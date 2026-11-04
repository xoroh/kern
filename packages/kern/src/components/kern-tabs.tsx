import { type KeyboardEvent, type ReactNode, useId, useState } from "react";
import { cn } from "../utils/cn";
import { FOCUS_RING_CLASS } from "./focus-ring";

/**
 * KernTabs — the ONE tabs component (D951 WP1b, CL-009; M3
 * https://m3.material.io/components/tabs/overview).
 *
 * Merges the web + mobile twins (`Tabs` + `SecondaryTabs` on both
 * renderers, CMP-3114/3176): one data contract — `items, active,
 * onChange, density` — with `variant` + `orientation` covering every
 * placement the inventory found (primary bars incl. Trip*, secondary
 * sub-sections, settings vertical pills).
 *
 * P0 parity decisions (WP9 backlog lane WP1b), recorded here so the next
 * reader does not re-litigate them:
 *
 * - secondary-tabs MERGED: `SecondaryTabs` (web + native `layouts.tsx`)
 *   is now this component at `variant="secondary"` — same 2px indicator,
 *   same on-surface active label, same roving-tabindex keyboard model.
 *   The old exports stay as thin wrappers (retirement happens in
 *   transfer, never in design), but they render `KernTabs` — there is
 *   exactly one behaviour implementation per renderer.
 * - segmented NOT merged: M3 lists Segmented buttons as their own
 *   component, and the guidance law holds ("fewer than three tabs — use
 *   segmented buttons"). `SegmentedButton` (web first-class, native in
 *   `web-parity.tsx`) owns the <3-choice pill row; `KernTabs` owns tabbed
 *   content with panels. A `variant="segmented"` here would be a second
 *   name for that surface.
 * - banner N/A: `Banner` already has a native twin (`web-parity.tsx`
 *   `Banner`, same 4 intents on the tone registry) — the P0 "native twin
 *   decision" is KEEP + test, not build.
 * - vertical-pills = `orientation="vertical"`: the settings pattern
 *   (DealTabs/settings ITEM_PANELS) is secondary tabs rotated, with the
 *   active tab filled as a pill instead of underlined.
 */

export type KernTabItem = {
  value: string;
  label: string;
  /** Panel body. Rendered when this tab is active. */
  content?: ReactNode;
  disabled?: boolean;
  /** Leading slot: a KernIcon-registry icon. Never raw lucide. */
  leadingIcon?: ReactNode;
  /** Trailing slot: usually a `Badge` count/dot. */
  badge?: ReactNode;
};

export type KernTabsVariant = "primary" | "secondary";
export type KernTabsOrientation = "horizontal" | "vertical";
export type KernTabsDensity = "compact" | "medium" | "expanded";

const DENSITY_TAB: Record<KernTabsDensity, string> = {
  compact: "min-h-10",
  medium: "min-h-12",
  expanded: "min-h-14",
};

export type KernTabsProps = {
  items: KernTabItem[];
  /** Controlled active tab value. */
  value?: string;
  /** Initial active value for the uncontrolled case. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * M3 level: `primary` under the app bar (3px primary indicator, primary
   * active text) or `secondary` inside content (2px indicator, on-surface
   * active text). Never mix both levels in one bar.
   */
  variant?: KernTabsVariant;
  /**
   * `horizontal` underlines the active tab; `vertical` fills it as a pill
   * (the settings pattern). The indicator geometry follows the axis.
   */
  orientation?: KernTabsOrientation;
  /** Row density: compact 40 / medium 48 / expanded 56. */
  density?: KernTabsDensity;
  /** Accessible name for the tablist. */
  label?: string;
  /**
   * Caller-composed panel area. When given, per-item `content` is ignored
   * and this is rendered as the tabpanel instead.
   */
  children?: ReactNode;
  className?: string;
  testID?: string;
};

