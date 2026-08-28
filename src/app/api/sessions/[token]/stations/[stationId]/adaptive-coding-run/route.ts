import { NextResponse } from "next/server";
import { z } from "zod";
import { getInviteByToken } from "@/lib/sessionAccess";
import { runCode } from "@/lib/piston";
import { AdaptiveCodingConfig } from "@/lib/stationTypes";

const schema = z.object({
  problemId: z.string(),
  code: z.string(),
});

function normalize(output: string) {
  return output.trim().replace(/\r\n/g, "\n");
}

// Test-only convenience run against the current problem's visible test cases
// (no adaptive selection, no scoring impact) — mirrors code-ide's /run route.
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
  const problem = config.problems.find((p) => p.id === body.data.problemId);
  if (!problem) return NextResponse.json({ error: "Problem not found" }, { status: 404 });

  const visibleTests = problem.testCases.filter((t) => !t.hidden);

  const results = [];
  for (const test of visibleTests) {
    const run = await runCode({ languageId: config.language.judge0LanguageId, code: body.data.code, stdin: test.stdin });
    results.push({
      id: test.id,
      stdin: test.stdin,
      expectedOutput: test.expectedOutput,
      actualOutput: run.error ? run.stderr || run.error : run.stdout,
      passed: !run.error && normalize(run.stdout) === normalize(test.expectedOutput),
      error: run.error || (run.stderr ? run.stderr : null),
    });
  }

  return NextResponse.json({ results });
}
