import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type ProgressRootProps = ComponentProps<typeof ProgressPrimitive.Root>;
export type ProgressLabelProps = ComponentProps<typeof ProgressPrimitive.Label>;

export function ProgressRoot({ className, ...props }: ProgressRootProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cnState(
        "kern-progress relative h-1 w-full overflow-hidden rounded-full bg-(--md-sys-color-surface-tonal)",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="kern-progress-indicator block h-full rounded-full bg-(--md-sys-color-primary) transition-[width] duration-200"
      />
    </ProgressPrimitive.Root>
  );
}

export function ProgressLabel({ className, ...props }: ProgressLabelProps) {
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      className={cnState(
        "kern-progress-label text-xs text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

export function ProgressValue(
  props: ComponentProps<typeof ProgressPrimitive.Value>,
) {
  return <ProgressPrimitive.Value data-slot="progress-value" {...props} />;
}

/** Determinate linear progress. Omit value for indeterminate motion. */
export const Progress = {
  Root: ProgressRoot,
  Label: ProgressLabel,
  Value: ProgressValue,
};
