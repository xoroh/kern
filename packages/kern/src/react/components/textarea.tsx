import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export function Textarea({
  error = false,
  className,
  ...props
}: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      aria-invalid={error || undefined}
      className={cn(
        "kern-textarea min-h-[112px] w-full rounded-[8px] border border-black/10 bg-white px-4 py-3 text-base outline-none transition-colors placeholder:text-black/40 focus:border-black disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-[#dc2626] focus:border-[#dc2626]",
        className,
      )}
      {...props}
    />
  );
}
