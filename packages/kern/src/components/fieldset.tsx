import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type FieldsetRootProps = ComponentProps<typeof FieldsetPrimitive.Root>;
export type FieldsetLegendProps = ComponentProps<
  typeof FieldsetPrimitive.Legend
>;

export function FieldsetRoot({ className, ...props }: FieldsetRootProps) {
  return (
    <FieldsetPrimitive.Root
      data-slot="fieldset"
      className={cnState(
        "kern-fieldset grid gap-4 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant) p-4 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function FieldsetLegend({ className, ...props }: FieldsetLegendProps) {
  return (
    <FieldsetPrimitive.Legend
      data-slot="fieldset-legend"
      className={cnState(
        "kern-fieldset-legend px-1 text-sm font-medium text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}

/** Grouped controls with a shared legend and disabled state. */
export const Fieldset = {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
};
