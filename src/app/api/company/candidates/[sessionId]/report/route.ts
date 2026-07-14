import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionCompanyId } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: { sessionId: string } }) {
  const companyId = await getSessionCompanyId();
  if (!companyId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const session = await db.session.findUnique({
    where: { id: params.sessionId },
    include: {
      report: true,
      invite: { include: { track: true } },
      results: { include: { station: true }, orderBy: { station: { order: "asc" } } },
    },
  });

  if (!session || session.invite.companyId !== companyId || !session.report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  return NextResponse.json({
    candidateName: session.invite.candidateName ?? "Anonymous candidate",
    candidateEmail: session.invite.candidateEmail,
    trackTitle: session.invite.track.title,
    roleLabel: session.invite.roleLabel,
    completedAt: session.completedAt,
    report: {
      overall: session.report.overall,
      technicalSkill: session.report.technicalSkill,
      problemSolving: session.report.problemSolving,
      softSkills: session.report.softSkills,
      narrative: session.report.narrative,
      strengths: JSON.parse(session.report.strengths),
      growthAreas: JSON.parse(session.report.growthAreas),
      aiGenerated: session.report.aiGenerated,
    },
    stations: session.results.map((r) => ({
      title: r.station.title,
      type: r.station.type,
      score: r.score,
      timeMs: r.timeMs,
    })),
  });
}
