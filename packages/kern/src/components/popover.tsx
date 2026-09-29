import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type PopoverRootProps = ComponentProps<typeof PopoverPrimitive.Root>;
export type PopoverTriggerProps = ComponentProps<
  typeof PopoverPrimitive.Trigger
>;
export type PopoverContentProps = ComponentProps<typeof PopoverPrimitive.Popup>;
export type PopoverTitleProps = ComponentProps<typeof PopoverPrimitive.Title>;
export type PopoverDescriptionProps = ComponentProps<
  typeof PopoverPrimitive.Description
>;
export type PopoverCloseProps = ComponentProps<typeof PopoverPrimitive.Close>;

export function PopoverRoot(props: PopoverRootProps) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

export function PopoverTrigger({ className, ...props }: PopoverTriggerProps) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      className={cnState("kern-popover-trigger", className)}
      {...props}
    />
  );
}

export function PopoverContent({ className, ...props }: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        sideOffset={8}
        className="kern-popover-positioner"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cnState(
            "kern-popover-popup w-64 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) p-4 text-sm text-(--md-sys-color-on-surface) shadow-(--md-sys-elevation-level2) outline-none",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cnState(
        "kern-popover-title text-sm font-medium text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}

export function PopoverDescription({
  className,
  ...props
}: PopoverDescriptionProps) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cnState(
        "kern-popover-description mt-1 text-sm text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

export function PopoverClose({ className, ...props }: PopoverCloseProps) {
  return (
    <PopoverPrimitive.Close
      data-slot="popover-close"
      className={cnState("kern-popover-close", className)}
      {...props}
    />
  );
}

/** Anchored non-modal panel for rich transient content. */
export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
};
