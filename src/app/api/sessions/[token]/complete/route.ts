import { NextResponse } from "next/server";
import { getInviteByToken } from "@/lib/sessionAccess";
import { completeSessionAndScore } from "@/lib/scoring";
import { db } from "@/lib/db";

export async function POST(_request: Request, { params }: { params: { token: string } }) {
  const invite = await getInviteByToken(params.token);
  if (!invite || !invite.session) {
    return NextResponse.json({ error: "Session not started" }, { status: 404 });
  }

  if (invite.session.completedAt) {
    return NextResponse.json({ error: "Session already completed" }, { status: 409 });
  }

  const answeredCount = await db.stationResult.count({ where: { sessionId: invite.session.id } });
  if (answeredCount < invite.track.stations.length) {
    return NextResponse.json({ error: "Not all stations have been answered yet" }, { status: 400 });
  }

  const report = await completeSessionAndScore(invite.session.id);

  return NextResponse.json({ overall: report.overall });
}
