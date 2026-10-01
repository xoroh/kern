import {
  type FeedbackShapeKind,
  type FeedbackSize,
  feedbackTiming,
  isLoadingStyleRendered,
  type LoadingIndicatorStyle,
  resolveFeedbackVariant,
} from "@xoroh/kern-tokens";
import type { ComponentPropsWithRef, CSSProperties } from "react";
import { cn } from "../utils/cn";

export type CircularProgressProps = Omit<
  ComponentPropsWithRef<"span">,
  "children" | "style"
> & {
  /** 0–1. Omit for the indeterminate loading indicator. */
  value?: number;
  /**
   * Loading-indicator style for indeterminate waits. Determinate renders
   * the M3 circular arc regardless of style (known progress ⇒ determinate).
   * Reserved styles (`conveyor`, `contained`, `orbit`, `morph`, `assembly`)
   * are defined in the spec but not rendered yet — they throw.
   */
  loaderStyle?: LoadingIndicatorStyle;
  size?: FeedbackSize;
  /** Shapes for the `shapes` style. Defaults to the brand trio. */
  shapes?: readonly FeedbackShapeKind[];
  /** Tenant variant override; unknown ids fail loud. */
  tenantId?: string;
  label?: string;
};

const SHAPE_BOX = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-[30px] w-[30px]",
} as const;

const RING_BOX = {
  sm: "h-8 w-8",
  md: "h-[38px] w-[38px]",
  lg: "h-12 w-12",
} as const;

const ROW_GAP = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-3.5",
} as const;

const DOT_BOX = {
  sm: "h-2 w-2",
  md: "h-3 w-3",
  lg: "h-[15px] w-[15px]",
} as const;

const BAR_WIDTH = {
  sm: "w-0.5",
  md: "w-1",
  lg: "w-1.5",
} as const;

const BAR_BOX = {
  sm: "h-4",
  md: "h-6",
  lg: "h-[30px]",
} as const;

const BAR_HEIGHTS = ["60%", "100%", "80%", "50%"] as const;
const DOT_SLOTS = ["dot-lead", "dot-mid", "dot-trail"] as const;

function staggerDelayMs(index: number, count: number): string {
  return `${-(count - 1 - index) * feedbackTiming.staggerMs}ms`;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function ShapeGlyph({
  kind,
  className,
  style,
}: {
  kind: FeedbackShapeKind;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={style}
      aria-hidden="true"
      fill="currentColor"
    >
      {kind === "triangle" ? (
        <polygon points="12,3 22,21 2,21" />
      ) : kind === "circle" ? (
        <circle cx="12" cy="12" r="10" />
      ) : kind === "square" ? (
        <rect x="3" y="3" width="18" height="18" rx="2" />
      ) : kind === "pill" ? (
        <rect x="1" y="7" width="22" height="10" rx="5" />
      ) : kind === "diamond" ? (
        <polygon points="12,2 22,12 12,22 2,12" />
      ) : (
        <path d="M5 21v-9a7 7 0 0 1 14 0v9z" />
      )}
    </svg>
  );
}

const RING_RADIUS = 16;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function DeterminateRing({
  value,
  size,
  label,
}: {
  value: number;
  size: FeedbackSize;
  label: string;
}) {
  const ratio = clamp01(value);
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn(RING_BOX[size], "-rotate-90")}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(ratio * 100)}
    >
      <circle
        cx="20"
        cy="20"
        r={RING_RADIUS}
        strokeWidth="4"
        fill="none"
        className="stroke-current opacity-25"
      />
      <circle
        cx="20"
        cy="20"
        r={RING_RADIUS}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        className="stroke-current transition-[stroke-dasharray] duration-200"
        strokeDasharray={`${ratio * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
      />
    </svg>
  );
}

/**
 * CircularProgress — M3 circular progress: determinate arc and the
 * indeterminate loading indicator. The loading indicator ships four styles
 * (`spinner`, `dots`, `bar`, `shapes`); `spinner` is the M3 ring, `shapes`
 * is the branded heritage trio. Colors follow `currentColor`.
 */
export function CircularProgress({
  value,
  loaderStyle,
  size = "md",
  shapes,
  tenantId,
  label = "Loading",
  className,
  ...props
}: CircularProgressProps) {
  const variant = resolveFeedbackVariant(tenantId);
  const style =
    loaderStyle ?? (tenantId === undefined ? "spinner" : variant.style);
  const list = shapes ?? variant.shapes;
  if (!isLoadingStyleRendered(style)) {
    throw new Error(
      `CircularProgress: loading style "${style}" is reserved and not rendered yet`,
    );
  }

  if (value !== undefined) {
    return (
      <span
        data-slot="circular-progress"
        data-testid="circular-progress"
        className={cn("kern-circular-progress inline-flex", className)}
        {...props}
      >
        <DeterminateRing value={value} size={size} label={label} />
      </span>
    );
  }

  if (style === "dots") {
    return (
      <span
        data-slot="circular-progress"
        data-testid="circular-progress"
        role="status"
        aria-label={label}
        className={cn(
          "kern-circular-progress inline-flex items-center",
          ROW_GAP[size],
          className,
        )}
        {...props}
      >
        {DOT_SLOTS.map((id, index) => (
          <span
            key={id}
            className={cn(
              "kern-circular-progress-dot animate-kern-loader-dot rounded-full bg-current motion-reduce:animate-none",
              DOT_BOX[size],
            )}
            style={{ animationDelay: staggerDelayMs(index, DOT_SLOTS.length) }}
          />
        ))}
      </span>
    );
  }

  if (style === "bar") {
    return (
      <span
        data-slot="circular-progress"
        data-testid="circular-progress"
        role="status"
        aria-label={label}
        className={cn(
          "kern-circular-progress inline-flex items-end gap-0.5 text-current",
          BAR_BOX[size],
          className,
        )}
        {...props}
      >
        {BAR_HEIGHTS.map((height, index) => (
          <span
            key={height}
            className={cn(
              "kern-circular-progress-bar animate-kern-loader-bar rounded-full bg-current motion-reduce:animate-none",
              BAR_WIDTH[size],
            )}
            style={{ height, animationDelay: staggerDelayMs(index, 4) }}
          />
        ))}
      </span>
    );
  }

  if (style === "shapes") {
    return (
      <span
        data-slot="circular-progress"
        data-testid="circular-progress"
        role="status"
        aria-label={label}
        className={cn(
          "kern-circular-progress inline-flex items-center text-current",
          ROW_GAP[size],
          className,
        )}
        {...props}
      >
        {list.map((kind, index) => (
          <ShapeGlyph
            key={kind}
            kind={kind}
            className={cn(
              "kern-circular-progress-shape animate-kern-loader-shape motion-reduce:animate-none",
              SHAPE_BOX[size],
            )}
            style={{
              animationDelay: staggerDelayMs(index, list.length),
            }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      data-slot="circular-progress"
      data-testid="circular-progress"
      className={cn("kern-circular-progress inline-flex", className)}
      {...props}
    >
      <svg
        viewBox="0 0 40 40"
        className={cn(
          RING_BOX[size],
          "animate-spin motion-reduce:animate-none",
        )}
        role="status"
        aria-label={label}
      >
        <circle
          cx="20"
          cy="20"
          r={RING_RADIUS}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          className="stroke-current"
          strokeDasharray={`${0.25 * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
        />
      </svg>
    </span>
  );
}
