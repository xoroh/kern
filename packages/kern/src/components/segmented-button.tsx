import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type SegmentedButtonRootProps<Value extends string = string> =
  ComponentProps<typeof ToggleGroupPrimitive<Value>>;
export type SegmentedButtonItemProps<Value extends string = string> =
  ComponentProps<typeof TogglePrimitive<Value>>;

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
 * One segment. The group owns exclusivity (`multiple={false}`); an item
 * toggles its own pressed state and reports it through `onPressedChange`.
 */
export function SegmentedButtonItem<Value extends string = string>({
  className,
  ...props
}: SegmentedButtonItemProps<Value>) {
  return (
    <TogglePrimitive
      data-slot="segmented-button-item"
      className={cnState(
        "kern-segmented-button-item flex h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 rounded-(--md-sys-shape-corner-full) px-4 text-sm font-medium text-(--md-sys-color-on-surface) outline-none select-none " + FOCUS_RING_CLASS + " disabled:pointer-events-none disabled:opacity-50 data-pressed:bg-(--md-sys-color-secondary-container) data-pressed:text-(--md-sys-color-on-secondary-container)",
        className,
      )}
      {...props}
    />
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
