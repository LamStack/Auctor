import {
  BugHuntConfig,
  CodePatchConfig,
  McqConfig,
  ScenarioConfig,
  SequenceConfig,
  StationType,
  TimedChallengeConfig,
} from "@/lib/stationTypes";

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

export function scoreStation(type: StationType, config: unknown, rawAnswer: unknown): StationScoreResult {
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
  const overall = Math.round((technicalSkill + problemSolving + softSkills) / 3);

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
