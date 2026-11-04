import type { ReactNode } from "react";
import { cn } from "../utils/cn";

/**
 * M3 bottom app bar — the compact-screen action bar (80dp tall,
 * `surface-container` fill). It hosts navigation and action icons plus an
 * optional FAB; it is NOT a navigation bar (fewer than 3 destinations, or
 * actions + FAB with no destinations at all).
 *
 * WP2a P0 NEW (both renderers): no Kern surface covered this M3 component —
 * the nav bar requires 3–5 destinations and the top bar sits at the top.
 *
 * M3: https://m3.material.io/components/bottom-app-bar
 */

export const BOTTOM_APP_BAR_HEIGHT = 80;

export type BottomAppBarProps = {
  /** Leading cluster: navigation + action icon buttons. */
  actions?: ReactNode;
  /** Trailing dock: a FAB (plain) or FAB menu. */
  fab?: ReactNode;
  /** Accessible name for the toolbar landmark. */
  label?: string;
  className?: string;
  testID?: string;
  children?: ReactNode;
};

/** M3 bottom app bar: actions leading, FAB trailing. */
export function BottomAppBar({
  actions,
  fab,
  label = "Actions",
  className,
  testID,
  children,
}: BottomAppBarProps) {
  return (
    <div
      role="toolbar"
      aria-label={label}
      data-slot="bottom-app-bar"
      data-testid={testID ?? "kern-bottom-app-bar"}
      style={{ height: BOTTOM_APP_BAR_HEIGHT }}
      className={cn(
        "kern-bottom-app-bar flex w-full items-center gap-2 bg-(--sys-color-surface-container) px-4 text-(--sys-color-on-surface-variant) shadow-(--sys-elevation-level2)",
        className,
      )}
    >
      {actions ? (
        <div
          data-slot="bottom-app-bar-actions"
          className="flex min-w-0 flex-1 items-center gap-1"
        >
          {actions}
        </div>
      ) : null}
      {children}
      {fab ? (
        <div
          data-slot="bottom-app-bar-fab"
          className="flex shrink-0 items-center"
        >
          {fab}
        </div>
      ) : null}
    </div>
  );
}
