import type { TimePickerFormat, TimePickerValue } from "@xoroh/axis";
import { type ReactNode, useState } from "react";
import { Pressable, type StyleProp, View, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";
import { Calendar } from "./calendar";
import { KernOverlay } from "./kern-overlay";
import { BottomSheetPicker, type PickerOption } from "./sheets";
import { Text } from "./text";
import { TimePicker } from "./time-picker";

/**
 * KernPicker — ONE picker, native renderer (CL-008; D925).
 *
 * Same mode contract as web `KernPicker`: `date` / `time` / `date-time` /
 * `country` / `option-list` / `assignee` / `status` / `plan`. Variants:
 * `dialog` (centered modal) / `bottom-sheet` (sheet + snap physics) /
 * `inline-popover` (inline expanded list — N has no floating anchored
 * popover; the option list renders in place, non-modal).
 *
 * `plan` merges the PlanSelector dupe through `serviceCatalogToOptions`;
 * `ReasonPicker` is generic over the injected `ReasonDataAdapter` (MS-020,
 * QUEUE-145 — no local reasons copy on either renderer).
 */

export type KernPickerMode =
  | "date"
  | "time"
  | "date-time"
  | "country"
  | "option-list"
  | "assignee"
  | "status"
  | "plan";

export type KernPickerVariant = "dialog" | "bottom-sheet" | "inline-popover";

export type { PickerOption };

export type ServiceCatalogEntry = {
  id: string;
  name: string;
  description?: string;
  priceLabel?: string;
};

/** Service-catalog → picker rows: the CMP-1320/2455 merge point. */
export function serviceCatalogToOptions(
  entries: readonly ServiceCatalogEntry[],
): PickerOption[] {
  return entries.map((entry) => ({
    value: entry.id,
    label: entry.name,
    supporting:
      entry.description && entry.priceLabel
        ? `${entry.description} · ${entry.priceLabel}`
        : (entry.description ?? entry.priceLabel),
  }));
}

export type ReasonEntry = {
  id: string;
  label: string;
  context: string;
  detail?: string;
};

/** Generic reasons adapter (MS-020): injected data, never a local copy. */
export type ReasonDataAdapter = {
  reasons: readonly ReasonEntry[];
  context?: string;
};

/** Adapter → picker rows, honouring the context filter. */
export function reasonAdapterToOptions(
  adapter: ReasonDataAdapter,
): PickerOption[] {
  return adapter.reasons
    .filter(
      (reason) =>
        adapter.context === undefined || reason.context === adapter.context,
    )
    .map((reason) => ({
      value: reason.id,
      label: reason.label,
      supporting: reason.detail,
    }));
}

export type NativeCountryOption = {
  code: string;
  name: string;
  dialCode?: string;
  disabled?: boolean;
};

export type NativeKernPickerProps = {
  mode?: KernPickerMode;
  variant?: KernPickerVariant;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Accessible name + default trigger label. */
  label: string;
  placeholder?: string;
  options?: readonly PickerOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onSelect?: (value: string) => void;
  onMultiSelect?: (values: string[]) => void;
  multiple?: boolean;
  dateValue?: Date;
  defaultDateValue?: Date;
  onDateChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  timeValue?: TimePickerValue;
  defaultTimeValue?: TimePickerValue;
  onTimeChange?: (value: TimePickerValue) => void;
  timeFormat?: TimePickerFormat;
  timeStep?: number;
  countries?: readonly NativeCountryOption[];
  countryCode?: string;
  defaultCountryCode?: string;
  onCountryChange?: (country: NativeCountryOption | null) => void;
  catalog?: readonly ServiceCatalogEntry[];
  reasons?: ReasonDataAdapter;
  /** Trigger content. Default: a 48dp row showing selection/placeholder. */
  trigger?: ReactNode;
  triggerLabel?: string;
  /** Panel override. */
  panel?: ReactNode;
  /** Footer-actions slot (dialog/sheet variants). */
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function isOptionMode(mode: KernPickerMode): boolean {
  return (
    mode === "option-list" ||
    mode === "assignee" ||
    mode === "status" ||
    mode === "plan"
  );
}

function OptionRows({
  labelledBy,
  options,
  value,
  multiple,
  onPick,
}: {
  labelledBy: string;
  options: readonly PickerOption[];
  value: string | string[] | undefined;
  multiple: boolean;
  onPick: (value: string) => void;
}) {
  const scheme = useKernScheme();
  const selected = (option: PickerOption) =>
    Array.isArray(value)
      ? value.includes(option.value)
      : value === option.value;
  return (
    <View
      accessibilityRole={multiple ? "checkbox" : "radiogroup"}
      accessibilityLabel={labelledBy}
      testID="kern-picker-options"
    >
      {options.map((option) => {
        const isSelected = selected(option);
        return (
          <Pressable
            key={option.value}
            accessibilityRole={multiple ? "checkbox" : "radio"}
            accessibilityLabel={option.label}
            accessibilityState={{
              selected: isSelected,
              disabled: option.disabled,
            }}
            disabled={option.disabled}
            onPress={() => onPick(option.value)}
            style={{
              minHeight: 48,
              justifyContent: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: Number.parseFloat(scheme.shape.medium),
              backgroundColor: isSelected
                ? scheme.color.secondaryContainer
                : "transparent",
              opacity: option.disabled ? 0.38 : 1,
            }}
          >
            <Text
              variant="label"
              style={{
                color: isSelected
                  ? scheme.color.onSecondaryContainer
                  : scheme.color.onSurface,
              }}
            >
              {option.label}
              {isSelected ? " ✓" : ""}
            </Text>
            {option.supporting ? (
              <Text
                variant="label"
                style={{ color: scheme.color.onSurfaceVariant }}
              >
                {option.supporting}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

/** ONE picker (native): date/time/date-time/country/option-list/assignee/status/plan. */
export function KernPicker({
  mode = "option-list",
  variant = "dialog",
  open,
  defaultOpen,
  onOpenChange,
  label,
  placeholder = "Select",
  options = [],
  value,
  defaultValue,
  onSelect,
  onMultiSelect,
  multiple = false,
  dateValue,
  defaultDateValue,
  onDateChange,
  minDate,
  maxDate,
  timeValue,
  defaultTimeValue,
  onTimeChange,
  timeFormat = "24h",
  timeStep = 1,
  countries = [],
  countryCode,
  defaultCountryCode,
  onCountryChange,
  catalog,
  reasons,
  trigger,
  triggerLabel,
  panel,
  footer,
  style,
  testID,
}: NativeKernPickerProps) {
  const scheme = useKernScheme();
  const effectiveOptions: readonly PickerOption[] =
    mode === "plan" && catalog
      ? serviceCatalogToOptions(catalog)
      : reasons && (mode === "option-list" || mode === "status")
        ? reasonAdapterToOptions(reasons)
        : options;

  const currentValue = value ?? defaultValue;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    defaultOpen ?? false,
  );
  const openValue = open ?? uncontrolledOpen;
  const reportOpen = (next: boolean) => {
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const pick = (next: string) => {
    if (multiple) {
      const list = Array.isArray(currentValue)
        ? currentValue
        : currentValue !== undefined
          ? [currentValue]
          : [];
      onMultiSelect?.(
        list.includes(next) ? list.filter((v) => v !== next) : [...list, next],
      );
      return;
    }
    onSelect?.(next);
    reportOpen(false);
  };

  const selectionLabel = (): string => {
    if (mode === "date" || mode === "date-time") {
      const date = dateValue ?? defaultDateValue;
      if (date) return date.toLocaleDateString();
    }
    if (mode === "country") {
      const code = countryCode ?? defaultCountryCode;
      const found = countries.find((c) => c.code === code);
      if (found) return found.name;
    }
    if (isOptionMode(mode)) {
      const key = Array.isArray(currentValue) ? currentValue[0] : currentValue;
      const found = effectiveOptions.find((o) => o.value === key);
      if (found) return found.label;
    }
    return placeholder;
  };

  const defaultTrigger = trigger ?? (
    <Text variant="label" style={{ color: scheme.color.onSurface }}>
      {triggerLabel ?? selectionLabel()}
    </Text>
  );

  const datePanel =
    mode === "date" || mode === "date-time" ? (
      <Calendar
        value={dateValue}
        defaultValue={defaultDateValue}
        onValueChange={onDateChange}
        min={minDate}
        max={maxDate}
        accessibilityLabel={`${label} calendar`}
      />
    ) : null;
  const timePanel =
    mode === "time" || mode === "date-time" ? (
      <TimePicker
        value={timeValue}
        defaultValue={defaultTimeValue}
        onValueChange={onTimeChange}
        format={timeFormat}
        step={timeStep}
        accessibilityLabel={`${label} time`}
      />
    ) : null;

  const body =
    panel ??
    (mode === "date" || mode === "time" || mode === "date-time" ? (
      <View>
        {datePanel}
        {timePanel}
      </View>
    ) : mode === "country" ? (
      <OptionRows
        labelledBy={label}
        options={countries.map((country) => ({
          value: country.code,
          label: country.name,
          supporting:
            country.dialCode !== undefined ? `+${country.dialCode}` : undefined,
          disabled: country.disabled,
        }))}
        value={countryCode ?? defaultCountryCode}
        multiple={false}
        onPick={(code) => {
          onCountryChange?.(countries.find((c) => c.code === code) ?? null);
          reportOpen(false);
        }}
      />
    ) : (
      <OptionRows
        labelledBy={label}
        options={effectiveOptions}
        value={currentValue}
        multiple={multiple}
        onPick={pick}
      />
    ));

  if (variant === "inline-popover") {
    // N has no floating anchored popover: the list renders in place,
    // non-modal, under the trigger. Same options contract, no Modal.
    return (
      <View testID={testID ?? "kern-picker"} style={style}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={() => reportOpen(!openValue)}
          style={{ minHeight: 48, justifyContent: "center" }}
        >
          {defaultTrigger}
        </Pressable>
        {openValue ? body : null}
        {openValue ? footer : null}
      </View>
    );
  }

  if (variant === "bottom-sheet" && isOptionMode(mode)) {
    // The sheet-as-selector: BottomSheetPicker is the native counterpart
    // of a web select. Single-select closes; multi-select is served by
    // the dialog variant (the sheet picker is single-pick by contract).
    return (
      <BottomSheetPicker
        open={openValue}
        onOpenChange={reportOpen}
        title={label}
        options={[...effectiveOptions]}
        value={Array.isArray(currentValue) ? currentValue[0] : currentValue}
        onSelect={(next) => {
          if (multiple) {
            pick(next);
            return;
          }
          onSelect?.(next);
          reportOpen(false);
        }}
        testID={testID ?? "kern-picker"}
      />
    );
  }

  return (
    <KernOverlay
      variant={variant === "bottom-sheet" ? "sheet" : "modal"}
      open={openValue}
      onOpenChange={reportOpen}
      title={label}
      trigger={defaultTrigger}
      triggerLabel={triggerLabel ?? selectionLabel()}
      footer={footer}
      testID={testID ?? "kern-picker"}
      style={style}
    >
      {body}
    </KernOverlay>
  );
}

export type ReasonPickerProps = Omit<
  NativeKernPickerProps,
  "mode" | "reasons"
> & {
  /** Injected reasons (QUEUE-145 system). Required: no local copy exists. */
  reasons: ReasonDataAdapter;
};

/**
 * Generic reason picker (MS-020, native): rows come ONLY from the injected
 * adapter — this component owns no reason dataset, in any context.
 */
export function ReasonPicker({ reasons, ...props }: ReasonPickerProps) {
  return (
    <KernPicker
      mode="option-list"
      options={reasonAdapterToOptions(reasons)}
      {...props}
    />
  );
}
