import { db } from "@/lib/db";
import { aggregateRuleScores } from "@/lib/scoring/rules";
import { generateAiNarrative } from "@/lib/scoring/ai";
import { sendResultsEmail } from "@/lib/email";

export async function completeSessionAndScore(sessionId: string) {
  const session = await db.session.findUniqueOrThrow({
    where: { id: sessionId },
    include: {
      results: { include: { station: true } },
      invite: { include: { track: true, company: true } },
    },
  });

  const sortedResults = [...session.results].sort((a, b) => a.station.order - b.station.order);

  // Each StationResult already carries its own score/dimensions computed at
  // answer time (real execution for coding/SQL stations happens once, then);
  // aggregation just combines what's already stored instead of re-running it.
  const aggregate = aggregateRuleScores(
    sortedResults.map((r) => ({
      stationTitle: r.station.title,
      result: { score: r.score, note: r.reasoningText ?? "", dimensions: JSON.parse(r.dimensions) },
    }))
  );

  const ai = await generateAiNarrative({
    trackTitle: session.invite.track.title,
    roleLabel: session.invite.roleLabel,
    aggregate,
  });

  // Rank against the batch this invite belongs to, if any (a bulk-invite
  // cohort), else fall back to the company+track scope used for one-off
  // invites — same "how many scored higher" formula either way.
  const rankScope = session.invite.batchId
    ? { session: { invite: { batchId: session.invite.batchId } } }
    : { session: { invite: { companyId: session.invite.companyId, trackId: session.invite.trackId } } };
  const priorScores = await db.skillReport.findMany({ where: rankScope, select: { overall: true } });
  const rankTotal = priorScores.length + 1;
  const rank = priorScores.filter((p) => p.overall > aggregate.overall).length + 1;

  const report = await db.skillReport.create({
    data: {
      sessionId: session.id,
      technicalSkill: aggregate.technicalSkill,
      problemSolving: aggregate.problemSolving,
      softSkills: aggregate.softSkills,
      overall: aggregate.overall,
      rank,
      rankTotal,
      seniorityEstimate: ai.seniorityEstimate,
      strengths: JSON.stringify(ai.strengths),
      growthAreas: JSON.stringify(ai.growthAreas),
      narrative: ai.narrative,
      perStationNotes: JSON.stringify(aggregate.perStationNotes),
      aiGenerated: ai.aiGenerated,
    },
  });

  await db.session.update({ where: { id: session.id }, data: { completedAt: new Date() } });
  await db.invite.update({ where: { id: session.invite.id }, data: { status: "completed" } });

  // Credits are now consumed when the invite is sent (see the invite-creation
  // routes), not on completion — an unopened invite still cost a credit, per
  // the licensing model, so nothing to decrement here anymore.

  if (session.invite.candidateEmail) {
    await sendResultsEmail({
      to: session.invite.candidateEmail,
      candidateName: session.invite.candidateName ?? "there",
      companyName: session.invite.company.name,
      roleLabel: session.invite.roleLabel,
      overall: aggregate.overall,
      emailTemplate: session.invite.company.emailTemplate,
    });
  }

  return report;
}
