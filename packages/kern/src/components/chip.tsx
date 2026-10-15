import { cva } from "class-variance-authority";
import type { ComponentPropsWithRef, MouseEvent } from "react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { FOCUS_RING_CLASS } from "./focus-ring";

const chipVariants = cva(
  `kern-chip relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[var(--comp-chip-container-shape,var(--sys-shape-corner-small))] px-4 text-sm leading-5 font-medium tracking-[0.00625rem] transition-[color,background-color,border-color] duration-200 ease-(--sys-motion-easing-standard) outline-none select-none ${FOCUS_RING_CLASS} disabled:pointer-events-none disabled:text-(--sys-color-on-surface)/38 aria-disabled:pointer-events-none aria-disabled:text-(--sys-color-on-surface)/38 after:absolute after:-inset-2 after:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 before:bg-(--sys-color-on-surface) hover:before:opacity-[var(--sys-state-hover)] focus-visible:before:opacity-[var(--sys-state-focus)] active:before:opacity-[var(--sys-state-press)] disabled:before:opacity-0 [&_svg]:size-[18px] [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        assist:
          "border border-(--sys-color-outline) text-(--sys-color-on-surface) disabled:border-(--sys-color-on-surface)/12 disabled:bg-transparent",
        filter:
          "border border-(--sys-color-outline) text-(--sys-color-on-surface) data-selected:border-transparent data-selected:bg-(--sys-color-secondary-container) data-selected:text-(--sys-color-on-secondary-container) data-selected:before:bg-(--sys-color-on-secondary-container) disabled:border-(--sys-color-on-surface)/12 disabled:bg-transparent",
        // M3 lists FOUR chip variants (m3.material.io/components/chips/overview):
        // assist, filter, input, suggestion.
        input:
          "border border-(--sys-color-outline-variant) text-(--sys-color-on-surface) disabled:border-(--sys-color-on-surface)/12 disabled:bg-transparent",
        suggestion:
          "border border-(--sys-color-outline) text-(--sys-color-on-surface) disabled:border-(--sys-color-on-surface)/12 disabled:bg-transparent",
      },
      // M3 elevated chips (assist + filter): surface-container-low fill at
      // level1 instead of the flat transparent fill. Input/suggestion have
      // no elevated treatment — the flag is ignored there.
      elevated: {
        true: "border-transparent bg-(--sys-color-surface-container-low) shadow-(--sys-elevation-level1)",
        false: "",
      },
    },
    defaultVariants: { variant: "assist" },
  },
);

type CommonChipProps = Omit<
  ComponentPropsWithRef<"button">,
  "aria-pressed" | "type"
> & {
  type?: "button" | "submit" | "reset";
  /**
   * M3 elevated treatment (assist + filter): level1 shadow on the
   * surface-container-low fill. Ignored for input/suggestion, which have
   * no elevated treatment.
   */
  elevated?: boolean;
};

export type FilterChipProps = CommonChipProps & {
  variant: "filter";
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /**
   * R2 lexicon canonical names (`value` wins when both are passed; both
   * callbacks fire). `selected`/`defaultSelected`/`onSelectedChange` are
   * deprecated aliases onto the same state.
   */
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (selected: boolean) => void;
};

export type ActionChipProps = CommonChipProps & {
  variant?: "assist" | "suggestion" | "input";
  selected?: never;
  defaultSelected?: never;
  onSelectedChange?: never;
};

export type ChipProps = FilterChipProps | ActionChipProps;

export function Chip(props: ChipProps) {
  const {
    variant = "assist",
    elevated = false,
    className,
    disabled,
    type = "button",
    children,
    onClick,
    selected: selectedProp,
    defaultSelected,
    onSelectedChange,
    ...buttonProps
  } = props;
  // R2 lexicon canonical names, read off the narrowed filter branch so the
  // DOM `value`/`defaultValue` (string|number) on action chips never leak
  // into the boolean selection state — or vice versa.
  const filterProps = variant === "filter" ? (props as FilterChipProps) : null;
  const valueProp = filterProps?.value;
  const lexiconDefault = filterProps?.defaultValue;
  const onValueChange = filterProps?.onValueChange;
  const [internalSelected, setInternalSelected] = useState(
    props.variant === "filter"
      ? (lexiconDefault ?? defaultSelected ?? false)
      : false,
  );
  const isFilter = variant === "filter";
  if (isFilter) {
    // The lexicon booleans are component state, not DOM attributes — a
    // filter chip must not render `value="true"` onto its `<button>`.
    // (Action chips keep the DOM `value`; see the note above.)
    delete (buttonProps as Record<string, unknown>).value;
    delete (buttonProps as Record<string, unknown>).defaultValue;
    delete (buttonProps as Record<string, unknown>).onValueChange;
  }
  const selected = isFilter
    ? (valueProp ?? selectedProp ?? internalSelected)
    : false;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (isFilter && !disabled && !event.defaultPrevented) {
      const next = !selected;
      if (valueProp === undefined && selectedProp === undefined)
        setInternalSelected(next);
      onValueChange?.(next);
      onSelectedChange?.(next);
    }
  }

  return (
    <button
      data-slot="chip"
      aria-pressed={isFilter ? selected : undefined}
      aria-disabled={disabled || undefined}
      data-selected={isFilter && selected ? "" : undefined}
      className={cn(
        chipVariants({
          variant,
          elevated: elevated && (variant === "assist" || variant === "filter"),
        }),
        className,
      )}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      {...buttonProps}
    >
      {isFilter && selected ? (
        <svg
          data-slot="chip-check"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 12.5 10 17.5 19 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
}

export { chipVariants };
