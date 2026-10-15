import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";

export type KbdProps = ComponentPropsWithRef<"kbd">;

/** Keyboard shortcut hint. Join chords with a space between Kbd parts. */
export function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "kern-kbd inline-flex h-6 min-w-6 items-center justify-center rounded-(--sys-shape-corner-extra-small) border border-(--sys-color-outline-variant) bg-(--sys-color-surface-tonal) px-1.5 font-mono text-[11px] font-medium text-(--sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}
