import { db } from "@/lib/db";
import { aggregateRuleScores } from "@/lib/scoring/rules";
import { generateAiNarrative } from "@/lib/scoring/ai";
import { sendResultsEmail } from "@/lib/email";

export async function completeSessionAndScore(sessionId: string) {
  const session = await db.session.findUniqueOrThrow({
    where: { id: sessionId },
    include: {
      results: { include: { station: true } },
      invite: { include: { track: true, company: { include: { credits: true } } } },
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

  const priorScores = await db.skillReport.findMany({
    where: { session: { invite: { companyId: session.invite.companyId, trackId: session.invite.trackId } } },
    select: { overall: true },
  });
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
      strengths: JSON.stringify(ai.strengths),
      growthAreas: JSON.stringify(ai.growthAreas),
      narrative: ai.narrative,
      perStationNotes: JSON.stringify(aggregate.perStationNotes),
      aiGenerated: ai.aiGenerated,
    },
  });

  await db.session.update({ where: { id: session.id }, data: { completedAt: new Date() } });
  await db.invite.update({ where: { id: session.invite.id }, data: { status: "completed" } });

  if (session.invite.company.credits) {
    await db.creditBalance.update({
      where: { companyId: session.invite.companyId },
      data: { assessmentsRemaining: { decrement: 1 } },
    });
  }

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
