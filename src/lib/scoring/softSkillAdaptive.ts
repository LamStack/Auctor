import { SoftSkillDifficulty, SoftSkillGameConfig, SoftSkillItem } from "@/lib/stationTypes";

const ORDER: SoftSkillDifficulty[] = ["easy", "medium", "hard"];

// Deterministic "staircase" difficulty ramp: a strong answer nudges the next
// item harder, a weak one nudges it easier. Scores never leave the server —
// the client only ever sees which item/choice was picked, not its value.
export function pickNextSoftSkillItem(
  config: SoftSkillGameConfig,
  path: { itemId: string; choiceId: string }[]
): SoftSkillItem | null {
  if (path.length >= config.rounds) return null;

  let targetDifficulty: SoftSkillDifficulty = "medium";

  if (path.length > 0) {
    const last = path[path.length - 1];
    const item = config.items.find((i) => i.id === last.itemId);
    const choice = item?.choices.find((c) => c.id === last.choiceId);
    const lastDifficulty = item?.difficulty ?? "medium";
    const goodAnswer = (choice?.score ?? 50) >= 60;
    const idx = ORDER.indexOf(lastDifficulty);
    targetDifficulty = goodAnswer ? ORDER[Math.min(idx + 1, ORDER.length - 1)] : ORDER[Math.max(idx - 1, 0)];
  }

  const usedIds = new Set(path.map((p) => p.itemId));
  const primary = config.items.filter((i) => i.difficulty === targetDifficulty && !usedIds.has(i.id));
  const candidates = primary.length > 0 ? primary : config.items.filter((i) => !usedIds.has(i.id));

  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function sanitizeSoftSkillItem(item: SoftSkillItem) {
  return {
    id: item.id,
    difficulty: item.difficulty,
    skillTag: item.skillTag,
    prompt: item.prompt,
    choices: item.choices.map((c) => ({ id: c.id, text: c.text })),
  };
}
