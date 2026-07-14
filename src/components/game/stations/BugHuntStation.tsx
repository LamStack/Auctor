"use client";

import { useState } from "react";
import { BugHuntClientConfig } from "@/lib/clientStationTypes";
import { Button } from "@/components/ui/Button";

export function BugHuntStation({
  config,
  onAnswer,
  submitting,
}: {
  config: BugHuntClientConfig;
  onAnswer: (rawAnswer: { selectedLineId: string }) => void;
  submitting: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted">{config.instruction}</p>
      <div className="overflow-hidden rounded-lg border border-brand-900 bg-brand-900">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-danger" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint-400" />
          <span className="ml-2 font-mono text-xs text-white/60">{config.sourceLabel}</span>
        </div>
        <div className="p-2 font-mono text-xs">
          {config.lines.map((line, i) => (
            <button
              key={line.id}
              type="button"
              onClick={() => setSelected(line.id)}
              className={`flex w-full items-start gap-3 rounded px-3 py-1.5 text-left transition ${
                selected === line.id ? "bg-accent-500/30" : "hover:bg-white/5"
              }`}
            >
              <span className="w-5 shrink-0 text-right text-white/30">{i + 1}</span>
              <span className="whitespace-pre text-mint-300">{line.text}</span>
            </button>
          ))}
        </div>
      </div>
      <Button
        disabled={!selected || submitting}
        onClick={() => selected && onAnswer({ selectedLineId: selected })}
        className="mt-1"
      >
        {submitting ? "Submitting..." : "Report the bug"}
      </Button>
    </div>
  );
}
