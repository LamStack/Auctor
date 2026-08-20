import { NextResponse } from "next/server";
import { z } from "zod";
import { getInviteByToken } from "@/lib/sessionAccess";
import { runCode } from "@/lib/piston";
import { CodeIdeConfig } from "@/lib/stationTypes";

const schema = z.object({
  languageId: z.string(),
  code: z.string(),
});

function normalize(output: string) {
  return output.trim().replace(/\r\n/g, "\n");
}

export async function POST(
  request: Request,
  { params }: { params: { token: string; stationId: string } }
) {
  const invite = await getInviteByToken(params.token);
  if (!invite || !invite.session) {
    return NextResponse.json({ error: "Session not started" }, { status: 404 });
  }

  const station = invite.track.stations.find((s) => s.id === params.stationId);
  if (!station || station.type !== "code-ide") {
    return NextResponse.json({ error: "Station not found" }, { status: 404 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const config = JSON.parse(station.config) as CodeIdeConfig;
  const language = config.languages.find((l) => l.id === body.data.languageId);
  if (!language) return NextResponse.json({ error: "Unsupported language" }, { status: 400 });

  const visibleTests = config.testCases.filter((t) => !t.hidden);

  const results = [];
  for (const test of visibleTests) {
    const run = await runCode({
      languageId: language.judge0LanguageId,
      code: body.data.code,
      stdin: test.stdin,
    });
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
