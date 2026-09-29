import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";
import { menuItemClass, menuPopupClass } from "./menu";

export type ContextMenuRootProps = ComponentProps<
  typeof ContextMenuPrimitive.Root
>;
export type ContextMenuTriggerProps = ComponentProps<
  typeof ContextMenuPrimitive.Trigger
>;
export type ContextMenuContentProps = ComponentProps<
  typeof ContextMenuPrimitive.Popup
>;
export type ContextMenuItemProps = ComponentProps<
  typeof ContextMenuPrimitive.Item
>;
export type ContextMenuSeparatorProps = ComponentProps<
  typeof ContextMenuPrimitive.Separator
>;

export function ContextMenuRoot(props: ContextMenuRootProps) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

export function ContextMenuTrigger({
  className,
  ...props
}: ContextMenuTriggerProps) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cnState("kern-context-menu-trigger", className)}
      {...props}
    />
  );
}

export function ContextMenuContent({
  className,
  ...props
}: ContextMenuContentProps) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        sideOffset={4}
        className="kern-context-menu-positioner"
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cnState(menuPopupClass, className)}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

export function ContextMenuItem({ className, ...props }: ContextMenuItemProps) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      className={cnState(menuItemClass, className)}
      {...props}
    />
  );
}

export function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuSeparatorProps) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cnState(
        "kern-context-menu-separator mx-2 my-1 h-px bg-(--md-sys-color-outline-variant)",
        className,
      )}
      {...props}
    />
  );
}

/** Right-click menu. Item recipe matches Menu for a consistent command look. */
export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Separator: ContextMenuSeparator,
};
