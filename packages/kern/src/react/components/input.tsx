import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export function Input({ error = false, className, ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      aria-invalid={error || undefined}
      className={cn(
        "kern-input h-14 w-full rounded-[8px] border border-black/10 bg-white px-4 text-base outline-none transition-colors placeholder:text-black/40 focus:border-black disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-[#dc2626] focus:border-[#dc2626]",
        className,
      )}
      {...props}
    />
  );
}
