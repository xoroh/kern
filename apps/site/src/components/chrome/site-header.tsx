/**
 * Site header — the M3 top app bar, on every page.
 *
 * Responsive utility bar: 80px desktop, 64px phone, in four beats:
 *
 *   1. Hamburger (below lg) + brand lockup — the K mark and wordmark link
 *      home; there is no Home tab (m3.material.io and MUI both lead with
 *      the brand instead).
 *   2. Desktop primary navigation stays in the top header; below lg the same
 *      destination model lives in the mobile drawer.
 *   3. Utilities — the version pill (single instance; the footer no longer
 *      repeats it), the search FIELD (not a button: surface-container-high
 *      pill with a leading icon, hinted text, and the ⌘K key cap), GitHub,
 *      and the theme toggle.
 *   4. The Get-started CTA — the one filled action in the bar.
 *
 * Every chrome icon target is 48dp, every color is a role, and the desktop
 * tabs and mobile drawer are mutually exclusive navigation surfaces.
 */
import { useLocation } from "@tanstack/react-router";
import { buttonVariants, cn, Kbd, useKernTheme } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import { useEffect, useRef, useState } from "react";
import { T_LABEL_LG, T_SUB } from "../../domains/shared/systems/type-scale";
import {
  FOCUS_RING,
  ICON_BUTTON,
  PILL_ACTIVE,
  PILL_REST,
  STATE_LAYERS,
  TRANSITION,
} from "../../domains/shared/systems/ui";
import { isTabActive, PRIMARY_TABS } from "./app-rail";
import { GitHubIcon } from "./github-icon";
import { MobileDrawer } from "./mobile-drawer";
import { openSearch } from "./search-palette";
import { VersionSelector } from "./version-selector";

/** Brand mark + wordmark — the home link. */
const BRAND = `flex shrink-0 items-center gap-2 rounded-(--sys-shape-corner-full) px-2 py-1 text-(--sys-color-on-surface) no-underline ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING}`;

export function SiteHeader() {
  const { pathname } = useLocation();
  const { mode, toggle } = useKernTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  // The hint shows the chord that works HERE: ⌘K on macOS, Ctrl K
  // elsewhere (the review caught a bare ⌘K hint on Linux). Post-mount so
  // SSR keeps one face and hydration never mismatches. The accessible name
  // below stays exactly "Search (Command K)" — the e2e suite matches it
  // exactly and lives outside this PR's paths.
  const [mac, setMac] = useState(true);
  useEffect(() => {
    setMac(
      /mac/i.test(navigator.platform ?? "") || /mac/i.test(navigator.userAgent),
    );
  }, []);

  return (
    <header className="site-header z-50 flex shrink-0 items-center gap-1 px-3 sm:px-6">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-expanded={drawerOpen}
        aria-label="Open navigation menu"
        className={cn(ICON_BUTTON, "lg:hidden")}
      >
        <Icon name="menu" size={24} />
      </button>

      <a href="/" aria-label="Kern home" className={BRAND}>
        <span
          aria-hidden="true"
          className="flex size-10 items-center justify-center rounded-(--sys-shape-corner-large) bg-(--sys-color-primary) text-(--sys-color-on-primary)"
        >
          <span className={T_SUB}>K</span>
        </span>
        <span className={T_SUB}>
          Kern<span className="text-(--sys-color-primary)">.</span>
        </span>
      </a>

      <nav
        aria-label="Primary"
        className="ml-4 hidden items-center gap-1 lg:flex"
      >
        {PRIMARY_TABS.map((tab) => {
          const active = isTabActive(pathname, tab);
          return (
            <a
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                `inline-flex min-h-12 items-center px-5 no-underline ${T_LABEL_LG} ${TRANSITION}`,
                active ? PILL_ACTIVE : PILL_REST,
              )}
            >
              {tab.label}
            </a>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-1">
        <span className="mr-1 hidden xl:inline-flex">
          <VersionSelector />
        </span>

        {/* Search is a FIELD, not a button: the M3 search-bar shape —
            tonal pill, leading icon, hinted text, key cap. Icon-only below
            sm, where the hint would crowd the bar. */}
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search (Command K)"
          className={cn(
            `inline-flex h-12 min-w-12 cursor-pointer items-center justify-center gap-2 rounded-(--sys-shape-corner-full) border-0 bg-(--sys-color-surface-container-high) px-3 text-(--sys-color-on-surface-variant) ${STATE_LAYERS} ${TRANSITION} sm:justify-start sm:px-4`,
            FOCUS_RING,
          )}
        >
          <Icon name="search" size={20} />
          <span className={`hidden sm:inline ${T_LABEL_LG}`}>Search</span>
          <span className="hidden sm:inline-flex">
            <Kbd>{mac ? "⌘K" : "Ctrl K"}</Kbd>
          </span>
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
            size={22}
          />
        </button>

        <a
          href="/docs/getting-started"
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
