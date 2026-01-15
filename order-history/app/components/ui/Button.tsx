"use client";

import * as React from "react";

type ButtonVariant = "default" | "outline" | "destructive";
type ButtonSize = "default" | "sm";

export function Button({
  className = "",
  variant = "default",
  size = "default",
  disabled,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition " +
    "focus:outline-none focus:ring-2 focus:ring-slate-400/40 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<ButtonVariant, string> = {
    default: "bg-indigo-600 text-white hover:bg-indigo-500",
    outline: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
    destructive: "bg-rose-600 text-white hover:bg-rose-500",
  };

  const sizes: Record<ButtonSize, string> = {
    default: "px-3 py-2 text-sm",
    sm: "px-2 py-1 text-xs",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={[base, variants[variant], sizes[size], className].join(" ")}
      {...props}
    />
  );
}
