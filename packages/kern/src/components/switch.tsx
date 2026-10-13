import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root>;

/**
 * M3 switch thumb icons (material-web `md-comp-switch` defaults): the
 * selected thumb carries a check in on-primary-container, the unselected
 * thumb a close glyph in surface-container-highest. Both are 16px on the
 * 24px selected / 16px unselected handle.
 */
function SwitchCheckedIcon() {
  return (
    <svg
      data-slot="switch-checked-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="hidden size-4 text-(--md-sys-color-on-primary-container) group-data-checked:block"
    >
      <path d="m4.5 12.75 5 5 10-11" />
    </svg>
  );
}

function SwitchUncheckedIcon() {
  return (
    <svg
      data-slot="switch-unchecked-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
      className="block size-4 text-(--md-sys-color-surface-container-highest) group-data-checked:hidden"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cnState(
        `kern-switch group relative flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-(--md-sys-shape-corner-full) border-2 border-(--md-sys-color-outline) bg-(--md-sys-color-surface-container-highest) px-1 outline-none transition-colors duration-200 ease-(--md-sys-motion-easing-standard) ${FOCUS_RING_CLASS} data-disabled:cursor-not-allowed data-checked:justify-end data-checked:border-(--md-sys-color-primary) data-checked:bg-(--md-sys-color-primary) data-disabled:data-checked:bg-(--md-sys-color-on-surface)/12 data-disabled:data-checked:border-transparent data-disabled:border-(--md-sys-color-on-surface) data-disabled:bg-(--md-sys-color-surface-container-highest) after:absolute after:-inset-2 after:content-[''] before:absolute before:-inset-2 before:rounded-full before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 before:bg-(--md-sys-color-on-surface) hover:before:opacity-[var(--md-sys-state-hover)] focus-visible:before:opacity-[var(--md-sys-state-focus)] active:before:opacity-[var(--md-sys-state-press)] data-checked:before:bg-(--md-sys-color-primary) data-disabled:before:opacity-0`,
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="kern-switch-thumb flex size-4 items-center justify-center rounded-full bg-(--md-sys-color-outline) transition-all duration-200 ease-(--md-sys-motion-easing-standard) data-checked:size-6 data-checked:bg-(--md-sys-color-on-primary) active:size-7 data-checked:active:size-7 data-disabled:bg-(--md-sys-color-on-surface)/38 data-checked:data-disabled:bg-(--md-sys-color-surface)"
      >
        <SwitchUncheckedIcon />
        <SwitchCheckedIcon />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}
