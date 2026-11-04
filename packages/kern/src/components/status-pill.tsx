import type { StatusTone } from "@xoroh/kern-tokens";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../utils/cn";

export type { StatusTone };

/**
 * KernStatus tone registry — web projection (D951 WP1b, CL-010).
 *
 * ONE tone system for Badge, Chip, Avatar and StatusPill. The source of
 * truth is `TONE_ROLES` in `@xoroh/kern-tokens` (`tones.ts`); this table is
 * its CSS-variable projection (`--sys-*` ONLY, no raw hex/rgba). The
 * parallel scales died here: tailwind amber/emerald utilities and per-app
 * HSL copies resolve to these registry roles instead — a status that was
 * `bg-amber-100` is now `tone="warning"`, an HSL disc is now an avatar
 * `tone`.
 *
 * Pairs are M3 container/on-container roles, so light/dark/contrast modes
 * follow the scheme with no conditionals.
 *
 * Every entry is a FULL literal class string (never `bg-(${role})`
 * interpolation): the consumer's Tailwind scan (`@source "./components"`)
 * only sees literals, and an interpolated tone class would silently ship
 * unstyled.
 */
const TONE_CLASSES: Record<
  StatusTone,
  { soft: string; solid: string; dot: string }
> = {
  primary: {
    soft: "bg-(--sys-color-primary-container) text-(--sys-color-on-primary-container)",
    solid: "bg-(--sys-color-primary) text-(--sys-color-on-primary)",
    dot: "bg-(--sys-color-primary)",
  },
  secondary: {
    soft: "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container)",
    solid: "bg-(--sys-color-secondary) text-(--sys-color-on-secondary)",
    dot: "bg-(--sys-color-secondary)",
  },
  success: {
    soft: "bg-(--sys-color-success-container) text-(--sys-color-on-success-container)",
    solid: "bg-(--sys-color-success) text-(--sys-color-on-success)",
    dot: "bg-(--sys-color-success)",
  },
  warning: {
    soft: "bg-(--sys-color-warning-container) text-(--sys-color-on-warning-container)",
    solid: "bg-(--sys-color-warning) text-(--sys-color-on-warning)",
    dot: "bg-(--sys-color-warning)",
  },
  error: {
    soft: "bg-(--sys-color-error-container) text-(--sys-color-on-error-container)",
    solid: "bg-(--sys-color-error) text-(--sys-color-on-error)",
    dot: "bg-(--sys-color-error)",
  },
  info: {
    soft: "bg-(--sys-color-info-container) text-(--sys-color-on-info-container)",
    solid: "bg-(--sys-color-info) text-(--sys-color-on-info)",
    dot: "bg-(--sys-color-info)",
  },
  neutral: {
    soft: "bg-(--sys-color-surface-container-high) text-(--sys-color-on-surface-variant)",
    solid:
      "bg-(--sys-color-surface-container-highest) text-(--sys-color-on-surface)",
    dot: "bg-(--sys-color-outline)",
  },
};

/** Container/fill class pair for a tone + emphasis. Shared by Badge/Chip/Avatar. */
export function statusToneClassNames(
  tone: StatusTone,
  emphasis: "soft" | "solid" = "soft",
): string {
  return TONE_CLASSES[tone][emphasis];
}

/** Dot/indicator class for a tone. */
export function statusToneDotClassName(tone: StatusTone): string {
  return TONE_CLASSES[tone].dot;
}

export type StatusPillProps = Omit<
  ComponentPropsWithRef<"span">,
  "children"
> & {
  /** Registry tone. Default `neutral` (the quiet container). */
  tone?: StatusTone;
  /** `soft` = container roles; `solid` = filled tone roles. */
  emphasis?: "soft" | "solid";
  /** Leading slot: a KernIcon-registry icon. Dot shows when no icon. */
  icon?: ReactNode;
  /** Force-hide the dot (an icon carries the meaning instead). */
  dot?: boolean;
  /** `compact` (24px) for table cells, `medium` (32px) default. */
  density?: "compact" | "medium";
  children: ReactNode;
};

/**
 * StatusPill — one-line status label on the tone registry: dot (or icon),
 * label, container roles. Replaces per-app RideStatus/Live/StatusBadge/
 * HoldBadge/ToneBadge/HSL copies (CL-010): every one of those is a tone +
 * a label, which is exactly this component.
 *
 * Usage: `<StatusPill tone="success">Active</StatusPill>`.
 * Props table: `tone` (7 registry tones) · `emphasis` soft|solid ·
 * `icon` (KernIcon registry node) · `dot` (default true without icon) ·
 * `density` compact|medium.
 */
export function StatusPill({
  tone = "neutral",
  emphasis = "soft",
  icon,
  dot,
  density = "medium",
  className,
  children,
  ...props
}: StatusPillProps) {
  const showDot = dot ?? icon === undefined;
  return (
    <span
      data-slot="status-pill"
      data-tone={tone}
      data-emphasis={emphasis}
      className={cn(
        "kern-status-pill inline-flex shrink-0 items-center gap-1.5 rounded-(--sys-shape-corner-full) font-medium tracking-[0.00625rem]",
        density === "compact" ? "h-6 px-2.5 text-xs" : "h-8 px-3.5 text-sm",
        statusToneClassNames(tone, emphasis),
        className,
      )}
      {...props}
    >
      {showDot ? (
        <span
          data-slot="status-pill-dot"
          aria-hidden="true"
          className={cn(
            "kern-status-pill-dot size-1.5 shrink-0 rounded-full",
            statusToneDotClassName(tone),
          )}
        />
      ) : null}
      {icon ? (
        <span
          data-slot="status-pill-icon"
          aria-hidden="true"
          className="kern-status-pill-icon inline-flex shrink-0 items-center [&_svg]:size-[18px]"
        >
          {icon}
        </span>
      ) : null}
      <span data-slot="status-pill-label" className="truncate">
        {children}
      </span>
    </span>
  );
}
