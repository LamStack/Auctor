"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ClientStation } from "@/lib/clientStationTypes";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StationNode } from "@/components/game/StationNode";
import { CharacterAvatar } from "@/components/game/CharacterAvatar";
import { StationOverlay } from "@/components/game/StationOverlay";

export function GameScene({
  token,
  companyName,
  trackTitle,
  roleLabel,
  initialStations,
  onAllComplete,
}: {
  token: string;
  companyName: string;
  trackTitle: string;
  roleLabel: string;
  initialStations: ClientStation[];
  onAllComplete: () => void;
}) {
  const [stations, setStations] = useState(initialStations);
  const [activeStationId, setActiveStationId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);

  const currentIndex = useMemo(() => stations.findIndex((s) => !s.answered), [stations]);
  const answeredCount = stations.filter((s) => s.answered).length;
  const activeStation = stations.find((s) => s.id === activeStationId) ?? null;

  async function handleAnswer(rawAnswer: unknown, timeMs: number, reasoningText?: string) {
    if (!activeStation) return;
    setSubmitting(true);
    const res = await fetch(`/api/sessions/${token}/stations/${activeStation.id}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawAnswer, timeMs, reasoningText }),
    });
    setSubmitting(false);
    if (!res.ok) return;

    const updated = stations.map((s) => (s.id === activeStation.id ? { ...s, answered: true } : s));
    setStations(updated);
    setActiveStationId(null);

    if (updated.every((s) => s.answered)) {
      setCompleting(true);
      await fetch(`/api/sessions/${token}/complete`, { method: "POST" });
      onAllComplete();
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-game-sky pb-24">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-72 h-96 w-96 rounded-full bg-mint-400/20 blur-3xl" />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-brand-900/40 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-6 py-4">
          <Image src="/Auctorlogo-transparent.png" alt="AUCTOR" width={32} height={32} className="rounded-md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {companyName} &middot; {roleLabel}
            </p>
            <p className="truncate text-xs text-white/60">{trackTitle}</p>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
            {answeredCount}/{stations.length}
          </span>
        </div>
        <div className="mx-auto max-w-2xl px-6 pb-3">
          <ProgressBar value={(answeredCount / stations.length) * 100} tone="accent" />
        </div>
      </header>

      <div className="relative mx-auto mt-12 max-w-2xl px-6">
        <div className="pointer-events-none absolute left-1/2 top-0 h-full w-0 -translate-x-1/2 border-l-4 border-dashed border-white/25" />

        <div className="flex flex-col gap-14">
          {stations.map((station, index) => {
            const isLeft = index % 2 === 0;
            const isCurrent = index === currentIndex;
            const isLocked = index > currentIndex && currentIndex !== -1;

            return (
              <div key={station.id} className={`relative flex ${isLeft ? "justify-start" : "justify-end"}`}>
                <div className={`w-[calc(50%+2.5rem)] ${isLeft ? "pr-6" : "pl-6"}`}>
                  <StationNode
                    station={station}
                    isCurrent={isCurrent}
                    isLocked={isLocked}
                    align={isLeft ? "left" : "right"}
                    onClick={() => isCurrent && setActiveStationId(station.id)}
                  />
                </div>
                {isCurrent && (
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? "left-1/2 ml-2" : "right-1/2 mr-2"}`}>
                    <CharacterAvatar />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeStation && (
          <StationOverlay
            key={activeStation.id}
            station={activeStation}
            submitting={submitting}
            onSubmit={handleAnswer}
            onClose={() => setActiveStationId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {completing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-brand-900/70 backdrop-blur"
          >
            <p className="font-display animate-float text-lg font-bold text-white">
              Scoring your run&hellip;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
