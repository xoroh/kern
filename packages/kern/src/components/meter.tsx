import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type MeterRootProps = ComponentProps<typeof MeterPrimitive.Root>;
export type MeterLabelProps = ComponentProps<typeof MeterPrimitive.Label>;

export function MeterRoot({ className, ...props }: MeterRootProps) {
  return (
    <MeterPrimitive.Root
      data-slot="meter"
      className={cnState(
        "kern-meter relative h-2 w-full overflow-hidden rounded-full bg-(--md-sys-color-surface-tonal)",
        className,
      )}
      {...props}
    >
      <MeterPrimitive.Indicator
        data-slot="meter-indicator"
        className="kern-meter-indicator block h-full rounded-full bg-(--md-sys-color-secondary)"
      />
    </MeterPrimitive.Root>
  );
}

export function MeterLabel({ className, ...props }: MeterLabelProps) {
  return (
    <MeterPrimitive.Label
      data-slot="meter-label"
      className={cnState(
        "kern-meter-label text-xs text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

export function MeterValue(props: ComponentProps<typeof MeterPrimitive.Value>) {
  return <MeterPrimitive.Value data-slot="meter-value" {...props} />;
}

/** Static scalar display (storage used, battery level). Not interactive. */
export const Meter = {
  Root: MeterRoot,
  Label: MeterLabel,
  Value: MeterValue,
};
