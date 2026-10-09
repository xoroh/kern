import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type { ComponentProps } from "react";
import { Children } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type SegmentedButtonRootProps<Value extends string = string> =
  ComponentProps<typeof ToggleGroupPrimitive<Value>>;
export type SegmentedButtonItemProps<Value extends string = string> =
  ComponentProps<typeof TogglePrimitive<Value>> & {
    /**
     * Show the M3 selection check on pressed segments. `undefined` (default)
     * resolves from content: label-bearing segments show it, icon-only
     * segments do not. Pass `false` to force it off, `true` to force it on.
     */
    check?: boolean;
    /** M3 density size. `sm` (40dp) is the current rendering, kept default. */
    size?: "xs" | "sm" | "md" | "lg" | "xl";
  };

export function SegmentedButtonRoot<Value extends string = string>({
  className,
  ...props
}: SegmentedButtonRootProps<Value>) {
  return (
    <ToggleGroupPrimitive
      data-slot="segmented-button"
      className={cnState(
        "kern-segmented-button inline-flex items-center gap-0 rounded-(--md-sys-shape-corner-full) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) p-1",
        className,
      )}
      {...props}
    />
  );
}

/**
 * M3 selected-segment check. Shown on pressed segments that carry a label;
 * icon-only segments set `check={false}` (or render no text) — a check with
 * no label is a second icon, not a selection mark.
 */
function SegmentCheck() {
  return (
    <svg
      data-slot="segmented-check"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="hidden size-[18px] shrink-0 group-data-pressed:block"
    >
      <path d="m4.5 12.75 5 5 10-11" />
    </svg>
  );
}

const SEGMENT_SIZES = {
  xs: "h-8 min-w-8 px-3 text-xs",
  sm: "h-10 min-w-10 px-4 text-sm",
  md: "h-12 min-w-12 px-5 text-sm",
  lg: "h-14 min-w-14 px-6 text-base",
  xl: "h-16 min-w-16 px-7 text-base",
} as const;

/**
 * One segment. The group owns exclusivity (`multiple={false}`); an item
 * toggles its own pressed state and reports it through `onPressedChange`.
 */
export function SegmentedButtonItem<Value extends string = string>({
  className,
  children,
  check,
  size = "sm",
  ...props
}: SegmentedButtonItemProps<Value>) {
  const childArray = Children.toArray(children);
  const hasLabel = childArray.some(
    (child) => typeof child === "string" || typeof child === "number",
  );
  const showCheck = check ?? hasLabel;
  return (
    <TogglePrimitive
      data-slot="segmented-button-item"
      className={cnState(
        `kern-segmented-button-item group flex cursor-pointer items-center justify-center gap-1.5 rounded-(--md-sys-shape-corner-full) font-medium text-(--md-sys-color-on-surface) outline-none select-none ${FOCUS_RING_CLASS} disabled:pointer-events-none disabled:opacity-50 data-pressed:bg-(--md-sys-color-secondary-container) data-pressed:text-(--md-sys-color-on-secondary-container) ${SEGMENT_SIZES[size]}`,
        className,
      )}
      {...props}
    >
      {showCheck ? <SegmentCheck /> : null}
      {children}
    </TogglePrimitive>
  );
}

/**
 * Exclusive segmented control: one segment pressed at a time, M3 segmented
 * button geometry (outlined pill, pressed segment filled with the secondary
 * container role).
 */
export const SegmentedButton = {
  Root: SegmentedButtonRoot,
  Item: SegmentedButtonItem,
};
