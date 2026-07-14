"use client";

import { useState } from "react";
import { CodePatchClientConfig } from "@/lib/clientStationTypes";
import { Button } from "@/components/ui/Button";

export function CodePatchStation({
  config,
  onAnswer,
  submitting,
}: {
  config: CodePatchClientConfig;
  onAnswer: (rawAnswer: { selectedOptionId: string }) => void;
  submitting: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedOption = config.options.find((o) => o.id === selected);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted">{config.instruction}</p>
      <div className="rounded-lg border border-brand-900 bg-brand-900 p-4 font-mono text-xs text-mint-300">
        <pre className="whitespace-pre-wrap">{config.codeBefore}</pre>
        <span className="rounded bg-accent-500/40 px-1 text-accent-100">
          {selectedOption ? selectedOption.text : config.blankMarker}
        </span>
        <pre className="whitespace-pre-wrap">{config.codeAfter}</pre>
      </div>
      <div className="flex flex-col gap-2">
        {config.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelected(opt.id)}
            className={`rounded-lg border-2 px-4 py-2.5 text-left font-mono text-xs transition ${
              selected === opt.id
                ? "border-brand-500 bg-brand-50 font-semibold text-brand-700"
                : "border-line hover:border-brand-300"
            }`}
          >
            {opt.text}
          </button>
        ))}
      </div>
      <Button
        disabled={!selected || submitting}
        onClick={() => selected && onAnswer({ selectedOptionId: selected })}
        className="mt-1"
      >
        {submitting ? "Submitting..." : "Patch the machine"}
      </Button>
    </div>
  );
}
