import Anthropic from "@anthropic-ai/sdk";
import { RubricResponseConfig } from "@/lib/stationTypes";
import { StationScoreResult } from "@/lib/scoring/rules";

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function neutralFallback(config: RubricResponseConfig, note: string): StationScoreResult {
  const dimensions: StationScoreResult["dimensions"] = {};
  for (const d of config.rubric) dimensions[d.mapsTo] = 50;
  return { score: 50, note, dimensions };
}

/**
 * Structured JSON rubric grading — the reusable service behind every
 * `rubric-response` station across fields. The rubric's weighted dimensions
 * and low/mid/high anchor descriptions are given to Claude as grounding
 * context, and the response is constrained to a JSON schema derived from
 * those dimensions (not a free-text "grade this" prompt), so scores stay
 * consistent and auditable across many candidates.
 */
export async function scoreRubricResponse(
  config: RubricResponseConfig,
  rawAnswer: { response: string }
): Promise<StationScoreResult> {
  const response = rawAnswer.response?.trim() ?? "";
  if (!response) {
    return { score: 0, note: "No response submitted.", dimensions: {} };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return neutralFallback(
      config,
      "Rubric grading requires ANTHROPIC_API_KEY — this response wasn't AI-graded, so a neutral default is shown."
    );
  }

  const schema = {
    type: "object",
    properties: {
      dimensionScores: {
        type: "object",
        properties: Object.fromEntries(
          config.rubric.map((d) => [
            d.key,
            { type: "integer", description: `Score 1 (weak) to 5 (excellent) for "${d.label}".` },
          ])
        ),
        required: config.rubric.map((d) => d.key),
        additionalProperties: false,
      },
      issuesIdentified: {
        type: "array",
        items: { type: "string" },
        description: "IDs of any seeded issues (from the provided list) the response correctly identified. Empty array if none apply.",
      },
      feedback: {
        type: "string",
        description: "2-3 sentence rationale grounded in the rubric anchors, for a hiring manager.",
      },
    },
    required: ["dimensionScores", "issuesIdentified", "feedback"],
    additionalProperties: false,
  } as const;

  const rubricTable = config.rubric
    .map(
      (d) =>
        `- ${d.label} (key: "${d.key}", weight ${d.weight}): 1 = ${d.anchors.low} | 3 = ${d.anchors.mid} | 5 = ${d.anchors.high}`
    )
    .join("\n");

  const issuesTable = config.seededIssues?.length
    ? `\n\nKnown issues planted in the material (for reference only — check which of these IDs the candidate's response actually surfaces):\n${config.seededIssues.map((i) => `- ${i.id}: ${i.description}`).join("\n")}`
    : "";

  try {
    const client = new Anthropic();
    const result = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      output_config: { format: { type: "json_schema", schema } },
      messages: [
        {
          role: "user",
          content: `You are grading one response in AUCTOR, a hiring assessment platform, using a fixed rubric. Grade strictly against the anchors below — do not invent your own criteria.

Task given to the candidate:
${config.prompt}
${config.contextMaterial ? `\nContext material:\n${config.contextMaterial}` : ""}

Rubric (score each dimension 1-5 against its anchors):
${rubricTable}${issuesTable}

Candidate's response:
${response}`,
        },
      ],
    });

    const textBlock = result.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return neutralFallback(config, "AI grading returned no output; showing a neutral default.");
    }

    const parsed = JSON.parse(textBlock.text) as {
      dimensionScores: Record<string, number>;
      issuesIdentified: string[];
      feedback: string;
    };

    const bucketTotals: Record<"technicalSkill" | "problemSolving" | "softSkills", { sum: number; weight: number }> = {
      technicalSkill: { sum: 0, weight: 0 },
      problemSolving: { sum: 0, weight: 0 },
      softSkills: { sum: 0, weight: 0 },
    };
    let overallSum = 0;
    let overallWeight = 0;

    for (const d of config.rubric) {
      const raw = parsed.dimensionScores[d.key] ?? 3;
      const normalized = clamp(((raw - 1) / 4) * 100);
      bucketTotals[d.mapsTo].sum += normalized * d.weight;
      bucketTotals[d.mapsTo].weight += d.weight;
      overallSum += normalized * d.weight;
      overallWeight += d.weight;
    }

    const dimensions: StationScoreResult["dimensions"] = {};
    const bucketKeys = ["technicalSkill", "problemSolving", "softSkills"] as const;
    for (const key of bucketKeys) {
      if (bucketTotals[key].weight > 0) {
        dimensions[key] = Math.round(bucketTotals[key].sum / bucketTotals[key].weight);
      }
    }

    let score = overallWeight > 0 ? Math.round(overallSum / overallWeight) : 0;

    if (config.seededIssues?.length) {
      const foundCount = parsed.issuesIdentified.filter((id) => config.seededIssues!.some((i) => i.id === id)).length;
      const issueAccuracy = Math.round((foundCount / config.seededIssues.length) * 100);
      score = Math.round(score * 0.7 + issueAccuracy * 0.3);
    }

    return { score, note: parsed.feedback, dimensions };
  } catch (err) {
    console.error("Rubric grading failed:", err);
    return neutralFallback(config, "AI grading hit an error; showing a neutral default.");
  }
}
