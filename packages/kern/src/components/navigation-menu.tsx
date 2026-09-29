import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type NavigationMenuRootProps = ComponentProps<
  typeof NavigationMenuPrimitive.Root
>;
export type NavigationMenuListProps = ComponentProps<
  typeof NavigationMenuPrimitive.List
>;
export type NavigationMenuItemProps = ComponentProps<
  typeof NavigationMenuPrimitive.Item
>;
export type NavigationMenuTriggerProps = ComponentProps<
  typeof NavigationMenuPrimitive.Trigger
>;
export type NavigationMenuContentProps = ComponentProps<
  typeof NavigationMenuPrimitive.Popup
>;
export type NavigationMenuLinkProps = ComponentProps<
  typeof NavigationMenuPrimitive.Link
>;

export function NavigationMenuRoot({
  className,
  ...props
}: NavigationMenuRootProps) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cnState("kern-navigation-menu", className)}
      {...props}
    />
  );
}

export function NavigationMenuList({
  className,
  ...props
}: NavigationMenuListProps) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cnState(
        "kern-navigation-menu-list flex items-center gap-1",
        className,
      )}
      {...props}
    />
  );
}

export function NavigationMenuItem(props: NavigationMenuItemProps) {
  return (
    <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" {...props} />
  );
}

export function NavigationMenuTrigger({
  className,
  ...props
}: NavigationMenuTriggerProps) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cnState(
        "kern-navigation-menu-trigger flex h-10 cursor-pointer items-center gap-1 rounded-(--md-sys-shape-corner-full) px-4 text-sm text-(--md-sys-color-on-surface) outline-none select-none data-highlighted:bg-(--md-sys-color-surface-tonal) data-popup-open:bg-(--md-sys-color-surface-tonal)",
        className,
      )}
      {...props}
    />
  );
}

export function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuContentProps) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner sideOffset={8}>
        <NavigationMenuPrimitive.Popup
          data-slot="navigation-menu-content"
          className={cnState(
            "kern-navigation-menu-popup rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) p-2 shadow-(--md-sys-elevation-level2) outline-none",
            className,
          )}
          {...props}
        />
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}

export function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuLinkProps) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cnState(
        "kern-navigation-menu-link flex h-10 items-center rounded-(--md-sys-shape-corner-full) px-4 text-sm text-(--md-sys-color-on-surface) outline-none data-active:bg-(--md-sys-color-surface-tonal)",
        className,
      )}
      {...props}
    />
  );
}

/** Site navigation with dropdown content per top-level item. */
export const NavigationMenu = {
  Root: NavigationMenuRoot,
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Content: NavigationMenuContent,
  Link: NavigationMenuLink,
};
