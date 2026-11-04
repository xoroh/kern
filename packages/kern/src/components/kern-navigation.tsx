import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "../utils/cn";
import {
  NavigationBar,
  NavigationBarItem,
  type NavigationDestination,
} from "./navigation-bar";
import { NavigationDrawer } from "./navigation-drawer";
import { type KernNavigationRailMode, NavigationRail } from "./navigation-rail";

/**
 * KernNavigation — ONE navigation (CL-002+CL-003; D925 "one nav").
 *
 * Variants (one destination contract, platform-split renderers):
 * - `drawer-modal` — M3 modal drawer (scrim, Escape, select-then-dismiss).
 * - `rail` — M3 navigation rail (collapsed 80dp icons / expanded 240dp
 *   sidebar presentation).
 * - `bar` — M3 navigation bar (compact, bottom, 3–5 destinations).
 * - `sidebar-pane` — desk persistent sidebar with section headings plus an
 *   optional drill/detail pane (W 3-pane; N renders 1-pane and the detail
 *   belongs in a sheet — see the variant note below).
 *
 * Slots: `header` (switcher), nav-item (icon/label/badge per destination),
 * `footer` (user row). Open state is controlled (`open` + `onOpenChange`)
 * or uncontrolled (`defaultOpen`).
 *
 * Adapter: `routeManifestToSections` turns a route manifest
 * (`{ path, label, section?, … }[]`) into `KernNavSection[]`, so a host
 * declares routes once and every variant renders them. M3 caps the bar at
 * 5 destinations: `flattenSections` feeds `bar`/`drawer-modal` (single-list
 * surfaces); sectioned variants keep the headings.
 *
 * Mobile already converges on the CMP-3140 destination shape — this adopts
 * it (`NavigationDestination`), it does not fork it.
 *
 * M3: https://m3.material.io/components/navigation-bar,
 * https://m3.material.io/components/navigation-drawer,
 * https://m3.material.io/components/navigation-rail
 */

export type { KernNavigationRailMode, NavigationDestination };

export type KernNavSection = {
  /** Stable identity for React keys. */
  key: string;
  /** Section heading. Omitted for single-list surfaces. */
  title?: ReactNode;
  destinations: NavigationDestination[];
};

/** One route in a host route manifest. */
export type RouteManifestEntry = {
  /** Stable identity AND selection key — use the route path. */
  path: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  /** Section heading. Routes without one group under `key: "main"`. */
  section?: string;
  disabled?: boolean;
};

/**
 * Route-manifest → sections adapter. Order-preserving: sections first-seen
 * order, destinations manifest order. Unsectioned routes group first under
 * `"main"` with no heading.
 */
export function routeManifestToSections(
  routes: readonly RouteManifestEntry[],
): KernNavSection[] {
  const sections: KernNavSection[] = [];
  const byTitle = new Map<string, KernNavSection>();
  for (const route of routes) {
    const key = route.section ?? "main";
    let section = byTitle.get(key);
    if (!section) {
      section = {
        key,
        title: route.section,
        destinations: [],
      };
      byTitle.set(key, section);
      sections.push(section);
    }
    section.destinations.push({
      key: route.path,
      label: route.label,
      icon: route.icon,
      badge: route.badge,
      disabled: route.disabled,
    });
  }
  return sections;
}

/** Sections → one destination list (for `bar` and `drawer-modal`). */
export function flattenSections(
  sections: readonly KernNavSection[],
): NavigationDestination[] {
  return sections.flatMap((section) => section.destinations);
}

export type KernNavigationVariant =
  | "drawer-modal"
  | "rail"
  | "bar"
  | "sidebar-pane";

export type KernNavigationProps = {
  variant?: KernNavigationVariant;
  sections: readonly KernNavSection[];
  /** Controlled active destination key. */
  value?: string;
  /** Initial active key for the uncontrolled case. */
  defaultValue?: string;
  onValueChange?: (key: string) => void;
  /** Header slot: workspace switcher. */
  header?: ReactNode;
  /** Footer slot: user row, settings shortcut. */
  footer?: ReactNode;
  /** Accessible name for the navigation landmark. */
  label?: string;
  /** `drawer-modal` visibility. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** `rail` presentation: icons-only vs sidebar. */
  railMode?: KernNavigationRailMode;
  /** `bar` FAB dock above the bar (M3). */
  floating?: ReactNode;
  /** `sidebar-pane` drill/detail pane (W 3-pane; N: pass nothing — the
   * detail belongs in a `KernOverlay` sheet on 1-pane screens). */
  detail?: ReactNode;
  /** Sidebar headline when the variant shows section headings. */
  title?: ReactNode;
  className?: string;
  testID?: string;
};

