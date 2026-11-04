import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";

export type ButtonGroupProps = ComponentPropsWithRef<"div"> & {
  /** Layout direction of the joined buttons. */
  orientation?: "horizontal" | "vertical";
  /**
   * M3 Expressive group variant. `connected` (default) joins the buttons
   * into one control — the expressive successor to the segmented button:
   * use toggle `Button` children and their press/selected shape morph reads
   * as the group's selection. `standard` spaces the buttons as individuals
   * with no radius surgery.
   */
  variant?: "standard" | "connected";
};

/**
 * M3 Expressive button group. Joins Button, PulseButton, IconButton, and Toggle
 * children into one control. Children keep their own variants; the group removes
 * inner radii and double borders collapse.
 */
export function ButtonGroup({
  orientation = "horizontal",
  variant = "connected",
  className,
  ...props
}: ButtonGroupProps) {
  const connected = variant === "connected";
  return (
    // biome-ignore lint/a11y/useSemanticElements: no native element groups arbitrary buttons; role=group is the correct pattern.
    <div
      data-slot="button-group"
      role="group"
      data-orientation={orientation}
      data-variant={variant}
      className={cn(
        "kern-button-group inline-flex shrink-0",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        connected
          ? [
              "[&>[data-slot=button]:not(:first-child):not(:last-child)]:rounded-none",
              "[&>[data-slot=pulse-button]:not(:first-child):not(:last-child)]:rounded-none",
              "[&>[data-slot=icon-button]:not(:first-child):not(:last-child)]:rounded-none",
              "[&>[data-slot=toggle]:not(:first-child):not(:last-child)]:rounded-none",
              orientation === "horizontal"
                ? "[&>[data-slot=button]:first-child]:rounded-r-none [&>[data-slot=button]:last-child]:rounded-l-none [&>[data-slot=button]+[data-slot=button]]:-ml-px [&>[data-slot=pulse-button]:first-child]:rounded-r-none [&>[data-slot=pulse-button]:last-child]:rounded-l-none [&>[data-slot=pulse-button]+[data-slot=pulse-button]]:-ml-px [&>[data-slot=icon-button]:first-child]:rounded-r-none [&>[data-slot=icon-button]:last-child]:rounded-l-none [&>[data-slot=icon-button]+[data-slot=icon-button]]:-ml-px [&>[data-slot=toggle]:first-child]:rounded-r-none [&>[data-slot=toggle]:last-child]:rounded-l-none [&>[data-slot=toggle]+[data-slot=toggle]]:-ml-px"
                : "[&>[data-slot=button]:first-child]:rounded-b-none [&>[data-slot=button]:last-child]:rounded-t-none [&>[data-slot=button]+[data-slot=button]]:-mt-px [&>[data-slot=pulse-button]:first-child]:rounded-b-none [&>[data-slot=pulse-button]:last-child]:rounded-t-none [&>[data-slot=pulse-button]+[data-slot=pulse-button]]:-mt-px [&>[data-slot=icon-button]:first-child]:rounded-b-none [&>[data-slot=icon-button]:last-child]:rounded-t-none [&>[data-slot=icon-button]+[data-slot=icon-button]]:-mt-px [&>[data-slot=toggle]:first-child]:rounded-b-none [&>[data-slot=toggle]:last-child]:rounded-t-none [&>[data-slot=toggle]+[data-slot=toggle]]:-mt-px",
            ]
          : [
              orientation === "horizontal"
                ? "flex-row gap-2"
                : "flex-col gap-2",
            ],
        className,
      )}
      {...props}
    />
  );
}
