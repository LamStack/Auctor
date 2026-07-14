// Client-safe station config shapes — mirrors src/lib/stationSanitize.ts output (no answer keys).

export type StationType = "mcq" | "sequence" | "bug-hunt" | "code-patch" | "scenario" | "timed-challenge";

export interface ClientStation {
  id: string;
  order: number;
  type: StationType;
  title: string;
  answered: boolean;
  config: any;
}

export interface McqClientConfig {
  intro: string;
  questions: { id: string; prompt: string; options: { id: string; text: string }[] }[];
}

export interface SequenceClientConfig {
  instruction: string;
  steps: { id: string; text: string }[];
}

export interface BugHuntClientConfig {
  instruction: string;
  sourceLabel: string;
  lines: { id: string; text: string }[];
}

export interface CodePatchClientConfig {
  instruction: string;
  codeBefore: string;
  blankMarker: string;
  codeAfter: string;
  options: { id: string; text: string }[];
}

export interface ScenarioClientConfig {
  situation: string;
  prompt: string;
  choices: { id: string; text: string }[];
  reasoningPrompt: string;
}

export interface TimedChallengeClientConfig {
  instruction: string;
  timeLimitSeconds: number;
  left: { id: string; text: string }[];
  right: { id: string; text: string }[];
}
