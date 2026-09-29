import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type SeparatorProps = ComponentProps<typeof SeparatorPrimitive>;

export function Separator({
  orientation,
  className,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cnState(
        "kern-separator shrink-0 bg-(--md-sys-color-outline-variant)",
        orientation === "vertical" ? "h-full w-px" : "h-px w-full",
        className,
      )}
      {...props}
    />
  );
}
