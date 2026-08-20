import { TrackDefinition } from "@/lib/stationTypes";

export const salesBusinessDevelopmentTrack: TrackDefinition = {
  slug: "sales-business-development",
  title: "Sales & Business Development",
  description:
    "PMP-style branching scenarios through a cold call and a price objection, plus a rebuttal speed round.",
  theme: "sec-ops",
  category: "sales",
  stations: [
    {
      order: 1,
      type: "mcq",
      title: "Sales Fundamentals Checkpoint",
      config: {
        intro: "A few core sales concepts before the live scenarios.",
        questions: [
          {
            id: "q1",
            prompt: "What is the primary purpose of a discovery call?",
            options: [
              { id: "a", text: "To close the deal immediately" },
              { id: "b", text: "To understand the prospect's needs, pain points, and goals" },
              { id: "c", text: "To read out product specs" },
              { id: "d", text: "To negotiate final pricing" },
            ],
            correctOptionId: "b",
            explanation: "Discovery is about understanding the prospect before pitching a solution.",
          },
          {
            id: "q2",
            prompt: "What does good objection handling look like?",
            options: [
              { id: "a", text: "Ignoring the concern to keep the pitch on track" },
              { id: "b", text: "Addressing the concern in a way that moves the conversation forward" },
              { id: "c", text: "Arguing with the customer until they agree" },
              { id: "d", text: "Ending the call when pushback occurs" },
            ],
            correctOptionId: "b",
            explanation: "Good objection handling engages the concern constructively rather than avoiding it.",
          },
          {
            id: "q3",
            prompt: "Which is a sign of active listening on a sales call?",
            options: [
              { id: "a", text: "Interrupting to share your opinion" },
              { id: "b", text: "Paraphrasing what the prospect said to confirm understanding" },
              { id: "c", text: "Waiting silently for your turn to talk" },
              { id: "d", text: "Checking your phone while they talk" },
            ],
            correctOptionId: "b",
            explanation: "Paraphrasing confirms understanding and shows genuine engagement.",
          },
          {
            id: "q4",
            prompt: "What's a risk of leading with a discount too early in a conversation?",
            options: [
              { id: "a", text: "It builds trust faster" },
              { id: "b", text: "It can undercut perceived value before the prospect understands the product's worth" },
              { id: "c", text: "It has no real effect" },
              { id: "d", text: "It always increases urgency" },
            ],
            correctOptionId: "b",
            explanation: "Leading with price before value tends to anchor the conversation around cost, not worth.",
          },
        ],
      },
    },
    {
      order: 2,
      type: "branching-scenario",
      title: "Cold Call: New Prospect",
      config: {
        intro: "You're cold-calling a prospect who's never heard of your company.",
        start: "n1",
        nodes: {
          n1: {
            situation: "They pick up sounding rushed: \"Yes? Who is this?\"",
            choices: [
              { id: "c1", text: "Immediately launch into your pitch and product features.", next: "n2a", weights: { softSkills: -0.5, problemSolving: -0.2 } },
              { id: "c2", text: "Introduce yourself briefly, acknowledge they're busy, and ask for 30 seconds.", next: "n2b", weights: { softSkills: 0.9, problemSolving: 0.7 } },
              { id: "c3", text: "Ask them how their day is going before anything else.", next: "n2c", weights: { softSkills: 0.2, problemSolving: -0.3 } },
            ],
          },
          n2a: {
            situation: "They cut you off: \"I don't have time for this,\" and hang up.",
            choices: [
              { id: "c1", text: "Accept it and call the next prospect on your list.", next: null, weights: { softSkills: 0.1, problemSolving: 0.1 } },
              { id: "c2", text: "Call back immediately to try again.", next: null, weights: { softSkills: -0.7, problemSolving: -0.6 } },
            ],
          },
          n2b: {
            situation: "They say: \"Okay, 30 seconds, go.\" You have their attention.",
            choices: [
              { id: "c1", text: "Ask a discovery question about their current pain points.", next: "n3a", weights: { softSkills: 0.8, problemSolving: 0.9 } },
              { id: "c2", text: "List every feature of your product quickly.", next: "n3b", weights: { softSkills: -0.3, problemSolving: -0.4 } },
              { id: "c3", text: "Offer a discount immediately to hook them.", next: "n3c", weights: { softSkills: -0.6, problemSolving: -0.7 } },
            ],
          },
          n2c: {
            situation: "They seem confused: \"Sorry, what is this about?\"",
            choices: [
              { id: "c1", text: "Pivot and explain the reason for your call clearly.", next: "n3a", weights: { softSkills: 0.4, problemSolving: 0.5 } },
              { id: "c2", text: "Keep making small talk to build rapport.", next: null, weights: { softSkills: -0.5, problemSolving: -0.5 } },
            ],
          },
          n3a: {
            situation: "They mention they're frustrated with their current vendor's slow support response times.",
            choices: [
              { id: "c1", text: "Acknowledge the frustration, briefly explain how your support model addresses it, and ask to schedule a proper call.", next: null, weights: { softSkills: 1, problemSolving: 1 } },
              { id: "c2", text: "Immediately trash-talk their current vendor.", next: null, weights: { softSkills: -0.8, problemSolving: -0.5 } },
              { id: "c3", text: "Say nothing about it and try to close the sale right now.", next: null, weights: { softSkills: -0.2, problemSolving: -0.3 } },
            ],
          },
          n3b: {
            situation: "They sound overwhelmed: \"That's a lot... I have to go.\"",
            choices: [
              { id: "c1", text: "Apologize and ask for a follow-up call at a better time.", next: null, weights: { softSkills: 0.5, problemSolving: 0.4 } },
              { id: "c2", text: "Speed up and try to finish the feature list anyway.", next: null, weights: { softSkills: -0.7, problemSolving: -0.6 } },
            ],
          },
          n3c: {
            situation: "They say: \"A discount already? What's actually wrong with this product?\"",
            choices: [
              { id: "c1", text: "Explain you're just excited to work with them, then pivot to understanding their needs.", next: null, weights: { softSkills: 0.3, problemSolving: 0.4 } },
              { id: "c2", text: "Offer an even bigger discount.", next: null, weights: { softSkills: -0.8, problemSolving: -0.8 } },
            ],
          },
        },
      },
    },
    {
      order: 3,
      type: "branching-scenario",
      title: "Handling a Price Objection",
      config: {
        intro: "A promising prospect is comparing you against a cheaper competitor.",
        start: "p1",
        nodes: {
          p1: {
            situation: "\"Your price is 30% higher than [competitor]. Why should I pay more?\"",
            choices: [
              { id: "c1", text: "Immediately drop the price to match the competitor.", next: null, weights: { softSkills: -0.6, problemSolving: -0.8 } },
              { id: "c2", text: "Ask what specifically matters most to them in this decision, then connect your value to that.", next: "p2a", weights: { softSkills: 0.9, problemSolving: 1 } },
              { id: "c3", text: "List every feature your product has that the competitor doesn't.", next: "p2b", weights: { softSkills: -0.1, problemSolving: 0.1 } },
            ],
          },
          p2a: {
            situation: "\"Honestly, reliability matters most — we've had outages with our current tool.\"",
            choices: [
              { id: "c1", text: "Share a concrete example of your uptime record and a relevant customer story.", next: null, weights: { softSkills: 0.9, problemSolving: 1 } },
              { id: "c2", text: "Say \"we're reliable too\" without specifics.", next: null, weights: { softSkills: -0.4, problemSolving: -0.5 } },
            ],
          },
          p2b: {
            situation: "\"Okay but that still doesn't explain the price gap.\"",
            choices: [
              { id: "c1", text: "Pause, and ask what would make the price feel justified to them.", next: null, weights: { softSkills: 0.6, problemSolving: 0.7 } },
              { id: "c2", text: "Repeat the feature list louder.", next: null, weights: { softSkills: -0.7, problemSolving: -0.6 } },
            ],
          },
        },
      },
    },
    {
      order: 4,
      type: "timed-challenge",
      title: "Objection Rebuttal Speed Round",
      config: {
        instruction: "Match each objection to the strongest response strategy before time runs out.",
        timeLimitSeconds: 60,
        left: [
          { id: "e1", text: "\"It's too expensive.\"" },
          { id: "e2", text: "\"We're happy with our current vendor.\"" },
          { id: "e3", text: "\"I need to check with my team.\"" },
          { id: "e4", text: "\"Now isn't a good time.\"" },
        ],
        right: [
          { id: "r1", text: "Reframe the conversation around value and ROI instead of price" },
          { id: "r2", text: "Ask what would need to change for them to consider switching" },
          { id: "r3", text: "Offer materials that help them make the case internally" },
          { id: "r4", text: "Ask what timeline would work better and follow up then" },
        ],
        correctPairs: { e1: "r1", e2: "r2", e3: "r3", e4: "r4" },
      },
    },
  ],
};
