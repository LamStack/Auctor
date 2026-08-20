// Client-safe station config shapes — mirrors src/lib/stationSanitize.ts output (no answer keys).

export type StationType =
  | "mcq"
  | "sequence"
  | "bug-hunt"
  | "code-patch"
  | "scenario"
  | "timed-challenge"
  | "code-ide"
  | "sql-sandbox"
  | "branching-scenario"
  | "softskill-game";

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

export interface CodeIdeClientConfig {
  prompt: string;
  languages: { id: string; label: string; monacoLanguage: string; starterCode: string }[];
  timeLimitMinutes: number;
  visibleTests: { id: string; stdin: string; expectedOutput: string }[];
  hiddenTestCount: number;
}

export interface SqlSandboxClientConfig {
  intro: string;
  schemaSql: string;
  schemaSummary: { table: string; columns: string[] }[];
  tasks: { id: string; prompt: string; hint?: string }[];
}

export interface BranchingScenarioClientConfig {
  intro: string;
  start: string;
  nodes: Record<
    string,
    { situation: string; choices: { id: string; text: string; next: string | null }[] }
  >;
}

export interface SoftSkillItemClient {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  skillTag: string;
  prompt: string;
  choices: { id: string; text: string }[];
}

export interface SoftSkillGameClientConfig {
  intro: string;
  rounds: number;
  firstItem: SoftSkillItemClient | null;
}
