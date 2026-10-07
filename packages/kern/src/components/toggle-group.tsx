import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type ToggleGroupRootProps<Value extends string = string> =
  ComponentProps<typeof ToggleGroupPrimitive<Value>>;
export type ToggleGroupItemProps<Value extends string = string> =
  ComponentProps<typeof TogglePrimitive<Value>>;

export function ToggleGroupRoot<Value extends string = string>({
  className,
  ...props
}: ToggleGroupRootProps<Value>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      className={cnState(
        "kern-toggle-group flex items-center gap-1 rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-surface-tonal) p-1",
        className,
      )}
      {...props}
    />
  );
}

export function ToggleGroupItem<Value extends string = string>({
  className,
  ...props
}: ToggleGroupItemProps<Value>) {
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cnState(
        "kern-toggle-group-item flex h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 rounded-(--md-sys-shape-corner-full) px-3 text-sm font-medium text-(--md-sys-color-on-surface) outline-none select-none " + FOCUS_RING_CLASS + " disabled:pointer-events-none disabled:opacity-50 data-pressed:bg-(--md-sys-color-primary) data-pressed:text-(--md-sys-color-on-primary)",
        className,
      )}
      {...props}
    />
  );
}

/** Exclusive or multi-select segmented control built from Toggle buttons. */
export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
};
