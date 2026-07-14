import { TrackDefinition } from "@/lib/stationTypes";

export const cybersecurityTrack: TrackDefinition = {
  slug: "cybersecurity-it-support",
  title: "Cybersecurity / IT Support Analyst",
  description:
    "An incident-response quest through security fundamentals, threat triage, and calm-under-pressure judgment.",
  theme: "sec-ops",
  stations: [
    {
      order: 1,
      type: "mcq",
      title: "Security Basics Checkpoint",
      config: {
        intro: "A badge scanner blocks the door. Answer correctly to get clearance.",
        questions: [
          {
            id: "q1",
            prompt: "What is the main goal of a phishing email?",
            options: [
              { id: "a", text: "To improve email deliverability" },
              { id: "b", text: "To trick the recipient into revealing credentials or installing malware" },
              { id: "c", text: "To test server uptime" },
              { id: "d", text: "To back up company data" },
            ],
            correctOptionId: "b",
            explanation: "Phishing manipulates people into giving up credentials or running malicious code.",
          },
          {
            id: "q2",
            prompt: "Which is the strongest password practice?",
            options: [
              { id: "a", text: "Reusing one strong password everywhere" },
              { id: "b", text: "A unique, long passphrase per account plus a password manager" },
              { id: "c", text: "Changing your password every day" },
              { id: "d", text: "Writing passwords on a sticky note near the desk" },
            ],
            correctOptionId: "b",
            explanation: "Unique long passphrases plus a manager reduce reuse risk and improve strength.",
          },
          {
            id: "q3",
            prompt: "A firewall primarily helps by:",
            options: [
              { id: "a", text: "Encrypting all stored files automatically" },
              { id: "b", text: "Filtering network traffic based on rules" },
              { id: "c", text: "Backing up user data" },
              { id: "d", text: "Speeding up internet connections" },
            ],
            correctOptionId: "b",
            explanation: "Firewalls allow/deny traffic based on defined rules to reduce attack surface.",
          },
          {
            id: "q4",
            prompt: "Social engineering attacks primarily exploit:",
            options: [
              { id: "a", text: "Software bugs only" },
              { id: "b", text: "Human trust and behavior" },
              { id: "c", text: "Hardware failures" },
              { id: "d", text: "Network latency" },
            ],
            correctOptionId: "b",
            explanation: "Social engineering manipulates people rather than exploiting purely technical flaws.",
          },
          {
            id: "q5",
            prompt: "What does encryption at rest protect against?",
            options: [
              { id: "a", text: "Someone reading stored data if they gain unauthorized file access" },
              { id: "b", text: "Slow network speeds" },
              { id: "c", text: "Power outages" },
              { id: "d", text: "Typing errors" },
            ],
            correctOptionId: "a",
            explanation: "Encryption at rest keeps stored data unreadable without the proper key, even if accessed.",
          },
        ],
      },
    },
    {
      order: 2,
      type: "sequence",
      title: "Incident Response Bay",
      config: {
        instruction: "Order the standard incident response phases correctly.",
        steps: [
          { id: "s1", text: "Identify the incident" },
          { id: "s2", text: "Contain the threat" },
          { id: "s3", text: "Eradicate the root cause" },
          { id: "s4", text: "Recover affected systems" },
          { id: "s5", text: "Document lessons learned" },
        ],
        correctOrder: ["s1", "s2", "s3", "s4", "s5"],
      },
    },
    {
      order: 3,
      type: "bug-hunt",
      title: "Suspicious Log Terminal",
      config: {
        instruction: "A server log is scrolling by. Click the entry that looks like a real security concern.",
        sourceLabel: "auth.log",
        lines: [
          { id: "l1", text: "09:01:12 user 'lamees' logged in from Manama, Bahrain (known device)" },
          { id: "l2", text: "09:02:45 user 'admin' failed login x1 from Manama, Bahrain" },
          { id: "l3", text: "09:03:10 user 'admin' failed login x47 from unrecognized IP in 2 minutes" },
          { id: "l4", text: "09:05:00 scheduled backup completed successfully" },
          { id: "l5", text: "09:06:22 user 'lamees' logged out" },
        ],
        buggyLineId: "l3",
        explanation: "47 failed admin logins in 2 minutes from an unrecognized IP is a classic brute-force signature.",
      },
    },
    {
      order: 4,
      type: "code-patch",
      title: "Firewall Rule Console",
      config: {
        instruction: "This firewall config is missing a rule. Pick the fragment that correctly blocks the described threat.",
        codeBefore: "# Goal: block inbound traffic on the unused legacy port, allow everything else as-is\nALLOW  ALL   OUTBOUND\nALLOW  443   INBOUND   # HTTPS\nALLOW  22    INBOUND   # SSH (admin only)\n",
        blankMarker: "??? INBOUND   # legacy telnet, unused",
        codeAfter: "",
        options: [
          { id: "o1", text: "DENY   23", correct: true },
          { id: "o2", text: "ALLOW  23", correct: false },
          { id: "o3", text: "DENY   443", correct: false },
          { id: "o4", text: "ALLOW  ALL", correct: false },
        ],
        explanation: "Port 23 (Telnet) is legacy and unused, so it should be explicitly denied to shrink the attack surface.",
      },
    },
    {
      order: 5,
      type: "scenario",
      title: "Help Desk Front Line",
      config: {
        situation:
          "A user calls in urgently, saying IT support (you) emailed them asking to 'confirm their password' by replying to an email, and they want to know if it's safe to reply.",
        prompt: "How do you respond?",
        choices: [
          {
            id: "c1",
            text: "Tell them IT never asks for passwords by email, don't reply, and report the email as phishing.",
            weights: { softSkills: 0.9, problemSolving: 1 },
            consequence: "The phishing attempt is neutralized and the user learns the correct pattern to watch for.",
          },
          {
            id: "c2",
            text: "Tell them it's probably fine since it came from an internal-looking email address.",
            weights: { softSkills: -0.7, problemSolving: -0.9 },
            consequence: "The user replies with their password, likely compromising their account.",
          },
          {
            id: "c3",
            text: "Say you're not sure and to just wait until you check later today.",
            weights: { softSkills: 0.1, problemSolving: -0.2 },
            consequence: "The threat sits unresolved longer than necessary, increasing risk.",
          },
        ],
        reasoningPrompt: "Optional: briefly explain your reasoning.",
      },
    },
    {
      order: 6,
      type: "timed-challenge",
      title: "Threat Triage Wall",
      config: {
        instruction: "Match each indicator to its correct severity/response before time runs out.",
        timeLimitSeconds: 60,
        left: [
          { id: "e1", text: "Single failed login from a known employee device" },
          { id: "e2", text: "Ransomware note appears on a shared file server" },
          { id: "e3", text: "Employee reports a suspicious but unopened email" },
          { id: "e4", text: "Unusual after-hours data export of customer records" },
        ],
        right: [
          { id: "r1", text: "Critical — isolate systems immediately, escalate now" },
          { id: "r2", text: "Low — log and monitor, no action needed" },
          { id: "r3", text: "Medium — investigate promptly, notify security team" },
          { id: "r4", text: "High — escalate and investigate same-day" },
        ],
        correctPairs: { e1: "r2", e2: "r1", e3: "r3", e4: "r4" },
      },
    },
  ],
};
