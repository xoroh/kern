import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

const backdropClass =
  "kern-dialog-backdrop fixed inset-0 bg-black/30 transition-opacity";
const popupClass =
  "kern-dialog-popup w-[min(28rem,calc(100vw-2rem))] rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) p-6 shadow-(--md-sys-elevation-level2) outline-none";

export type DialogRootProps = ComponentProps<typeof DialogPrimitive.Root>;
export type DialogTriggerProps = ComponentProps<typeof DialogPrimitive.Trigger>;
export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Popup>;
export type DialogTitleProps = ComponentProps<typeof DialogPrimitive.Title>;
export type DialogDescriptionProps = ComponentProps<
  typeof DialogPrimitive.Description
>;
export type DialogCloseProps = ComponentProps<typeof DialogPrimitive.Close>;

export function DialogRoot(props: DialogRootProps) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

export function DialogTrigger({ className, ...props }: DialogTriggerProps) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      className={cnState("kern-dialog-trigger", className)}
      {...props}
    />
  );
}

export function DialogContent({ className, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        data-slot="dialog-backdrop"
        className={backdropClass}
      />
      <DialogPrimitive.Viewport className="kern-dialog-viewport fixed inset-0 flex items-center justify-center p-4">
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          // Base UI's Popup traps focus and inerts the rest of the page but
          // does not emit aria-modal; the parity contract requires a modal
          // surface to announce itself as one, and a modal dialog that does
          // not is a trap to a screen reader. Same attribute the navigation
          // drawer sets (navigation-drawer.tsx).
          aria-modal="true"
          className={cnState(popupClass, className)}
          {...props}
        />
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cnState(
        "kern-dialog-title text-(length:--md-sys-typescale-title-large-font-size) font-medium text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cnState(
        "kern-dialog-description mt-2 text-sm text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

export function DialogClose({ className, ...props }: DialogCloseProps) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className={cnState("kern-dialog-close", className)}
      {...props}
    />
  );
}

/** Modal dialog: focus-trapped surface with scrim, title, and description. */
export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};
