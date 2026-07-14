import { TrackDefinition } from "@/lib/stationTypes";

export const juniorDeveloperTrack: TrackDefinition = {
  slug: "junior-developer",
  title: "Junior Software Developer",
  description:
    "A code-foundations quest through variables, git workflow, debugging, and shipping under pressure.",
  theme: "dev-city",
  stations: [
    {
      order: 1,
      type: "mcq",
      title: "Code Foundations Terminal",
      config: {
        intro: "The terminal hums awake. Answer its questions to unlock the workshop door.",
        questions: [
          {
            id: "q1",
            prompt: "What will `typeof []` return in JavaScript?",
            options: [
              { id: "a", text: "\"array\"" },
              { id: "b", text: "\"object\"" },
              { id: "c", text: "\"undefined\"" },
              { id: "d", text: "\"list\"" },
            ],
            correctOptionId: "b",
            explanation: "Arrays are a specialized object type, so typeof returns \"object\".",
          },
          {
            id: "q2",
            prompt: "Which Big-O best describes searching an unsorted array for a value?",
            options: [
              { id: "a", text: "O(1)" },
              { id: "b", text: "O(log n)" },
              { id: "c", text: "O(n)" },
              { id: "d", text: "O(n^2)" },
            ],
            correctOptionId: "c",
            explanation: "Without ordering, every element may need to be checked: linear time.",
          },
          {
            id: "q3",
            prompt: "In Git, what does `git rebase` primarily do differently from `git merge`?",
            options: [
              { id: "a", text: "It deletes the branch history" },
              { id: "b", text: "It rewrites commits onto a new base, creating a linear history" },
              { id: "c", text: "It only works on remote branches" },
              { id: "d", text: "It automatically resolves all conflicts" },
            ],
            correctOptionId: "b",
            explanation: "Rebase replays commits on top of another base branch instead of creating a merge commit.",
          },
          {
            id: "q4",
            prompt: "Which principle does 'a function should do one thing' describe?",
            options: [
              { id: "a", text: "DRY" },
              { id: "b", text: "Single Responsibility" },
              { id: "c", text: "YAGNI" },
              { id: "d", text: "Law of Demeter" },
            ],
            correctOptionId: "b",
            explanation: "Single Responsibility keeps each function/unit focused on one job.",
          },
          {
            id: "q5",
            prompt: "What is the main purpose of a code review before merging?",
            options: [
              { id: "a", text: "To slow down the team on purpose" },
              { id: "b", text: "To catch bugs, share knowledge, and keep quality consistent" },
              { id: "c", text: "To assign blame for bugs" },
              { id: "d", text: "It has no real purpose beyond formatting" },
            ],
            correctOptionId: "b",
            explanation: "Reviews catch defects early and spread context across the team.",
          },
        ],
      },
    },
    {
      order: 2,
      type: "sequence",
      title: "Deploy Pipeline Dock",
      config: {
        instruction: "Drag the crates into the correct order to ship a feature safely, start to finish.",
        steps: [
          { id: "s1", text: "Write the code for the feature" },
          { id: "s2", text: "Run tests locally" },
          { id: "s3", text: "Open a pull request" },
          { id: "s4", text: "Address code review feedback" },
          { id: "s5", text: "Merge to the main branch" },
          { id: "s6", text: "Deploy to production" },
        ],
        correctOrder: ["s1", "s2", "s3", "s4", "s5", "s6"],
      },
    },
    {
      order: 3,
      type: "bug-hunt",
      title: "Haunted Function Room",
      config: {
        instruction: "Something in this function is haunted. Click the line that's causing the bug.",
        sourceLabel: "sumEvenNumbers.js",
        lines: [
          { id: "l1", text: "function sumEvenNumbers(numbers) {" },
          { id: "l2", text: "  let total = 0;" },
          { id: "l3", text: "  for (let i = 0; i <= numbers.length; i++) {" },
          { id: "l4", text: "    if (numbers[i] % 2 === 0) {" },
          { id: "l5", text: "      total += numbers[i];" },
          { id: "l6", text: "    }" },
          { id: "l7", text: "  }" },
          { id: "l8", text: "  return total;" },
          { id: "l9", text: "}" },
        ],
        buggyLineId: "l3",
        explanation: "`i <= numbers.length` reads one index past the array end (should be `<`), causing an off-by-one bug.",
      },
    },
    {
      order: 4,
      type: "code-patch",
      title: "Generator Room",
      config: {
        instruction: "The machine's core function is missing a piece. Pick the fragment that fixes it.",
        codeBefore: "function isPalindrome(str) {\n  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  const reversed = clean.split('').reverse().join('');\n  ",
        blankMarker: "/* ??? */",
        codeAfter: "\n}",
        options: [
          { id: "o1", text: "return clean === reversed;", correct: true },
          { id: "o2", text: "return clean == str;", correct: false },
          { id: "o3", text: "return reversed.length > 0;", correct: false },
          { id: "o4", text: "console.log(clean);", correct: false },
        ],
        explanation: "A palindrome check compares the cleaned string against its reversed form.",
      },
    },
    {
      order: 5,
      type: "scenario",
      title: "Sprint Standup Plaza",
      config: {
        situation:
          "It's standup. A teammate says they're blocked on an API contract you own, and your sprint deadline is tomorrow. You also have your own unfinished ticket.",
        prompt: "What do you do first?",
        choices: [
          {
            id: "c1",
            text: "Pause your own ticket, quickly unblock them with a clear contract, then return to your work.",
            weights: { softSkills: 1, problemSolving: 0.6 },
            consequence: "The team stays unblocked and trusts you'll prioritize shared blockers.",
          },
          {
            id: "c2",
            text: "Tell them to wait until you finish your ticket since it's not officially assigned to you.",
            weights: { softSkills: -0.6, problemSolving: -0.2 },
            consequence: "Your ticket finishes on time, but the team loses a day and trust erodes.",
          },
          {
            id: "c3",
            text: "Ask a quick clarifying question, then share a rough contract in chat so they can start while you keep working.",
            weights: { softSkills: 0.8, problemSolving: 1 },
            consequence: "Both workstreams keep moving with minimal context-switch cost.",
          },
        ],
        reasoningPrompt: "Optional: briefly explain why you chose this (helps us understand your thinking).",
      },
    },
    {
      order: 6,
      type: "timed-challenge",
      title: "Error Console Alley",
      config: {
        instruction: "The console is flooding with errors. Match each error to its likely cause before time runs out.",
        timeLimitSeconds: 60,
        left: [
          { id: "e1", text: "TypeError: Cannot read properties of undefined" },
          { id: "e2", text: "404 Not Found" },
          { id: "e3", text: "Maximum call stack size exceeded" },
          { id: "e4", text: "CORS policy blocked the request" },
        ],
        right: [
          { id: "r1", text: "Infinite/uncontrolled recursion" },
          { id: "r2", text: "Accessing a property on a null/undefined value" },
          { id: "r3", text: "Server missing Access-Control-Allow-Origin header" },
          { id: "r4", text: "Requested a URL/route that doesn't exist" },
        ],
        correctPairs: { e1: "r2", e2: "r4", e3: "r1", e4: "r3" },
      },
    },
  ],
};
