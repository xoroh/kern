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

export type SliderSize = "default" | "xs" | "sm" | "md" | "lg" | "xl";

/**
 * M3 Expressive slider sizes: XS 16dp track / 44dp handle, S 24/44,
 * M 40/52, L 56/68, XL 96/108 (4dp handle bar). `default` keeps the
 * pre-expressive baseline (4px track, 20px round thumb) so existing
 * rendering cannot change.
 */
const SLIDER_TRACK: Record<Exclude<SliderSize, "default">, string> = {
  xs: "h-4",
  sm: "h-6",
  md: "h-10",
  lg: "h-14",
  xl: "h-24",
};

const SLIDER_ROOT_H: Record<Exclude<SliderSize, "default">, string> = {
  xs: "h-12",
  sm: "h-12",
  md: "h-14",
  lg: "h-20",
  xl: "h-28",
};

export function SliderRoot({
  className,
  children,
  showTicks = false,
  size = "default",
  min = 0,
  max = 100,
  step,
  ...props
}: SliderRootProps &
  SliderTicksProps & {
    /**
     * M3 Expressive size. `default` is the pre-expressive baseline;
     * `xs`–`xl` swap the token-driven expressive geometry.
     */
    size?: SliderSize;
  }) {
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
      data-size={size}
      className={cnState(
        "kern-slider group relative flex w-full touch-none items-center outline-none select-none data-disabled:cursor-not-allowed",
        size === "default" ? "h-12" : SLIDER_ROOT_H[size],
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
          className={cnState(
            "kern-slider-track relative w-full rounded-full bg-(--sys-color-surface-container-highest) group-data-disabled:bg-(--sys-color-on-surface)/12",
            size === "default" ? "h-1" : SLIDER_TRACK[size],
          )}
        >
          {stops.map((stop) => (
            <span
              key={stop}
              data-slot="slider-stop"
              aria-hidden="true"
              style={{ left: `${((stop - min) / (max - min)) * 100}%` }}
              className="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--sys-color-primary) group-data-disabled:bg-(--sys-color-on-surface)/38"
            />
          ))}
          <SliderPrimitive.Indicator
            data-slot="slider-indicator"
            className="kern-slider-indicator absolute rounded-full bg-(--sys-color-primary) group-data-disabled:bg-(--sys-color-on-surface)/38"
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
        `kern-slider-thumb block size-5 cursor-grab rounded-full bg-(--sys-color-primary) outline-none transition-colors ${FOCUS_RING_CLASS} focus-visible:ring-offset-2 focus-visible:ring-offset-(--sys-color-surface) disabled:cursor-not-allowed disabled:bg-(--sys-color-on-surface)/38` +
          " group-data-[size=xs]:h-11 group-data-[size=xs]:w-1" +
          " group-data-[size=sm]:h-11 group-data-[size=sm]:w-1" +
          " group-data-[size=md]:h-[52px] group-data-[size=md]:w-1" +
          " group-data-[size=lg]:h-[68px] group-data-[size=lg]:w-1" +
          " group-data-[size=xl]:h-[108px] group-data-[size=xl]:w-1",
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
        "kern-slider-label text-sm font-medium text-(--sys-color-on-surface)",
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
        "kern-slider-value text-sm text-(--sys-color-on-surface-variant)",
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
