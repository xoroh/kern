import { type KeyboardEvent, type ReactNode, useId, useState } from "react";
import { cn } from "../utils/cn";
import { FOCUS_RING_CLASS } from "./focus-ring";

/**
 * M3 secondary tabs — the sub-section switcher inside a primary view. Distinct
 * from `Tabs` (the primary set) in weight and placement, not in behaviour:
 * both own a tablist with one active tab and a panel bound to it.
 *
 * Behaviour this component owns:
 *
 * - **Controlled or uncontrolled selection** (`value` / `defaultValue`), with
 *   the change reported through `onValueChange` in both cases.
 * - **Roving tabindex** — one tab stop for the whole set, arrow keys move and
 *   activate, Home/End jump to the ends, and traversal wraps.
 * - **Disabled tabs** — skipped by traversal, `aria-disabled`, inert to
 *   activation, and never made the active tab.
 * - **Panel association** — the active tab is `aria-controls` the panel and
 *   the panel is `role="tabpanel"` labelled by its tab, generated through
 *   `useId` so two instances on a page cannot collide.
 * - **No tabs is not a tablist** — with an empty `tabs` array nothing renders,
 *   rather than an empty `role="tablist"` for a screen reader to land in.
 *
 * A `tab` that declares `content` is rendered as this component's panel, which
 * is how the native `SecondaryTabs` works: one data array, no panel plumbing.
 * Pass `children` instead when the panel is composed by the caller.
 */

export type SecondaryTab = {
  value: string;
  label: string;
  /** Panel body. Rendered when this tab is active. */
  content?: ReactNode;
  disabled?: boolean;
};

export type SecondaryTabsProps = {
  tabs: SecondaryTab[];
  /** Controlled active tab value. */
  value?: string;
  /** Initial active value for the uncontrolled case. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Accessible name for the tablist. */
  label?: string;
  className?: string;
  testID?: string;
};

export function SecondaryTabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  label = "Sections",
  className,
  testID,
}: SecondaryTabsProps) {
  const baseId = useId();
  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const requested = controlled ? value : uncontrolled;
  const found = tabs.findIndex((tab) => tab.value === requested);
  // Default to the first tab that is not disabled; an empty or all-disabled
  // set renders no tablist at all (below).
  const fallback = tabs.findIndex((tab) => !tab.disabled);
  const activeIndex = found !== -1 ? found : fallback;
  const active = tabs[activeIndex];

  if (!active) return null;

  const select = (next: string) => {
    if (!controlled) setUncontrolled(next);
    onValueChange?.(next);
  };

  const focusTab = (index: number) => {
    const tab = tabs[index];
    if (!tab) return;
    const el = document.getElementById(`${baseId}-tab-${tab.value}`);
    el?.focus();
  };

  const enabledNeighbour = (from: number, step: number) => {
    const total = tabs.length;
    if (total === 0) return -1;
    for (let hop = 1; hop <= total; hop++) {
      const index = (((from + step * hop) % total) + total) % total;
      if (!tabs[index]?.disabled) return index;
    }
    return -1;
  };

  const move = (step: number) => {
    const index = enabledNeighbour(activeIndex, step);
    if (index === -1) return;
    const next = tabs[index];
    if (!next) return;
    select(next.value);
    focusTab(index);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
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
        const first = tabs.findIndex((tab) => !tab.disabled);
        if (first !== -1) {
          const tab = tabs[first];
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
        for (let i = tabs.length - 1; i >= 0; i--) {
          if (!tabs[i]?.disabled) {
            last = i;
            break;
          }
        }
        if (last !== -1) {
          const tab = tabs[last];
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

  return (
    <div
      data-slot="secondary-tabs"
      data-testid={testID ?? "kern-secondary-tabs"}
      className={cn("flex flex-col", className)}
    >
      <div
        role="tablist"
        aria-label={label}
        className="flex items-stretch gap-1 border-b border-(--md-sys-color-outline-variant)"
      >
        {tabs.map((tab, index) => {
          const selected = index === activeIndex;
          const tabId = `${baseId}-tab-${tab.value}`;
          return (
            <button
              key={tab.value}
              type="button"
              id={tabId}
              role="tab"
              data-slot="secondary-tab"
              data-active={selected || undefined}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.value}`}
              aria-disabled={tab.disabled || undefined}
              disabled={tab.disabled}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.value)}
              onKeyDown={onKeyDown}
              className={cn(
                "kern-secondary-tab relative flex min-h-12 cursor-pointer items-center px-4 text-sm font-medium text-(--md-sys-color-on-surface-variant) outline-none select-none after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-transparent after:content-[''] " + FOCUS_RING_CLASS,
                tab.disabled
                  ? "pointer-events-none opacity-38"
                  : "hover:text-(--md-sys-color-on-surface)",
                selected &&
                  "font-semibold text-(--md-sys-color-on-surface) after:bg-(--md-sys-color-primary)",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {/*
        Only the active tab's panel is mounted. Inactive panels are removed
        rather than hidden: a hidden panel is still reachable by assistive tech
        and still announced, which reads as duplicated content.
      */}
      <div
        key={active.value}
        id={`${baseId}-panel-${active.value}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active.value}`}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA APG requires a tabpanel in the tab order so a keyboard user can reach the panel content directly; it is the panel, not a control.
        tabIndex={0}
        className="kern-secondary-tabpanel py-4 outline-none"
      >
        {active.content}
      </div>
    </div>
  );
}
