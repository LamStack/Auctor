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

// --- Coding (real IDE + execution) ---
export interface CodeTestCase {
  id: string;
  stdin: string;
  expectedOutput: string;
  hidden: boolean;
}
export interface CodeLanguageOption {
  id: string; // internal key, e.g. "python", "javascript"
  label: string;
  judge0LanguageId: number; // Judge0 CE numeric language id
  monacoLanguage: string; // for editor syntax highlighting
  starterCode: string;
}
export interface CodeIdeConfig {
  prompt: string;
  languages: CodeLanguageOption[];
  testCases: CodeTestCase[];
  timeLimitMinutes: number;
}

// --- Database & IS (real SQL sandbox) ---
export interface SqlTask {
  id: string;
  prompt: string;
  // A SELECT run against the candidate's final database state. By default
  // the task passes if it returns at least one row (for add/update tasks);
  // set expectAbsence to require zero rows instead (for delete tasks).
  validationSql: string;
  expectAbsence?: boolean;
  hint?: string;
}
export interface SqlSandboxConfig {
  intro: string;
  schemaSql: string; // CREATE TABLE + seed INSERT statements
  schemaSummary: { table: string; columns: string[] }[];
  tasks: SqlTask[];
}

// --- Sales (branching multi-step scenario) ---
export interface BranchingChoice {
  id: string;
  text: string;
  next: string | null; // null = this ends the story
  weights: { softSkills: number; problemSolving: number };
}
export interface BranchingNode {
  situation: string;
  choices: BranchingChoice[];
}
export interface BranchingScenarioConfig {
  intro: string;
  start: string;
  nodes: Record<string, BranchingNode>;
}

// --- Soft skills (adaptive mini-games) ---
export type SoftSkillDifficulty = "easy" | "medium" | "hard";
export interface SoftSkillChoice {
  id: string;
  text: string;
  score: number; // 0-100
}
export interface SoftSkillItem {
  id: string;
  difficulty: SoftSkillDifficulty;
  skillTag: string;
  prompt: string;
  choices: SoftSkillChoice[];
}
export interface SoftSkillGameConfig {
  intro: string;
  rounds: number;
  items: SoftSkillItem[];
}

export type StationConfig =
  | { type: "mcq"; data: McqConfig }
  | { type: "sequence"; data: SequenceConfig }
  | { type: "bug-hunt"; data: BugHuntConfig }
  | { type: "code-patch"; data: CodePatchConfig }
  | { type: "scenario"; data: ScenarioConfig }
  | { type: "timed-challenge"; data: TimedChallengeConfig }
  | { type: "code-ide"; data: CodeIdeConfig }
  | { type: "sql-sandbox"; data: SqlSandboxConfig }
  | { type: "branching-scenario"; data: BranchingScenarioConfig }
  | { type: "softskill-game"; data: SoftSkillGameConfig };

export interface StationDefinition {
  order: number;
  type: StationType;
  title: string;
  config: StationConfig["data"];
}

export type TrackCategory = "coding" | "database" | "sales" | "game-world" | "soft-skills";

export interface TrackDefinition {
  slug: string;
  title: string;
  description: string;
  theme: string;
  category: TrackCategory;
  stations: StationDefinition[];
}
