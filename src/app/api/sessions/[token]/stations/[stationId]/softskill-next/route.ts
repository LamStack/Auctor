import { NextResponse } from "next/server";
import { z } from "zod";
import { getInviteByToken } from "@/lib/sessionAccess";
import { pickNextSoftSkillItem, sanitizeSoftSkillItem } from "@/lib/scoring/softSkillAdaptive";
import { SoftSkillGameConfig } from "@/lib/stationTypes";

const schema = z.object({
  path: z.array(z.object({ itemId: z.string(), choiceId: z.string() })),
});

export async function POST(
  request: Request,
  { params }: { params: { token: string; stationId: string } }
) {
  const invite = await getInviteByToken(params.token);
  if (!invite || !invite.session) {
    return NextResponse.json({ error: "Session not started" }, { status: 404 });
  }

  const station = invite.track.stations.find((s) => s.id === params.stationId);
  if (!station || station.type !== "softskill-game") {
    return NextResponse.json({ error: "Station not found" }, { status: 404 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const config = JSON.parse(station.config) as SoftSkillGameConfig;
  const next = pickNextSoftSkillItem(config, body.data.path);

  if (!next) return NextResponse.json({ done: true, item: null });

  return NextResponse.json({ done: false, item: sanitizeSoftSkillItem(next) });
}
