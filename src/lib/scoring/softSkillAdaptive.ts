import { SoftSkillGameConfig, SoftSkillItem } from "@/lib/stationTypes";
import { pickNextAdaptiveItem } from "@/lib/scoring/adaptiveBank";

// Deterministic "staircase" difficulty ramp built on the generic adaptive
// bank engine (src/lib/scoring/adaptiveBank.ts) — this file just supplies
// the soft-skill-specific "was that a good answer?" signal (a choice score
// threshold). Scores never leave the server — the client only ever sees
// which item/choice was picked, not its value.
export function pickNextSoftSkillItem(
  config: SoftSkillGameConfig,
  path: { itemId: string; choiceId: string }[]
): SoftSkillItem | null {
  const adaptivePath = path.map((step) => {
    const item = config.items.find((i) => i.id === step.itemId);
    const choice = item?.choices.find((c) => c.id === step.choiceId);
    return { itemId: step.itemId, wasGood: (choice?.score ?? 50) >= 60 };
  });

  return pickNextAdaptiveItem(config.items, adaptivePath, config.rounds);
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
