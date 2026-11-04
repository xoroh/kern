import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { Calendar } from "./calendar";
import type { CountryOption } from "./country-select";
import { FOCUS_RING_CLASS } from "./focus-ring";
import { KernOverlay } from "./kern-overlay";
import { Popover } from "./popover";
import type { PickerOption } from "./sheet-family";
import {
  formatClock,
  TimePicker,
  type TimePickerFormat,
  type TimePickerValue,
} from "./time-picker";

/**
 * KernPicker — ONE picker (CL-008; D925 "one picker").
 *
 * Modes: `date` / `time` / `date-time` / `country` / `option-list` /
 * `assignee` / `status` / `plan`. Variants: `dialog` (W) / `bottom-sheet`
 * (N) / `inline-popover` (anchored, non-modal).
 *
 * Slots: `trigger` / panel (per-mode, overridable via `panel`) /
 * `footer` (footer-actions: Cancel/Apply).
 *
 * Data adapters (visuals + contracts only — Q3 split: data wiring lives in
 * service-catalog-1, never here):
 * - `plan` merges the PlanSelector dupe (CMP-1320 vs 2455): pass `catalog`
 *   (service-catalog entries) and the picker renders them through
 *   `serviceCatalogToOptions`. No second plan selector.
 * - `ReasonPicker` (MS-020) is generic with a data adapter: reasons arrive
 *   via props and are consumed from the QUEUE-145 reasons system — the
 *   picker owns NO local reasons copy (asserted in test).
 *
 * M3: https://m3.material.io/components/date-pickers,
 * https://m3.material.io/components/time-pickers,
 * https://m3.material.io/components/menus,
 * https://m3.material.io/components/bottom-sheets
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

/**
 * One selectable row. Single definition for the whole picker family —
 * re-exported from the sheet-family contract, never re-declared (D925).
 */
export type { PickerOption };

