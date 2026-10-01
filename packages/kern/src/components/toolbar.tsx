import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type ToolbarRootProps = ComponentProps<typeof ToolbarPrimitive.Root>;
export type ToolbarButtonProps = ComponentProps<typeof ToolbarPrimitive.Button>;
export type ToolbarSeparatorProps = ComponentProps<
  typeof ToolbarPrimitive.Separator
>;
export type ToolbarGroupProps = ComponentProps<typeof ToolbarPrimitive.Group>;

export function ToolbarRoot({ className, ...props }: ToolbarRootProps) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      className={cnState(
        "kern-toolbar flex h-14 items-center gap-1 rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-surface-tonal) px-2 shadow-(--md-sys-elevation-level2)",
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
        "kern-toolbar-button flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-(--md-sys-color-on-surface) outline-none select-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none disabled:opacity-50 data-pressed:bg-(--md-sys-color-primary) data-pressed:text-(--md-sys-color-on-primary)",
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
        "kern-toolbar-separator mx-1 h-6 w-px bg-(--md-sys-color-outline-variant)",
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
