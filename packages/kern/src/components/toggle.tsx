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
        "kern-toggle relative flex h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 rounded-(--md-sys-shape-corner-full) px-3 text-sm leading-5 font-medium tracking-[0.1px] text-(--md-sys-color-on-surface) transition-[color,background-color,border-color] duration-200 ease-(--md-sys-motion-easing-standard) outline-none select-none " +
          FOCUS_RING_CLASS +
          " disabled:pointer-events-none disabled:opacity-38 aria-disabled:pointer-events-none aria-disabled:opacity-38 before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 before:bg-(--md-sys-color-on-surface) hover:before:opacity-[var(--md-sys-state-hover)] focus-visible:before:opacity-[var(--md-sys-state-focus)] active:before:opacity-[var(--md-sys-state-press)] disabled:before:opacity-0 data-pressed:bg-(--md-sys-color-secondary-container) data-pressed:text-(--md-sys-color-on-secondary-container) data-pressed:before:bg-(--md-sys-color-on-secondary-container)",
        className,
      )}
      {...props}
    />
  );
}
