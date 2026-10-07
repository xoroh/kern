import { cva } from "class-variance-authority";
import type { ComponentPropsWithRef, MouseEvent } from "react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { FOCUS_RING_CLASS } from "./focus-ring";

const chipVariants = cva(
  "kern-chip relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-(--md-sys-shape-corner-full) px-3 text-xs font-medium transition-colors outline-none select-none " + FOCUS_RING_CLASS + " disabled:pointer-events-none disabled:opacity-50 after:absolute after:-inset-2 after:content-['']",
  {
    variants: {
      variant: {
        assist:
          "bg-(--md-sys-color-surface-tonal) text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)",
        filter:
          "bg-(--md-sys-color-surface-tonal) text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high) data-selected:bg-(--md-sys-color-primary) data-selected:text-(--md-sys-color-on-primary)",
        // M3 lists FOUR chip variants (m3.material.io/components/chips/overview):
        // assist, filter, input, suggestion. `input` was missing.
        input:
          "bg-(--md-sys-color-surface) text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-tonal) pr-1",
        suggestion:
          "border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-tonal)",
      },
    },
    defaultVariants: { variant: "assist" },
  },
);

type CommonChipProps = Omit<
  ComponentPropsWithRef<"button">,
  "aria-pressed" | "type"
> & { type?: "button" | "submit" | "reset" };

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
  variant?: "assist" | "suggestion";
  selected?: never;
  defaultSelected?: never;
  onSelectedChange?: never;
};

export type ChipProps = FilterChipProps | ActionChipProps;

export function Chip(props: ChipProps) {
  const {
    variant = "assist",
    className,
    disabled,
    type = "button",
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
      data-selected={isFilter && selected ? "" : undefined}
      className={cn(chipVariants({ variant }), className)}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      {...buttonProps}
    />
  );
}

export { chipVariants };
