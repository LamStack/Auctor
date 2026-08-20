import {
  BranchingScenarioConfig,
  BugHuntConfig,
  CodeIdeConfig,
  CodePatchConfig,
  McqConfig,
  ScenarioConfig,
  SequenceConfig,
  SoftSkillGameConfig,
  SqlSandboxConfig,
  StationType,
  TimedChallengeConfig,
} from "@/lib/stationTypes";
import { scoreCodeIde } from "@/lib/scoring/codeIdeScorer";
import { scoreSqlSandbox } from "@/lib/scoring/sqlSandboxScorer";

export interface StationScoreResult {
  score: number; // 0-100, general display score for the station
  note: string; // short human-readable summary for the report
  dimensions: { technicalSkill?: number; problemSolving?: number; softSkills?: number };
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function scoreMcq(config: McqConfig, rawAnswer: { answers: Record<string, string> }): StationScoreResult {
  const total = config.questions.length;
  let correct = 0;
  for (const q of config.questions) {
    if (rawAnswer.answers?.[q.id] === q.correctOptionId) correct += 1;
  }
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  return {
    score,
    note: `Answered ${correct}/${total} knowledge questions correctly.`,
    dimensions: { technicalSkill: score },
  };
}

export function scoreSequence(config: SequenceConfig, rawAnswer: { order: string[] }): StationScoreResult {
  const correctOrder = config.correctOrder;
  const submitted = rawAnswer.order ?? [];
  let matches = 0;
  for (let i = 0; i < correctOrder.length; i++) {
    if (submitted[i] === correctOrder[i]) matches += 1;
  }
  const score = correctOrder.length > 0 ? Math.round((matches / correctOrder.length) * 100) : 0;
  return {
    score,
    note: `Placed ${matches}/${correctOrder.length} steps in the correct position.`,
    dimensions: { technicalSkill: Math.round(score * 0.4), problemSolving: Math.round(score * 0.6) },
  };
}

export function scoreBugHunt(config: BugHuntConfig, rawAnswer: { selectedLineId: string }): StationScoreResult {
  const correct = rawAnswer.selectedLineId === config.buggyLineId;
  const score = correct ? 100 : 0;
  return {
    score,
    note: correct ? "Correctly identified the defect." : "Selected an incorrect line as the defect.",
    dimensions: { technicalSkill: Math.round(score * 0.6), problemSolving: Math.round(score * 0.4) },
  };
}

export function scoreCodePatch(config: CodePatchConfig, rawAnswer: { selectedOptionId: string }): StationScoreResult {
  const chosen = config.options.find((o) => o.id === rawAnswer.selectedOptionId);
  const score = chosen?.correct ? 100 : 0;
  return {
    score,
    note: chosen?.correct ? "Correctly patched the broken logic." : "Chose an incorrect fix.",
    dimensions: { technicalSkill: Math.round(score * 0.7), problemSolving: Math.round(score * 0.3) },
  };
}

export function scoreScenario(
  config: ScenarioConfig,
  rawAnswer: { choiceId: string; reasoningText?: string }
): StationScoreResult {
  const choice = config.choices.find((c) => c.id === rawAnswer.choiceId);
  const softSkills = choice ? clamp(((choice.weights.softSkills + 1) / 2) * 100) : 50;
  const problemSolving = choice ? clamp(((choice.weights.problemSolving + 1) / 2) * 100) : 50;
  const score = Math.round((softSkills + problemSolving) / 2);
  return {
    score,
    note: choice ? `Chose to: ${choice.text}` : "No choice recorded.",
    dimensions: { softSkills: Math.round(softSkills), problemSolving: Math.round(problemSolving) },
  };
}

export function scoreTimedChallenge(
  config: TimedChallengeConfig,
  rawAnswer: { pairs: Record<string, string>; timeUsedMs: number }
): StationScoreResult {
  const total = config.left.length;
  let correct = 0;
  for (const item of config.left) {
    if (rawAnswer.pairs?.[item.id] === config.correctPairs[item.id]) correct += 1;
  }
  const accuracy = total > 0 ? (correct / total) * 100 : 0;
  const timeLimitMs = config.timeLimitSeconds * 1000;
  const timeUsedMs = rawAnswer.timeUsedMs ?? timeLimitMs;
  const speedFactor = clamp(1 - timeUsedMs / timeLimitMs, -0.2, 0.2);
  const score = Math.round(clamp(accuracy + speedFactor * 100 * 0.15));
  return {
    score,
    note: `Matched ${correct}/${total} correctly with ${Math.round(timeUsedMs / 1000)}s used of ${config.timeLimitSeconds}s.`,
    dimensions: { problemSolving: Math.round(score * 0.7), technicalSkill: Math.round(score * 0.3) },
  };
}

export function scoreBranchingScenario(
  config: BranchingScenarioConfig,
  rawAnswer: { path: { nodeId: string; choiceId: string }[] }
): StationScoreResult {
  const path = rawAnswer.path ?? [];
  let softSum = 0;
  let probSum = 0;
  let count = 0;
  const chosenTexts: string[] = [];

  for (const step of path) {
    const node = config.nodes[step.nodeId];
    const choice = node?.choices.find((c) => c.id === step.choiceId);
    if (!choice) continue;
    softSum += clamp(((choice.weights.softSkills + 1) / 2) * 100);
    probSum += clamp(((choice.weights.problemSolving + 1) / 2) * 100);
    count += 1;
    chosenTexts.push(choice.text);
  }

  const softSkills = count > 0 ? Math.round(softSum / count) : 50;
  const problemSolving = count > 0 ? Math.round(probSum / count) : 50;
  const score = Math.round((softSkills + problemSolving) / 2);

  return {
    score,
    note:
      chosenTexts.length > 0
        ? `Walked a ${chosenTexts.length}-step scenario, most recently: "${chosenTexts[chosenTexts.length - 1]}".`
        : "No decisions recorded.",
    dimensions: { softSkills, problemSolving },
  };
}

const DIFFICULTY_MULTIPLIER: Record<string, number> = { easy: 0.8, medium: 1, hard: 1.3 };

export function scoreSoftSkillGame(
  config: SoftSkillGameConfig,
  rawAnswer: { path: { itemId: string; choiceId: string }[] }
): StationScoreResult {
  const path = rawAnswer.path ?? [];
  let weightedSum = 0;
  let weightTotal = 0;
  let hardestCleared: string = "none";

  for (const step of path) {
    const item = config.items.find((i) => i.id === step.itemId);
    const choice = item?.choices.find((c) => c.id === step.choiceId);
    if (!item || !choice) continue;
    const multiplier = DIFFICULTY_MULTIPLIER[item.difficulty] ?? 1;
    weightedSum += choice.score * multiplier;
    weightTotal += multiplier;
    if (choice.score >= 60) hardestCleared = item.difficulty;
  }

  const score = weightTotal > 0 ? Math.round(clamp(weightedSum / weightTotal)) : 0;

  return {
    score,
    note: `Completed ${path.length} adaptive rounds, reaching "${hardestCleared}" difficulty with a solid score.`,
    dimensions: { softSkills: score, problemSolving: Math.round(score * 0.5) },
  };
}

export async function scoreStation(type: StationType, config: unknown, rawAnswer: unknown): Promise<StationScoreResult> {
  switch (type) {
    case "mcq":
      return scoreMcq(config as McqConfig, rawAnswer as { answers: Record<string, string> });
    case "sequence":
      return scoreSequence(config as SequenceConfig, rawAnswer as { order: string[] });
    case "bug-hunt":
      return scoreBugHunt(config as BugHuntConfig, rawAnswer as { selectedLineId: string });
    case "code-patch":
      return scoreCodePatch(config as CodePatchConfig, rawAnswer as { selectedOptionId: string });
    case "scenario":
      return scoreScenario(config as ScenarioConfig, rawAnswer as { choiceId: string; reasoningText?: string });
    case "timed-challenge":
      return scoreTimedChallenge(
        config as TimedChallengeConfig,
        rawAnswer as { pairs: Record<string, string>; timeUsedMs: number }
      );
    case "branching-scenario":
      return scoreBranchingScenario(
        config as BranchingScenarioConfig,
        rawAnswer as { path: { nodeId: string; choiceId: string }[] }
      );
    case "softskill-game":
      return scoreSoftSkillGame(
        config as SoftSkillGameConfig,
        rawAnswer as { path: { itemId: string; choiceId: string }[] }
      );
    case "sql-sandbox":
      return scoreSqlSandbox(config as SqlSandboxConfig, rawAnswer as { statements: string[] });
    case "code-ide":
      return scoreCodeIde(config as CodeIdeConfig, rawAnswer as { languageId: string; code: string });
    default:
      return { score: 0, note: "Unscored station type.", dimensions: {} };
  }
}

export interface AggregateInput {
  stationTitle: string;
  result: StationScoreResult;
}

export interface AggregateScores {
  technicalSkill: number;
  problemSolving: number;
  softSkills: number;
  overall: number;
  perStationNotes: { title: string; note: string; score: number }[];
}

export function aggregateRuleScores(inputs: AggregateInput[]): AggregateScores {
  const totals: Record<"technicalSkill" | "problemSolving" | "softSkills", { sum: number; count: number }> = {
    technicalSkill: { sum: 0, count: 0 },
    problemSolving: { sum: 0, count: 0 },
    softSkills: { sum: 0, count: 0 },
  };

  for (const { result } of inputs) {
    for (const key of Object.keys(result.dimensions) as (keyof typeof totals)[]) {
      const value = result.dimensions[key];
      if (typeof value === "number") {
        totals[key].sum += value;
        totals[key].count += 1;
      }
    }
  }

  const avg = (key: keyof typeof totals) => (totals[key].count > 0 ? Math.round(totals[key].sum / totals[key].count) : 0);

  const technicalSkill = avg("technicalSkill");
  const problemSolving = avg("problemSolving");
  const softSkills = avg("softSkills");

  // Only average dimensions the track actually exercised — a purely
  // technical track (no soft-skill stations) shouldn't have its overall
  // score dragged down by an untested dimension defaulting to 0.
  const testedDimensions = (["technicalSkill", "problemSolving", "softSkills"] as const).filter(
    (key) => totals[key].count > 0
  );
  const overall =
    testedDimensions.length > 0
      ? Math.round(testedDimensions.reduce((sum, key) => sum + avg(key), 0) / testedDimensions.length)
      : 0;

  return {
    technicalSkill,
    problemSolving,
    softSkills,
    overall,
    perStationNotes: inputs.map(({ stationTitle, result }) => ({
      title: stationTitle,
      note: result.note,
      score: result.score,
    })),
  };
}
