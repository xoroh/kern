import { Select as SelectPrimitive } from "@base-ui/react/select";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type SelectRootProps<
  T = unknown,
  Multiple extends boolean | undefined = false,
> = ComponentProps<typeof SelectPrimitive.Root<T, Multiple>>;
export type SelectTriggerProps = ComponentProps<
  typeof SelectPrimitive.Trigger
> & {
  /**
   * M3 select treatment. `outlined` (default) draws the 1px outline;
   * `filled` fills `surface-container-highest` with a bottom active
   * indicator. Functionally identical — pick by surface.
   */
  variant?: "outlined" | "filled";
};
export type SelectContentProps = ComponentProps<typeof SelectPrimitive.Popup>;
export type SelectItemProps = ComponentProps<typeof SelectPrimitive.Item>;
export type SelectSeparatorProps = ComponentProps<
  typeof SelectPrimitive.Separator
>;
export type SelectGroupProps = ComponentProps<typeof SelectPrimitive.Group>;
export type SelectGroupLabelProps = ComponentProps<
  typeof SelectPrimitive.GroupLabel
>;

export function SelectRoot<T, Multiple extends boolean | undefined = false>(
  props: SelectRootProps<T, Multiple>,
) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

export function SelectTrigger({
  variant = "outlined",
  className,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-variant={variant}
      className={cnState(
        "kern-select-trigger flex h-14 w-full cursor-pointer items-center justify-between gap-2 text-base text-(--md-sys-color-on-surface) outline-none transition-colors data-disabled:cursor-not-allowed data-placeholder:text-(--md-sys-color-on-surface-variant) " +
          (variant === "filled"
            ? "rounded-t-(--md-sys-shape-corner-extra-small) border-b border-(--md-sys-color-on-surface-variant) bg-(--md-sys-color-surface-container-highest) px-4 focus:border-b-2 focus:border-(--md-sys-color-primary) data-disabled:border-(--md-sys-color-on-surface)/38 data-disabled:bg-(--md-sys-color-on-surface)/4 data-disabled:text-(--md-sys-color-on-surface)/38"
            : "rounded-(--md-sys-shape-corner-extra-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) px-4 hover:border-(--md-sys-color-on-surface) focus:border-2 focus:border-(--md-sys-color-primary) focus:px-[15px] data-disabled:border-(--md-sys-color-on-surface)/12 data-disabled:bg-transparent data-disabled:text-(--md-sys-color-on-surface)/38"),
        className,
      )}
      {...props}
    />
  );
}

export function SelectValue(
  props: ComponentProps<typeof SelectPrimitive.Value>,
) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

export function SelectContent({ className, ...props }: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        sideOffset={4}
        className="kern-select-positioner"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cnState(
            "kern-select-popup min-w-28 max-w-[280px] rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface-container) p-2 shadow-(--md-sys-elevation-level2) outline-none",
            className,
          )}
          {...props}
        />
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cnState(
        "kern-select-item flex min-h-12 cursor-pointer items-center gap-2 rounded-(--md-sys-shape-corner-extra-small) px-3 text-sm text-(--md-sys-color-on-surface) outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-(--md-sys-color-surface-tonal)",
        className,
      )}
      {...props}
    />
  );
}

export function SelectItemText(
  props: ComponentProps<typeof SelectPrimitive.ItemText>,
) {
  return <SelectPrimitive.ItemText data-slot="select-item-text" {...props} />;
}

export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cnState(
        "kern-select-separator mx-2 my-1 h-px bg-(--md-sys-color-outline-variant)",
        className,
      )}
      {...props}
    />
  );
}

export function SelectGroup({ className, ...props }: SelectGroupProps) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cnState("kern-select-group", className)}
      {...props}
    />
  );
}

export function SelectGroupLabel({
  className,
  ...props
}: SelectGroupLabelProps) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-group-label"
      className={cnState(
        "kern-select-group-label px-3 py-2 text-xs font-medium text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

/** Single-choice dropdown bound to a field-sized trigger. */
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
  ItemText: SelectItemText,
  Separator: SelectSeparator,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
};
