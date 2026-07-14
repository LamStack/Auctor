"use client";

import { useEffect, useRef, useState } from "react";
import { TimedChallengeClientConfig } from "@/lib/clientStationTypes";
import { Button } from "@/components/ui/Button";

export function TimedChallengeStation({
  config,
  onAnswer,
  submitting,
}: {
  config: TimedChallengeClientConfig;
  onAnswer: (rawAnswer: { pairs: Record<string, string>; timeUsedMs: number }) => void;
  submitting: boolean;
}) {
  const [secondsLeft, setSecondsLeft] = useState(config.timeLimitSeconds);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const startedAt = useRef(Date.now());
  const submittedRef = useRef(false);

  function submit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    onAnswer({ pairs, timeUsedMs: Date.now() - startedAt.current });
  }

  useEffect(() => {
    if (submitting) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          submit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitting]);

  const pairedRightIds = new Set(Object.values(pairs));
  const allPaired = Object.keys(pairs).length === config.left.length;

  function handleRightClick(rightId: string) {
    if (!activeLeft || pairedRightIds.has(rightId)) return;
    setPairs((p) => ({ ...p, [activeLeft]: rightId }));
    setActiveLeft(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{config.instruction}</p>
        <span
          className={`font-display rounded-full px-3 py-1 text-sm font-bold ${
            secondsLeft <= 10 ? "bg-danger/10 text-danger" : "bg-brand-100 text-brand-700"
          }`}
        >
          {secondsLeft}s
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {config.left.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveLeft(item.id)}
              className={`rounded-lg border-2 px-3 py-2.5 text-left text-xs font-medium transition ${
                pairs[item.id]
                  ? "border-mint-400 bg-mint-50"
                  : activeLeft === item.id
                    ? "border-accent-500 bg-accent-50"
                    : "border-line hover:border-brand-300"
              }`}
            >
              {item.text}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {config.right.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleRightClick(item.id)}
              disabled={pairedRightIds.has(item.id)}
              className={`rounded-lg border-2 px-3 py-2.5 text-left text-xs font-medium transition ${
                pairedRightIds.has(item.id) ? "border-mint-400 bg-mint-50 opacity-60" : "border-line hover:border-brand-300"
              }`}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
      <Button disabled={!allPaired || submitting} onClick={submit} className="mt-1">
        {submitting ? "Submitting..." : "Submit matches"}
      </Button>
    </div>
  );
}
