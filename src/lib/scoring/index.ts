import { db } from "@/lib/db";
import { aggregateRuleScores, scoreStation } from "@/lib/scoring/rules";
import { generateAiNarrative } from "@/lib/scoring/ai";
import { StationType } from "@/lib/stationTypes";

export async function completeSessionAndScore(sessionId: string) {
  const session = await db.session.findUniqueOrThrow({
    where: { id: sessionId },
    include: {
      results: { include: { station: true } },
      invite: { include: { track: true, company: { include: { credits: true } } } },
    },
  });

  const sortedResults = [...session.results].sort((a, b) => a.station.order - b.station.order);

  // Recompute per-dimension scores from the stored config + raw answer, since
  // StationResult only persists the display-facing scalar score.
  const aggregate = aggregateRuleScores(
    sortedResults.map((r) => ({
      stationTitle: r.station.title,
      result: scoreStation(r.station.type as StationType, JSON.parse(r.station.config), JSON.parse(r.rawAnswer)),
    }))
  );

  const ai = await generateAiNarrative({
    trackTitle: session.invite.track.title,
    roleLabel: session.invite.roleLabel,
    aggregate,
  });

  const report = await db.skillReport.create({
    data: {
      sessionId: session.id,
      technicalSkill: aggregate.technicalSkill,
      problemSolving: aggregate.problemSolving,
      softSkills: aggregate.softSkills,
      overall: aggregate.overall,
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

  return report;
}
