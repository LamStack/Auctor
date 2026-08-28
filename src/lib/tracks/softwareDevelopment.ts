import { TrackDefinition } from "@/lib/stationTypes";

export const softwareDevelopmentTrack: TrackDefinition = {
  slug: "software-development",
  title: "Software Development",
  description:
    "A leveled coding assessment: adaptive L1-2 coding rounds, an ambiguous ticket, a system design scenario, and a code review simulation.",
  theme: "dev-city",
  category: "coding",
  stations: [
    {
      order: 1,
      type: "mcq",
      title: "Fundamentals Checkpoint",
      config: {
        intro: "Quick fundamentals check before the main coding challenge.",
        questions: [
          {
            id: "q1",
            prompt: "What does Big-O notation describe?",
            options: [
              { id: "a", text: "How much memory a program uses at compile time" },
              { id: "b", text: "How an algorithm's running time or space scales with input size" },
              { id: "c", text: "The number of bugs in a program" },
              { id: "d", text: "How many languages a program supports" },
            ],
            correctOptionId: "b",
            explanation: "Big-O describes the growth rate of time/space relative to input size.",
          },
          {
            id: "q2",
            prompt: "Which best describes a REST API?",
            options: [
              { id: "a", text: "A database query language" },
              { id: "b", text: "A convention for stateless HTTP endpoints organized around resources" },
              { id: "c", text: "A type of compiler" },
              { id: "d", text: "A CSS framework" },
            ],
            correctOptionId: "b",
            explanation: "REST is an architectural style for stateless, resource-oriented HTTP APIs.",
          },
          {
            id: "q3",
            prompt: "What's the main risk of deeply nested callback functions?",
            options: [
              { id: "a", text: "They run faster than necessary" },
              { id: "b", text: "Code becomes hard to read and reason about (\"callback hell\")" },
              { id: "c", text: "They can't access variables from an outer scope" },
              { id: "d", text: "They only work in Python" },
            ],
            correctOptionId: "b",
            explanation: "Deep nesting hurts readability and error handling; promises/async-await usually fix this.",
          },
          {
            id: "q4",
            prompt: "What is a unit test primarily meant to verify?",
            options: [
              { id: "a", text: "That the whole system works end-to-end" },
              { id: "b", text: "That a small, isolated piece of code behaves as expected" },
              { id: "c", text: "That the UI looks correct" },
              { id: "d", text: "That the server has enough memory" },
            ],
            correctOptionId: "b",
            explanation: "Unit tests isolate and verify small units of logic independently.",
          },
        ],
      },
    },
    {
      order: 2,
      type: "adaptive-coding",
      title: "Adaptive Coding Rounds (L1-2)",
      config: {
        intro: "A few short coding problems. Answer well and the next one gets harder.",
        rounds: 3,
        language: { id: "python", label: "Python 3", judge0LanguageId: 71, monacoLanguage: "python" },
        problems: [
          {
            id: "e1",
            difficulty: "easy",
            prompt: "Read two space-separated integers from stdin and print their sum.",
            starterCode:
              "# Read two space-separated integers and print their sum.\n\nline = input()\na, b = map(int, line.split())\n\n# TODO: print the sum\n",
            testCases: [
              { id: "t1", stdin: "3 5", expectedOutput: "8", hidden: false },
              { id: "t2", stdin: "10 20", expectedOutput: "30", hidden: false },
              { id: "t3", stdin: "-5 5", expectedOutput: "0", hidden: true },
            ],
          },
          {
            id: "e2",
            difficulty: "easy",
            prompt: "Read one integer from stdin and print YES if it's even, else NO.",
            starterCode: "# Read one integer and print YES if even, else NO.\n\nn = int(input())\n\n# TODO\n",
            testCases: [
              { id: "t1", stdin: "4", expectedOutput: "YES", hidden: false },
              { id: "t2", stdin: "7", expectedOutput: "NO", hidden: false },
              { id: "t3", stdin: "0", expectedOutput: "YES", hidden: true },
            ],
          },
          {
            id: "m1",
            difficulty: "medium",
            prompt: "Read a comma-separated list of integers from stdin and print the maximum value.",
            starterCode:
              "# Read a comma-separated list of integers and print the maximum.\n\nnumbers = [int(x) for x in input().split(\",\")]\n\n# TODO\n",
            testCases: [
              { id: "t1", stdin: "3,7,2,9,4", expectedOutput: "9", hidden: false },
              { id: "t2", stdin: "-5,-1,-10", expectedOutput: "-1", hidden: false },
              { id: "t3", stdin: "42", expectedOutput: "42", hidden: true },
            ],
          },
          {
            id: "m2",
            difficulty: "medium",
            prompt: "Read a string from stdin and print it reversed.",
            starterCode: "# Read a string and print it reversed.\n\ns = input()\n\n# TODO\n",
            testCases: [
              { id: "t1", stdin: "hello", expectedOutput: "olleh", hidden: false },
              { id: "t2", stdin: "auctor", expectedOutput: "rotcua", hidden: false },
              { id: "t3", stdin: "a", expectedOutput: "a", hidden: true },
            ],
          },
          {
            id: "h1",
            difficulty: "hard",
            prompt:
              "Read a comma-separated list of integers from stdin and print the two largest values, in descending order, separated by a space.",
            starterCode:
              "# Read a comma-separated list of integers and print the two largest\n# values in descending order, separated by a space.\n\nnumbers = [int(x) for x in input().split(\",\")]\n\n# TODO\n",
            testCases: [
              { id: "t1", stdin: "3,7,2,9,4", expectedOutput: "9 7", hidden: false },
              { id: "t2", stdin: "1,1,2", expectedOutput: "2 1", hidden: false },
              { id: "t3", stdin: "5,5,5,5", expectedOutput: "5 5", hidden: true },
            ],
          },
          {
            id: "h2",
            difficulty: "hard",
            prompt:
              "Read a string from stdin and print \"true\" if it's a valid palindrome (ignoring case and non-alphanumeric characters), else \"false\".",
            starterCode:
              "# Read a string and print \"true\" if it's a valid palindrome\n# (ignoring case and non-alphanumeric characters), else \"false\".\n\ns = input()\n\n# TODO\n",
            testCases: [
              { id: "t1", stdin: "A man a plan a canal Panama", expectedOutput: "true", hidden: false },
              { id: "t2", stdin: "hello", expectedOutput: "false", hidden: false },
              { id: "t3", stdin: "No lemon, no melon", expectedOutput: "true", hidden: true },
            ],
          },
        ],
      },
    },
    {
      order: 3,
      type: "rubric-response",
      title: "The Ambiguous Ticket (L3)",
      config: {
        level: 3,
        skillTag: "requirements-clarification",
        responseType: "text",
        prompt:
          'You\'ve been assigned this ticket: "Users report that the export button sometimes doesn\'t work." That\'s the entire ticket — no repro steps, no error logs, no specifics. Before writing any code, respond with: (1) the clarifying questions you\'d ask, and (2) the assumptions you\'d make if you couldn\'t get answers right away, and how you\'d proceed.',
        rubric: [
          {
            key: "clarifying_questions",
            label: "Quality of clarifying questions",
            weight: 2,
            mapsTo: "problemSolving",
            anchors: {
              low: 'Asks no questions, or only vague ones ("what\'s wrong with it?").',
              mid: "Asks a few relevant questions (browser, error messages, when it happens).",
              high: "Asks sharp, prioritized questions that would quickly isolate the failure mode (specific browsers/roles/data conditions, whether it errors silently, recent deploys).",
            },
          },
          {
            key: "assumption_handling",
            label: "Handling ambiguity / stated assumptions",
            weight: 1.5,
            mapsTo: "problemSolving",
            anchors: {
              low: "Just starts guessing at a fix with no stated assumptions.",
              mid: "States a reasonable assumption before proceeding.",
              high: "States explicit, falsifiable assumptions and a plan to validate or roll back if wrong.",
            },
          },
          {
            key: "communication",
            label: "Clarity of communication",
            weight: 1,
            mapsTo: "softSkills",
            anchors: {
              low: "Rambling, hard to follow.",
              mid: "Clear but unstructured.",
              high: "Clear, structured, and immediately actionable for a teammate or PM.",
            },
          },
        ],
      },
    },
    {
      order: 4,
      type: "rubric-response",
      title: "System Design: Rate Limiter (L4-5)",
      config: {
        level: 4,
        skillTag: "system-design",
        responseType: "text",
        prompt:
          "Design a rate limiter for a public API that needs to support 10,000 requests/second across multiple servers, with per-user limits. Describe your approach: the algorithm you'd use, how you'd handle state across multiple servers, and the key trade-offs of your design versus at least one alternative.",
        rubric: [
          {
            key: "algorithm_choice",
            label: "Algorithm choice & justification",
            weight: 2,
            mapsTo: "technicalSkill",
            anchors: {
              low: "No concrete algorithm named, or a clearly poor fit (e.g. a simple in-memory counter with no distribution story).",
              mid: "Names a reasonable algorithm (e.g. token bucket, sliding window) with basic justification.",
              high: "Names an appropriate algorithm and justifies it against the specific constraints (throughput, per-user limits, accuracy vs. performance).",
            },
          },
          {
            key: "distributed_state",
            label: "Distributed state handling",
            weight: 2,
            mapsTo: "technicalSkill",
            anchors: {
              low: "Ignores the multi-server requirement entirely.",
              mid: "Mentions needing shared state (e.g. Redis) without addressing consistency or latency.",
              high: "Explains how state is shared/synced across servers, addresses consistency vs. latency trade-offs, and considers failure modes.",
            },
          },
          {
            key: "tradeoff_reasoning",
            label: "Trade-off reasoning",
            weight: 1.5,
            mapsTo: "problemSolving",
            anchors: {
              low: "Presents one option as simply \"the answer\" with no alternatives considered.",
              mid: "Mentions an alternative approach briefly.",
              high: "Clearly compares at least two approaches with concrete, scenario-relevant trade-offs (cost, complexity, accuracy, failure behavior).",
            },
          },
        ],
      },
    },
    {
      order: 5,
      type: "rubric-response",
      title: "Code Review Simulation",
      config: {
        level: 4,
        skillTag: "code-review",
        responseType: "text",
        prompt:
          "Below is a code diff from a teammate's pull request. Review it as you would in a real code review: identify any bugs you find, and explain what's wrong and how you'd fix each one.",
        contextMaterial: `function calculateDiscount(price, discountPercent) {
  const discount = price * discountPercent / 100;
  const finalPrice = price - discount;
  return finalPrice.toFixed(2);
}

function applyBulkDiscount(items, discountPercent) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += calculateDiscount(items[i].price, discountPercent);
  }
  return total;
}`,
        seededIssues: [
          {
            id: "no-validation",
            description:
              "discountPercent isn't validated (could be negative or over 100), which would produce a negative or nonsensical discount/price.",
          },
          {
            id: "type-mismatch",
            description:
              "calculateDiscount returns a string (toFixed's result) but is used in numeric addition in applyBulkDiscount, causing string concatenation instead of a numeric sum.",
          },
          {
            id: "off-by-one",
            description:
              "the loop condition `i <= items.length` reads one index past the end of the array (items[items.length] is undefined), which throws when accessing .price.",
          },
        ],
        rubric: [
          {
            key: "bugs_found",
            label: "Bugs identified",
            weight: 2,
            mapsTo: "technicalSkill",
            anchors: { low: "Finds 0-1 of the real issues.", mid: "Finds 2 of the real issues.", high: "Finds all 3 real issues." },
          },
          {
            key: "fix_quality",
            label: "Quality of proposed fixes",
            weight: 1.5,
            mapsTo: "technicalSkill",
            anchors: {
              low: "No concrete fixes proposed, or fixes that don't address the actual bug.",
              mid: "Proposes workable fixes for the issues found.",
              high: "Proposes clean, correct fixes and explains why each resolves the root cause, not just the symptom.",
            },
          },
          {
            key: "review_communication",
            label: "Code review communication style",
            weight: 1,
            mapsTo: "softSkills",
            anchors: {
              low: "Blunt/dismissive tone, or too vague to act on.",
              mid: "Clear and factual.",
              high: "Constructive, specific, and collaborative — the kind of review that helps a teammate improve.",
            },
          },
        ],
      },
    },
  ],
};
