/**
 * Docs-shell chrome: admonitions and persisted tabs (the Docusaurus-patterned
 * additions, ported as shared components).
 *
 * ADR-STYLE RULES
 * - Admonition: a callout band with a semantic role per intent. Content
 *   pages compose it; no page draws its own warning box (one visual, one
 *   a11y treatment).
 * - PlatformTabs: the web/RN switcher. Today the two platforms are separate
 *   pages linked by `meta.nativePeer`; this component makes the switch a
 *   first-class control AND persists the reader's platform choice
 *   (localStorage) so the next visit lands on the platform they read last.
 *   The variant MEANING is frozen per platform (`docs/platform-parity.md`) —
 *   this control navigates, it never relabels.
 */

import { cn } from "@xoroh/kern";
import type { ReactNode } from "react";
import { T_BODY_SM, T_LABEL_LG } from "../systems/type-scale";

/* ------------------------------------------------------------- Admonition */

export type AdmonitionIntent = "note" | "tip" | "warning" | "danger";

const INTENT_STYLE: Record<AdmonitionIntent, { band: string; label: string }> =
  {
    note: {
      band: "border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low)",
      label: "Note",
    },
    tip: {
      band: "border-(--md-sys-color-tertiary-container) bg-(--md-sys-color-tertiary-container)/40",
      label: "Tip",
    },
    warning: {
      band: "border-(--md-sys-color-secondary) bg-(--md-sys-color-secondary-container)/40",
      label: "Warning",
    },
    danger: {
      band: "border-(--md-sys-color-error) bg-(--md-sys-color-error-container)/40",
      label: "Danger",
    },
  };

export function Admonition({
  intent = "note",
  title,
  children,
}: {
  intent?: AdmonitionIntent;
  /** Overrides the per-intent default label. */
  title?: string;
  children: ReactNode;
}) {
  const style = INTENT_STYLE[intent];
  return (
    <aside
      // The band is a complementary note, not a form control: `aside` with a
      // label is the native semantic, no ARIA role needed.
      aria-label={title ?? style.label}
      className={cn(
        "flex flex-col gap-1 rounded-(--md-sys-shape-corner-medium) border-l-4 px-4 py-3",
        style.band,
      )}
    >
      <p className={`m-0 ${T_LABEL_LG} text-(--md-sys-color-on-surface)`}>
        {title ?? style.label}
      </p>
      <div
        className={`m-0 ${T_BODY_SM} text-(--md-sys-color-on-surface-variant)`}
      >
        {children}
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------ PlatformTabs */

export type PlatformTab = {
  id: string;
  label: string;
  href: string;
};

const PLATFORM_STORAGE_KEY = "kern.platform-tabs.v1";

/** The reader's last platform choice, or null. SSR-safe. */
export function loadPlatformChoice(): string | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(PLATFORM_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function savePlatformChoice(id: string): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(PLATFORM_STORAGE_KEY, id);
  } catch {
    // A preference that cannot persist is still a usable preference.
  }
}

/**
 * Persisted platform tabs (web/RN switcher).
 *
 * `tabs` is the domain's pair (or set); `active` is the one showing. Picking
 * a tab remembers it (`loadPlatformChoice` reads it back) and navigates via
 * plain anchors — the hrefs are real routes, so the switch works without
 * JavaScript and crawlers see both pages.
 */
export function PlatformTabs({
  tabs,
  active,
  label = "Platform",
  onPick,
}: {
  tabs: PlatformTab[];
  active: string;
  label?: string;
  /** Extra side effect on pick (the navigation itself is the anchor's). */
  onPick?: (id: string) => void;
}) {
  return (
    <nav aria-label={label} className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <a
            key={tab.id}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            onClick={() => {
              savePlatformChoice(tab.id);
              onPick?.(tab.id);
            }}
            className={cn(
              "inline-flex items-center rounded-(--md-sys-shape-corner-full) border px-3 py-1 no-underline",
              T_LABEL_LG,
              isActive
                ? "border-(--md-sys-color-primary) bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container)"
                : "border-(--md-sys-color-outline) text-(--md-sys-color-on-surface-variant)",
            )}
          >
            {tab.label}
          </a>
        );
      })}
    </nav>
  );
}

/* ----------------------------------------------------------- Breadcrumbs */

export type Crumb = {
  label: string;
  /** Absent on the last crumb — the page you are on is not a link. */
  href?: string;
};

/**
 * The breadcrumb trail. Domain-injected crumbs, one shared treatment: the
 * foundations pages and the component catalog show the same shape, so a
 * reader always knows where in the docs tree they are.
 */
export function Breadcrumbs({
  items,
  label = "Breadcrumb",
}: {
  items: Crumb[];
  label?: string;
}) {
  return (
    <nav
      aria-label={label}
      className={`flex flex-wrap items-center gap-2 ${T_BODY_SM} text-(--md-sys-color-on-surface-variant)`}
    >
      {items.map((crumb) => {
        const last = crumb.href === undefined;
        return (
          <span
            key={crumb.href ?? `current-${crumb.label}`}
            className="flex items-center gap-2"
          >
            {crumb.href && !last ? (
              <a
                href={crumb.href}
                className="text-(--md-sys-color-on-surface-variant) no-underline hover:underline"
              >
                {crumb.label}
              </a>
            ) : (
              <span className="text-(--md-sys-color-on-surface)">
                {crumb.label}
              </span>
            )}
            {last ? null : <span aria-hidden="true">/</span>}
          </span>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------- Pagination */

export type PageLink = { href: string; title: string };

/**
 * Generalised prev/next pagination. The foundations shell and the component
 * footer both navigate a domain-ordered list; this is the one treatment —
 * the target's TITLE rides beside its href so the reader knows where the
 * link goes before taking it.
 */
export function Pagination({
  prev,
  next,
  label = "Pages",
}: {
  prev?: PageLink;
  next?: PageLink;
  label?: string;
}) {
  return (
    <nav
      aria-label={label}
      className="flex items-stretch justify-between gap-4 border-t border-(--md-sys-color-outline-variant) pt-6"
    >
      {prev ? (
        <a
          href={prev.href}
          className="flex-1 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) p-4 text-(--md-sys-color-on-surface) no-underline"
        >
          <span className={T_BODY_SM}>← Previous</span>
          <span className="block">{prev.title}</span>
        </a>
      ) : (
        <span className="flex-1" />
      )}
      {next ? (
        <a
          href={next.href}
          className="flex-1 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) p-4 text-right text-(--md-sys-color-on-surface) no-underline"
        >
          <span className={T_BODY_SM}>Next →</span>
          <span className="block">{next.title}</span>
        </a>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
}
