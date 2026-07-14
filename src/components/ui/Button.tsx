import { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-card",
  accent: "bg-accent-500 text-white hover:bg-accent-600 shadow-card",
  outline: "border-2 border-brand-500 text-brand-600 hover:bg-brand-50",
  ghost: "text-ink hover:bg-brand-50",
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
