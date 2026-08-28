import { AdaptiveCodingConfig, AdaptiveCodingProblem } from "@/lib/stationTypes";
import { StationScoreResult } from "@/lib/scoring/rules";
import { runCode } from "@/lib/piston";
import { pickNextAdaptiveItem, weightedCompositeScore } from "@/lib/scoring/adaptiveBank";

function normalize(output: string) {
  return output.trim().replace(/\r\n/g, "\n");
}

/** Runs one submitted solution against its problem's test cases via Judge0. */
export async function scoreCodingProblem(
  problem: AdaptiveCodingProblem,
  code: string,
  judge0LanguageId: number
): Promise<{ passed: number; total: number; score: number }> {
  const total = problem.testCases.length;
  if (!code?.trim() || total === 0) return { passed: 0, total, score: 0 };

  let passed = 0;
  for (const test of problem.testCases) {
    const result = await runCode({ languageId: judge0LanguageId, code, stdin: test.stdin });
    if (!result.error && normalize(result.stdout) === normalize(test.expectedOutput)) passed += 1;
  }
  return { passed, total, score: Math.round((passed / total) * 100) };
}

/** Server-driven adaptive selection — mirrors src/lib/scoring/softSkillAdaptive.ts. */
export async function pickNextAdaptiveCodingProblem(
  config: AdaptiveCodingConfig,
  path: { problemId: string; code: string }[]
): Promise<AdaptiveCodingProblem | null> {
  const adaptivePath = await Promise.all(
    path.map(async (step, i) => {
      // Only the most recent submission's pass/fail actually drives the next
      // pick (see pickNextAdaptiveItem) — earlier entries only contribute
      // their id to the "already used" set, so skip re-running Judge0 on them.
      if (i < path.length - 1) return { itemId: step.problemId, wasGood: false };
      const problem = config.problems.find((p) => p.id === step.problemId);
      if (!problem) return { itemId: step.problemId, wasGood: false };
      const result = await scoreCodingProblem(problem, step.code, config.language.judge0LanguageId);
      return { itemId: step.problemId, wasGood: result.score >= 60 };
    })
  );

  return pickNextAdaptiveItem(config.problems, adaptivePath, config.rounds);
}

export function sanitizeAdaptiveCodingProblem(problem: AdaptiveCodingProblem) {
  const visibleTests = problem.testCases.filter((t) => !t.hidden);
  return {
    id: problem.id,
    difficulty: problem.difficulty,
    prompt: problem.prompt,
    starterCode: problem.starterCode,
    visibleTests: visibleTests.map((t) => ({ id: t.id, stdin: t.stdin, expectedOutput: t.expectedOutput })),
    hiddenTestCount: problem.testCases.length - visibleTests.length,
  };
}

export async function scoreAdaptiveCoding(
  config: AdaptiveCodingConfig,
  rawAnswer: { path: { problemId: string; code: string }[] }
): Promise<StationScoreResult> {
  const path = rawAnswer.path ?? [];
  let hardestCleared = "none";

  const rounds = [];
  for (const step of path) {
    const problem = config.problems.find((p) => p.id === step.problemId);
    if (!problem) continue;
    const result = await scoreCodingProblem(problem, step.code, config.language.judge0LanguageId);
    if (result.score >= 60) hardestCleared = problem.difficulty;
    rounds.push({ difficulty: problem.difficulty, score: result.score });
  }

  const score = weightedCompositeScore(rounds);

  return {
    score,
    note: `Completed ${rounds.length} adaptive coding round${rounds.length === 1 ? "" : "s"} in ${config.language.label}, reaching "${hardestCleared}" difficulty.`,
    dimensions: { technicalSkill: score, problemSolving: Math.round(score * 0.8) },
  };
}
