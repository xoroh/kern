import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

const backdropClass =
  "kern-sheet-backdrop fixed inset-0 bg-black/30 transition-opacity";

export type SheetRootProps = ComponentProps<typeof DialogPrimitive.Root>;
export type SheetTriggerProps = ComponentProps<typeof DialogPrimitive.Trigger>;
export type SheetContentProps = ComponentProps<typeof DialogPrimitive.Popup> & {
  /** Which edge the sheet slides from. */
  side?: "left" | "right";
};
export type SheetTitleProps = ComponentProps<typeof DialogPrimitive.Title>;
export type SheetDescriptionProps = ComponentProps<
  typeof DialogPrimitive.Description
>;
export type SheetCloseProps = ComponentProps<typeof DialogPrimitive.Close>;

export function SheetRoot(props: SheetRootProps) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

export function SheetTrigger({ className, ...props }: SheetTriggerProps) {
  return (
    <DialogPrimitive.Trigger
      data-slot="sheet-trigger"
      className={cnState("kern-sheet-trigger", className)}
      {...props}
    />
  );
}

export function SheetContent({
  side = "right",
  className,
  ...props
}: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        data-slot="sheet-backdrop"
        className={backdropClass}
      />
      <DialogPrimitive.Viewport
        className={
          side === "right"
            ? "kern-sheet-viewport fixed inset-0 flex items-stretch justify-end"
            : "kern-sheet-viewport fixed inset-0 flex items-stretch justify-start"
        }
      >
        <DialogPrimitive.Popup
          data-slot="sheet-content"
          className={cnState(
            "kern-sheet-popup flex h-full w-[min(24rem,calc(100vw-2rem))] flex-col gap-2 overflow-y-auto border-(--md-sys-color-outline) bg-(--md-sys-color-surface) p-6 shadow-(--md-sys-elevation-level2) outline-none " +
              (side === "right"
                ? "rounded-l-(--md-sys-shape-corner-extra-large) border-l"
                : "rounded-r-(--md-sys-shape-corner-extra-large) border-r"),
            className,
          )}
          {...props}
        />
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

export function SheetTitle({ className, ...props }: SheetTitleProps) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cnState(
        "kern-sheet-title text-(length:--md-sys-typescale-title-large-font-size) font-medium text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: SheetDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cnState(
        "kern-sheet-description text-sm text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

export function SheetClose({ className, ...props }: SheetCloseProps) {
  return (
    <DialogPrimitive.Close
      data-slot="sheet-close"
      className={cnState("kern-sheet-close", className)}
      {...props}
    />
  );
}

/** Edge-anchored panel built on the Dialog behavior (focus-trapped). */
export const Sheet = {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Content: SheetContent,
  Title: SheetTitle,
  Description: SheetDescription,
  Close: SheetClose,
};
