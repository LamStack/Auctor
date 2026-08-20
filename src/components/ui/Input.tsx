import { InputHTMLAttributes, forwardRef, LabelHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 ${className}`}
      {...props}
    />
  )
);
Input.displayName = "Input";

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="mb-1.5 block text-sm font-semibold text-ink" {...props} />;
}
