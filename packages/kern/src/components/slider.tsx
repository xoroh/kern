import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type SliderRootProps = ComponentProps<typeof SliderPrimitive.Root>;
export type SliderThumbProps = ComponentProps<typeof SliderPrimitive.Thumb>;
export type SliderLabelProps = ComponentProps<typeof SliderPrimitive.Label>;
export type SliderValueProps = ComponentProps<typeof SliderPrimitive.Value>;

export type SliderTicksProps = {
  /**
   * Render M3 stop indicators at each step of a discrete slider. Stops paint
   * in the primary role over the inactive track; the active indicator covers
   * the stops behind the value (M3's active-stop tint needs a value-aware
   * split the current primitive does not expose, so stops under the fill
   * stay covered rather than re-tinted — an honest limitation, not a second
   * treatment). Only meaningful with a `step` that yields a countable set.
   */
  showTicks?: boolean;
};

export function SliderRoot({
  className,
  children,
  showTicks = false,
  min = 0,
  max = 100,
  step,
  ...props
}: SliderRootProps & SliderTicksProps) {
  // Stops need an explicit step: the primitive's continuous default (step 1
  // over 0–100) would render a hundred dots. `showTicks` without `step` is
  // a no-op by design.
  const stops =
    showTicks && step != null && step > 0 && Number.isFinite((max - min) / step)
      ? Array.from(
          { length: Math.floor((max - min) / step) + 1 },
          (_, i) => min + i * step,
        ).filter((stop) => stop > min && stop < max)
      : [];
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cnState(
        "kern-slider relative flex h-12 w-full touch-none items-center outline-none select-none data-disabled:opacity-50",
        className,
      )}
      min={min}
      max={max}
      step={step}
      {...props}
    >
      <SliderPrimitive.Control className="kern-slider-control flex w-full items-center">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="kern-slider-track relative h-1 w-full rounded-full bg-(--md-sys-color-surface-container-highest)"
        >
          {stops.map((stop) => (
            <span
              key={stop}
              data-slot="slider-stop"
              aria-hidden="true"
              style={{ left: `${((stop - min) / (max - min)) * 100}%` }}
              className="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--md-sys-color-primary)"
            />
          ))}
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
        `kern-slider-thumb block size-5 cursor-grab rounded-full bg-(--md-sys-color-primary) outline-none ${FOCUS_RING_CLASS} focus-visible:ring-offset-2 focus-visible:ring-offset-(--md-sys-color-surface)`,
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
