import { HTMLAttributes } from "react";

type Tone = "brand" | "accent" | "mint" | "neutral";

const toneClasses: Record<Tone, string> = {
  brand: "bg-brand-100 text-brand-700",
  accent: "bg-accent-100 text-accent-700",
  mint: "bg-mint-100 text-mint-600",
  neutral: "bg-line text-muted",
};

export function Badge({
  tone = "neutral",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}
