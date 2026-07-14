import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl2 border border-line bg-panel p-6 shadow-card ${className}`}
      {...props}
    />
  );
}
