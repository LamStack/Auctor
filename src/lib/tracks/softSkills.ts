import { TrackDefinition } from "@/lib/stationTypes";

export const softSkillsTrack: TrackDefinition = {
  slug: "soft-skills-assessment",
  title: "Soft Skills Assessment",
  description:
    "Adaptive workplace-scenario mini-games that get harder the better you do — communication, teamwork, and pressure handling.",
  theme: "soft-skills",
  category: "soft-skills",
  stations: [
    {
      order: 1,
      type: "mcq",
      title: "Workplace Basics Checkpoint",
      config: {
        intro: "A quick warm-up on workplace communication before the adaptive rounds.",
        questions: [
          {
            id: "q1",
            prompt: "What's the best first response to receiving critical feedback?",
            options: [
              { id: "a", text: "Get defensive and explain why you're right" },
              { id: "b", text: "Listen fully, ask clarifying questions, then reflect" },
              { id: "c", text: "Ignore it" },
              { id: "d", text: "Immediately agree without thinking it through" },
            ],
            correctOptionId: "b",
            explanation: "Understanding feedback fully before reacting leads to better outcomes.",
          },
          {
            id: "q2",
            prompt: "In a disagreement with a colleague, what best preserves the relationship while resolving the issue?",
            options: [
              { id: "a", text: "Avoid the topic entirely" },
              { id: "b", text: "Focus on the shared goal and discuss the issue directly and respectfully" },
              { id: "c", text: "Complain to other colleagues about them" },
              { id: "d", text: "Wait for them to bring it up first" },
            ],
            correctOptionId: "b",
            explanation: "Direct, respectful, goal-focused conversation resolves issues without damaging trust.",
          },
          {
            id: "q3",
            prompt: "What does \"active listening\" mean?",
            options: [
              { id: "a", text: "Waiting for your turn to speak" },
              { id: "b", text: "Fully concentrating, understanding, and responding thoughtfully to what's said" },
              { id: "c", text: "Repeating everything word for word" },
              { id: "d", text: "Only listening to the parts you agree with" },
            ],
            correctOptionId: "b",
            explanation: "Active listening means genuinely engaging with and understanding the speaker.",
          },
          {
            id: "q4",
            prompt: "Two urgent tasks conflict for your time. What's the best first step?",
            options: [
              { id: "a", text: "Do whichever is easiest first" },
              { id: "b", text: "Clarify with stakeholders which one is actually more urgent" },
              { id: "c", text: "Do both simultaneously without a plan" },
              { id: "d", text: "Postpone both until told what to do" },
            ],
            correctOptionId: "b",
            explanation: "Clarifying true priority prevents wasted effort on the wrong task.",
          },
        ],
      },
    },
    {
      order: 2,
      type: "softskill-game",
      title: "Adaptive Judgment Rounds",
      config: {
        intro: "Six short workplace scenarios. Answer well and the next one gets harder.",
        rounds: 6,
        items: [
          {
            id: "e1",
            difficulty: "easy",
            skillTag: "communication",
            prompt: "A coworker sends you a message you don't fully understand. What do you do?",
            choices: [
              { id: "c1", text: "Ask a clarifying question", score: 90 },
              { id: "c2", text: "Guess what they meant and proceed", score: 30 },
              { id: "c3", text: "Ignore it and hope it's not important", score: 10 },
            ],
          },
          {
            id: "e2",
            difficulty: "easy",
            skillTag: "teamwork",
            prompt: "Your team is deciding where to eat lunch together. You have a preference but others suggest something else.",
            choices: [
              { id: "c1", text: "Go along with the group's choice cheerfully", score: 80 },
              { id: "c2", text: "Insist on your preference", score: 20 },
              { id: "c3", text: "Say nothing and seem annoyed", score: 15 },
            ],
          },
          {
            id: "e3",
            difficulty: "easy",
            skillTag: "time-management",
            prompt: "You have two small tasks due today: one takes 5 minutes, the other 2 hours.",
            choices: [
              { id: "c1", text: "Do the quick one first to build momentum, then the longer one", score: 85 },
              { id: "c2", text: "Start the long one immediately and let the short one wait", score: 50 },
              { id: "c3", text: "Do neither and wait for reminders", score: 5 },
            ],
          },
          {
            id: "m1",
            difficulty: "medium",
            skillTag: "conflict-resolution",
            prompt: "Two teammates disagree loudly in a meeting about the right approach.",
            choices: [
              { id: "c1", text: "Pause the discussion, acknowledge both viewpoints, and suggest evaluating pros/cons together", score: 95 },
              { id: "c2", text: "Let them keep arguing until one gives up", score: 20 },
              { id: "c3", text: "Take one side to end it quickly", score: 30 },
            ],
          },
          {
            id: "m2",
            difficulty: "medium",
            skillTag: "adaptability",
            prompt: "Midway through a project, requirements change significantly.",
            choices: [
              { id: "c1", text: "Reassess the plan and communicate the impact to stakeholders", score: 90 },
              { id: "c2", text: "Continue with the original plan and adjust later", score: 25 },
              { id: "c3", text: "Complain that the requirements shouldn't have changed", score: 15 },
            ],
          },
          {
            id: "m3",
            difficulty: "medium",
            skillTag: "communication",
            prompt: "You need to give a teammate critical feedback on their work.",
            choices: [
              { id: "c1", text: "Give specific, constructive feedback focused on the work, privately", score: 95 },
              { id: "c2", text: "Mention it casually in a group chat", score: 20 },
              { id: "c3", text: "Avoid saying anything to keep the peace", score: 25 },
            ],
          },
          {
            id: "h1",
            difficulty: "hard",
            skillTag: "leadership",
            prompt: "Your team is behind on a deadline and morale is low.",
            choices: [
              { id: "c1", text: "Acknowledge the challenge honestly, re-prioritize scope with the team, and check in on workload", score: 95 },
              { id: "c2", text: "Push everyone to work overtime without discussion", score: 20 },
              { id: "c3", text: "Escalate blame to management immediately", score: 10 },
            ],
          },
          {
            id: "h2",
            difficulty: "hard",
            skillTag: "conflict-resolution",
            prompt: "A senior stakeholder publicly criticizes your team's work in a meeting, and you believe part of the criticism is unfair.",
            choices: [
              { id: "c1", text: "Calmly acknowledge the valid points, then clarify context for the unfair parts after the meeting", score: 95 },
              { id: "c2", text: "Argue back immediately in the meeting", score: 30 },
              { id: "c3", text: "Stay silent in the meeting and vent to teammates afterward", score: 35 },
            ],
          },
          {
            id: "h3",
            difficulty: "hard",
            skillTag: "adaptability",
            prompt: "You're asked to take over a failing project with unclear scope and a tight new deadline.",
            choices: [
              { id: "c1", text: "Quickly clarify scope and priorities with stakeholders, then propose a realistic plan", score: 95 },
              { id: "c2", text: "Accept the deadline as-is and start working immediately without clarifying", score: 30 },
              { id: "c3", text: "Push back and refuse the assignment", score: 15 },
            ],
          },
        ],
      },
    },
  ],
};
