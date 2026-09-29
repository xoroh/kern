import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";
import { menuItemClass, menuPopupClass } from "./menu";

export type MenubarRootProps = ComponentProps<typeof MenubarPrimitive>;
export type MenubarMenuProps = ComponentProps<typeof MenuPrimitive.Root>;
export type MenubarTriggerProps = ComponentProps<typeof MenuPrimitive.Trigger>;
export type MenubarContentProps = ComponentProps<typeof MenuPrimitive.Popup>;
export type MenubarItemProps = ComponentProps<typeof MenuPrimitive.Item>;

export function MenubarRoot({ className, ...props }: MenubarRootProps) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cnState(
        "kern-menubar flex h-12 items-center gap-1 rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-surface-tonal) px-2",
        className,
      )}
      {...props}
    />
  );
}

export function MenubarMenu(props: MenubarMenuProps) {
  return <MenuPrimitive.Root data-slot="menubar-menu" {...props} />;
}

export function MenubarTrigger({ className, ...props }: MenubarTriggerProps) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cnState(
        "kern-menubar-trigger flex h-10 cursor-pointer items-center rounded-(--md-sys-shape-corner-full) px-4 text-sm text-(--md-sys-color-on-surface) outline-none select-none data-highlighted:bg-(--md-sys-color-surface-container-high) data-popup-open:bg-(--md-sys-color-surface-container-high)",
        className,
      )}
      {...props}
    />
  );
}

export function MenubarContent({ className, ...props }: MenubarContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        sideOffset={4}
        className="kern-menubar-positioner"
      >
        <MenuPrimitive.Popup
          data-slot="menubar-content"
          className={cnState(menuPopupClass, className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export function MenubarItem({ className, ...props }: MenubarItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="menubar-item"
      className={cnState(menuItemClass, className)}
      {...props}
    />
  );
}

/**
 * Horizontal application menu bar. The bar is the Menubar primitive; each
 * top-level entry is a regular Menu whose trigger adopts the bar recipe.
 * Content parts reuse the Menu item recipe.
 */
export const Menubar = {
  Root: MenubarRoot,
  Menu: MenubarMenu,
  Trigger: MenubarTrigger,
  Content: MenubarContent,
  Item: MenubarItem,
};