/** ONE navigation: drawer-modal / rail / bar / sidebar-pane. */
export function KernNavigation({
  variant = "sidebar-pane",
  sections,
  value,
  defaultValue,
  onValueChange,
  header,
  footer,
  label = "Primary",
  open,
  defaultOpen = false,
  onOpenChange,
  railMode = "collapsed",
  floating,
  detail,
  title,
  className,
  testID,
}: KernNavigationProps) {
  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const active = controlled ? value : uncontrolled;
  const select = (key: string) => {
    if (!controlled) setUncontrolled(key);
    onValueChange?.(key);
  };
  const openControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const openValue = openControlled ? open : uncontrolledOpen;
  const reportOpen = (next: boolean) => {
    if (!openControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  if (variant === "bar") {
    return (
      <NavigationBar
        destinations={flattenSections(sections)}
        value={active}
        onValueChange={select}
        label={label}
        floating={floating}
        testID={testID ?? "kern-navigation-bar"}
        className={className}
      />
    );
  }

  if (variant === "drawer-modal") {
    return (
      <NavigationDrawer
        open={openValue}
        onOpenChange={reportOpen}
        destinations={flattenSections(sections)}
        value={active}
        onValueChange={select}
        title={title ?? header}
        footer={footer}
        aria-label={label}
        testID={testID ?? "kern-navigation-drawer"}
        className={className}
      />
    );
  }

  if (variant === "rail") {
    return (
      <NavigationRail
        destinations={flattenSections(sections)}
        value={active}
        onValueChange={select}
        mode={railMode}
        header={header}
        footer={footer}
        label={label}
        testID={testID ?? "kern-navigation-rail"}
        className={className}
      />
    );
  }

  // `sidebar-pane`: the persistent desk surface. Section headings stay (a
  // flat list would merge unrelated destinations); the modal drawer
  // deliberately flattens instead — M3 modal drawers carry one list.
  return (
    <div
      data-slot="kern-navigation"
      data-testid={testID ?? "kern-navigation"}
      className={cn("kern-navigation flex min-h-0 flex-1", className)}
    >
      <nav
        aria-label={label}
        data-slot="kern-navigation-sidebar"
        className="kern-navigation-sidebar flex h-full w-60 shrink-0 flex-col border-e border-(--sys-color-outline-variant) bg-(--sys-color-surface) text-(--sys-color-on-surface)"
      >
        {header ? (
          <div
            data-slot="kern-navigation-header"
            className="flex min-h-14 items-center gap-2 px-4"
          >
            {header}
          </div>
        ) : null}
        <div
          data-slot="kern-navigation-sections"
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-2"
        >
          {sections.map((section) => (
            <div key={section.key} data-slot="kern-navigation-section">
              {section.title ? (
                <p
                  data-slot="kern-navigation-section-title"
                  className="px-4 pb-1 text-xs font-medium tracking-wide text-(--sys-color-on-surface-variant)"
                >
                  {section.title}
                </p>
              ) : null}
              <div className="flex flex-col gap-1">
                {section.destinations.map((destination) => (
                  <NavigationBarItem
                    key={destination.key}
                    label={destination.label}
                    icon={destination.icon}
                    badge={destination.badge}
                    disabled={destination.disabled}
                    selected={destination.key === active}
                    onSelect={() => select(destination.key)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {footer ? (
          <div
            data-slot="kern-navigation-footer"
            className="flex min-h-14 items-center gap-2 px-4"
          >
            {footer}
          </div>
        ) : null}
      </nav>
      {detail ? (
        <div
          data-slot="kern-navigation-detail"
          className="kern-navigation-detail min-w-0 flex-1 overflow-y-auto"
        >
          {detail}
        </div>
      ) : null}
    </div>
  );
}
