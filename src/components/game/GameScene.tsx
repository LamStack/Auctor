"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useTransform } from "framer-motion";
import { ClientStation } from "@/lib/clientStationTypes";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StationProp } from "@/components/game/StationProp";
import { CharacterAvatar } from "@/components/game/CharacterAvatar";
import { StationOverlay } from "@/components/game/StationOverlay";
import { useCharacterController, WorldStation } from "@/components/game/useCharacterController";
import { SPAWN_POINT, WORLD_HEIGHT, WORLD_WIDTH, clamp, stationWorldPosition } from "@/lib/gameWorld";

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
  const viewportRef = useRef<HTMLDivElement>(null);

  const currentIndex = useMemo(() => stations.findIndex((s) => !s.answered), [stations]);
  const answeredCount = stations.filter((s) => s.answered).length;
  const activeStation = stations.find((s) => s.id === activeStationId) ?? null;

  const worldStations: WorldStation[] = useMemo(
    () =>
      stations.map((s, i) => {
        const pos = stationWorldPosition(i);
        return { id: s.id, x: pos.x, y: pos.y, interactive: i === currentIndex };
      }),
    [stations, currentIndex]
  );

  const handleArrive = useCallback((stationId: string) => {
    setActiveStationId(stationId);
  }, []);

  const { x, y, walking, facingLeft, moveTo } = useCharacterController({
    spawn: SPAWN_POINT,
    stations: worldStations,
    paused: Boolean(activeStationId) || completing,
    onArrive: handleArrive,
  });

  const cameraX = useTransform(x, (val) => {
    const vw = viewportRef.current?.clientWidth ?? 0;
    return clamp(vw / 2 - val, Math.min(0, vw - WORLD_WIDTH), 0);
  });
  const cameraY = useTransform(y, (val) => {
    const vh = viewportRef.current?.clientHeight ?? 0;
    return clamp(vh / 2 - val, Math.min(0, vh - WORLD_HEIGHT), 0);
  });

  function handleViewportClick(e: React.MouseEvent<HTMLDivElement>) {
    if (activeStationId || completing || !viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const worldX = e.clientX - rect.left - cameraX.get();
    const worldY = e.clientY - rect.top - cameraY.get();
    moveTo({ x: clamp(worldX, 0, WORLD_WIDTH), y: clamp(worldY, 0, WORLD_HEIGHT) });
  }

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
    <main className="relative min-h-screen overflow-hidden bg-game-sky pb-8">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-brand-900/40 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
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
        <div className="mx-auto max-w-5xl px-6 pb-3">
          <ProgressBar value={(answeredCount / stations.length) * 100} tone="accent" />
        </div>
      </header>

      <div className="mx-auto mt-6 max-w-5xl px-4">
        <div
          ref={viewportRef}
          onClick={handleViewportClick}
          className="relative h-[65vh] w-full cursor-crosshair overflow-hidden rounded-xl2 border-2 border-white/15 shadow-soft sm:h-[70vh]"
        >
          <motion.div
            style={{ x: cameraX, y: cameraY, width: WORLD_WIDTH, height: WORLD_HEIGHT }}
            className="absolute left-0 top-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.12),transparent_55%)]"
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.28) 1.5px, transparent 1.5px)",
                backgroundSize: "34px 34px",
              }}
            />
            <div className="pointer-events-none absolute left-[8%] top-[60%] h-40 w-40 rounded-full bg-mint-400/20 blur-3xl" />
            <div className="pointer-events-none absolute left-[55%] top-[10%] h-56 w-56 rounded-full bg-accent-400/20 blur-3xl" />
            <div className="pointer-events-none absolute left-[75%] top-[55%] h-48 w-48 rounded-full bg-brand-400/20 blur-3xl" />

            {stations.map((s, i) => {
              const pos = stationWorldPosition(i);
              return (
                <StationProp
                  key={s.id}
                  station={s}
                  x={pos.x}
                  y={pos.y}
                  isCurrent={i === currentIndex}
                  onWalkTo={() => !activeStationId && moveTo(pos)}
                />
              );
            })}

            <CharacterAvatar x={x} y={y} walking={walking} facingLeft={facingLeft} />
          </motion.div>
        </div>
        <p className="mt-3 text-center text-xs text-white/60">
          Use arrow keys / WASD, or tap the ground to walk. Reach a glowing station to play it.
        </p>
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
