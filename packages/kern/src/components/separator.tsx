import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type SeparatorProps = ComponentProps<typeof SeparatorPrimitive> & {
  /**
   * M3 divider insets: `none` full-bleed, `start` 16dp leading inset,
   * `middle` 16dp on both sides.
   */
  inset?: "none" | "start" | "middle";
};

export function Separator({
  orientation,
  inset = "none",
  className,
  ...props
}: SeparatorProps) {
  const horizontal = orientation !== "vertical";
  return (
    <SeparatorPrimitive
      data-slot="separator"
      data-inset={inset}
      orientation={orientation}
      className={cnState(
        "kern-separator shrink-0 bg-(--sys-color-outline-variant)",
        horizontal ? "h-px w-full" : "h-full w-px",
        inset === "start" && (horizontal ? "ml-4" : "mt-4"),
        inset === "middle" && (horizontal ? "mx-4" : "my-4"),
        inset !== "none" && (horizontal ? "w-auto" : "h-auto"),
        className,
      )}
      {...props}
    />
  );
}
