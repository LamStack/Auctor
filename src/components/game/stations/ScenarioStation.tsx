"use client";

import { useState } from "react";
import { ScenarioClientConfig } from "@/lib/clientStationTypes";
import { Button } from "@/components/ui/Button";

export function ScenarioStation({
  config,
  onAnswer,
  submitting,
}: {
  config: ScenarioClientConfig;
  onAnswer: (rawAnswer: { choiceId: string }, reasoningText?: string) => void;
  submitting: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState("");

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg bg-paper p-4 text-sm text-ink">{config.situation}</div>
      <p className="text-sm font-semibold text-ink">{config.prompt}</p>
      <div className="flex flex-col gap-2">
        {config.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            onClick={() => setSelected(choice.id)}
            className={`rounded-lg border-2 px-4 py-2.5 text-left text-sm transition ${
              selected === choice.id
                ? "border-brand-500 bg-brand-50 font-semibold text-brand-700"
                : "border-line hover:border-brand-300"
            }`}
          >
            {choice.text}
          </button>
        ))}
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-muted">{config.reasoningPrompt}</label>
        <textarea
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>
      <Button
        disabled={!selected || submitting}
        onClick={() => selected && onAnswer({ choiceId: selected }, reasoning || undefined)}
        className="mt-1"
      >
        {submitting ? "Submitting..." : "Confirm decision"}
      </Button>
    </div>
  );
}
