import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";

/**
 * The centralized focus-visible ring.
 *
 * `FOCUS_RING_CLASS` is the single source of the ring utilities — every
 * component builds its focus style from this constant instead of repeating
 * the `ring-2` / `ring-secondary` pair, so the treatment cannot drift one
 * component at a time. Geometry (2px, the `secondary` role, no offset) is
 * recorded in `@xoroh/kern-tokens` (`FOCUS_RING_WIDTH_PX`,
 * `FOCUS_RING_COLOR_ROLE`, `FOCUS_RING_OFFSET_PX`); this module is the web
 * binding of that spec.
 *
 * The class names appear literally in this file, so the Tailwind scanner
 * generates them from here — interpolating the constant elsewhere does not
 * hide them from the build.
 *
 * `FocusRing` is the wrapper for one-off host content that needs the ring
 * without becoming a Kern component. Kern components bake the constant
 * into their own classes instead of wrapping themselves.
 */
export const FOCUS_RING_CLASS =
  "focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary)";

export type FocusRingProps = ComponentPropsWithRef<"span">;

export function FocusRing({ className, children, ...props }: FocusRingProps) {
  return (
    // The host gives this focus (e.g. `tabIndex`) — the span only owns the
    // treatment, never the tab stop, so it cannot steal keyboard order.
    <span
      data-slot="focus-ring"
      className={cn("outline-none", FOCUS_RING_CLASS, className)}
      {...props}
    >
      {children}
    </span>
  );
}
