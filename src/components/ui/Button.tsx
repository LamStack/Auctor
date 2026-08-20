import { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-paper hover:bg-brand-400 shadow-card",
  accent: "bg-accent-500 text-paper hover:bg-accent-400 shadow-card",
  outline: "border-2 border-brand-400 text-brand-300 hover:bg-brand-500/10",
  ghost: "text-ink hover:bg-white/5",
};

export function buttonClasses(variant: ButtonVariant = "primary", className = "") {
  return `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => {
    return <button ref={ref} className={buttonClasses(variant, className)} {...props} />;
  }
);
Button.displayName = "Button";
