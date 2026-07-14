import { NextResponse } from "next/server";
import { getInviteByToken } from "@/lib/sessionAccess";

export async function GET(_request: Request, { params }: { params: { token: string } }) {
  const invite = await getInviteByToken(params.token);
  if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 });

  return NextResponse.json({
    companyName: invite.company.name,
    trackTitle: invite.track.title,
    trackDescription: invite.track.description,
    trackTheme: invite.track.theme,
    roleLabel: invite.roleLabel,
    status: invite.status,
    stationCount: invite.track.stations.length,
    completed: Boolean(invite.session?.completedAt),
  });
}
