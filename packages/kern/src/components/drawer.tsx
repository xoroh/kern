import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type DrawerRootProps = ComponentProps<typeof DrawerPrimitive.Root>;
export type DrawerTriggerProps = ComponentProps<typeof DrawerPrimitive.Trigger>;
export type DrawerContentProps = ComponentProps<typeof DrawerPrimitive.Popup>;
export type DrawerTitleProps = ComponentProps<typeof DrawerPrimitive.Title>;
export type DrawerDescriptionProps = ComponentProps<
  typeof DrawerPrimitive.Description
>;
export type DrawerCloseProps = ComponentProps<typeof DrawerPrimitive.Close>;

export function DrawerRoot(props: DrawerRootProps) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

export function DrawerTrigger({ className, ...props }: DrawerTriggerProps) {
  return (
    <DrawerPrimitive.Trigger
      data-slot="drawer-trigger"
      className={cnState("kern-drawer-trigger", className)}
      {...props}
    />
  );
}

export function DrawerContent({ className, ...props }: DrawerContentProps) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Backdrop
        data-slot="drawer-backdrop"
        className="kern-drawer-backdrop fixed inset-0 bg-black/30"
      />
      <DrawerPrimitive.Viewport className="kern-drawer-viewport fixed inset-0 flex items-end justify-center">
        <DrawerPrimitive.Popup
          data-slot="drawer-content"
          className={cnState(
            "kern-drawer-popup max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-t-(--md-sys-shape-corner-extra-large) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) p-6 pb-10 shadow-(--md-sys-elevation-level2) outline-none",
            className,
          )}
          {...props}
        />
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  );
}

export function DrawerTitle({ className, ...props }: DrawerTitleProps) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cnState(
        "kern-drawer-title text-(length:--md-sys-typescale-title-large-font-size) font-medium text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}

export function DrawerDescription({
  className,
  ...props
}: DrawerDescriptionProps) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cnState(
        "kern-drawer-description mt-2 text-sm text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

export function DrawerClose({ className, ...props }: DrawerCloseProps) {
  return (
    <DrawerPrimitive.Close
      data-slot="drawer-close"
      className={cnState("kern-drawer-close", className)}
      {...props}
    />
  );
}

/** Bottom-anchored panel for supplementary flows and pickers. */
export const Drawer = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
};
