import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import type { ComponentProps } from "react";
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
            "kern-tooltip-popup max-w-64 rounded-(--md-sys-shape-corner-extra-small) bg-(--md-sys-color-inverse-surface) px-2 py-1 text-xs text-(--md-sys-color-inverse-on-surface)",
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
