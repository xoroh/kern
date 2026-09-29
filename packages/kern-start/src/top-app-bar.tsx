import { cn } from "@xoroh/kern";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { Link } from "./link";

export type TopAppBarSize = "small" | "medium" | "large";

const SIZES: Record<TopAppBarSize, string> = {
  small: "h-14 items-center",
  medium: "h-24 items-end pb-3",
  large: "h-28 items-end pb-4",
};

/** M3 top app bar: leading slot, title, trailing actions. */
export function TopAppBar({
  size = "small",
  leading,
  trailing,
  className,
  children,
  ...props
}: Omit<ComponentPropsWithRef<"header">, "title"> & {
  size?: TopAppBarSize;
  leading?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header
      data-slot="top-app-bar"
      className={cn(
        "kern-top-app-bar sticky top-0 z-10 flex w-full gap-2 border-b border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) px-2 text-(--md-sys-color-on-surface)",
        SIZES[size],
        className,
      )}
      {...props}
    >
      {leading ? (
        <span className="flex shrink-0 items-center">{leading}</span>
      ) : null}
      <span
        className={cn(
          "min-w-0 flex-1 truncate",
          size === "small"
            ? "text-base font-medium"
            : "px-2 text-2xl font-medium",
        )}
      >
        {children}
      </span>
      {trailing ? (
        <span className="flex shrink-0 items-center gap-1">{trailing}</span>
      ) : null}
    </header>
  );
}

/** Leading button that opens/closes the shell's rail or drawer. */
export function TopAppBarToggle({
  open,
  onToggle,
  className,
  ...props
}: Omit<ComponentPropsWithRef<"button">, "children" | "onChange"> & {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      data-slot="top-app-bar-toggle"
      type="button"
      aria-label={open ? "Close navigation" : "Open navigation"}
      aria-expanded={open}
      className={cn(
        "kern-top-app-bar-toggle inline-flex h-10 w-10 items-center justify-center rounded-(--md-sys-shape-corner-full) hover:bg-(--md-sys-color-surface-tonal) focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) outline-none",
        className,
      )}
      onClick={onToggle}
      {...props}
    >
      <span aria-hidden="true" className="text-base leading-none">
        ☰
      </span>
    </button>
  );
}

/** Product top bar: wordmark, context switcher, action menus. */
export function AppTopBar({
  wordmark,
  context,
  actions,
  leading,
  className,
  ...props
}: Omit<ComponentPropsWithRef<"header">, "title"> & {
  wordmark: ReactNode;
  context?: ReactNode;
  actions?: ReactNode;
  leading?: ReactNode;
}) {
  return (
    <TopAppBar
      size="small"
      leading={leading}
      trailing={actions}
      className={cn("kern-app-top-bar", className)}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="shrink-0 font-semibold">{wordmark}</span>
        {context ? (
          <span className="flex min-w-0 items-center truncate rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-surface-tonal) px-3 py-1 text-sm">
            {context}
          </span>
        ) : null}
      </span>
    </TopAppBar>
  );
}

/** Menu shell for top-bar actions: trigger button + dropdown panel. */
export function TopBarMenu({
  label,
  trigger,
  children,
  className,
  ...props
}: Omit<ComponentPropsWithRef<"div">, "children"> & {
  label: string;
  trigger?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      data-slot="top-bar-menu"
      data-open="false"
      className={cn("kern-top-bar-menu relative inline-block", className)}
      {...props}
    >
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-(--md-sys-shape-corner-full) text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-tonal) focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) outline-none"
      >
        {trigger ?? <span aria-hidden="true">⋯</span>}
      </button>
      <div
        role="menu"
        aria-label={label}
        className="absolute end-0 top-12 z-20 min-w-56 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) p-2 shadow-(--md-sys-elevation-level2)"
      >
        {children}
      </div>
    </div>
  );
}

export type TopBarMenuItem = {
  id: string;
  label: ReactNode;
  href?: string;
  onSelect?: () => void;
};

function MenuItems({ items }: { items: TopBarMenuItem[] }) {
  return (
    <>
      {items.map((item) =>
        item.href ? (
          <Link
            key={item.id}
            to={item.href}
            role="menuitem"
            className="block rounded-(--md-sys-shape-corner-small) px-3 py-2 text-sm text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-tonal)"
          >
            {item.label}
          </Link>
        ) : (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            onClick={item.onSelect}
            className="block w-full rounded-(--md-sys-shape-corner-small) px-3 py-2 text-start text-sm text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-tonal)"
          >
            {item.label}
          </button>
        ),
      )}
    </>
  );
}

/** Apps launcher menu — app injects its own items. */
export function AppsMenu({
  items,
  ...props
}: Omit<ComponentPropsWithRef<typeof TopBarMenu>, "label" | "children"> & {
  items: TopBarMenuItem[];
}) {
  return (
    <TopBarMenu label="Apps" {...props}>
      <MenuItems items={items} />
    </TopBarMenu>
  );
}

/** Help menu — app injects its own items. */
export function HelpMenu({
  items,
  ...props
}: Omit<ComponentPropsWithRef<typeof TopBarMenu>, "label" | "children"> & {
  items: TopBarMenuItem[];
}) {
  return (
    <TopBarMenu label="Help" {...props}>
      <MenuItems items={items} />
    </TopBarMenu>
  );
}

/** Notifications menu — app injects its own feed and actions. */
export function NotificationsMenu({
  items,
  empty,
  ...props
}: Omit<ComponentPropsWithRef<typeof TopBarMenu>, "label" | "children"> & {
  items: TopBarMenuItem[];
  empty?: ReactNode;
}) {
  return (
    <TopBarMenu label="Notifications" {...props}>
      {items.length === 0 && empty ? (
        <p className="px-3 py-2 text-sm text-(--md-sys-color-on-surface-variant)">
          {empty}
        </p>
      ) : (
        <MenuItems items={items} />
      )}
    </TopBarMenu>
  );
}

/** User menu — app injects identity content and actions. */
export function UserMenu({
  items,
  identity,
  ...props
}: Omit<ComponentPropsWithRef<typeof TopBarMenu>, "label" | "children"> & {
  items: TopBarMenuItem[];
  identity?: ReactNode;
}) {
  return (
    <TopBarMenu label="User menu" {...props}>
      {identity ? (
        <div className="border-b border-(--md-sys-color-outline-variant) px-3 py-2 text-sm">
          {identity}
        </div>
      ) : null}
      <MenuItems items={items} />
    </TopBarMenu>
  );
}
