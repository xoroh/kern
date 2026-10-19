import type { ComponentPropsWithRef, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { FOCUS_RING_CLASS } from "../components/focus-ring";
import { cn } from "../utils/cn";
import { Link } from "./link";

export type HeroProps = Omit<ComponentPropsWithRef<"section">, "children"> & {
  /** Short context above the main heading. */
  eyebrow: ReactNode;
  /** The page's primary heading. A page should use one Hero. */
  title: ReactNode;
  /** Supporting copy below the heading. */
  lede: ReactNode;
  /** Primary and secondary actions, supplied by the host. */
  actions?: ReactNode;
  /** Optional illustration, preview, or interactive composition. */
  art?: ReactNode;
};

/** Page-opening composition: heading, supporting copy, actions, and optional art. */
export function Hero({
  eyebrow,
  title,
  lede,
  actions,
  art,
  className,
  id,
  ...props
}: HeroProps) {
  const generatedId = useId();
  const titleId = id ? `${id}-title` : `${generatedId}-title`;

  return (
    <section
      data-slot="hero"
      className={cn(
        "kern-hero overflow-hidden rounded-(--sys-shape-corner-extra-large) border border-(--sys-color-outline-variant) bg-(--sys-color-surface-container) text-(--sys-color-on-surface)",
        className,
      )}
      id={id}
      aria-labelledby={props["aria-labelledby"] ?? titleId}
      {...props}
    >
      <div className="grid grid-cols-1 gap-8 p-6 sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14 lg:p-16">
        <div className="min-w-0 py-2">
          <p className="inline-flex items-center rounded-(--sys-shape-corner-full) border border-(--sys-color-outline-variant) px-3 py-1 text-(length:--sys-typescale-label-large-font-size) leading-(--sys-typescale-label-large-line-height) font-(--sys-typescale-label-large-font-weight) tracking-(--sys-typescale-label-large-letter-spacing) text-(--sys-color-on-surface-variant)">
            {eyebrow}
          </p>
          <h1
            id={titleId}
            className="mt-6 max-w-[15ch] text-(length:--sys-typescale-display-medium-font-size) leading-(--sys-typescale-display-medium-line-height) font-(--sys-typescale-display-medium-font-weight) tracking-(--sys-typescale-display-medium-letter-spacing)"
          >
            {title}
          </h1>
          <div className="mt-4 max-w-prose text-(length:--sys-typescale-body-large-font-size) leading-(--sys-typescale-body-large-line-height) text-(--sys-color-on-surface-variant)">
            {lede}
          </div>
          {actions ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {actions}
            </div>
          ) : null}
        </div>
        {art ? <div className="min-w-0">{art}</div> : null}
      </div>
    </section>
  );
}

export type TopBarItem = {
  /** Internal route rendered through `LinkProvider` when one is installed. */
  to: string;
  label: ReactNode;
  /** Match only this route instead of also matching its nested paths. */
  exact?: boolean;
};

export type TopBarProps = Omit<ComponentPropsWithRef<"header">, "children"> & {
  /** Brand or wordmark, linked to `homeTo`. */
  brand: ReactNode;
  /** Primary destinations, rendered in desktop and disclosure navigation. */
  items: readonly TopBarItem[];
  /** Current path used to mark the active destination; routing stays host-owned. */
  activePath?: string;
  /** Home route for the brand link. */
  homeTo?: string;
  /** Optional host actions, such as theme or account controls. */
  actions?: ReactNode;
  /** Accessible name shared by both navigation landmarks. */
  navLabel?: string;
  /** Accessible name of the collapsed navigation control. */
  menuLabel?: string;
  /** Accessible name of the expanded navigation control. */
  closeMenuLabel?: string;
  /** Keep the bar at the viewport top while the page scrolls. */
  sticky?: boolean;
};

function normalizePath(path: string): string {
  const withoutTrailingSlash = path.replace(/\/+$/, "");
  return withoutTrailingSlash || "/";
}

