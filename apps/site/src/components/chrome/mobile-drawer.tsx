/**
 * Mobile drawer — the hamburger destination below lg, where the header tabs
 * are hidden.
 *
 * A modal dialog over a scrim: the primary tabs first (the same list the
 * header renders, so a tab added there is reachable here with no second
 * edit), then the secondary destinations, then a search row. Escape and the
 * scrim close it; Tab is trapped first↔last with the shared `trapTarget`
 * helper (the same contract the ⌘K palette keeps); focus returns to the
 * hamburger that opened it; the body stops scrolling while it is open.
 *
 * Section labels are plain text, not headings — check-headings requires an id
 * on every h2/h3, and these labels are wayfinding, not document structure.
 */
import { useLocation } from "@tanstack/react-router";
import { buttonVariants, cn } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import { useEffect, useRef, type RefObject } from "react";
import { trapTarget } from "../../systems/focus-trap";
import { T_BODY_MD, T_LABEL, T_LABEL_LG } from "../../systems/type-scale";
import { isActivePath } from "./app-rail";
import { openSearch } from "./search-palette";
import { PRIMARY_TABS } from "./site-header";

/** Destinations that are not primary tabs but must stay reachable by hand. */
const SECONDARY: { href: string; label: string }[] = [
  { href: "/docs", label: "Docs" },
  { href: "/getting-started", label: "Getting started" },
  { href: "/theme-configurator", label: "Theme configurator" },
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
        className="absolute inset-0 cursor-default border-0 bg-(--md-sys-color-scrim)/40 p-0"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col gap-5 overflow-y-auto bg-(--md-sys-color-surface) px-4 pt-3 pb-6"
      >
        <div className="flex items-center justify-between">
          <a
            href="/"
            onClick={onClose}
            aria-label="Kern home"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) no-underline"
          >
            <span className={T_LABEL_LG}>K</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high)"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <nav aria-label="Primary" className="flex flex-col gap-0.5">
          {PRIMARY_TABS.map((tab) => {
            const active = isActivePath(pathname, tab.href);
            return (
              <a
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                onClick={onClose}
                className={cn(
                  "rounded-(--md-sys-shape-corner-small) px-3 py-2.5 no-underline",
                  active
                    ? `bg-(--md-sys-color-secondary-container) ${T_LABEL_LG} text-(--md-sys-color-on-secondary-container)`
                    : `${T_BODY_MD} text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)`,
                )}
              >
                {tab.label}
              </a>
            );
          })}
        </nav>
        <nav aria-label="More from kern" className="flex flex-col gap-0.5">
          <p
            className={`m-0 px-3 pb-1 ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}
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
              className={`${T_BODY_MD} rounded-(--md-sys-shape-corner-small) px-3 py-2 text-(--md-sys-color-on-surface-variant) no-underline hover:bg-(--md-sys-color-surface-container-high) hover:text-(--md-sys-color-on-surface)`}
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
            className={`flex w-full cursor-pointer items-center gap-2 rounded-(--md-sys-shape-corner-small) border-0 bg-transparent px-3 py-2 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high) hover:text-(--md-sys-color-on-surface)`}
          >
            <Icon name="search" size={16} />
            Search (⌘K)
          </button>
        </nav>
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <a
            href="/getting-started"
            onClick={onClose}
            className={cn(buttonVariants({ variant: "primary" }), "no-underline")}
          >
            Get started
          </a>
          <a
            href="https://github.com/xoroh/kern"
            className={`${T_BODY_MD} rounded-(--md-sys-shape-corner-small) px-3 py-2 text-center text-(--md-sys-color-on-surface-variant) no-underline hover:bg-(--md-sys-color-surface-container-high)`}
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
