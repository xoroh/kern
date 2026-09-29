import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import type { ComponentProps } from "react";
import { cn } from "../utils/cn";
import { cnState } from "../utils/cnState";

export type AutocompleteRootProps = ComponentProps<
  typeof AutocompletePrimitive.Root
>;
export type AutocompleteInputProps = ComponentProps<
  typeof AutocompletePrimitive.Input
>;
export type AutocompleteContentProps = ComponentProps<
  typeof AutocompletePrimitive.Popup
>;
export type AutocompleteItemProps = ComponentProps<
  typeof AutocompletePrimitive.Item
>;
export type AutocompleteEmptyProps = ComponentProps<
  typeof AutocompletePrimitive.Empty
>;
export type AutocompleteLabelProps = ComponentProps<"label">;

export function AutocompleteRoot(props: AutocompleteRootProps) {
  return <AutocompletePrimitive.Root data-slot="autocomplete" {...props} />;
}

export function AutocompleteLabel({
  className,
  ...props
}: AutocompleteLabelProps) {
  return (
    // Plain label: the Autocomplete primitive exposes no label part.
    // Association comes from the consumer via htmlFor.
    // biome-ignore lint/a11y/noLabelWithoutControl: consumers associate this label with the input through htmlFor.
    <label
      data-slot="autocomplete-label"
      className={cn(
        "kern-autocomplete-label text-sm font-medium text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}

export function AutocompleteInput({
  className,
  ...props
}: AutocompleteInputProps) {
  return (
    <AutocompletePrimitive.Input
      data-slot="autocomplete-input"
      className={cnState(
        "kern-autocomplete-input h-14 w-full rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) px-4 text-base text-(--md-sys-color-on-surface) outline-none transition-colors placeholder:text-(--md-sys-color-on-surface-variant) focus:border-(--md-sys-color-primary)",
        className,
      )}
      {...props}
    />
  );
}

export function AutocompleteContent({
  className,
  ...props
}: AutocompleteContentProps) {
  return (
    <AutocompletePrimitive.Portal>
      <AutocompletePrimitive.Positioner
        sideOffset={4}
        className="kern-autocomplete-positioner"
      >
        <AutocompletePrimitive.Popup
          data-slot="autocomplete-content"
          className={cnState(
            "kern-autocomplete-popup min-w-48 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) p-2 shadow-(--md-sys-elevation-level2) outline-none",
            className,
          )}
          {...props}
        />
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  );
}

export function AutocompleteItem({
  className,
  ...props
}: AutocompleteItemProps) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cnState(
        "kern-autocomplete-item flex min-h-12 cursor-pointer items-center gap-2 rounded-(--md-sys-shape-corner-extra-small) px-3 text-sm text-(--md-sys-color-on-surface) outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-(--md-sys-color-surface-tonal)",
        className,
      )}
      {...props}
    />
  );
}

export function AutocompleteEmpty({
  className,
  ...props
}: AutocompleteEmptyProps) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      className={cnState(
        "kern-autocomplete-empty px-3 py-2 text-sm text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

/** Free-text input with filtered suggestion list. */
export const Autocomplete = {
  Root: AutocompleteRoot,
  Label: AutocompleteLabel,
  Input: AutocompleteInput,
  Content: AutocompleteContent,
  Item: AutocompleteItem,
  Empty: AutocompleteEmpty,
};
