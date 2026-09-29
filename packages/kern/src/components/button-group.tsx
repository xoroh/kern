import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";

export type ButtonGroupProps = ComponentPropsWithRef<"div"> & {
  /** Layout direction of the joined buttons. */
  orientation?: "horizontal" | "vertical";
};

/**
 * Joins Button children into one segmented control. Children keep their own
 * variants; the group removes inner radii and doubles borders collapse.
 */
export function ButtonGroup({
  orientation = "horizontal",
  className,
  ...props
}: ButtonGroupProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: no native element groups arbitrary buttons; role=group is the correct pattern.
    <div
      data-slot="button-group"
      role="group"
      data-orientation={orientation}
      className={cn(
        "kern-button-group inline-flex shrink-0",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        "[&>[data-slot=button]:not(:first-child):not(:last-child)]:rounded-none",
        orientation === "horizontal"
          ? "[&>[data-slot=button]:first-child]:rounded-r-none [&>[data-slot=button]:last-child]:rounded-l-none [&>[data-slot=button]+[data-slot=button]]:-ml-px"
          : "[&>[data-slot=button]:first-child]:rounded-b-none [&>[data-slot=button]:last-child]:rounded-t-none [&>[data-slot=button]+[data-slot=button]]:-mt-px",
        className,
      )}
      {...props}
    />
  );
}
