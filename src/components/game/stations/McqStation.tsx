"use client";

import { useState } from "react";
import { McqClientConfig } from "@/lib/clientStationTypes";
import { Button } from "@/components/ui/Button";

export function McqStation({
  config,
  onAnswer,
  submitting,
}: {
  config: McqClientConfig;
  onAnswer: (rawAnswer: { answers: Record<string, string> }) => void;
  submitting: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const allAnswered = config.questions.every((q) => answers[q.id]);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted">{config.intro}</p>
      {config.questions.map((q, i) => (
        <div key={q.id}>
          <p className="mb-2 text-sm font-semibold text-ink">
            {i + 1}. {q.prompt}
          </p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.id }))}
                className={`rounded-lg border-2 px-4 py-2.5 text-left text-sm transition ${
                  answers[q.id] === opt.id
                    ? "border-brand-500 bg-brand-50 font-semibold text-brand-700"
                    : "border-line hover:border-brand-300"
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      ))}
      <Button disabled={!allAnswered || submitting} onClick={() => onAnswer({ answers })} className="mt-2">
        {submitting ? "Submitting..." : "Submit answers"}
      </Button>
    </div>
  );
}
