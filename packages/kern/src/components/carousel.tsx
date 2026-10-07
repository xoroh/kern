import { type ReactNode, useId, useState } from "react";
import { cn } from "../utils/cn";

/**
 * M3 carousel — a bounded set of items shown one at a time with previous and
 * next controls and an optional dot indicator.
 *
 * M3 is explicit that a carousel **does not auto-advance**: motion that moves
 * content out from under a reader is an accessibility failure, not an
 * enhancement. There is therefore no `autoplay` prop to add later — a host that
 * wants one composes it outside, which keeps the decision visible instead of
 * burying a motion preference in a default.
 *
 * Behaviour this component owns:
 *
 * - **Controlled or uncontrolled index**, reported as `onIndexChange`.
 *   R2 callback lexicon (re-homed): `value`/`defaultValue`/`onValueChange`
 *   are the canonical names — `index`/`defaultIndex`/`onIndexChange` are kept
 *   as deprecated aliases resolving to the same state, never a second state.
 * - **`aria-roledescription="carousel"`** on the region and **on each item**
 *   (`"slide"`), with each item labelled `"3 of 7"`. Without the
 *   roledescription a screen reader announces "group" and the user cannot tell
 *   a carousel from a layout container.
 * - **Wrap or clamp** (`wrap`). Clamped is the M3 default: at the first slide
 *   the previous control is disabled rather than silently wrapping, so the
 *   control's state tells the truth about where the user is.
 * - **One tab stop for the item track.** Arrow keys move between items; the
 *   previous/next controls are separate tab stops. Items are a roving
 *   `tablist`-style group, so a 20-slide carousel is not 20 tab stops.
 * - **Only the active slide is exposed** to assistive tech: inactive slides stay
 *   mounted but carry `inert` + `aria-hidden`, so a screen reader does not read
 *   20 slides to find the current one. They stay MOUNTED deliberately — the
 *   track slides by transform, and unmounting would discard a playing video or
 *   a scroll position when the user swipes away and back. (An earlier version of
 *   this comment claimed inactive children were absent; that was wrong, and
 *   `carousel.test.tsx` now pins the actual mechanism.)
 * - **Disabled** disables both controls and stops keyboard traversal, and says
 *   so with `aria-disabled`.
 */

export type CarouselProps = {
  /** Slide content, in order. Exactly one is shown at a time. */
  items: ReactNode[];
  /** Accessible name of the carousel region. */
  label?: string;
  /** Controlled active index. */
  index?: number;
  /** Initial index for the uncontrolled case. */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /**
   * R2 lexicon canonical names. `value` wins when both are passed; both
   * callbacks fire on every change, so a host mid-migration never misses one.
   */
  value?: number;
  defaultValue?: number;
  onValueChange?: (index: number) => void;
  /** Wrap past the ends instead of disabling the control. M3 default is false. */
  wrap?: boolean;
  /** Renders the dot indicator. */
  showIndicators?: boolean;
  disabled?: boolean;
  className?: string;
  /** Per-slide accessible names. Defaults to `Slide n of total`. */
  itemLabels?: string[];
  /**
   * Stable identity per slide, for React reconciliation when slides are
   * reordered. Falls back to the index, which is correct for a static set and
   * wrong for a reordered one — so a dynamic carousel must pass these.
   */
  itemKeys?: string[];
  testID?: string;
};

