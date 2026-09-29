import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export const menuPopupClass =
  "kern-menu-popup min-w-48 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) p-2 shadow-(--md-sys-elevation-level2) outline-none";
export const menuItemClass =
  "kern-menu-item flex min-h-12 cursor-pointer items-center gap-2 rounded-(--md-sys-shape-corner-extra-small) px-3 text-sm text-(--md-sys-color-on-surface) outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-(--md-sys-color-surface-tonal)";

export type MenuRootProps = ComponentProps<typeof MenuPrimitive.Root>;
export type MenuTriggerProps = ComponentProps<typeof MenuPrimitive.Trigger>;
export type MenuContentProps = ComponentProps<typeof MenuPrimitive.Popup>;
export type MenuItemProps = ComponentProps<typeof MenuPrimitive.Item>;
export type MenuSeparatorProps = ComponentProps<typeof MenuPrimitive.Separator>;
export type MenuGroupLabelProps = ComponentProps<
  typeof MenuPrimitive.GroupLabel
>;

export function MenuRoot(props: MenuRootProps) {
  return <MenuPrimitive.Root data-slot="menu" {...props} />;
}

export function MenuTrigger({ className, ...props }: MenuTriggerProps) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menu-trigger"
      className={cnState("kern-menu-trigger", className)}
      {...props}
    />
  );
}

export function MenuContent({ className, ...props }: MenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner sideOffset={4} className="kern-menu-positioner">
        <MenuPrimitive.Popup
          data-slot="menu-content"
          className={cnState(menuPopupClass, className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export function MenuItem({ className, ...props }: MenuItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      className={cnState(menuItemClass, className)}
      {...props}
    />
  );
}

export function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return (
    <MenuPrimitive.Separator
      data-slot="menu-separator"
      className={cnState(
        "kern-menu-separator mx-2 my-1 h-px bg-(--md-sys-color-outline-variant)",
        className,
      )}
      {...props}
    />
  );
}

export function MenuGroupLabel({ className, ...props }: MenuGroupLabelProps) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="menu-group-label"
      className={cnState(
        "kern-menu-group-label px-3 py-2 text-xs font-medium text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

/** Dropdown command menu with roving-focus item navigation. */
export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  Separator: MenuSeparator,
  GroupLabel: MenuGroupLabel,
};
