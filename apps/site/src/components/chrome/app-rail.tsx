/**
 * Site chrome — built on the real `@xoroh/kern/start` scaffold.
 *
 * The navigation rail and its destinations are the shipped /kern/start
 * components, not markup copied from them: this is the site's proof that
 * /kern/start works outside its own test suite. The host router's link reaches
 * it through `LinkProvider`, the seam /kern/start provides for exactly this
 * case, and the glyphs come from `@xoroh/kern-icons`.
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
import { openSearch } from "./search-palette";

const ITEMS: { href: string; label: string; icon: IconSemantic }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/docs", label: "Docs", icon: "info" },
  { href: "/components", label: "Components", icon: "work" },
  { href: "/theme", label: "Theme", icon: "favorite" },
  { href: "/getting-started", label: "Start", icon: "check" },
];

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
      <div className="fixed inset-y-0 left-0 z-50 hidden md:block">
        <NavigationRail
          aria-label="Primary"
          header={
            <a
              href="/"
              aria-label="Kern home"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) no-underline"
            >
              <span className="text-sm font-bold">K</span>
            </a>
          }
        >
          {ITEMS.map((item) => (
            <NavigationRailButton
              key={item.href}
              href={item.href}
              label={item.label}
              icon={<Icon name={item.icon} size={20} />}
              active={
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)
              }
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
              icon={<Icon name="settings" size={20} />}
              label={mode === "light" ? "Dark" : "Light"}
              onSelect={toggle}
            />
          </div>
        </NavigationRail>
      </div>
    </LinkProvider>
  );
}

/** The narrow-screen bar. Uses the same icon set as the rail. */
export function MobileBar() {
  const { mode, toggle } = useKernTheme();
  return (
    <header className="flex h-14 items-center justify-between px-4 md:hidden">
      <a
        href="/"
        className="flex items-center gap-2 font-semibold text-(--md-sys-color-on-surface) no-underline"
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
          className="inline-flex h-8 cursor-pointer items-center justify-center rounded-(--md-sys-shape-corner-full) border-0 bg-(--md-sys-color-surface-tonal) px-3 text-[13px] font-medium text-(--md-sys-color-on-surface)"
          aria-label="Search (Command K)"
        >
          Search
        </button>
        <a
          href="/components"
          className={cn(
            "inline-flex h-8 items-center justify-center rounded-(--md-sys-shape-corner-full) px-3 text-[13px] font-medium text-(--md-sys-color-on-surface) no-underline",
          )}
        >
          Components
        </a>
        <button
          type="button"
          onClick={toggle}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-(--md-sys-color-surface-tonal) border-0"
          aria-label={
            mode === "light" ? "Switch to dark theme" : "Switch to light theme"
          }
        >
          <Icon name="favorite" size={16} />
        </button>
      </nav>
    </header>
  );
}
