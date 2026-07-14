import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionCompanyId } from "@/lib/auth";

export async function GET() {
  const companyId = await getSessionCompanyId();
  if (!companyId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const invites = await db.invite.findMany({
    where: { companyId, status: "completed" },
    include: { track: true, session: { include: { report: true } } },
    orderBy: { createdAt: "desc" },
  });

  const candidates = invites
    .filter((i) => i.session?.report)
    .map((i) => ({
      sessionId: i.session!.id,
      candidateName: i.candidateName ?? "Anonymous candidate",
      candidateEmail: i.candidateEmail,
      trackTitle: i.track.title,
      roleLabel: i.roleLabel,
      overall: i.session!.report!.overall,
      technicalSkill: i.session!.report!.technicalSkill,
      problemSolving: i.session!.report!.problemSolving,
      softSkills: i.session!.report!.softSkills,
      completedAt: i.session!.completedAt,
    }))
    .sort((a, b) => b.overall - a.overall);

  return NextResponse.json({ candidates });
}
