// Generic "staircase" adaptive item-selection engine — the reusable leveling
// engine referenced across fields. A strong answer nudges the next item
// harder, a weak one nudges it easier, for a fixed number of rounds.
//
// Callers decide what "good" means for their item type (a soft-skill choice
// score, a coding problem pass/fail, a rubric score threshold, ...) and pass
// that verdict in — this module only owns the difficulty ramp + selection.

export type Difficulty = "easy" | "medium" | "hard";
const ORDER: Difficulty[] = ["easy", "medium", "hard"];

export interface AdaptiveBankItem {
  id: string;
  difficulty: Difficulty;
}

export interface AdaptivePathStep {
  itemId: string;
  wasGood: boolean;
}

export function pickNextAdaptiveItem<T extends AdaptiveBankItem>(
  items: T[],
  path: AdaptivePathStep[],
  rounds: number
): T | null {
  if (path.length >= rounds) return null;

  let targetDifficulty: Difficulty = "medium";

  if (path.length > 0) {
    const last = path[path.length - 1];
    const lastItem = items.find((i) => i.id === last.itemId);
    const lastDifficulty = lastItem?.difficulty ?? "medium";
    const idx = ORDER.indexOf(lastDifficulty);
    targetDifficulty = last.wasGood ? ORDER[Math.min(idx + 1, ORDER.length - 1)] : ORDER[Math.max(idx - 1, 0)];
  }

  const usedIds = new Set(path.map((p) => p.itemId));
  const primary = items.filter((i) => i.difficulty === targetDifficulty && !usedIds.has(i.id));
  const candidates = primary.length > 0 ? primary : items.filter((i) => !usedIds.has(i.id));

  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = { easy: 0.8, medium: 1, hard: 1.3 };

/** Difficulty-weighted composite: clearing harder items counts for more. */
export function weightedCompositeScore(rounds: { difficulty: Difficulty; score: number }[]): number {
  let weightedSum = 0;
  let weightTotal = 0;
  for (const r of rounds) {
    const multiplier = DIFFICULTY_MULTIPLIER[r.difficulty] ?? 1;
    weightedSum += r.score * multiplier;
    weightTotal += multiplier;
  }
  return weightTotal > 0 ? Math.round(Math.max(0, Math.min(100, weightedSum / weightTotal))) : 0;
}
