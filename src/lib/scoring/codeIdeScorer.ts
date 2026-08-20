import { CodeIdeConfig } from "@/lib/stationTypes";
import { StationScoreResult } from "@/lib/scoring/rules";
import { runCode } from "@/lib/piston";

function normalize(output: string) {
  return output.trim().replace(/\r\n/g, "\n");
}

export async function scoreCodeIde(
  config: CodeIdeConfig,
  rawAnswer: { languageId: string; code: string }
): Promise<StationScoreResult> {
  const language = config.languages.find((l) => l.id === rawAnswer.languageId);
  if (!language || !rawAnswer.code?.trim()) {
    return { score: 0, note: "No code submitted.", dimensions: { technicalSkill: 0, problemSolving: 0 } };
  }

  let passed = 0;
  const total = config.testCases.length;

  // Sequential, not parallel: the public execution API is rate-limited and
  // this also naturally paces requests rather than bursting them.
  for (const test of config.testCases) {
    const result = await runCode({
      languageId: language.judge0LanguageId,
      code: rawAnswer.code,
      stdin: test.stdin,
    });
    if (!result.error && normalize(result.stdout) === normalize(test.expectedOutput)) {
      passed += 1;
    }
  }

  const score = total > 0 ? Math.round((passed / total) * 100) : 0;

  return {
    score,
    note: `Passed ${passed}/${total} test cases in ${language.label}.`,
    dimensions: { technicalSkill: score, problemSolving: Math.round(score * 0.8) },
  };
}
