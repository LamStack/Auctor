export function ProgressBar({ value, tone = "brand" }: { value: number; tone?: "brand" | "accent" | "mint" }) {
  const bg = tone === "brand" ? "bg-brand-500" : tone === "accent" ? "bg-accent-500" : "bg-mint-500";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-line">
      <div
        className={`h-full rounded-full transition-all duration-500 ${bg}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
