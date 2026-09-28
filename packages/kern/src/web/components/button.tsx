import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "kern-button",
        variant === "primary" ? "kern-button--primary" : "kern-button--ghost",
        className,
      )}
      {...props}
    />
  );
}
