import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
}

const variants = {
  primary: "bg-banbif-violet text-white hover:bg-banbif-violetDark",
  secondary: "border border-banbif-border bg-white text-banbif-text hover:bg-slate-50",
  ghost: "text-banbif-muted hover:bg-slate-100",
  danger: "bg-red-50 text-red-700 hover:bg-red-100",
};

export function Button({ children, variant = "primary", icon, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
