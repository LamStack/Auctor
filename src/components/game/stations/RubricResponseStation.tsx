"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { RubricResponseClientConfig } from "@/lib/clientStationTypes";
import { Button } from "@/components/ui/Button";

const LEVEL_LABEL: Record<number, string> = {
  1: "Level 1",
  2: "Level 2",
  3: "Level 3 — ambiguity",
  4: "Level 4 — senior judgment",
  5: "Level 5 — expert judgment",
};

export function RubricResponseStation({
  config,
  onAnswer,
  submitting,
}: {
  config: RubricResponseClientConfig;
  onAnswer: (rawAnswer: { response: string }) => void;
  submitting: boolean;
}) {
  const [response, setResponse] = useState("");

  return (
    <div className="flex h-full flex-col gap-3">
      <span className="w-fit rounded-full bg-accent-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-700">
        {LEVEL_LABEL[config.level] ?? `Level ${config.level}`}
      </span>

      <div className="rounded-lg bg-paper p-4 text-sm text-ink">{config.prompt}</div>

      {config.contextMaterial && (
        <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-brand-900 p-3 font-mono text-xs text-mint-300">
          {config.contextMaterial}
        </pre>
      )}

      <div className="min-h-0 flex-1">
        {config.responseType === "code" ? (
          <div className="h-full min-h-[220px] overflow-hidden rounded-lg border border-line">
            <Editor
              height="220px"
              language="plaintext"
              theme="vs-dark"
              value={response}
              onChange={(value) => setResponse(value ?? "")}
              options={{ minimap: { enabled: false }, fontSize: 13 }}
            />
          </div>
        ) : (
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={10}
            placeholder="Write your response here..."
            className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
          />
        )}
      </div>

      <Button disabled={submitting || !response.trim()} onClick={() => onAnswer({ response })}>
        {submitting ? "Submitting..." : "Submit response"}
      </Button>
    </div>
  );
}
