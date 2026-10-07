import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type ToggleProps<Value extends string = string> = ComponentProps<
  typeof TogglePrimitive<Value>
>;

/** Two-state button. Inside a ToggleGroup, pass `value` to join the group. */
export function Toggle<Value extends string = string>({
  className,
  ...props
}: ToggleProps<Value>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cnState(
        "kern-toggle flex h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 rounded-(--md-sys-shape-corner-full) px-3 text-sm font-medium text-(--md-sys-color-on-surface) outline-none select-none " + FOCUS_RING_CLASS + " disabled:pointer-events-none disabled:opacity-50 data-pressed:bg-(--md-sys-color-primary) data-pressed:text-(--md-sys-color-on-primary)",
        className,
      )}
      {...props}
    />
  );
}