export function Carousel({
  items,
  label = "Carousel",
  index,
  defaultIndex = 0,
  onIndexChange,
  value,
  defaultValue,
  onValueChange,
  wrap = false,
  showIndicators = false,
  disabled = false,
  className,
  itemLabels,
  itemKeys,
  testID,
}: CarouselProps) {
  const controlled = value !== undefined || index !== undefined;
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue ?? defaultIndex,
  );
  const total = items.length;
  // A controlled index out of range must not blank the carousel. Clamp to the
  // nearest real slide rather than rendering nothing.
  const requested = controlled ? (value ?? index ?? 0) : uncontrolled;
  const active = total === 0 ? 0 : Math.min(Math.max(requested, 0), total - 1);

  const baseId = useId();

  const go = (next: number) => {
    if (disabled || total === 0) return;
    const target = wrap
      ? ((next % total) + total) % total
      : Math.min(Math.max(next, 0), total - 1);
    if (!controlled) setUncontrolled(target);
    onValueChange?.(target);
    onIndexChange?.(target);
  };

  const atStart = active === 0;
  const atEnd = active === total - 1;

  if (total === 0) return null;

  const slideName = (i: number) => itemLabels?.[i] ?? `Slide ${i + 1}`;

  return (
    <section
      data-slot="carousel"
      data-testid={testID ?? "kern-carousel"}
      // `<section aria-label>` already resolves to `region`; the
      // roledescription is what makes it announce as a carousel rather than as
      // an unnamed region.
      aria-roledescription="carousel"
      aria-label={label}
      aria-disabled={disabled || undefined}
      // One tab stop for the region, so a 20-slide carousel is reached once and
      // then traversed with Arrow keys instead of costing 20 tab stops. The
      // keydown lives on the controls group below, which is interactive, rather
      // than putting `tabIndex` on a `<section>`.
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === "ArrowRight") {
          event.preventDefault();
          go(active + 1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(active - 1);
        }
      }}
      className={cn(
        "kern-carousel relative flex flex-col gap-2",
        disabled && "opacity-50",
        className,
      )}
    >
      <div
        id={`${baseId}-track`}
        data-slot="carousel-viewport"
        className="relative overflow-hidden rounded-(--md-sys-shape-corner-large) bg-(--md-sys-color-surface-container)"
      >
        <div
          data-slot="carousel-track"
          aria-live={disabled ? "off" : "polite"}
          id={`${baseId}-slides`}
          className="flex"
          style={{
            // Slide by transform rather than unmount/remount, so the incoming
            // slide keeps its own state (a playing video, a scroll position).
            transform: `translateX(-${active * 100}%)`,
            transitionProperty: "transform",
            transitionDuration: "300ms",
          }}
        >
          {items.map((item, i) => (
            // biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-roledescription is valid on any element with a role (WAI-ARIA 1.2, 4.1.9); biome's table only covers roles it models.
            <div
              // Index fallback is deliberate and documented on `itemKeys`; the
              // baseId prefix keeps two carousels on one page from sharing keys.
              key={itemKeys?.[i] ?? `${baseId}-${i}`}
              data-slot="carousel-item"
              aria-roledescription="slide"
              aria-label={`${slideName(i)} (${i + 1} of ${total})`}
              // Only the active slide is exposed: a hidden slide is still
              // announced and reads as duplicate content.
              {...(i === active ? {} : { inert: true, "aria-hidden": true })}
              className="w-full shrink-0"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* biome-ignore lint/a11y/useSemanticElements: a labelled group of paging controls; no semantic element models this and M3's carousel declares no landmark. */}
      <div
        data-slot="carousel-controls"
        role="group"
        aria-label={`${label} controls`}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: this group IS the keyboard surface for the carousel - it owns Arrow-key traversal, so it must be reachable. Tab stops on the arrow buttons alone would leave traversal unreachable once focus moved past them.
        tabIndex={0}
        className="flex items-center justify-between"
      >
        <button
          type="button"
          data-slot="carousel-previous"
          aria-label="Previous slide"
          aria-controls={`${baseId}-track`}
          disabled={disabled || (!wrap && atStart)}
          onClick={() => go(active - 1)}
          className="kern-carousel-previous inline-flex size-10 items-center justify-center rounded-(--md-sys-shape-corner-full) text-(--md-sys-color-on-surface-variant) outline-none select-none hover:bg-(--md-sys-color-surface-container-high) focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none disabled:opacity-38"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="size-5"
          >
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {showIndicators ? (
          <div
            data-slot="carousel-indicators"
            className="flex items-center gap-2"
          >
            {items.map((_, i) => (
              <button
                key={itemKeys?.[i] ?? `${baseId}-dot-${i}`}
                type="button"
                data-slot="carousel-indicator"
                data-active={i === active || undefined}
                aria-label={`Go to ${slideName(i)}`}
                aria-current={i === active ? "true" : undefined}
                disabled={disabled}
                onClick={() => go(i)}
                className={cn(
                  "kern-carousel-indicator size-2.5 rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-outline) outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none",
                  i === active && "bg-(--md-sys-color-primary)",
                )}
              />
            ))}
          </div>
        ) : null}

        <button
          type="button"
          data-slot="carousel-next"
          aria-label="Next slide"
          aria-controls={`${baseId}-track`}
          disabled={disabled || (!wrap && atEnd)}
          onClick={() => go(active + 1)}
          className="kern-carousel-next inline-flex size-10 items-center justify-center rounded-(--md-sys-shape-corner-full) text-(--md-sys-color-on-surface-variant) outline-none select-none hover:bg-(--md-sys-color-surface-container-high) focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none disabled:opacity-38"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="size-5"
          >
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
