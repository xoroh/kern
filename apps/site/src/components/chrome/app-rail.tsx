/**
 * Docs-context rail — built on the real `@xoroh/kern/start` scaffold.
 *
 * This rail used to be the site's primary chrome. The sticky SiteHeader owns
 * that job now (primary tabs, search, theme, CTA on every page); the rail
 * stays for the docs-context pages only, where the sidebar tree needs a
 * top-level companion. It still renders the shipped /kern/start components,
 * not markup copied from them: this is the site's proof that /kern/start
 * works outside its own test suite. The host router's link reaches it through
 * `LinkProvider`, the seam /kern/start provides for exactly this case, and
 * the glyphs come from `@xoroh/kern-icons`.
 *
 * Below md the rail is hidden and the header hamburger carries every
 * destination through the mobile drawer instead.
 */
import { useLocation } from "@tanstack/react-router";
import { useKernTheme } from "@xoroh/kern";
import {
  type LinkComponent,
  LinkProvider,
  NavigationRail,
  NavigationRailButton,
} from "@xoroh/kern/start";
import { Icon, type IconSemantic } from "@xoroh/kern-icons";
import { T_LABEL_LG } from "../../systems/type-scale";
import { GitHubIcon } from "./github-icon";
import { openSearch } from "./search-palette";

/**
 * Every docs-context destination, in rail order. The header and drawer read
 * their own lists; this one stays because check-nav counts the rail as a
 * chrome surface that keeps these routes reachable.
 */
export const RAIL_ITEMS: { href: string; label: string; icon: IconSemantic }[] =
  [
    { href: "/", label: "Home", icon: "home" },
    { href: "/docs", label: "Docs", icon: "info" },
    { href: "/components", label: "Components", icon: "work" },
    { href: "/foundations", label: "Foundations", icon: "favorite" },
    { href: "/theme-configurator", label: "Configurator", icon: "settings" },
    { href: "/showcase", label: "Showcase", icon: "image" },
    { href: "/getting-started", label: "Start", icon: "check" },
    { href: "/changelog", label: "Changelog", icon: "refresh" },
  ];

/** Active-path matching, shared with the header and drawer. */
export function isActivePath(pathname: string, href: string): boolean {
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
              aria-label="Kern on GitHub"
              title="GitHub"
              className="flex h-8 w-14 items-center justify-center rounded-full text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-tonal) focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-(--md-sys-color-secondary)"
            >
              <GitHubIcon />
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
