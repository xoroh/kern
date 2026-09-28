import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

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
      className={cn(
        "kern-separator shrink-0 bg-black/10",
        orientation === "vertical" ? "h-full w-px" : "h-px w-full",
        className,
      )}
      {...props}
    />
  );
}
