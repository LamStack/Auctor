import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getInviteByToken, getOrCreateSession } from "@/lib/sessionAccess";
import { sanitizeStationConfig } from "@/lib/stationSanitize";
import { StationType } from "@/lib/stationTypes";

export async function POST(_request: Request, { params }: { params: { token: string } }) {
  const invite = await getInviteByToken(params.token);
  if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 });

  const session = await getOrCreateSession(invite.id);

  if (invite.status === "pending") {
    await db.invite.update({ where: { id: invite.id }, data: { status: "in_progress" } });
  }

  const answeredStationIds = new Set(
    (await db.stationResult.findMany({ where: { sessionId: session.id }, select: { stationId: true } })).map(
      (r) => r.stationId
    )
  );

  return NextResponse.json({
    sessionId: session.id,
    companyName: invite.company.name,
    trackTitle: invite.track.title,
    trackTheme: invite.track.theme,
    roleLabel: invite.roleLabel,
    currentStationIndex: session.currentStationIndex,
    completed: Boolean(session.completedAt),
    stations: invite.track.stations.map((s) => ({
      id: s.id,
      order: s.order,
      type: s.type,
      title: s.title,
      answered: answeredStationIds.has(s.id),
      config: sanitizeStationConfig(s.type as StationType, JSON.parse(s.config)),
    })),
  });
}
