import { cva } from "class-variance-authority";
import type { ComponentPropsWithRef, MouseEvent } from "react";
import { useState } from "react";
import { cn } from "../utils/cn";

const chipVariants = cva(
  "kern-chip relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-(--md-sys-shape-corner-full) px-3 text-xs font-medium transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none disabled:opacity-50 after:absolute after:-inset-2 after:content-['']",
  {
    variants: {
      variant: {
        assist:
          "bg-(--md-sys-color-surface-tonal) text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)",
        filter:
          "bg-(--md-sys-color-surface-tonal) text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high) data-selected:bg-(--md-sys-color-primary) data-selected:text-(--md-sys-color-on-primary)",
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
  const [internalSelected, setInternalSelected] = useState(
    props.variant === "filter" ? (defaultSelected ?? false) : false,
  );
  const isFilter = variant === "filter";
  const selected = isFilter ? (selectedProp ?? internalSelected) : false;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (isFilter && !disabled && !event.defaultPrevented) {
      const next = !selected;
      if (selectedProp === undefined) setInternalSelected(next);
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