export function KernTabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = "primary",
  orientation = "horizontal",
  density = "medium",
  label = "Sections",
  children,
  className,
  testID,
}: KernTabsProps) {
  const baseId = useId();
  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const requested = controlled ? value : uncontrolled;
  const found = items.findIndex((tab) => tab.value === requested);
  // Default to the first tab that is not disabled; an empty or all-disabled
  // set renders no tablist at all (below).
  const fallback = items.findIndex((tab) => !tab.disabled);
  const activeIndex = found !== -1 ? found : fallback;
  const active = items[activeIndex];
  const vertical = orientation === "vertical";

  if (!active) return null;

  const select = (next: string) => {
    if (!controlled) setUncontrolled(next);
    onValueChange?.(next);
  };

  const focusTab = (index: number) => {
    const tab = items[index];
    if (!tab) return;
    const el = document.getElementById(`${baseId}-tab-${tab.value}`);
    el?.focus();
  };

  const enabledNeighbour = (from: number, step: number) => {
    const total = items.length;
    if (total === 0) return -1;
    for (let hop = 1; hop <= total; hop++) {
      const index = (((from + step * hop) % total) + total) % total;
      if (!items[index]?.disabled) return index;
    }
    return -1;
  };

  const move = (step: number) => {
    const index = enabledNeighbour(activeIndex, step);
    if (index === -1) return;
    const next = items[index];
    if (!next) return;
    select(next.value);
    focusTab(index);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    // Vertical tabs traverse with Up/Down; horizontal with Left/Right.
    // Both accept all four arrows (WAI-ARIA APG orientation rule).
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
      case "Home": {
        event.preventDefault();
        const first = items.findIndex((tab) => !tab.disabled);
        if (first !== -1) {
          const tab = items[first];
          if (tab) {
            select(tab.value);
            focusTab(first);
          }
        }
        break;
      }
      case "End": {
        event.preventDefault();
        let last = -1;
        for (let i = items.length - 1; i >= 0; i--) {
          if (!items[i]?.disabled) {
            last = i;
            break;
          }
        }
        if (last !== -1) {
          const tab = items[last];
          if (tab) {
            select(tab.value);
            focusTab(last);
          }
        }
        break;
      }
      default:
        break;
    }
  };

  const showPanel =
    children !== undefined || items.some((tab) => tab.content !== undefined);
  const primary = variant === "primary";

  return (
    <div
      data-slot="kern-tabs"
      data-variant={variant}
      data-orientation={orientation}
      data-testid={testID ?? "kern-tabs"}
      className={cn(
        vertical ? "flex flex-row gap-2" : "flex flex-col",
        className,
      )}
    >
      <div
        role="tablist"
        aria-label={label}
        aria-orientation={vertical ? "vertical" : "horizontal"}
        className={
          vertical
            ? "flex flex-col items-stretch gap-1"
            : "flex items-stretch gap-1 border-b border-(--sys-color-outline-variant)"
        }
      >
        {items.map((tab, index) => {
          const selected = index === activeIndex;
          const tabId = `${baseId}-tab-${tab.value}`;
          return (
            <button
              key={tab.value}
              type="button"
              id={tabId}
              role="tab"
              data-slot="kern-tab"
              data-active={selected || undefined}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.value}`}
              aria-disabled={tab.disabled || undefined}
              disabled={tab.disabled}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.value)}
              onKeyDown={onKeyDown}
              className={cn(
                vertical
                  ? // Vertical pills (settings): selection is a fill, not a
                    // line — the active tab is a secondary-container pill.
                    `kern-tab relative flex cursor-pointer items-center gap-2 rounded-(--sys-shape-corner-full) px-4 text-sm leading-5 font-medium tracking-[0.00625rem] text-(--sys-color-on-surface-variant) outline-none select-none transition-colors duration-200 ease-(--sys-motion-easing-standard) hover:text-(--sys-color-on-surface) focus-visible:text-(--sys-color-on-surface) active:text-(--sys-color-on-surface) ${DENSITY_TAB[density]} ` +
                      FOCUS_RING_CLASS
                  : `kern-tab relative flex cursor-pointer items-center gap-2 px-4 text-sm leading-5 font-medium tracking-[0.00625rem] text-(--sys-color-on-surface-variant) outline-none select-none transition-colors duration-200 ease-(--sys-motion-easing-standard) after:absolute after:inset-x-0 after:bottom-0 after:rounded-full after:bg-transparent after:content-[''] before:absolute before:inset-0 before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 before:bg-(--sys-color-on-surface) hover:before:opacity-[var(--sys-state-hover)] hover:text-(--sys-color-on-surface) focus-visible:before:opacity-[var(--sys-state-focus)] focus-visible:text-(--sys-color-on-surface) active:before:opacity-[var(--sys-state-press)] active:text-(--sys-color-on-surface) ${DENSITY_TAB[density]} ` +
                      (primary ? "after:h-[3px]" : "after:h-[2px]") +
                      ` ${FOCUS_RING_CLASS}`,
                tab.disabled ? "pointer-events-none opacity-38" : "",
                !vertical &&
                  selected &&
                  (primary
                    ? "text-(--sys-color-primary) after:bg-(--sys-color-primary)"
                    : "text-(--sys-color-on-surface) after:bg-(--sys-color-primary)"),
                vertical &&
                  selected &&
                  "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container)",
              )}
            >
              {tab.leadingIcon ? (
                <span
                  data-slot="kern-tab-leading-icon"
                  aria-hidden="true"
                  className="inline-flex shrink-0 items-center [&_svg]:size-[18px]"
                >
                  {tab.leadingIcon}
                </span>
              ) : null}
              <span className="truncate">{tab.label}</span>
              {tab.badge ? (
                <span
                  data-slot="kern-tab-badge"
                  aria-hidden="true"
                  className="inline-flex shrink-0 items-center"
                >
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {/*
        Only the active tab's panel is mounted. Inactive panels are removed
        rather than hidden: a hidden panel is still reachable by assistive tech
        and still announced, which reads as duplicated content.
      */}
      {showPanel ? (
        <div
          key={active.value}
          id={`${baseId}-panel-${active.value}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active.value}`}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA APG requires a tabpanel in the tab order so a keyboard user can reach the panel content directly; it is the panel, not a control.
          tabIndex={0}
          className="kern-tabpanel flex-1 py-4 outline-none"
        >
          {children ?? active.content}
        </div>
      ) : null}
    </div>
  );
}
