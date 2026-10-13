import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import type { ComponentProps } from "react";
import { cn } from "../utils/cn";
import { cnState } from "../utils/cnState";

export type TooltipProviderProps = ComponentProps<
  typeof TooltipPrimitive.Provider
>;
export type TooltipRootProps = ComponentProps<typeof TooltipPrimitive.Root>;
export type TooltipTriggerProps = ComponentProps<
  typeof TooltipPrimitive.Trigger
>;
export type TooltipContentProps = ComponentProps<typeof TooltipPrimitive.Popup>;

export function TooltipProvider(props: TooltipProviderProps) {
  return <TooltipPrimitive.Provider {...props} />;
}

export function TooltipRoot(props: TooltipRootProps) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

export function TooltipTrigger({ className, ...props }: TooltipTriggerProps) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      className={cnState("kern-tooltip-trigger", className)}
      {...props}
    />
  );
}

export function TooltipContent({ className, ...props }: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner sideOffset={6}>
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cnState(
            "kern-tooltip-popup max-w-64 rounded-(--md-sys-shape-corner-extra-small) bg-(--md-sys-color-inverse-surface) px-2 py-1 text-xs text-(--md-sys-color-inverse-on-surface) shadow-(--md-sys-elevation-level2)",
            className,
          )}
          {...props}
        />
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

/** Hover/focus hint label. Wrap groups in TooltipProvider to share timing. */
export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
};

/**
 * M3 rich tooltip — subhead, supporting text, and plain-text actions for
 * content that needs more than a label. Container is surface-container
 * (NOT the plain tooltip's inverse-surface), 12dp top / 8dp bottom / 16dp
 * side padding.
 */
export function RichTooltipContent({
  className,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner sideOffset={6}>
        <TooltipPrimitive.Popup
          data-slot="rich-tooltip-content"
          className={cnState(
            "kern-rich-tooltip-popup max-w-80 rounded-(--md-sys-shape-corner-extra-small) bg-(--md-sys-color-surface-container) px-4 pt-3 pb-2 text-sm text-(--md-sys-color-on-surface-variant) shadow-(--md-sys-elevation-level2)",
            className,
          )}
          {...props}
        />
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export function RichTooltipTitle({
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      data-slot="rich-tooltip-title"
      className={cn(
        "kern-rich-tooltip-title m-0 text-sm font-medium text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}

export function RichTooltipActions({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="rich-tooltip-actions"
      className={cn(
        "kern-rich-tooltip-actions mt-1 flex items-center gap-4",
        className,
      )}
      {...props}
    />
  );
}
