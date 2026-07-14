import { StationType } from "@/lib/stationTypes";

/** Strips answer keys from a station config before it is sent to the candidate's browser. */
export function sanitizeStationConfig(type: StationType, config: any): any {
  switch (type) {
    case "mcq":
      return {
        intro: config.intro,
        questions: config.questions.map((q: any) => ({
          id: q.id,
          prompt: q.prompt,
          options: q.options,
        })),
      };
    case "sequence":
      return {
        instruction: config.instruction,
        steps: shuffle(config.steps),
      };
    case "bug-hunt":
      return {
        instruction: config.instruction,
        sourceLabel: config.sourceLabel,
        lines: config.lines,
      };
    case "code-patch":
      return {
        instruction: config.instruction,
        codeBefore: config.codeBefore,
        blankMarker: config.blankMarker,
        codeAfter: config.codeAfter,
        options: config.options.map((o: any) => ({ id: o.id, text: o.text })),
      };
    case "scenario":
      return {
        situation: config.situation,
        prompt: config.prompt,
        choices: config.choices.map((c: any) => ({ id: c.id, text: c.text })),
        reasoningPrompt: config.reasoningPrompt,
      };
    case "timed-challenge":
      return {
        instruction: config.instruction,
        timeLimitSeconds: config.timeLimitSeconds,
        left: config.left,
        right: shuffle(config.right),
      };
    default:
      return config;
  }
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
