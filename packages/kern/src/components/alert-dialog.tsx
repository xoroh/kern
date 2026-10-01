import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

const backdropClass =
  "kern-alert-dialog-backdrop fixed inset-0 bg-black/30 transition-opacity";
const popupClass =
  "kern-alert-dialog-popup w-[min(28rem,calc(100vw-2rem))] rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) p-6 shadow-(--md-sys-elevation-level3) outline-none";

export type AlertDialogRootProps = ComponentProps<
  typeof AlertDialogPrimitive.Root
>;
export type AlertDialogTriggerProps = ComponentProps<
  typeof AlertDialogPrimitive.Trigger
>;
export type AlertDialogContentProps = ComponentProps<
  typeof AlertDialogPrimitive.Popup
>;
export type AlertDialogTitleProps = ComponentProps<
  typeof AlertDialogPrimitive.Title
>;
export type AlertDialogDescriptionProps = ComponentProps<
  typeof AlertDialogPrimitive.Description
>;
export type AlertDialogCloseProps = ComponentProps<
  typeof AlertDialogPrimitive.Close
>;

export function AlertDialogRoot(props: AlertDialogRootProps) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

export function AlertDialogTrigger({
  className,
  ...props
}: AlertDialogTriggerProps) {
  return (
    <AlertDialogPrimitive.Trigger
      data-slot="alert-dialog-trigger"
      className={cnState("kern-alert-dialog-trigger", className)}
      {...props}
    />
  );
}

export function AlertDialogContent({
  className,
  ...props
}: AlertDialogContentProps) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Backdrop
        data-slot="alert-dialog-backdrop"
        className={backdropClass}
      />
      <AlertDialogPrimitive.Viewport className="kern-alert-dialog-viewport fixed inset-0 flex items-center justify-center p-4">
        <AlertDialogPrimitive.Popup
          data-slot="alert-dialog-content"
          // Identical gap to `dialog.tsx`: Base UI's Popup never emits
          // aria-modal. An alert dialog is modal by definition, and the parity
          // contract requires the surface to say so.
          aria-modal="true"
          className={cnState(popupClass, className)}
          {...props}
        />
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPrimitive.Portal>
  );
}

export function AlertDialogTitle({
  className,
  ...props
}: AlertDialogTitleProps) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cnState(
        "kern-alert-dialog-title text-(length:--md-sys-typescale-title-large-font-size) font-medium text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}

export function AlertDialogDescription({
  className,
  ...props
}: AlertDialogDescriptionProps) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cnState(
        "kern-alert-dialog-description mt-2 text-sm text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

export function AlertDialogClose({
  className,
  ...props
}: AlertDialogCloseProps) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-close"
      className={cnState("kern-alert-dialog-close", className)}
      {...props}
    />
  );
}

/**
 * Blocking confirmation dialog. Same anatomy as Dialog; the primitive keeps
 * focus inside until the user picks an explicit action.
 */
export const AlertDialog = {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Content: AlertDialogContent,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Close: AlertDialogClose,
};
