import { Select as SelectPrimitive } from "@base-ui/react/select";
import type { ComponentProps, ReactNode } from "react";
import { cnState } from "../utils/cnState";

/**
 * One selectable country. Kern ships no country dataset — the consumer passes
 * `options` (an ISO 3166 list, a billing-region list, whatever fits).
 */
export type CountryOption = {
  /** ISO 3166-1 alpha-2 code, or any stable key the consumer uses. */
  code: string;
  /** Display name in the consumer's locale. */
  name: string;
  /** Dial code without the leading `+`. */
  dialCode?: string;
  /** Leading adornment: a flag emoji, an `Icon`, or any node. */
  flag?: ReactNode;
  disabled?: boolean;
};

export type CountrySelectRootProps<T extends CountryOption = CountryOption> =
  Omit<ComponentProps<typeof SelectPrimitive.Root<T>>, "items"> & {
    /** The countries to offer. */
    options: readonly CountryOption[];
    /** Called with the chosen country. */
    onCountryChange?: (country: CountryOption | null) => void;
  };

export type CountrySelectTriggerProps = ComponentProps<
  typeof SelectPrimitive.Trigger
>;
export type CountrySelectContentProps = ComponentProps<
  typeof SelectPrimitive.Popup
>;
export type CountrySelectItemProps = ComponentProps<
  typeof SelectPrimitive.Item
>;
export type CountrySelectLabelProps = ComponentProps<
  typeof SelectPrimitive.Label
>;

export function CountrySelectRoot<T extends CountryOption = CountryOption>({
  options,
  onCountryChange,
  children,
  ...props
}: CountrySelectRootProps<T>) {
  return (
    <SelectPrimitive.Root<T>
      data-slot="country-select"
      items={options.map((option) => ({ label: option.name, value: option }))}
      itemToStringLabel={(item) => item?.name ?? ""}
      itemToStringValue={(item) => item?.code ?? ""}
      onValueChange={(value, eventDetails) => {
        props.onValueChange?.(value, eventDetails);
        onCountryChange?.((value as CountryOption | null) ?? null);
      }}
      {...props}
    >
      {children}
    </SelectPrimitive.Root>
  );
}

export function CountrySelectLabel({
  className,
  ...props
}: CountrySelectLabelProps) {
  return (
    <SelectPrimitive.Label
      data-slot="country-select-label"
      className={cnState(
        "kern-country-select-label text-sm font-medium text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    />
  );
}

export function CountrySelectTrigger({
  className,
  ...props
}: CountrySelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="country-select-trigger"
      className={cnState(
        "kern-country-select-trigger flex h-14 w-full cursor-pointer items-center justify-between gap-2 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) px-4 text-base text-(--md-sys-color-on-surface) outline-none transition-colors focus:border-(--md-sys-color-primary) data-disabled:cursor-not-allowed data-disabled:opacity-50 data-placeholder:text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

/** Renders the flag then the name for the current value. */
export function CountrySelectValue(
  props: ComponentProps<typeof SelectPrimitive.Value>,
) {
  return <SelectPrimitive.Value data-slot="country-select-value" {...props} />;
}

export function CountrySelectContent({
  className,
  ...props
}: CountrySelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        sideOffset={4}
        className="kern-country-select-positioner"
      >
        <SelectPrimitive.Popup
          data-slot="country-select-content"
          className={cnState(
            "kern-country-select-popup min-w-64 max-h-80 overflow-y-auto rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) p-2 shadow-(--md-sys-elevation-level2) outline-none",
            className,
          )}
          {...props}
        />
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

export function CountrySelectItem({
  className,
  children,
  ...props
}: CountrySelectItemProps) {
  return (
    <SelectPrimitive.Item
      data-slot="country-select-item"
      className={cnState(
        "kern-country-select-item flex min-h-12 cursor-pointer items-center gap-3 rounded-(--md-sys-shape-corner-extra-small) px-3 text-sm text-(--md-sys-color-on-surface) outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-(--md-sys-color-surface-tonal)",
        className,
      )}
      {...props}
    >
      {children}
    </SelectPrimitive.Item>
  );
}

/**
 * Single-choice country dropdown. `options` is a prop by design: Kern ships no
 * country dataset, so no locale, size, or update policy is baked in.
 */
export const CountrySelect = {
  Root: CountrySelectRoot,
  Label: CountrySelectLabel,
  Trigger: CountrySelectTrigger,
  Value: CountrySelectValue,
  Content: CountrySelectContent,
  Item: CountrySelectItem,
};
