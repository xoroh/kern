import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../utils/cn";

/** M3 search bar: leading icon slot + input + trailing actions. */
export function SearchBar({
  leading,
  trailing,
  className,
  children,
  ...props
}: ComponentPropsWithRef<"form"> & {
  leading?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <form
      data-slot="search-bar"
      className={cn(
        "kern-search-bar flex h-12 items-center gap-2 rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-surface-container-high) px-4 text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    >
      {leading ? (
        <span aria-hidden="true" className="flex shrink-0 items-center">
          {leading}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 items-center">{children}</span>
      {trailing ? (
        <span className="flex shrink-0 items-center gap-1">{trailing}</span>
      ) : null}
    </form>
  );
}

/** One settings row: label + supporting text + trailing control slot. */
export function SettingsRow({
  label,
  supporting,
  trailing,
  className,
  ...props
}: Omit<ComponentPropsWithRef<"div">, "children"> & {
  label: ReactNode;
  supporting?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div
      data-slot="settings-row"
      className={cn(
        "kern-settings-row flex min-h-14 items-center gap-4 px-4 py-3 text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-medium">{label}</span>
        {supporting ? (
          <span className="text-xs text-(--md-sys-color-on-surface-variant)">
            {supporting}
          </span>
        ) : null}
      </span>
      {trailing ? (
        <span className="flex shrink-0 items-center">{trailing}</span>
      ) : null}
    </div>
  );
}

/** Status bar strip: leading + centered status + trailing slots. */
export function StatusBar({
  leading,
  trailing,
  className,
  children,
  ...props
}: ComponentPropsWithRef<"div"> & {
  leading?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div
      data-slot="status-bar"
      className={cn(
        "kern-status-bar flex h-8 items-center gap-3 border-t border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) px-3 text-xs text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    >
      {leading ? (
        <span className="flex items-center gap-2">{leading}</span>
      ) : null}
      <span className="flex min-w-0 flex-1 items-center justify-center">
        {children}
      </span>
      {trailing ? (
        <span className="flex items-center gap-2">{trailing}</span>
      ) : null}
    </div>
  );
}

/** Toggles light/dark; the host owns the actual mode state. */
export function ThemeToggle({
  mode,
  onToggle,
  className,
  ...props
}: Omit<ComponentPropsWithRef<"button">, "children" | "onChange"> & {
  mode: "light" | "dark";
  onToggle: () => void;
}) {
  return (
    <button
      data-slot="theme-toggle"
      type="button"
      aria-label={mode === "dark" ? "Switch to light" : "Switch to dark"}
      className={cn(
        "kern-theme-toggle inline-flex h-10 w-10 items-center justify-center rounded-(--md-sys-shape-corner-full) text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-tonal) focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) outline-none",
        className,
      )}
      onClick={onToggle}
      {...props}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {mode === "dark" ? "☾" : "☀"}
      </span>
    </button>
  );
}

/** Toggles standard/high contrast; the host owns the contrast state. */
export function ContrastToggle({
  contrast,
  onToggle,
  className,
  ...props
}: Omit<ComponentPropsWithRef<"button">, "children" | "onChange"> & {
  contrast: "standard" | "high";
  onToggle: () => void;
}) {
  return (
    <button
      data-slot="contrast-toggle"
      type="button"
      aria-label={
        contrast === "high" ? "Use standard contrast" : "Use high contrast"
      }
      className={cn(
        "kern-contrast-toggle inline-flex h-10 w-10 items-center justify-center rounded-(--md-sys-shape-corner-full) text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-tonal) focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) outline-none",
        className,
      )}
      onClick={onToggle}
      {...props}
    >
      <span aria-hidden="true" className="text-base leading-none">
        Aa
      </span>
    </button>
  );
}
