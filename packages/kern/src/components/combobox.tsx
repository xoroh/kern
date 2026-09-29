import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type ComboboxRootProps<T = unknown> = ComponentProps<
  typeof ComboboxPrimitive.Root<T>
>;
export type ComboboxInputProps = ComponentProps<typeof ComboboxPrimitive.Input>;
export type ComboboxTriggerProps = ComponentProps<
  typeof ComboboxPrimitive.Trigger
>;
export type ComboboxClearProps = ComponentProps<typeof ComboboxPrimitive.Clear>;
export type ComboboxContentProps = ComponentProps<
  typeof ComboboxPrimitive.Popup
>;
export type ComboboxItemProps = ComponentProps<typeof ComboboxPrimitive.Item>;
export type ComboboxEmptyProps = ComponentProps<typeof ComboboxPrimitive.Empty>;
export type ComboboxLabelProps = ComponentProps<typeof ComboboxPrimitive.Label>;

export function ComboboxRoot<T>(props: ComboboxRootProps<T>) {
  return <ComboboxPrimitive.Root data-slot="combobox" {...props} />;
}

export function ComboboxLabel({ className, ...props }: ComboboxLabelProps) {
  return (
    <ComboboxPrimitive.Label
      data-slot="combobox-label"
      className={cnState(
        "kern-combobox-label text-sm font-medium text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxInput({ className, ...props }: ComboboxInputProps) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      className={cnState(
        "kern-combobox-input h-14 w-full rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) px-4 text-base text-(--md-sys-color-on-surface) outline-none transition-colors placeholder:text-(--md-sys-color-on-surface-variant) focus:border-(--md-sys-color-primary)",
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxTrigger({ className, ...props }: ComboboxTriggerProps) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cnState("kern-combobox-trigger", className)}
      {...props}
    />
  );
}

export function ComboboxClear({ className, ...props }: ComboboxClearProps) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      className={cnState("kern-combobox-clear", className)}
      {...props}
    />
  );
}

export function ComboboxContent({ className, ...props }: ComboboxContentProps) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        sideOffset={4}
        className="kern-combobox-positioner"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cnState(
            "kern-combobox-popup min-w-48 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) p-2 shadow-(--md-sys-elevation-level2) outline-none",
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

export function ComboboxItem({ className, ...props }: ComboboxItemProps) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cnState(
        "kern-combobox-item flex min-h-12 cursor-pointer items-center gap-2 rounded-(--md-sys-shape-corner-extra-small) px-3 text-sm text-(--md-sys-color-on-surface) outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-(--md-sys-color-surface-tonal)",
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxEmpty({ className, ...props }: ComboboxEmptyProps) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cnState(
        "kern-combobox-empty px-3 py-2 text-sm text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

/** Type-to-filter single choice with a field-sized input. */
export const Combobox = {
  Root: ComboboxRoot,
  Label: ComboboxLabel,
  Input: ComboboxInput,
  Trigger: ComboboxTrigger,
  Clear: ComboboxClear,
  Content: ComboboxContent,
  Item: ComboboxItem,
  Empty: ComboboxEmpty,
};
