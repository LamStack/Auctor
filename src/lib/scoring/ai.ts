import Anthropic from "@anthropic-ai/sdk";
import { AggregateScores } from "@/lib/scoring/rules";

export interface AiNarrative {
  narrative: string;
  strengths: string[];
  growthAreas: string[];
  aiGenerated: boolean;
}

const REPORT_SCHEMA = {
  type: "object",
  properties: {
    narrative: {
      type: "string",
      description: "2-4 sentence explainability summary of the candidate's performance for a hiring manager.",
    },
    strengths: {
      type: "array",
      items: { type: "string" },
      description: "2-4 short, specific strengths observed across the stations.",
    },
    growthAreas: {
      type: "array",
      items: { type: "string" },
      description: "1-3 short, specific growth areas observed across the stations.",
    },
  },
  required: ["narrative", "strengths", "growthAreas"],
  additionalProperties: false,
} as const;

function fallbackNarrative(aggregate: AggregateScores): AiNarrative {
  const strong = aggregate.perStationNotes.filter((s) => s.score >= 70).map((s) => s.title);
  const weak = aggregate.perStationNotes.filter((s) => s.score < 50).map((s) => s.title);
  return {
    narrative: `Rule-based summary (AI narrative unavailable): overall score ${aggregate.overall}/100, with technical skill ${aggregate.technicalSkill}, problem solving ${aggregate.problemSolving}, and soft skills ${aggregate.softSkills}.`,
    strengths: strong.length ? strong : ["No standout stations identified."],
    growthAreas: weak.length ? weak : ["No significant weak areas identified."],
    aiGenerated: false,
  };
}

export async function generateAiNarrative(params: {
  trackTitle: string;
  roleLabel: string;
  aggregate: AggregateScores;
}): Promise<AiNarrative> {
  const { trackTitle, roleLabel, aggregate } = params;

  if (!process.env.ANTHROPIC_API_KEY) {
    return fallbackNarrative(aggregate);
  }

  const client = new Anthropic();

  const stationSummary = aggregate.perStationNotes
    .map((s) => `- ${s.title}: score ${s.score}/100 — ${s.note}`)
    .join("\n");

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      output_config: { format: { type: "json_schema", schema: REPORT_SCHEMA } },
      messages: [
        {
          role: "user",
          content: `You are writing an explainability report for AUCTOR, a gamified hiring assessment platform in Bahrain. A candidate completed the "${trackTitle}" assessment for the role "${roleLabel}".

Rule-based sub-scores (0-100): technical skill ${aggregate.technicalSkill}, problem solving / way of thinking ${aggregate.problemSolving}, soft skills ${aggregate.softSkills}, overall ${aggregate.overall}.

Per-station results:
${stationSummary}

Write a short, concrete, hiring-manager-facing narrative explaining the candidate's performance, plus specific strengths and growth areas grounded in the station results above. Do not invent details not supported by the data.`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") return fallbackNarrative(aggregate);

    const parsed = JSON.parse(textBlock.text) as {
      narrative: string;
      strengths: string[];
      growthAreas: string[];
    };

    return { ...parsed, aiGenerated: true };
  } catch {
    return fallbackNarrative(aggregate);
  }
}
