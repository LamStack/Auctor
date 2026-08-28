"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { AdaptiveCodingClientConfig, AdaptiveCodingProblemClient } from "@/lib/clientStationTypes";
import { Button } from "@/components/ui/Button";

const DIFFICULTY_LABEL: Record<string, string> = { easy: "Warm-up", medium: "Standard", hard: "Pressure round" };

interface RunResult {
  id: string;
  stdin: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error: string | null;
}

export function AdaptiveCodingStation({
  token,
  stationId,
  config,
  onAnswer,
  submitting,
}: {
  token: string;
  stationId: string;
  config: AdaptiveCodingClientConfig;
  onAnswer: (rawAnswer: { path: { problemId: string; code: string }[] }) => void;
  submitting: boolean;
}) {
  const [currentProblem, setCurrentProblem] = useState<AdaptiveCodingProblemClient | null>(config.firstProblem);
  const [code, setCode] = useState(config.firstProblem?.starterCode ?? "");
  const [path, setPath] = useState<{ problemId: string; code: string }[]>([]);
  const [loadingNext, setLoadingNext] = useState(false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<RunResult[] | null>(null);

  async function handleTest() {
    if (!currentProblem) return;
    setRunning(true);
    setResults(null);
    const res = await fetch(`/api/sessions/${token}/stations/${stationId}/adaptive-coding-run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId: currentProblem.id, code }),
    });
    setRunning(false);
    if (res.ok) setResults((await res.json()).results);
  }

  async function submitRound() {
    if (!currentProblem || loadingNext) return;
    const newPath = [...path, { problemId: currentProblem.id, code }];
    setPath(newPath);
    setLoadingNext(true);
    setResults(null);

    const res = await fetch(`/api/sessions/${token}/stations/${stationId}/adaptive-coding-next`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: newPath }),
    });
    const data = await res.json();
    setLoadingNext(false);
    setCurrentProblem(data.done ? null : data.problem);
    setCode(data.done ? "" : (data.problem?.starterCode ?? ""));
  }

  const finished = !currentProblem && path.length > 0;

  return (
    <div className="flex h-full flex-col gap-3">
      <p className="text-sm text-muted">{config.intro}</p>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: config.rounds }).map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i < path.length ? "bg-mint-400" : "bg-brand-500/30"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loadingNext ? (
          <motion.p key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center text-sm text-muted">
            Scoring and picking your next round&hellip;
          </motion.p>
        ) : currentProblem ? (
          <motion.div
            key={currentProblem.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="flex min-h-0 flex-1 flex-col gap-3"
          >
            <div>
              <span className="w-fit rounded-full bg-accent-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-700">
                {DIFFICULTY_LABEL[currentProblem.difficulty]} &middot; {config.language.label}
              </span>
              <div className="mt-2 rounded-lg bg-paper p-3 text-sm text-ink">{currentProblem.prompt}</div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-line">
              <Editor
                height="220px"
                language={config.language.monacoLanguage}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value ?? "")}
                options={{ minimap: { enabled: false }, fontSize: 13 }}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleTest} disabled={running}>
                {running ? "Running..." : "Test"}
              </Button>
              <span className="text-xs text-muted">
                {currentProblem.visibleTests.length} visible test{currentProblem.visibleTests.length === 1 ? "" : "s"}
                {currentProblem.hiddenTestCount > 0 && ` + ${currentProblem.hiddenTestCount} hidden`}
              </span>
            </div>

            {results && (
              <div className="max-h-32 overflow-y-auto rounded-lg border border-line bg-paper p-3 font-mono text-xs">
                {results.map((r, i) => (
                  <p key={r.id} className={r.passed ? "text-mint-300" : "text-danger"}>
                    Test {i + 1}: {r.passed ? "PASSED" : "FAILED"}
                  </p>
                ))}
              </div>
            )}

            <Button disabled={loadingNext} onClick={submitRound}>
              Lock in &amp; continue
            </Button>
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
