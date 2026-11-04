import { type ReactNode, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { FOCUS_RING_CLASS } from "./focus-ring";
import type { NavigationDestination } from "./navigation-bar";

/**
 * M3 navigation rail — the medium-screen destination switcher (3–7
 * destinations, start edge, 80dp wide). The data-driven web twin of native
 * `NavigationRail` (WP2a P0): one `NavigationDestination[]` feeds the bar,
 * the rail, and the drawer, on the SAME contract both renderers share.
 *
 * `collapsed` shows icons only; `expanded` also paints each label (240dp —
 * what a sidebar is, per the Expressive mapping native already records).
 * The label stays in the accessible name in both modes: collapsing is a
 * visual decision, never a semantic one.
 *
 * M3: https://m3.material.io/components/navigation-rail
 */

export const KERN_NAVIGATION_RAIL_WIDTH = 80;
export const KERN_NAVIGATION_RAIL_EXPANDED_WIDTH = 240;

export type KernNavigationRailMode = "collapsed" | "expanded";

export type NavigationRailProps = {
  destinations: readonly NavigationDestination[];
  /** Controlled active destination key. */
  value?: string;
  /** Initial active key for the uncontrolled case. */
  defaultValue?: string;
  onValueChange?: (key: string) => void;
  mode?: KernNavigationRailMode;
  /** Rendered above the destination list — a menu toggle, a switcher. */
  header?: ReactNode;
  /** Rendered below the list — a user row, a settings shortcut. */
  footer?: ReactNode;
  /** Accessible name for the navigation landmark. */
  label?: string;
  className?: string;
  testID?: string;
};

/** M3 navigation rail: vertical destinations with the pill indicator. */
export function NavigationRail({
  destinations,
  value,
  defaultValue,
  onValueChange,
  mode = "collapsed",
  header,
  footer,
  label = "Primary",
  className,
  testID,
}: NavigationRailProps) {
  const expanded = mode === "expanded";
  const listRef = useRef<HTMLElement>(null);
  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const active = controlled ? value : uncontrolled;

  const select = (key: string) => {
    if (!controlled) setUncontrolled(key);
    onValueChange?.(key);
  };

  const focusKey = (key: string) => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"]`)
      ?.focus();
  };

  const move = (step: number) => {
    const total = destinations.length;
    const from = destinations.findIndex((d) => d.key === active);
    for (let hop = 1; hop <= total; hop++) {
      const index = (((from + step * hop) % total) + total) % total;
      const next = destinations[index];
      if (next && !next.disabled) {
        select(next.key);
        focusKey(next.key);
        return;
      }
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        move(1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        move(-1);
        break;
      case "Home":
        event.preventDefault();
        {
          const first = destinations.find((d) => !d.disabled);
          if (first) {
            select(first.key);
            focusKey(first.key);
          }
        }
        break;
      case "End":
        event.preventDefault();
        {
          const last = [...destinations].reverse().find((d) => !d.disabled);
          if (last) {
            select(last.key);
            focusKey(last.key);
          }
        }
        break;
      default:
        break;
    }
  };

  return (
    <nav
      aria-label={label}
      data-slot="navigation-rail"
      data-testid={testID ?? "kern-navigation-rail"}
      style={{
        width: expanded
          ? KERN_NAVIGATION_RAIL_EXPANDED_WIDTH
          : KERN_NAVIGATION_RAIL_WIDTH,
      }}
      className={cn(
        "kern-navigation-rail flex h-full shrink-0 flex-col border-e border-(--sys-color-outline-variant) bg-(--sys-color-surface) py-3 text-(--sys-color-on-surface)",
        expanded ? "items-stretch px-3" : "items-center px-0",
        className,
      )}
    >
      {header ? (
        <div
          data-slot="navigation-rail-header"
          className="mb-2 flex justify-center"
        >
          {header}
        </div>
      ) : null}
      <div
        ref={listRef as React.RefObject<HTMLDivElement>}
        data-slot="navigation-rail-list"
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto",
          expanded ? "w-full" : "items-center",
        )}
      >
        {destinations.map((destination) => {
          const selected = destination.key === active;
          return (
            <button
              key={destination.key}
              type="button"
              data-slot="navigation-rail-destination"
              data-key={destination.key}
              data-active={selected || undefined}
              // The label is the accessible name in BOTH modes — collapsing
              // is visual only, matching the native twin.
              aria-label={destination.label}
              aria-current={selected ? "page" : undefined}
              aria-disabled={destination.disabled || undefined}
              disabled={destination.disabled}
              // Roving tabindex: the rail is one tab stop, arrows move inside.
              tabIndex={
                selected ||
                (!active &&
                  destination === destinations.find((d) => !d.disabled))
                  ? 0
                  : -1
              }
              onClick={() => select(destination.key)}
              onKeyDown={onKeyDown}
              className={cn(
                `kern-navigation-rail-destination relative flex min-h-12 cursor-pointer items-center justify-center gap-1 outline-none select-none ${FOCUS_RING_CLASS}`,
                expanded
                  ? "w-full flex-row justify-start gap-3 rounded-(--sys-shape-corner-full) px-4"
                  : "w-16 flex-col rounded-(--sys-shape-corner-medium)",
                destination.disabled
                  ? "pointer-events-none opacity-38"
                  : "hover:bg-(--sys-color-surface-tonal)",
                expanded &&
                  selected &&
                  "bg-(--sys-color-secondary-container) font-medium text-(--sys-color-on-secondary-container)",
              )}
            >
              <span
                data-active={selected || undefined}
                className={cn(
                  "relative flex h-8 items-center justify-center rounded-(--sys-shape-corner-full) transition-colors",
                  expanded
                    ? "w-8 shrink-0"
                    : "w-14 data-[active]:bg-(--sys-color-secondary-container) data-[active]:text-(--sys-color-on-secondary-container)",
                )}
              >
                <span
                  aria-hidden="true"
                  className="flex items-center [&_svg]:size-6"
                >
                  {destination.icon}
                </span>
                {destination.badge && !expanded ? (
                  <span className="absolute -end-0.5 -top-0.5 flex items-center">
                    {destination.badge}
                  </span>
                ) : null}
              </span>
              {expanded ? (
                <span className="min-w-0 flex-1 truncate text-start text-sm">
                  {destination.label}
                </span>
              ) : (
                <span className="max-w-full truncate text-xs font-medium">
                  {destination.label}
                </span>
              )}
              {expanded && destination.badge ? (
                <span className="shrink-0">{destination.badge}</span>
              ) : null}
            </button>
          );
        })}
      </div>
      {footer ? (
        <div
          data-slot="navigation-rail-footer"
          className="mt-2 flex justify-center"
        >
          {footer}
        </div>
      ) : null}
    </nav>
  );
}
