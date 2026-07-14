import { ClientStation } from "@/lib/clientStationTypes";

const ICONS: Record<string, string> = {
  mcq: "🧠",
  sequence: "🧩",
  "bug-hunt": "🐛",
  "code-patch": "🛠️",
  scenario: "💬",
  "timed-challenge": "⏱️",
};

export function StationNode({
  station,
  isCurrent,
  isLocked,
  align,
  onClick,
}: {
  station: ClientStation;
  isCurrent: boolean;
  isLocked: boolean;
  align: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isCurrent}
      className={`flex items-center gap-3 rounded-xl2 border-2 px-4 py-3 text-left transition-all ${
        align === "right" ? "flex-row-reverse text-right" : ""
      } ${
        station.answered
          ? "border-mint-400 bg-mint-50/95"
          : isCurrent
            ? "animate-pulseGlow border-accent-400 bg-white shadow-soft"
            : "border-white/20 bg-white/10"
      } ${isLocked ? "opacity-50" : ""} ${isCurrent ? "cursor-pointer" : "cursor-default"}`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ${
          station.answered ? "bg-mint-200" : isCurrent ? "bg-accent-100" : "bg-white/20"
        }`}
      >
        {station.answered ? "✅" : ICONS[station.type] ?? "❔"}
      </span>
      <span className="min-w-0">
        <span className={`block text-sm font-bold ${isCurrent || station.answered ? "text-ink" : "text-white"}`}>
          {station.title}
        </span>
        <span className={`block text-xs ${isCurrent || station.answered ? "text-muted" : "text-white/60"}`}>
          {station.answered ? "Completed" : isCurrent ? "Tap to play" : "Locked"}
        </span>
      </span>
    </button>
  );
}
