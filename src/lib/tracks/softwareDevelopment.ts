import { TrackDefinition } from "@/lib/stationTypes";

export const softwareDevelopmentTrack: TrackDefinition = {
  slug: "software-development",
  title: "Software Development",
  description:
    "A real coding assessment: fundamentals, a live IDE with an AI helper, and a creative debugging round.",
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
      type: "code-ide",
      title: "Live Coding Challenge",
      config: {
        prompt:
          "Read a single line of comma-separated integers from standard input, and print the sum of only the even numbers.\n\nExample: input `2,3,4,5,6` should print `12` (2 + 4 + 6).",
        timeLimitMinutes: 20,
        languages: [
          {
            id: "python",
            label: "Python 3",
            judge0LanguageId: 71,
            monacoLanguage: "python",
            starterCode:
              "# Read a comma-separated line of integers from stdin\n# and print the sum of the even numbers.\n\nline = input()\nnumbers = [int(x) for x in line.split(\",\")]\n\n# TODO: compute and print the sum of the even numbers\n",
          },
          {
            id: "javascript",
            label: "JavaScript (Node)",
            judge0LanguageId: 63,
            monacoLanguage: "javascript",
            starterCode:
              "// Read a comma-separated line of integers from stdin\n// and print the sum of the even numbers.\n\nconst line = require('fs').readFileSync(0, 'utf8').trim();\nconst numbers = line.split(',').map(Number);\n\n// TODO: compute and print the sum of the even numbers\n",
          },
        ],
        testCases: [
          { id: "t1", stdin: "2,3,4,5,6", expectedOutput: "12", hidden: false },
          { id: "t2", stdin: "1,3,5", expectedOutput: "0", hidden: false },
          { id: "t3", stdin: "10,20,30", expectedOutput: "60", hidden: true },
          { id: "t4", stdin: "-2,-4,3", expectedOutput: "-6", hidden: true },
        ],
      },
    },
    {
      order: 3,
      type: "code-patch",
      title: "Generator Room",
      config: {
        instruction: "The machine's core function is missing a piece. Pick the fragment that fixes it.",
        codeBefore:
          "function isPalindrome(str) {\n  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  const reversed = clean.split('').reverse().join('');\n  ",
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
  ],
};
