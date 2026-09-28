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
        "kern-textarea min-h-[112px] w-full rounded-[8px] border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) px-4 py-3 text-base text-(--md-sys-color-on-surface) outline-none transition-colors placeholder:text-(--md-sys-color-on-surface-variant) focus:border-(--md-sys-color-primary) disabled:cursor-not-allowed disabled:opacity-50",
        error &&
          "border-(--md-sys-color-error) focus:border-(--md-sys-color-error)",
        className,
      )}
      {...props}
    />
  );
}
