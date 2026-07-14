export type StationType =
  | "mcq"
  | "sequence"
  | "bug-hunt"
  | "code-patch"
  | "scenario"
  | "timed-challenge";

export interface McqQuestion {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}
export interface McqConfig {
  intro: string;
  questions: McqQuestion[];
}

export interface SequenceConfig {
  instruction: string;
  steps: { id: string; text: string }[];
  correctOrder: string[];
}

export interface BugHuntConfig {
  instruction: string;
  sourceLabel: string;
  lines: { id: string; text: string }[];
  buggyLineId: string;
  explanation: string;
}

export interface CodePatchConfig {
  instruction: string;
  codeBefore: string;
  blankMarker: string;
  codeAfter: string;
  options: { id: string; text: string; correct: boolean }[];
  explanation: string;
}

export interface ScenarioChoice {
  id: string;
  text: string;
  weights: { softSkills: number; problemSolving: number };
  consequence: string;
}
export interface ScenarioConfig {
  situation: string;
  prompt: string;
  choices: ScenarioChoice[];
  reasoningPrompt: string;
}

export interface TimedChallengeConfig {
  instruction: string;
  timeLimitSeconds: number;
  left: { id: string; text: string }[];
  right: { id: string; text: string }[];
  correctPairs: Record<string, string>;
}

export type StationConfig =
  | { type: "mcq"; data: McqConfig }
  | { type: "sequence"; data: SequenceConfig }
  | { type: "bug-hunt"; data: BugHuntConfig }
  | { type: "code-patch"; data: CodePatchConfig }
  | { type: "scenario"; data: ScenarioConfig }
  | { type: "timed-challenge"; data: TimedChallengeConfig };

export interface StationDefinition {
  order: number;
  type: StationType;
  title: string;
  config: StationConfig["data"];
}

export interface TrackDefinition {
  slug: string;
  title: string;
  description: string;
  theme: string;
  stations: StationDefinition[];
}
