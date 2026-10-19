import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../utils/cn";
import { useColorScheme } from "../web-theme";
import { IconButton, type IconButtonVariant } from "./icon-button";

/**
 * M3 sun icon glyph for light mode destination.
 */
export function SunIcon({ className, ...props }: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

/**
 * M3 crescent moon icon glyph for dark mode destination.
 */
export function MoonIcon({
  className,
  ...props
}: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

export type ThemeToggleProps = Omit<
  ComponentPropsWithRef<"button">,
  "children" | "onChange"
> & {
  /**
   * Current mode when controlled by the host. When omitted, automatically
   * reads and updates the global theme via `useColorScheme()`.
   */
  mode?: "light" | "dark";
  /** Controlled change handler. */
  onToggle?: () => void;
  /** M3 icon button visual variant. Defaults to `"standard"`. */
  variant?: IconButtonVariant;
  /** Accessible name override for the toggle action. */
  label?: string;
  /** Accessible name override when toggled. */
  selectedLabel?: string;
  /** Custom icon to render for the sun / switch to light action. */
  sunIcon?: ReactNode;
  /** Custom icon to render for the moon / switch to dark action. */
  moonIcon?: ReactNode;
  /** Test selector contract. */
  testID?: string;
};

/**
 * M3 `ThemeToggle` — switches color scheme between light and dark.
 *
 * Built on `IconButton` toggle form with M3 state layers, 48dp minimum touch
 * target, and destination-named accessible labels per M3 accessibility
 * guidelines ("Switch to light" while dark, "Switch to dark" while light).
 *
 * Supports both uncontrolled zero-config drop-in (`<ThemeToggle />` backed by
 * `useColorScheme`) and controlled host state (`<ThemeToggle mode={mode} onToggle={fn} />`).
 */
export function ThemeToggle({
  mode: controlledMode,
  onToggle: controlledOnToggle,
  variant = "standard",
  label: customLabel,
  selectedLabel: customSelectedLabel,
  sunIcon,
  moonIcon,
  className,
  testID,
  ...props
}: ThemeToggleProps) {
  const scheme = useColorScheme();
  const isControlled = controlledMode !== undefined;
  const isDark = isControlled
    ? controlledMode === "dark"
    : scheme.resolved === "dark";
  const handleToggle = isControlled ? controlledOnToggle : scheme.toggle;
  const destinationLabel = isDark ? "Switch to light" : "Switch to dark";
  const label = customLabel ?? destinationLabel;
  const selectedLabel = customSelectedLabel ?? label;

  return (
    <IconButton
      data-slot="theme-toggle"
      data-testid={testID}
      variant={variant}
      toggle
      pressed={isDark}
      onPressedChange={handleToggle}
      icon={isDark ? (sunIcon ?? <SunIcon />) : (moonIcon ?? <MoonIcon />)}
      label={label}
      selectedLabel={selectedLabel}
      className={cn("kern-theme-toggle", className)}
      {...props}
    />
  );
}
