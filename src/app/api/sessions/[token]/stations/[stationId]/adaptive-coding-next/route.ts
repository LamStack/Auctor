import { NextResponse } from "next/server";
import { z } from "zod";
import { getInviteByToken } from "@/lib/sessionAccess";
import { pickNextAdaptiveCodingProblem, sanitizeAdaptiveCodingProblem } from "@/lib/scoring/adaptiveCodingScorer";
import { AdaptiveCodingConfig } from "@/lib/stationTypes";

const schema = z.object({
  path: z.array(z.object({ problemId: z.string(), code: z.string() })),
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
  if (!station || station.type !== "adaptive-coding") {
    return NextResponse.json({ error: "Station not found" }, { status: 404 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const config = JSON.parse(station.config) as AdaptiveCodingConfig;
  const next = await pickNextAdaptiveCodingProblem(config, body.data.path);

  if (!next) return NextResponse.json({ done: true, problem: null });

  return NextResponse.json({ done: false, problem: sanitizeAdaptiveCodingProblem(next) });
}
