import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type ToolbarRootProps = ComponentProps<typeof ToolbarPrimitive.Root>;
export type ToolbarButtonProps = ComponentProps<typeof ToolbarPrimitive.Button>;
export type ToolbarSeparatorProps = ComponentProps<
  typeof ToolbarPrimitive.Separator
>;
export type ToolbarGroupProps = ComponentProps<typeof ToolbarPrimitive.Group>;

export function ToolbarRoot({
  className,
  variant = "standard",
  orientation = "horizontal",
  layout = "floating",
  ...props
}: ToolbarRootProps & {
  /**
   * M3 color style: `standard`, or `vibrant` (primary-container fill) for
   * greater emphasis.
   */
  variant?: "standard" | "vibrant";
  /** M3 floating toolbar layout: horizontal row or vertical column. */
  orientation?: "horizontal" | "vertical";
  /**
   * M3 toolbar attachment. `floating` (default) is the detached pill at
   * level3 with 8dp side padding; `docked` is the edge-attached bar that
   * replaces the bottom app bar — square corners, full-bleed, 16dp side
   * padding (MDC-Android docked tokens; no elevation token ships, so the
   * attached bar carries none).
   */
  layout?: "floating" | "docked";
}) {
  const vertical = orientation === "vertical";
  const docked = layout === "docked";
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      data-variant={variant}
      data-orientation={orientation}
      data-layout={layout}
      className={cnState(
        "kern-toolbar flex min-h-16 items-center gap-1",
        vertical ? "flex-col py-2" : "flex-row",
        docked
          ? "w-full rounded-none px-4 shadow-none"
          : "rounded-(--sys-shape-corner-full) px-2 shadow-(--sys-elevation-level3)",
        variant === "vibrant"
          ? "bg-(--sys-color-primary-container) text-(--sys-color-on-primary-container)"
          : "bg-(--sys-color-surface-tonal) text-(--sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}

export function ToolbarGroup({ className, ...props }: ToolbarGroupProps) {
  return (
    <ToolbarPrimitive.Group
      data-slot="toolbar-group"
      className={cnState(
        "kern-toolbar-group flex items-center gap-1",
        className,
      )}
      {...props}
    />
  );
}

export function ToolbarButton({ className, ...props }: ToolbarButtonProps) {
  return (
    <ToolbarPrimitive.Button
      data-slot="toolbar-button"
      className={cnState(
        "kern-toolbar-button relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-(--sys-color-on-surface) outline-none select-none transition-colors duration-200 ease-(--sys-motion-easing-standard) " +
          FOCUS_RING_CLASS +
          " disabled:pointer-events-none disabled:text-(--sys-color-on-surface)/38 aria-disabled:pointer-events-none aria-disabled:text-(--sys-color-on-surface)/38 before:absolute before:inset-0 before:rounded-full before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 before:bg-(--sys-color-on-surface) hover:before:opacity-[var(--sys-state-hover)] focus-visible:before:opacity-[var(--sys-state-focus)] active:before:opacity-[var(--sys-state-press)] disabled:before:opacity-0 data-pressed:bg-(--sys-color-secondary-container) data-pressed:text-(--sys-color-on-secondary-container) data-pressed:before:bg-(--sys-color-on-secondary-container)",
        className,
      )}
      {...props}
    />
  );
}

export function ToolbarSeparator({
  className,
  ...props
}: ToolbarSeparatorProps) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cnState(
        "kern-toolbar-separator mx-1 h-6 w-px bg-(--sys-color-outline-variant)",
        className,
      )}
      {...props}
    />
  );
}

/** Single-tab-stop action bar with roving focus between controls. */
export const Toolbar = {
  Root: ToolbarRoot,
  Group: ToolbarGroup,
  Button: ToolbarButton,
  Separator: ToolbarSeparator,
};