function isActivePath(
  to: string,
  activePath: string | undefined,
  exact: boolean,
) {
  if (!activePath) return false;
  const destination = normalizePath(to);
  const current = normalizePath(activePath);
  return (
    current === destination ||
    (!exact && destination !== "/" && current.startsWith(`${destination}/`))
  );
}

const TOP_BAR_LINK =
  "relative inline-flex min-h-12 items-center rounded-(--sys-shape-corner-full) px-4 text-(length:--sys-typescale-label-large-font-size) leading-(--sys-typescale-label-large-line-height) font-(--sys-typescale-label-large-font-weight) text-(--sys-color-on-surface-variant) outline-none transition-colors duration-(--sys-motion-duration-short3) hover:bg-(--sys-color-surface-tonal) hover:text-(--sys-color-on-surface)";

/** Responsive marketing navigation with a host-owned route and action seam. */
export function TopBar({
  brand,
  items,
  activePath,
  homeTo = "/",
  actions,
  navLabel = "Primary",
  menuLabel = "Open navigation",
  closeMenuLabel = "Close navigation",
  sticky = true,
  className,
  ...props
}: TopBarProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => document.removeEventListener("keydown", handleDocumentKeyDown);
  }, [open]);

  const brandActive = activePath
    ? normalizePath(activePath) === normalizePath(homeTo)
    : false;

  return (
    <header
      data-slot="top-bar"
      className={cn(
        "kern-top-bar z-50 border-b border-(--sys-color-outline-variant) bg-(--sys-color-surface)/95 text-(--sys-color-on-surface) backdrop-blur",
        sticky ? "sticky top-0" : "relative",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link
          to={homeTo}
          aria-current={brandActive ? "page" : undefined}
          className={cn(
            "mr-2 inline-flex min-h-12 shrink-0 items-center gap-2 rounded-(--sys-shape-corner-full) px-2 text-(length:--sys-typescale-title-large-font-size) leading-(--sys-typescale-title-large-line-height) font-(--sys-typescale-title-large-font-weight) text-(--sys-color-on-surface) no-underline outline-none",
            FOCUS_RING_CLASS,
          )}
        >
          {brand}
        </Link>

        <nav aria-label={navLabel} className="hidden min-w-0 flex-1 lg:block">
          <ul className="flex items-center gap-0.5">
            {items.map((item) => {
              const active = isActivePath(
                item.to,
                activePath,
                item.exact ?? false,
              );
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      TOP_BAR_LINK,
                      FOCUS_RING_CLASS,
                      active && "text-(--sys-color-primary)",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          {actions}
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={open ? closeMenuLabel : menuLabel}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
            className={cn(
              "inline-flex size-12 items-center justify-center rounded-(--sys-shape-corner-full) text-(--sys-color-on-surface-variant) outline-none transition-colors duration-(--sys-motion-duration-short3) hover:bg-(--sys-color-surface-tonal) hover:text-(--sys-color-on-surface) lg:hidden",
              FOCUS_RING_CLASS,
            )}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              className="size-6"
            >
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        aria-label={navLabel}
        hidden={!open}
        className="border-t border-(--sys-color-outline-variant) px-4 py-2 sm:px-6 lg:hidden"
      >
        <ul className="mx-auto w-full max-w-7xl">
          {items.map((item) => {
            const active = isActivePath(
              item.to,
              activePath,
              item.exact ?? false,
            );
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    TOP_BAR_LINK,
                    FOCUS_RING_CLASS,
                    "w-full",
                    active && "text-(--sys-color-primary)",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export type SiteFooterLink = {
  label: ReactNode;
  detail?: ReactNode;
} & ({ to: string; href?: never } | { href: string; to?: never });

export type SiteFooterGroup = {
  /** Optional stable id; group headings should otherwise be unique. */
  id?: string;
  heading: string;
  links: readonly SiteFooterLink[];
};

export type SiteFooterProps = Omit<
  ComponentPropsWithRef<"footer">,
  "children"
> & {
  /** Wordmark or other brand lockup. */
  brand: ReactNode;
  /** Short product or organization description. */
  summary?: ReactNode;
  /** Named navigation groups. `to` links use the host `LinkProvider`. */
  groups: readonly SiteFooterGroup[];
  /** Optional legal or copyright line beneath the navigation. */
  legal?: ReactNode;
  /** Optional content aligned opposite `legal`. */
  trailing?: ReactNode;
};

const FOOTER_LINK =
  "inline-flex min-h-11 items-center rounded-(--sys-shape-corner-small) text-(length:--sys-typescale-body-medium-font-size) leading-(--sys-typescale-body-medium-line-height) text-(--sys-color-on-surface-variant) no-underline outline-none transition-colors duration-(--sys-motion-duration-short3) hover:text-(--sys-color-on-surface)";

function FooterLinkContent({ item }: { item: SiteFooterLink }) {
  return item.detail ? (
    <span className="flex flex-col items-start justify-center leading-tight">
      <span>{item.label}</span>
      <span className="sr-only">, </span>
      <span className="text-(length:--sys-typescale-body-small-font-size) text-(--sys-color-on-surface-variant)">
        {item.detail}
      </span>
    </span>
  ) : (
    item.label
  );
}

function slugifyHeading(heading: string): string {
  const slug = heading
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "group";
}

/** Multi-column site footer with data-driven, router-compatible link groups. */
export function SiteFooter({
  brand,
  summary,
  groups,
  legal,
  trailing,
  className,
  ...props
}: SiteFooterProps) {
  const id = useId();

  return (
    <footer
      data-slot="site-footer"
      className={cn(
        "kern-site-footer border-t border-(--sys-color-outline-variant) bg-(--sys-color-surface-container-low) text-(--sys-color-on-surface)",
        className,
      )}
      {...props}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="min-w-0">
          <div className="text-(length:--sys-typescale-title-large-font-size) leading-(--sys-typescale-title-large-line-height) font-(--sys-typescale-title-large-font-weight)">
            {brand}
          </div>
          {summary ? (
            <div className="mt-3 max-w-prose text-(length:--sys-typescale-body-medium-font-size) leading-(--sys-typescale-body-medium-line-height) text-(--sys-color-on-surface-variant)">
              {summary}
            </div>
          ) : null}
        </div>

        {groups.map((group) => {
          const headingId = `${id}-group-${group.id ?? slugifyHeading(group.heading)}`;
          return (
            <nav key={group.id ?? group.heading} aria-labelledby={headingId}>
              <h2
                id={headingId}
                className="text-(length:--sys-typescale-label-large-font-size) leading-(--sys-typescale-label-large-line-height) font-(--sys-typescale-label-large-font-weight) text-(--sys-color-on-surface-variant)"
              >
                {group.heading}
              </h2>
              <ul className="mt-2">
                {group.links.map((item) => {
                  const content = <FooterLinkContent item={item} />;
                  const linkClass = cn(
                    FOOTER_LINK,
                    FOCUS_RING_CLASS,
                    item.detail && "flex-col items-start justify-center py-2",
                  );
                  return (
                    <li key={item.to ?? item.href}>
                      {item.to ? (
                        <Link to={item.to} className={linkClass}>
                          {content}
                        </Link>
                      ) : (
                        <a href={item.href} className={linkClass}>
                          {content}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          );
        })}
      </div>

      {legal || trailing ? (
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-(--sys-color-outline-variant) px-4 py-6 text-(length:--sys-typescale-body-small-font-size) leading-(--sys-typescale-body-small-line-height) text-(--sys-color-on-surface-variant) sm:px-6 lg:px-8">
          {legal ? <div>{legal}</div> : null}
          {trailing ? <div>{trailing}</div> : null}
        </div>
      ) : null}
    </footer>
  );
}
