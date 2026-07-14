import { TrackDefinition } from "@/lib/stationTypes";

export const qaTestingTrack: TrackDefinition = {
  slug: "qa-testing",
  title: "QA / Software Testing",
  description:
    "A defect-hunting quest through test design, bug triage, and release-gate judgment calls.",
  theme: "qa-lab",
  stations: [
    {
      order: 1,
      type: "mcq",
      title: "Test Theory Booth",
      config: {
        intro: "A QA lead greets you at the booth with a clipboard of questions.",
        questions: [
          {
            id: "q1",
            prompt: "What's the key difference between black-box and white-box testing?",
            options: [
              { id: "a", text: "Black-box tests behavior without looking at code; white-box uses internal code knowledge" },
              { id: "b", text: "Black-box is only for mobile apps" },
              { id: "c", text: "White-box testing never uses code" },
              { id: "d", text: "There is no real difference" },
            ],
            correctOptionId: "a",
            explanation: "Black-box focuses on inputs/outputs; white-box uses internal logic/structure.",
          },
          {
            id: "q2",
            prompt: "A 'smoke test' is best described as:",
            options: [
              { id: "a", text: "An exhaustive test of every edge case" },
              { id: "b", text: "A quick check that core functionality works before deeper testing" },
              { id: "c", text: "A test that only runs on Fridays" },
              { id: "d", text: "A performance stress test" },
            ],
            correctOptionId: "b",
            explanation: "Smoke tests verify the build is stable enough to test further.",
          },
          {
            id: "q3",
            prompt: "Severity and priority in a bug report describe:",
            options: [
              { id: "a", text: "The same thing, just different words" },
              { id: "b", text: "Severity = technical impact; Priority = urgency to fix" },
              { id: "c", text: "Severity = urgency; Priority = technical impact" },
              { id: "d", text: "Neither matters for triage" },
            ],
            correctOptionId: "b",
            explanation: "Severity measures impact on the system; priority measures how soon it should be fixed.",
          },
          {
            id: "q4",
            prompt: "Regression testing is performed to:",
            options: [
              { id: "a", text: "Test brand-new features only" },
              { id: "b", text: "Confirm that recent changes haven't broken existing functionality" },
              { id: "c", text: "Replace the need for smoke tests" },
              { id: "d", text: "Check server hardware" },
            ],
            correctOptionId: "b",
            explanation: "Regression tests re-verify existing behavior after changes.",
          },
          {
            id: "q5",
            prompt: "What makes a good test case?",
            options: [
              { id: "a", text: "Vague steps so testers can improvise" },
              { id: "b", text: "Clear preconditions, steps, and expected result" },
              { id: "c", text: "No expected result, just observations" },
              { id: "d", text: "Only testing the happy path" },
            ],
            correctOptionId: "b",
            explanation: "Good test cases are reproducible: clear setup, steps, and expected outcome.",
          },
        ],
      },
    },
    {
      order: 2,
      type: "sequence",
      title: "Bug Report Bench",
      config: {
        instruction: "Order the steps for properly triaging and reporting a newly found bug.",
        steps: [
          { id: "s1", text: "Reproduce the issue consistently" },
          { id: "s2", text: "Check if it's already a known/duplicate bug" },
          { id: "s3", text: "Isolate exact steps and environment" },
          { id: "s4", text: "Write a clear bug report with severity" },
          { id: "s5", text: "Assign/route it to the right owner" },
          { id: "s6", text: "Verify the fix once resolved" },
        ],
        correctOrder: ["s1", "s2", "s3", "s4", "s5", "s6"],
      },
    },
    {
      order: 3,
      type: "bug-hunt",
      title: "Broken Checkout Screen",
      config: {
        instruction: "These are notes from a checkout page test session. Click the line that actually describes a real defect.",
        sourceLabel: "checkout-test-notes.log",
        lines: [
          { id: "l1", text: "Cart total updates correctly when quantity changes" },
          { id: "l2", text: "Discount code 'SAVE10' applies a 10% discount as expected" },
          { id: "l3", text: "Clicking 'Place Order' with an empty required address field still submits the order" },
          { id: "l4", text: "Page loads in under 2 seconds on test environment" },
          { id: "l5", text: "Confirmation email is sent after successful order" },
        ],
        buggyLineId: "l3",
        explanation: "Required field validation should block submission — this is a real functional defect, not expected behavior.",
      },
    },
    {
      order: 4,
      type: "code-patch",
      title: "Test Script Terminal",
      config: {
        instruction: "This automated test assertion is broken. Pick the fragment that correctly completes it.",
        codeBefore: "test('login rejects wrong password', () => {\n  const result = login('user@auctor.bh', 'wrongPassword');\n  ",
        blankMarker: "/* ??? */",
        codeAfter: "\n});",
        options: [
          { id: "o1", text: "expect(result.success).toBe(false);", correct: true },
          { id: "o2", text: "expect(result.success).toBe(true);", correct: false },
          { id: "o3", text: "expect(result).toBeUndefined();", correct: false },
          { id: "o4", text: "console.log('done');", correct: false },
        ],
        explanation: "A wrong password should make the login attempt fail, so success should be false.",
      },
    },
    {
      order: 5,
      type: "scenario",
      title: "Release Gate Room",
      config: {
        situation:
          "It's 4pm, the release is scheduled for 5pm, and you just found a bug where 1 in 20 users can't complete checkout on mobile Safari.",
        prompt: "What do you do?",
        choices: [
          {
            id: "c1",
            text: "Immediately flag it to the release owner with clear impact data and recommend delaying or hotfixing before ship.",
            weights: { softSkills: 0.9, problemSolving: 1 },
            consequence: "The team makes an informed, fast call instead of shipping blind.",
          },
          {
            id: "c2",
            text: "Say nothing since it's a minority of users and the deadline is close.",
            weights: { softSkills: -0.8, problemSolving: -0.6 },
            consequence: "A real checkout defect ships to production silently.",
          },
          {
            id: "c3",
            text: "Quietly keep investigating alone past the deadline without telling anyone yet.",
            weights: { softSkills: -0.3, problemSolving: 0.2 },
            consequence: "The release ships on time by default, without the team ever deciding on the risk.",
          },
        ],
        reasoningPrompt: "Optional: briefly explain your reasoning.",
      },
    },
    {
      order: 6,
      type: "timed-challenge",
      title: "Regression Sprint",
      config: {
        instruction: "Match each test case to the feature area it actually covers before time runs out.",
        timeLimitSeconds: 60,
        left: [
          { id: "e1", text: "Verify discount code expires after end date" },
          { id: "e2", text: "Verify password reset email link expires after 1 hour" },
          { id: "e3", text: "Verify item count updates after removing from cart" },
          { id: "e4", text: "Verify 2FA code rejects after 3 wrong attempts" },
        ],
        right: [
          { id: "r1", text: "Authentication & security" },
          { id: "r2", text: "Shopping cart" },
          { id: "r3", text: "Promotions/pricing" },
          { id: "r4", text: "Account recovery" },
        ],
        correctPairs: { e1: "r3", e2: "r4", e3: "r2", e4: "r1" },
      },
    },
  ],
};
