import type { StatusTone } from "@xoroh/kern-tokens";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { statusToneClassNames } from "./status-pill";

const badgeVariants = cva("kern-badge shrink-0", {
  variants: {
    variant: {
      dot: "size-1.5 rounded-full",
      count:
        "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[11px] font-medium",
    },
  },
  defaultVariants: { variant: "count" },
});

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    /**
     * Truncation ceiling for numeric counts. Past `max` the badge shows
     * `{max}+` (M3: "99+") while the accessible name keeps the full count.
     * Non-numeric children render untouched.
     */
    max?: number;
    /**
     * Registry tone (KernStatus, CL-010). Default `error` — the M3 badge
     * mapping; any of the 7 registry tones may replace it where 3:1
     * contrast against the anchor is proven.
     */
    tone?: StatusTone;
  };

export function Badge({
  variant,
  max = 99,
  tone = "error",
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: BadgeProps) {
  const isDot = variant === "dot";
  const raw =
    typeof children === "number"
      ? children
      : typeof children === "string" && /^\d+$/.test(children.trim())
        ? Number.parseInt(children.trim(), 10)
        : null;
  const truncated = !isDot && raw !== null && raw > max;
  return (
    <span
      data-slot="badge"
      data-tone={tone}
      role="img"
      aria-hidden={(isDot && !ariaLabel) || undefined}
      aria-label={truncated ? String(raw) : ariaLabel}
      className={cn(
        badgeVariants({ variant }),
        // Solid emphasis: a badge is a filled mark, not a container.
        statusToneClassNames(tone, "solid"),
        className,
      )}
      {...props}
    >
      {truncated ? `${max}+` : children}
    </span>
  );
}

export { badgeVariants };
