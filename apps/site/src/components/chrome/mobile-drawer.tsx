/**
 * Mobile drawer — the hamburger destination below lg, where the header tabs
 * are hidden. It is also the bar's overflow surface: GitHub, search, and the
 * CTA live here when the bar runs out of room.
 *
 * A modal dialog over a 30% scrim: the five section tabs first (the same
 * `PRIMARY_TABS` list the header renders, so a tab added there is reachable
 * here with no second edit), then the secondary destinations, then a search
 * row. Escape and the scrim close it; Tab is trapped first↔last with the
 * shared `trapTarget` helper (the same contract the ⌘K palette keeps);
 * focus returns to the hamburger that opened it; the body stops scrolling
 * while it is open. Rows are 48dp pills — the same IA, the same shape as
 * the header, across breakpoints.
 *
 * Section labels are plain text, not headings — check-headings requires an id
 * on every h2/h3, and these labels are wayfinding, not document structure.
 */
import { useLocation } from "@tanstack/react-router";
import { buttonVariants, cn } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import { type RefObject, useEffect, useRef } from "react";
import { T_BODY_MD, T_LABEL } from "../../domains/shared/systems/type-scale";
import {
  FOCUS_RING,
  ICON_BUTTON,
  PILL_ACTIVE,
  PILL_REST,
} from "../../domains/shared/systems/ui";
import { trapTarget } from "../../systems/focus-trap";
import { isActivePath, isTabActive, PRIMARY_TABS } from "./app-rail";
import { openSearch } from "./search-palette";

/** Destinations that are not primary tabs but must stay reachable by hand. */
const SECONDARY: { href: string; label: string }[] = [
  { href: "/docs/getting-started", label: "Getting started" },
  { href: "/primitives", label: "Primitives" },
  { href: "/changelog", label: "Changelog" },
  { href: "/about", label: "About" },
  { href: "/community", label: "Community" },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileDrawer({
  open,
  onClose,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    // First focusable is the close button — the way back out is named first.
    panel
      ?.querySelector<HTMLElement>(FOCUSABLE)
      ?.focus({ preventScroll: true });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const target = trapTarget(
        items.length,
        items.indexOf(document.activeElement as HTMLElement),
        e.shiftKey,
      );
      if (target !== null) {
        e.preventDefault();
        items[target]?.focus();
      } else if (items.length === 0) {
        e.preventDefault();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        className="absolute inset-0 cursor-default border-0 bg-(--sys-color-scrim)/30 p-0"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col gap-5 overflow-y-auto rounded-e-(--sys-shape-corner-extra-large) bg-(--sys-color-surface) px-4 pt-3 pb-6 shadow-(--sys-elevation-level3)"
      >
        <div className="flex items-center justify-between">
          <a
            href="/"
            onClick={onClose}
            aria-label="Kern home"
            className="flex size-10 items-center justify-center rounded-full bg-(--sys-color-primary) text-(--sys-color-on-primary) no-underline"
          >
            <span className={T_BODY_MD}>K</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className={ICON_BUTTON}
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        <nav aria-label="Primary" className="flex flex-col gap-0.5">
          {PRIMARY_TABS.map((tab) => {
            const active = isTabActive(pathname, tab);
            return (
              <a
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                onClick={onClose}
                className={cn(
                  "min-h-12 px-4 no-underline",
                  active
                    ? `${PILL_ACTIVE} flex items-center`
                    : `${PILL_REST} flex items-center ${T_BODY_MD}`,
                )}
              >
                {tab.label}
              </a>
            );
          })}
        </nav>

        <nav aria-label="More from kern" className="flex flex-col gap-0.5">
          <p
            className={`m-0 px-3 pb-1 ${T_LABEL} text-(--sys-color-on-surface-variant) uppercase`}
          >
            More from kern
          </p>
          {SECONDARY.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={
                isActivePath(pathname, item.href) ? "page" : undefined
              }
              onClick={onClose}
              className={cn(
                `min-h-12 rounded-(--sys-shape-corner-full) px-4 no-underline`,
                isActivePath(pathname, item.href)
                  ? `${PILL_ACTIVE} flex items-center`
                  : `${PILL_REST} flex items-center ${T_BODY_MD}`,
              )}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              onClose();
              openSearch();
            }}
            className={`flex min-h-12 w-full cursor-pointer items-center gap-2 rounded-(--sys-shape-corner-full) border-0 bg-transparent px-4 ${T_BODY_MD} text-(--sys-color-on-surface-variant) hover:bg-(--sys-color-on-surface)/8 hover:text-(--sys-color-on-surface) active:bg-(--sys-color-on-surface)/12 ${FOCUS_RING}`}
          >
            <Icon name="search" size={18} />
            Search (⌘K)
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <a
            href="/docs/getting-started"
            onClick={onClose}
            className={cn(
              buttonVariants({ variant: "primary" }),
              "no-underline",
            )}
          >
            Get started
          </a>
          <a
            href="https://github.com/xoroh/kern"
            className={`${T_BODY_MD} rounded-(--sys-shape-corner-full) px-3 py-3 text-center text-(--sys-color-on-surface-variant) no-underline hover:bg-(--sys-color-on-surface)/8 active:bg-(--sys-color-on-surface)/12`}
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
