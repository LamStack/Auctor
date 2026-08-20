"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ClientStation } from "@/lib/clientStationTypes";
import { McqStation } from "@/components/game/stations/McqStation";
import { SequenceStation } from "@/components/game/stations/SequenceStation";
import { BugHuntStation } from "@/components/game/stations/BugHuntStation";
import { CodePatchStation } from "@/components/game/stations/CodePatchStation";
import { ScenarioStation } from "@/components/game/stations/ScenarioStation";
import { TimedChallengeStation } from "@/components/game/stations/TimedChallengeStation";
import { BranchingScenarioStation } from "@/components/game/stations/BranchingScenarioStation";
import { SoftSkillGameStation } from "@/components/game/stations/SoftSkillGameStation";
import { SqlSandboxStation } from "@/components/game/stations/SqlSandboxStation";
import { CodeIdeStation } from "@/components/game/stations/CodeIdeStation";

export interface StationAnswerProps {
  onAnswer: (rawAnswer: unknown, reasoningText?: string) => void;
  submitting: boolean;
}

const WIDE_STATION_TYPES = new Set(["code-ide", "sql-sandbox"]);

export function StationOverlay({
  token,
  station,
  submitting,
  onSubmit,
  onClose,
}: {
  token: string;
  station: ClientStation;
  submitting: boolean;
  onSubmit: (rawAnswer: unknown, timeMs: number, reasoningText?: string) => void;
  onClose: () => void;
}) {
  const startedAt = useRef(Date.now());
  const isWide = WIDE_STATION_TYPES.has(station.type);

  function handleAnswer(rawAnswer: unknown, reasoningText?: string) {
    onSubmit(rawAnswer, Date.now() - startedAt.current, reasoningText);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 flex items-center justify-center bg-brand-900/70 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className={`overflow-y-auto rounded-xl2 border border-line bg-panel p-6 shadow-soft ${
          isWide ? "h-[92vh] w-full max-w-6xl" : "max-h-[90vh] w-full max-w-lg"
        }`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-lg font-bold text-ink">{station.title}</h2>
          <button
            onClick={onClose}
            className="rounded-full px-2 py-1 text-sm font-bold text-muted hover:bg-white/10"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {station.type === "mcq" && (
          <McqStation config={station.config} onAnswer={handleAnswer} submitting={submitting} />
        )}
        {station.type === "sequence" && (
          <SequenceStation config={station.config} onAnswer={handleAnswer} submitting={submitting} />
        )}
        {station.type === "bug-hunt" && (
          <BugHuntStation config={station.config} onAnswer={handleAnswer} submitting={submitting} />
        )}
        {station.type === "code-patch" && (
          <CodePatchStation config={station.config} onAnswer={handleAnswer} submitting={submitting} />
        )}
        {station.type === "scenario" && (
          <ScenarioStation config={station.config} onAnswer={handleAnswer} submitting={submitting} />
        )}
        {station.type === "timed-challenge" && (
          <TimedChallengeStation config={station.config} onAnswer={handleAnswer} submitting={submitting} />
        )}
        {station.type === "branching-scenario" && (
          <BranchingScenarioStation config={station.config} onAnswer={handleAnswer} submitting={submitting} />
        )}
        {station.type === "softskill-game" && (
          <SoftSkillGameStation
            token={token}
            stationId={station.id}
            config={station.config}
            onAnswer={handleAnswer}
            submitting={submitting}
          />
        )}
        {station.type === "sql-sandbox" && (
          <SqlSandboxStation config={station.config} onAnswer={handleAnswer} submitting={submitting} />
        )}
        {station.type === "code-ide" && (
          <CodeIdeStation
            token={token}
            stationId={station.id}
            config={station.config}
            onAnswer={handleAnswer}
            submitting={submitting}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
