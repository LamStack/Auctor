import { ClientStation } from "@/lib/clientStationTypes";

const ICONS: Record<string, string> = {
  mcq: "🧠",
  sequence: "🧩",
  "bug-hunt": "🐛",
  "code-patch": "🛠️",
  scenario: "💬",
  "timed-challenge": "⏱️",
};

export function StationProp({
  station,
  x,
  y,
  isCurrent,
  onWalkTo,
}: {
  station: ClientStation;
  x: number;
  y: number;
  isCurrent: boolean;
  onWalkTo: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onWalkTo();
      }}
      style={{ left: x, top: y }}
      className="absolute -translate-x-1/2 -translate-y-full cursor-pointer select-none flex flex-col items-center gap-1.5"
    >
      {isCurrent && (
        <span className="mb-0.5 whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-accent-700 shadow-card">
          Walk here to play
        </span>
      )}
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-2xl border-4 text-3xl shadow-soft transition-transform hover:scale-105 ${
          station.answered
            ? "border-mint-400 bg-mint-100"
            : isCurrent
              ? "animate-pulseGlow border-accent-400 bg-white"
              : "border-white/40 bg-white/30 grayscale"
        }`}
      >
        {station.answered ? "✅" : ICONS[station.type] ?? "❔"}
      </span>
      <span
        className={`max-w-[6.5rem] whitespace-normal rounded-full px-2 py-0.5 text-center text-[11px] font-bold leading-tight shadow-card ${
          station.answered || isCurrent ? "bg-white text-ink" : "bg-brand-900/60 text-white/80"
        }`}
      >
        {station.title}
      </span>
    </button>
  );
}
