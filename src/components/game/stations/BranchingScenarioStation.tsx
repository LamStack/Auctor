"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BranchingScenarioClientConfig } from "@/lib/clientStationTypes";
import { Button } from "@/components/ui/Button";

export function BranchingScenarioStation({
  config,
  onAnswer,
  submitting,
}: {
  config: BranchingScenarioClientConfig;
  onAnswer: (rawAnswer: { path: { nodeId: string; choiceId: string }[] }) => void;
  submitting: boolean;
}) {
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(config.start);
  const [path, setPath] = useState<{ nodeId: string; choiceId: string }[]>([]);

  const currentNode = currentNodeId ? config.nodes[currentNodeId] : null;
  const finished = !currentNode;

  function choose(choiceId: string, next: string | null) {
    if (!currentNodeId) return;
    setPath((p) => [...p, { nodeId: currentNodeId, choiceId }]);
    setCurrentNodeId(next);
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted">{config.intro}</p>

      <div className="flex items-center gap-1.5">
        {path.map((_, i) => (
          <span key={i} className="h-1.5 flex-1 rounded-full bg-mint-400" />
        ))}
        {!finished && <span className="h-1.5 flex-1 rounded-full bg-brand-500/30" />}
      </div>

      <AnimatePresence mode="wait">
        {currentNode ? (
          <motion.div
            key={currentNodeId}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-lg bg-paper p-4 text-sm text-ink">{currentNode.situation}</div>
            <div className="flex flex-col gap-2">
              {currentNode.choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => choose(choice.id, choice.next)}
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
            You&rsquo;ve reached the end of this scenario. Submit when you&rsquo;re ready.
          </motion.div>
        )}
      </AnimatePresence>

      {finished && (
        <Button disabled={submitting} onClick={() => onAnswer({ path })}>
          {submitting ? "Submitting..." : "Submit scenario"}
        </Button>
      )}
    </div>
  );
}