/** One service-catalog entry (D924 adapter input for `plan` mode). */
export type ServiceCatalogEntry = {
  id: string;
  name: string;
  description?: string;
  /** Localised price line, e.g. drawn from the catalog pricing. */
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

/**
 * One reason row. The context (`cancel` / `refund` / `reject` / `ticket` /
 * `block` / `verify` …) selects which reasons apply — the picker never
 * invents rows for a context it was not given.
 */
export type ReasonEntry = {
  id: string;
  label: string;
  context: string;
  detail?: string;
};

/** Generic reasons adapter (MS-020): injected data, never a local copy. */
export type ReasonDataAdapter = {
  reasons: readonly ReasonEntry[];
  /** When set, only rows for this context are offered. */
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

export type KernPickerProps = {
  mode?: KernPickerMode;
  variant?: KernPickerVariant;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Accessible name for the surface + default trigger label. */
  label: string;
  placeholder?: string;
  /** Option modes (`option-list` / `assignee` / `status` / `plan` fallback). */
  options?: readonly PickerOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  /** Single-select pick (also closes the surface: select-then-dismiss). */
  onSelect?: (value: string) => void;
  /** Multi-select report (`multiple`). The surface stays open. */
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
  countries?: readonly CountryOption[];
  countryCode?: string;
  defaultCountryCode?: string;
  onCountryChange?: (country: CountryOption | null) => void;
  /** `plan` mode primary input (preferred over `options`). */
  catalog?: readonly ServiceCatalogEntry[];
  /** Reason mode input (used by `ReasonPicker`). */
  reasons?: ReasonDataAdapter;
  /**
   * Trigger slot: the element rendered AS the trigger (Base UI `render`
   * model — typically a `<button>`). Default: a button showing the current
   * selection or the placeholder.
   */
  trigger?: ReactElement;
  /** Panel override. Default: the per-mode panel below. */
  panel?: ReactNode;
  /** Footer-actions slot: Cancel/Apply. */
  footer?: ReactNode;
  className?: string;
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

function OptionList({
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
  const selected = (option: PickerOption) =>
    Array.isArray(value)
      ? value.includes(option.value)
      : value === option.value;
  return (
    <div
      role="listbox"
      aria-label={labelledBy}
      aria-multiselectable={multiple || undefined}
      data-slot="picker-options"
      className="flex list-none flex-col gap-1 p-0"
    >
      {options.map((option) => {
        const isSelected = selected(option);
        return (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={isSelected}
            disabled={option.disabled}
            onClick={() => onPick(option.value)}
            className={cn(
              "flex min-h-12 w-full flex-col items-start gap-0.5 rounded-(--sys-shape-corner-medium) p-3 text-left outline-none transition-colors",
              FOCUS_RING_CLASS,
              "hover:opacity-[var(--sys-state-hover)]",
              "active:opacity-[var(--sys-state-press)]",
              isSelected
                ? "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container)"
                : "text-(--sys-color-on-surface)",
              option.disabled && "opacity-[var(--sys-state-disabled)]",
            )}
          >
            <span className="text-(--sys-typescale-body-large-font-size)">
              {option.label}
              {isSelected ? <span aria-hidden="true"> ✓</span> : null}
            </span>
            {option.supporting ? (
              // Hidden from the accessible name: the option is named by its
              // label alone ("Pro", not "Pro Most popular"), so role=option
              // queries stay exact. The detail remains visible text.
              <span
                aria-hidden="true"
                className="text-(--sys-typescale-body-small-font-size) text-(--sys-color-on-surface-variant)"
              >
                {option.supporting}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/** ONE picker: date/time/date-time/country/option-list/assignee/status/plan. */
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
  panel,
  footer,
  className,
  testID,
}: KernPickerProps) {
  const effectiveOptions: readonly PickerOption[] =
    mode === "plan" && catalog
      ? serviceCatalogToOptions(catalog)
      : reasons && (mode === "option-list" || mode === "status")
        ? reasonAdapterToOptions(reasons)
        : options;

  const currentValue = value ?? defaultValue;
  // The picker owns visibility when uncontrolled, so single-select
  // select-then-dismiss works with no consumer wiring. Controlled `open`
  // passes straight through; every close flows through `reportOpen`.
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
      const updated = list.includes(next)
        ? list.filter((v) => v !== next)
        : [...list, next];
      onMultiSelect?.(updated);
      return;
    }
    onSelect?.(next);
    // Select-then-dismiss, the same rule the modal drawer follows: a
    // single pick resolves the surface, multi-select stays open for more.
    reportOpen(false);
  };

  const triggerLabel = (): string => {
    if (mode === "date" || mode === "date-time") {
      const date = dateValue ?? defaultDateValue;
      if (date) return date.toLocaleDateString();
    }
    if (mode === "time" || mode === "date-time") {
      const time = timeValue ?? defaultTimeValue;
      if (time && mode === "time") return formatClock(time, timeFormat);
    }
    if (mode === "country") {
      const code = countryCode ?? defaultCountryCode;
      const found = countries.find((c) => c.code === code);
      if (found) return found.name;
    }
    if (isOptionMode(mode)) {
      const key = Array.isArray(currentValue) ? currentValue[0] : currentValue;
      const found = effectiveOptions.find((o) => o.value === key);
      if (found) {
        return Array.isArray(currentValue) && currentValue.length > 1
          ? `${found.label} +${currentValue.length - 1}`
          : found.label;
      }
    }
    return placeholder;
  };

  const defaultTriggerElement = (
    <button
      type="button"
      aria-label={label}
      className={
        "kern-picker-trigger inline-flex min-h-12 cursor-pointer items-center justify-between gap-2 rounded-(--sys-shape-corner-small) border border-(--sys-color-outline) bg-(--sys-color-surface) px-4 text-sm text-(--sys-color-on-surface) outline-none " +
        FOCUS_RING_CLASS
      }
    >
      <span className="truncate">{triggerLabel()}</span>
      <span aria-hidden="true" className="text-xs">
        ▾
      </span>
    </button>
  );

  const body: ReactNode = panel ?? (
    <>
      {mode === "date" || mode === "date-time" ? (
        <Calendar
          value={dateValue}
          defaultValue={defaultDateValue}
          onValueChange={onDateChange}
          min={minDate}
          max={maxDate}
        />
      ) : null}
      {mode === "time" || mode === "date-time" ? (
        <TimePicker
          value={timeValue}
          defaultValue={defaultTimeValue}
          onValueChange={onTimeChange}
          format={timeFormat}
          step={timeStep}
          label={mode === "time" ? label : `${label} time`}
        />
      ) : null}
      {mode === "country" ? (
        <OptionList
          labelledBy={label}
          options={countries.map((country) => ({
            value: country.code,
            label: country.name,
            supporting:
              country.dialCode !== undefined
                ? `+${country.dialCode}`
                : undefined,
            disabled: country.disabled,
          }))}
          value={countryCode ?? defaultCountryCode}
          multiple={false}
          onPick={(code) => {
            onCountryChange?.(countries.find((c) => c.code === code) ?? null);
            reportOpen(false);
          }}
        />
      ) : null}
      {isOptionMode(mode) ? (
        <OptionList
          labelledBy={label}
          options={effectiveOptions}
          value={currentValue}
          multiple={multiple}
          onPick={pick}
        />
      ) : null}
    </>
  );

  if (variant === "inline-popover") {
    return (
      <Popover.Root open={openValue} onOpenChange={reportOpen}>
        <Popover.Trigger render={trigger ?? defaultTriggerElement} />
        <Popover.Content
          data-testid={testID ?? "kern-picker"}
          className={cn("flex max-h-[60vh] flex-col gap-2", className)}
        >
          <Popover.Title>{label}</Popover.Title>
          <div className="overflow-y-auto">{body}</div>
          {footer ? (
            <div data-slot="picker-footer" className="flex justify-end gap-2">
              {footer}
            </div>
          ) : null}
        </Popover.Content>
      </Popover.Root>
    );
  }

  return (
    <KernOverlay
      variant={variant === "bottom-sheet" ? "sheet" : "modal"}
      open={openValue}
      onOpenChange={reportOpen}
      title={label}
      trigger={trigger ?? defaultTriggerElement}
      footer={footer}
      testID={testID ?? "kern-picker"}
      className={className}
    >
      {body}
    </KernOverlay>
  );
}

export type ReasonPickerProps = Omit<KernPickerProps, "mode" | "reasons"> & {
  /** Injected reasons (QUEUE-145 system). Required: no local copy exists. */
  reasons: ReasonDataAdapter;
};

/**
 * Generic reason picker (MS-020): one shared select for cancel / refund /
 * reject / ticket / block / verify contexts. Rows come ONLY from the
 * injected adapter — this component owns no reason dataset, in any context.
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
