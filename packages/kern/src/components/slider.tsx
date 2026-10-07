import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type SliderRootProps = ComponentProps<typeof SliderPrimitive.Root>;
export type SliderThumbProps = ComponentProps<typeof SliderPrimitive.Thumb>;
export type SliderLabelProps = ComponentProps<typeof SliderPrimitive.Label>;
export type SliderValueProps = ComponentProps<typeof SliderPrimitive.Value>;

export function SliderRoot({ className, children, ...props }: SliderRootProps) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cnState(
        "kern-slider relative flex h-12 w-full touch-none items-center outline-none select-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Control className="kern-slider-control flex w-full items-center">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="kern-slider-track relative h-1 w-full rounded-full bg-(--md-sys-color-surface-tonal)"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-indicator"
            className="kern-slider-indicator absolute rounded-full bg-(--md-sys-color-primary)"
          />
          {children}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export function SliderThumb({ className, ...props }: SliderThumbProps) {
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className={cnState(
        "kern-slider-thumb block size-5 cursor-grab rounded-full bg-(--md-sys-color-primary) outline-none " + FOCUS_RING_CLASS + " focus-visible:ring-offset-2 focus-visible:ring-offset-(--md-sys-color-surface)",
        className,
      )}
      {...props}
    />
  );
}

export function SliderLabel({ className, ...props }: SliderLabelProps) {
  return (
    <SliderPrimitive.Label
      data-slot="slider-label"
      className={cnState(
        "kern-slider-label text-sm font-medium text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}

export function SliderValue({ className, ...props }: SliderValueProps) {
  return (
    <SliderPrimitive.Value
      data-slot="slider-value"
      className={cnState(
        "kern-slider-value text-sm text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

/** Continuous value selection with keyboard support. */
export const Slider = {
  Root: SliderRoot,
  Thumb: SliderThumb,
  Label: SliderLabel,
  Value: SliderValue,
};
