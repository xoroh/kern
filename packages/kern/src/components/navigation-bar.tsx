import { type ComponentProps, type ReactNode, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { FOCUS_RING_CLASS } from "./focus-ring";

/**
 * M3 navigation bar — the compact-screen destination switcher (3–5
 * destinations, bottom edge, 80dp tall). Same data shape as the vertical
 * containers: one `NavigationDestination` list feeds the bar, the rail, and
 * the drawer, so a host never re-declares its destinations per surface.
 *
 * Behaviour this component owns, rather than delegating to a primitive:
 *
 * - **Selection** — controlled (`value` + `onValueChange`) or uncontrolled
 *   (`defaultValue`), one destination active at a time.
 * - **Keyboard traversal** — roving tabindex with Left/Right (and Up/Down, so
 *   the bar survives a vertical host layout), Home/End. Traversal skips
 *   disabled destinations and auto-activates the destination it lands on,
 *   which is the keyboard model M3's bar inherits from the tablist.
 * - **Disabled destinations** — announced, skipped by traversal, and inert to
 *   activation.
 * - **A11y semantics** — `role="navigation"` with an accessible name, and
 *   `aria-current="page"` on the active destination (the web contract recorded
 *   in `docs/parity-contract.md` row 10; native uses `accessibilityRole="tab"`
 *   plus `accessibilityState.selected`).
 *
 * The active indicator is a `secondaryContainer` pill behind the icon, per the
 * M3 navigation bar anatomy — bound to `data-active`, so appearance never
 * depends on React state.
 */

/** M3 navigation bar height (80dp). The bar never reflows when labels change. */
export const NAVIGATION_BAR_HEIGHT = 80;

/** M3 caps a navigation bar at 5 destinations before it becomes a drawer. */
export const NAVIGATION_BAR_MAX_DESTINATIONS = 5;

export type NavigationDestination = {
  /** Stable identity for selection. Also used as the React key. */
  key: string;
  label: string;
  /** Icon node. Kern icons or any renderable; hidden from assistive tech. */
  icon?: ReactNode;
  /** Badge node drawn inside the icon's bounding box, upper-trailing. */
  badge?: ReactNode;
  disabled?: boolean;
};

export type NavigationBarProps = {
  destinations: NavigationDestination[];
  /** Controlled active destination key. */
  value?: string;
  /** Initial active key for the uncontrolled case. */
  defaultValue?: string;
  onValueChange?: (key: string) => void;
  /** Accessible name for the navigation landmark. */
  label?: string;
  /** Rendered above the bar — a FAB dock sits here in M3. */
  floating?: ReactNode;
  className?: string;
  testID?: string;
};

/** Index of the next enabled destination in `step` direction, or -1. */
function nextEnabledIndex(
  destinations: NavigationDestination[],
  from: number,
  step: number,
): number {
  const total = destinations.length;
  if (total === 0) return -1;
  for (let hop = 1; hop <= total; hop++) {
    const index = (((from + step * hop) % total) + total) % total;
    if (!destinations[index]?.disabled) return index;
  }
  return -1;
}

/** M3 navigation bar: 3–5 destinations, always visible, exactly one active. */
export function NavigationBar({
  destinations,
  value,
  defaultValue,
  onValueChange,
  label = "Primary",
  floating,
  className,
  testID,
}: NavigationBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const active = controlled ? value : uncontrolled;
  const found = destinations.findIndex((d) => d.key === active);
  // A controlled value that names no destination must not blank the bar: fall
  // back to the first destination rather than rendering nothing active.
  const activeIndex = found === -1 ? 0 : found;

  const select = (key: string) => {
    if (!controlled) setUncontrolled(key);
    onValueChange?.(key);
  };

  const focusKey = (key: string) => {
    barRef.current
      ?.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"]`)
      ?.focus();
  };

  const move = (step: number) => {
    const index = nextEnabledIndex(destinations, activeIndex, step);
    const next = destinations[index];
    if (!next) return;
    select(next.key);
    // Focus follows selection: with a roving tabindex the bar is one tab stop,
    // so a keyboard user must land on the destination they moved to.
    focusKey(next.key);
  };

  const edge = (last: boolean) => {
    const ordered = last ? [...destinations].reverse() : destinations;
    const target = ordered.find((d) => !d.disabled);
    if (!target) return;
    select(target.key);
    focusKey(target.key);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        move(1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        break;
      case "Home":
        event.preventDefault();
        edge(false);
        break;
      case "End":
        event.preventDefault();
        edge(true);
        break;
      default:
        break;
    }
  };

  return (
    <div data-slot="navigation-bar-container" className="flex flex-col">
      {floating ? (
        <div
          data-slot="navigation-bar-floating"
          className="flex justify-end px-4 pb-2"
        >
          {floating}
        </div>
      ) : null}
      <nav
        ref={barRef}
        aria-label={label}
        data-slot="navigation-bar"
        data-testid={testID ?? "kern-navigation-bar"}
        className={cn(
          "kern-navigation-bar flex h-20 items-stretch border-t border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) text-(--md-sys-color-on-surface-variant) shadow-(--md-sys-elevation-level2)",
          className,
        )}
      >
        {destinations.map((destination, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={destination.key}
              type="button"
              data-slot="navigation-bar-destination"
              data-key={destination.key}
              data-active={selected || undefined}
              aria-current={selected ? "page" : undefined}
              aria-disabled={destination.disabled || undefined}
              disabled={destination.disabled}
              // Roving tabindex: exactly one destination sits in the tab
              // order, the active one. Five tab stops is not a navigation bar.
              tabIndex={selected ? 0 : -1}
              onClick={() => select(destination.key)}
              onKeyDown={onKeyDown}
              className={cn(
                "kern-navigation-bar-destination flex min-h-12 flex-1 cursor-pointer flex-col items-center justify-center gap-1 px-2 outline-none select-none " + FOCUS_RING_CLASS,
                destination.disabled
                  ? "pointer-events-none opacity-38"
                  : "hover:bg-(--md-sys-color-surface-container-high)",
                selected && "text-(--md-sys-color-on-surface)",
              )}
            >
              <span
                data-active={selected || undefined}
                className="relative flex h-8 w-16 items-center justify-center rounded-(--md-sys-shape-corner-full) transition-colors data-[active]:bg-(--md-sys-color-secondary-container)"
              >
                <span
                  aria-hidden="true"
                  className="flex items-center [&_svg]:size-6"
                >
                  {destination.icon}
                </span>
                {destination.badge ? (
                  <span className="absolute -end-0.5 -top-0.5 flex items-center">
                    {destination.badge}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "max-w-full truncate text-xs",
                  selected ? "font-semibold" : "font-medium",
                )}
              >
                {destination.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export type NavigationBarItemProps = Omit<
  ComponentProps<"button">,
  "aria-current" | "children"
> & {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
  onSelect?: () => void;
};

/**
 * One destination row for vertical containers (drawer, rail, sidebar list):
 * 56dp minimum with the `secondaryContainer` pill when selected. Same
 * destination data as {@link NavigationBar} — only the container differs.
 */
export function NavigationBarItem({
  label,
  selected = false,
  icon,
  badge,
  onSelect,
  disabled,
  className,
  ...props
}: NavigationBarItemProps) {
  return (
    <button
      type="button"
      data-slot="navigation-bar-item"
      data-active={selected || undefined}
      aria-current={selected ? "page" : undefined}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "kern-navigation-bar-item flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-(--md-sys-shape-corner-full) px-6 text-left text-(--md-sys-color-on-surface) outline-none transition-colors " + FOCUS_RING_CLASS,
        disabled
          ? "pointer-events-none opacity-38"
          : "hover:bg-(--md-sys-color-surface-tonal)",
        selected &&
          "bg-(--md-sys-color-secondary-container) font-medium text-(--md-sys-color-on-secondary-container)",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="flex shrink-0 items-center [&_svg]:size-6"
        >
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate text-sm">{label}</span>
      {badge ? <span className="shrink-0">{badge}</span> : null}
    </button>
  );
}
