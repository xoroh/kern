/**
 * Site chrome — built on the real `@xoroh/kern/start` scaffold.
 *
 * The navigation rail and its destinations are the shipped /kern/start
 * components, not markup copied from them: this is the site's proof that
 * /kern/start works outside its own test suite. The host router's link reaches
 * it through `LinkProvider`, the seam /kern/start provides for exactly this
 * case, and the glyphs come from `@xoroh/kern-icons`.
 *
 * Three viewport tiers, stated once so they stay deliberate:
 * - <768px (below md): the rail is hidden; MobileBar carries Search, Docs,
 *   a menu of every destination below, and the theme toggle.
 * - 768–1024px (md to lg): the icon-only rail shows; the docs sidebar stays
 *   hidden and SiteLayout renders the "On this page" disclosure instead.
 * - 1024px and up (lg): rail plus the full docs sidebar tree.
 */
import { useLocation } from "@tanstack/react-router";
import { cn, useKernTheme } from "@xoroh/kern";
import {
  type LinkComponent,
  LinkProvider,
  NavigationRail,
  NavigationRailButton,
} from "@xoroh/kern/start";
import { Icon, type IconSemantic } from "@xoroh/kern-icons";
import { useState } from "react";
import { T_BODY_MD, T_LABEL_LG, T_LEAD } from "../../systems/type-scale";
import { openSearch } from "./search-palette";

/**
 * Every top-level destination, in rail order. The mobile menu reads the same
 * list, so a destination added here is reachable on every viewport — there
 * are no rail-only or menu-only pages. Labels stay single-word where the
 * rail's 64px column would wrap them ("Configurator" for the theme
 * configurator); the page itself carries the full title.
 */
export const RAIL_ITEMS: { href: string; label: string; icon: IconSemantic }[] =
  [
    { href: "/", label: "Home", icon: "home" },
    { href: "/docs", label: "Docs", icon: "info" },
    { href: "/components", label: "Components", icon: "work" },
    { href: "/theme", label: "Theme", icon: "favorite" },
    { href: "/theme-configurator", label: "Configurator", icon: "settings" },
    { href: "/showcase", label: "Showcase", icon: "image" },
    { href: "/getting-started", label: "Start", icon: "check" },
    { href: "/changelog", label: "Changelog", icon: "refresh" },
  ];

function isActivePath(pathname: string, href: string): boolean {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

/** Host router seam: /kern/start renders every `to` through this component. */
const RouterLink: LinkComponent = ({ to, href, ...props }) => (
  <a href={href ?? to} {...props} />
);

/** M3 navigation rail, rendered by /kern/start. */
export function AppRail() {
  const { pathname } = useLocation();
  const { mode, toggle } = useKernTheme();
  return (
    <LinkProvider component={RouterLink}>
      <div
        className="fixed inset-y-0 left-0 z-50 hidden md:block"
        data-chrome="rail"
      >
        {/* Eight destinations plus search no longer fit a short viewport at
            56px a row, so the rail scrolls internally rather than clipping the
            theme toggle off the bottom. */}
        <NavigationRail
          aria-label="Primary"
          className="overflow-y-auto"
          header={
            <a
              href="/"
              aria-label="Kern home"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) no-underline"
            >
              <span className={T_LABEL_LG}>K</span>
            </a>
          }
        >
          {RAIL_ITEMS.map((item) => (
            <NavigationRailButton
              key={item.href}
              href={item.href}
              label={item.label}
              icon={<Icon name={item.icon} size={20} />}
              active={isActivePath(pathname, item.href)}
            />
          ))}
          <NavigationRailButton
            icon={<Icon name="search" size={20} />}
            label="Search (⌘K)"
            onSelect={openSearch}
          />
          <div className="mt-auto flex flex-col items-center gap-2 pt-4">
            <a
              href="https://github.com/xoroh/kern"
              title="GitHub"
              className="flex h-8 w-14 items-center justify-center rounded-full text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-tonal)"
            >
              <Icon name="code" size={20} />
            </a>
            <NavigationRailButton
              icon={
                <Icon
                  name={mode === "light" ? "dark-mode" : "light-mode"}
                  size={20}
                />
              }
              label={mode === "light" ? "Dark" : "Light"}
              onSelect={toggle}
            />
          </div>
        </NavigationRail>
      </div>
    </LinkProvider>
  );
}

/** The narrow-screen bar. Uses the same icon set and destination list as the rail. */
export function MobileBar() {
  const { pathname } = useLocation();
  const { mode, toggle } = useKernTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="flex h-14 items-center justify-between px-4 md:hidden">
      <a
        href="/"
        className={`flex items-center gap-2 ${T_LEAD} text-(--md-sys-color-on-surface) no-underline`}
      >
        <span
          aria-hidden="true"
          className="inline-block size-2.5 rounded-full bg-(--md-sys-color-primary)"
        />
        Kern
      </a>
      <nav className="flex items-center gap-1" aria-label="Primary">
        <button
          type="button"
          onClick={openSearch}
          className={`inline-flex h-8 cursor-pointer items-center justify-center rounded-(--md-sys-shape-corner-full) border-0 bg-(--md-sys-color-surface-tonal) px-3 ${T_LABEL_LG} text-(--md-sys-color-on-surface)`}
          aria-label="Search (Command K)"
        >
          Search
        </button>
        <a
          href="/docs"
          aria-current={isActivePath(pathname, "/docs") ? "page" : undefined}
          className={`inline-flex h-8 items-center justify-center rounded-(--md-sys-shape-corner-full) px-3 ${T_LABEL_LG} text-(--md-sys-color-on-surface) no-underline`}
        >
          Docs
        </a>
        <button
          type="button"
          onClick={toggle}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-(--md-sys-color-surface-tonal) border-0"
          aria-label={
            mode === "light" ? "Switch to dark theme" : "Switch to light theme"
          }
        >
          <Icon
            name={mode === "light" ? "dark-mode" : "light-mode"}
            size={16}
          />
        </button>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-(--md-sys-color-surface-tonal) border-0 text-(--md-sys-color-on-surface)"
        >
          <Icon name={menuOpen ? "close" : "menu"} size={16} />
        </button>
      </nav>
      {menuOpen ? (
        <nav
          id="mobile-menu"
          aria-label="Site"
          onKeyDown={(e) => {
            if (e.key === "Escape") setMenuOpen(false);
          }}
          className="fixed inset-x-0 top-14 z-40 border-b border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) px-4 pt-2 pb-4 shadow-(--md-sys-elevation-level2)"
        >
          <ul className="m-0 flex list-none flex-col p-0">
            {RAIL_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href} className="m-0 p-0">
                  <a
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-(--md-sys-shape-corner-small) px-3 py-2.5 no-underline",
                      active
                        ? `bg-(--md-sys-color-secondary-container) ${T_LABEL_LG} text-(--md-sys-color-on-secondary-container)`
                        : `${T_BODY_MD} text-(--md-sys-color-on-surface)`,
                    )}
                  >
                    <Icon name={item.icon} size={20} />
                    {item.label}
                  </a>
                </li>
              );
            })}
            <li className="m-0 p-0">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openSearch();
                }}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-(--md-sys-shape-corner-small) border-0 bg-transparent px-3 py-2.5 ${T_BODY_MD} text-(--md-sys-color-on-surface)`}
              >
                <Icon name="search" size={20} />
                Search (⌘K)
              </button>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
