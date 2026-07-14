import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getInviteByToken } from "@/lib/sessionAccess";
import { scoreStation } from "@/lib/scoring/rules";
import { StationType } from "@/lib/stationTypes";

const schema = z.object({
  rawAnswer: z.unknown(),
  timeMs: z.number().int().nonnegative(),
  reasoningText: z.string().optional(),
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
  if (!station) return NextResponse.json({ error: "Station not found" }, { status: 404 });

  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const alreadyAnswered = await db.stationResult.findFirst({
    where: { sessionId: invite.session.id, stationId: station.id },
  });
  if (alreadyAnswered) {
    return NextResponse.json({ error: "Station already answered" }, { status: 409 });
  }

  const config = JSON.parse(station.config);
  const result = scoreStation(station.type as StationType, config, body.data.rawAnswer);

  await db.stationResult.create({
    data: {
      sessionId: invite.session.id,
      stationId: station.id,
      rawAnswer: JSON.stringify(body.data.rawAnswer),
      score: result.score,
      timeMs: body.data.timeMs,
      reasoningText: body.data.reasoningText ?? result.note,
    },
  });

  await db.session.update({
    where: { id: invite.session.id },
    data: { currentStationIndex: { increment: 1 } },
  });

  return NextResponse.json({ score: result.score });
}
