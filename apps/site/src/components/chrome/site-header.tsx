/**
 * Site header — the primary chrome on every page.
 *
 * A sticky h-14 bar: the K mark, the primary tabs, and a right cluster with
 * the version pill (promoted from the footer), a visible ⌘K button, the
 * GitHub link, the theme toggle, and the Get-started CTA. Below lg the tabs
 * collapse behind a hamburger that opens the mobile drawer — there is exactly
 * one navigation list per viewport, never tabs-plus-menu at once.
 *
 * The tab destinations are the hub paths: Foundations, Patterns, and
 * Playground land with the hub migration (step 3); Components and Showcase
 * resolve today. The shared hub list lives in app-rail.tsx — the header
 * does not map the docs section.
 */
import { useLocation } from "@tanstack/react-router";
import { buttonVariants, cn, Kbd, useKernTheme } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import { useRef, useState } from "react";
import { T_LABEL_LG } from "../../systems/type-scale";
import { isActivePath } from "./app-rail";
import { GitHubIcon } from "./github-icon";
import { MobileDrawer } from "./mobile-drawer";
import { openSearch } from "./search-palette";
import { VersionSelector } from "./version-selector";

/** The primary destinations, in header order. The drawer reads the same list. */
export const PRIMARY_TABS: { href: string; label: string }[] = [
  { href: "/foundations", label: "Foundations" },
  { href: "/components", label: "Components" },
  { href: "/patterns", label: "Patterns" },
  { href: "/playground", label: "Playground" },
  { href: "/showcase", label: "Showcase" },
];

// Every header icon button shares the rhythm: 36px target, variant ink, a
// focus-visible ring in the focus role — keyboard readers get the same
// affordance as pointer readers.
const ICON_BUTTON =
  "inline-flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high) hover:text-(--md-sys-color-on-surface) focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-(--md-sys-color-secondary)";

export function SiteHeader() {
  const { pathname } = useLocation();
  const { mode, toggle } = useKernTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-1 border-b border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) px-3 sm:px-4">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-expanded={drawerOpen}
        aria-label="Open navigation menu"
        className={cn(ICON_BUTTON, "lg:hidden")}
      >
        <Icon name="menu" size={20} />
      </button>
      <a
        href="/"
        aria-label="Kern home"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) no-underline"
      >
        <span className={T_LABEL_LG}>K</span>
      </a>
      <nav aria-label="Primary" className="ml-2 hidden items-center lg:flex">
        {PRIMARY_TABS.map((tab) => {
          const active = isActivePath(pathname, tab.href);
          return (
            <a
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-(--md-sys-shape-corner-full) px-3 py-2 no-underline",
                active
                  ? `bg-(--md-sys-color-secondary-container) ${T_LABEL_LG} text-(--md-sys-color-on-secondary-container)`
                  : `${T_LABEL_LG} text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high) hover:text-(--md-sys-color-on-surface)`,
              )}
            >
              {tab.label}
            </a>
          );
        })}
      </nav>
      <div className="ml-auto flex items-center gap-1">
        <span className="mr-1 hidden md:inline-flex">
          <VersionSelector />
        </span>
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search (Command K)"
          className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-(--md-sys-shape-corner-full) border-0 bg-(--md-sys-color-surface-container-high) px-3 text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-highest)"
        >
          <Icon name="search" size={16} />
          <span className={`hidden ${T_LABEL_LG} sm:inline`}>Search</span>
          <Kbd>⌘K</Kbd>
        </button>
        <a
          href="https://github.com/xoroh/kern"
          aria-label="Kern on GitHub"
          title="GitHub"
          className={cn(ICON_BUTTON, "hidden sm:inline-flex")}
        >
          <GitHubIcon />
        </a>
        <button
          type="button"
          onClick={toggle}
          aria-label={
            mode === "light" ? "Switch to dark theme" : "Switch to light theme"
          }
          title={mode === "light" ? "Dark" : "Light"}
          className={ICON_BUTTON}
        >
          <Icon
            name={mode === "light" ? "dark-mode" : "light-mode"}
            size={20}
          />
        </button>
        <a
          href="/getting-started"
          className={cn(
            buttonVariants({ variant: "primary" }),
            "ml-1 hidden no-underline sm:inline-flex",
          )}
        >
          Get started
        </a>
      </div>
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        triggerRef={menuButtonRef}
      />
    </header>
  );
}
