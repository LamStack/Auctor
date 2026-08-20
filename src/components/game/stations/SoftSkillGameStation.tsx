"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SoftSkillGameClientConfig, SoftSkillItemClient } from "@/lib/clientStationTypes";
import { Button } from "@/components/ui/Button";

const DIFFICULTY_LABEL: Record<string, string> = { easy: "Warm-up", medium: "Standard", hard: "Pressure round" };

export function SoftSkillGameStation({
  token,
  stationId,
  config,
  onAnswer,
  submitting,
}: {
  token: string;
  stationId: string;
  config: SoftSkillGameClientConfig;
  onAnswer: (rawAnswer: { path: { itemId: string; choiceId: string }[] }) => void;
  submitting: boolean;
}) {
  const [currentItem, setCurrentItem] = useState<SoftSkillItemClient | null>(config.firstItem);
  const [path, setPath] = useState<{ itemId: string; choiceId: string }[]>([]);
  const [loadingNext, setLoadingNext] = useState(false);

  async function choose(choiceId: string) {
    if (!currentItem || loadingNext) return;
    const newPath = [...path, { itemId: currentItem.id, choiceId }];
    setPath(newPath);
    setLoadingNext(true);

    const res = await fetch(`/api/sessions/${token}/stations/${stationId}/softskill-next`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: newPath }),
    });
    const data = await res.json();
    setLoadingNext(false);
    setCurrentItem(data.done ? null : data.item);
  }

  const finished = !currentItem && path.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted">{config.intro}</p>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: config.rounds }).map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i < path.length ? "bg-mint-400" : "bg-brand-500/30"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loadingNext ? (
          <motion.p key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center text-sm text-muted">
            Next round&hellip;
          </motion.p>
        ) : currentItem ? (
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <span className="w-fit rounded-full bg-accent-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-700">
              {DIFFICULTY_LABEL[currentItem.difficulty]} &middot; {currentItem.skillTag}
            </span>
            <div className="rounded-lg bg-paper p-4 text-sm text-ink">{currentItem.prompt}</div>
            <div className="flex flex-col gap-2">
              {currentItem.choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => choose(choice.id)}
                  className="rounded-lg border-2 border-line px-4 py-2.5 text-left text-sm transition hover:border-brand-400/60 hover:bg-brand-500/10"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-mint-400/40 bg-mint-500/10 p-4 text-sm text-ink"
          >
            All rounds complete. Submit when you&rsquo;re ready.
          </motion.div>
        )}
      </AnimatePresence>

      {finished && (
        <Button disabled={submitting} onClick={() => onAnswer({ path })}>
          {submitting ? "Submitting..." : "Submit results"}
        </Button>
      )}
    </div>
  );
}
