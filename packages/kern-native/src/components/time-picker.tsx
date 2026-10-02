import {
  formatTimeValue,
  minutesForStep,
  normalizeTimeValue,
  type TimePickerFormat,
  type TimePickerValue,
  toTwentyFourHour,
  useControllableState,
  useRovingModel,
} from "@xoroh/kern-primitives";
import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import { useMemo } from "react";
import {
  Pressable,
  Text as RNText,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";

/**
 * Time picker — hour, minute and (in 12-hour mode) period, as listboxes the
 * user traverses.
 *
 * ## Three tab stops, not one
 *
 * The web contract is a **roving tabindex PER FIELD**: three fields are three
 * tab stops. That is the opposite of a carousel's single tab stop, and it is why
 * this needs its own roving model per field rather than sharing one — a shared
 * axis would make the whole picker one stop, and a keyboard user could never
 * reach the minutes.
 *
 * Each field is therefore its own `useRovingModel`, and each option's selected
 * state comes from its field's model, so the option row and the state cannot
 * disagree.
 *
 * ## 12-hour is presentation, never state
 *
 * The value is 24-hour internally, always — `normalizeTimeValue` and
 * `toTwentyFourHour` do the conversion. Choosing "3 PM" reports `hours: 15`, and
 * re-opening in 24-hour mode shows `15`. A picker that stored 12-hour state
 * would drift the moment a consumer persisted it.
 *
 * ## `role="listbox"`, not `accessibilityRole`
 *
 * Each field is a listbox of options, mirroring the web's `role="listbox"` and
 * `role="option"` with `aria-selected`. The platform-trait `AccessibilityRole`
 * union carries `listbox` too, but the ARIA-aligned `Role` union is used
 * consistently with meter, fieldset, loading-indicator and carousel.
 *
 * There are no arrow keys on a touch device, so traversal here is by pressing an
 * option. The roving MODEL is shared; only the input mechanism is per-platform.
 */

export function timeFieldStyles(
  selected: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
): { field: ViewStyle; option: ViewStyle } {
  return {
    field: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Number.parseFloat(tokens.spacing["space-50"]),
      minHeight: 48,
    },
    option: {
      minWidth: 48,
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Number.parseFloat(scheme.shape.full),
      backgroundColor: selected ? scheme.color.primary : "transparent",
      opacity: selected ? 1 : 0.75,
    },
  };
}

/** One traversable field: a listbox whose options share a roving axis. */
function Field({
  label,
  values,
  selectedIndex,
  format,
  onSelect,
  renderText,
}: {
  label: string;
  values: readonly number[];
  selectedIndex: number;
  format: (value: number) => string;
  onSelect: (index: number) => void;
  renderText?: never;
}) {
  const scheme = useKernScheme();
  const styles = timeFieldStyles(false, scheme);
  // One model per field: this is what makes the picker THREE tab stops rather
  // than one. `loop` matches the web contract — arrow traversal wraps.
  const roving = useRovingModel({
    count: values.length,
    orientation: "vertical",
    loop: true,
    activeIndex: selectedIndex,
    onActiveIndexChange: onSelect,
  });

  return (
    <View
      testID={`kern-time-field-${label}`}
      // RN's Role union has NO `listbox` — it carries `list`, `listitem`,
      // `option` and `menuitem`. So a listbox of options is announced natively
      // as a LIST, which does not carry the selection semantics a listbox does.
      // Recorded as a real divergence rather than papered over: a screen reader
      // on native hears "list" where the web says "listbox". The per-option
      // `selected` state below is what carries the selection itself, so the
      // information is not lost — only the container's implicit promise is.
      role="list"
      accessibilityLabel={label}
      style={styles.field}
    >
      {values.map((value, i) => {
        const described = roving.describe(i);
        return (
          <Option
            key={value}
            label={`${label} ${format(value)}`}
            text={format(value)}
            selected={described.isTabbable}
            disabled={described.disabled}
            style={styles.option}
            onPress={() => {
              if (!described.disabled) onSelect(i);
            }}
          />
        );
      })}
    </View>
  );
}

function Option({
  label,
  text,
  selected,
  disabled,
  style,
  onPress,
}: {
  label: string;
  text: string;
  selected: boolean;
  disabled: boolean;
  style: ViewStyle;
  onPress: () => void;
}) {
  const scheme = useKernScheme();
  const styles = timeFieldStyles(selected, scheme);
  return (
    <Pressable
      accessibilityRole="option"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      testID={`kern-time-option-${label}`}
      style={styles.option}
    >
      <RNText
        style={{
          fontSize: 14,
          color: selected ? scheme.color.onPrimary : scheme.color.onSurface,
        }}
      >
        {text}
      </RNText>
    </Pressable>
  );
}

export type NativeTimePickerProps = Omit<
  ViewProps,
  "children" | "style" | "accessibilityRole"
> & {
  value?: TimePickerValue;
  defaultValue?: TimePickerValue;
  /** Receives the NORMALISED value — never an out-of-range time. */
  onValueChange?: (value: TimePickerValue) => void;
  /** `12h` adds the AM/PM field. State stays 24-hour. */
  format?: TimePickerFormat;
  /** Minute granularity. Must be an integer dividing 60; else falls back to 1. */
  step?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function TimePicker({
  value,
  defaultValue,
  onValueChange,
  format = "24h",
  step = 1,
  accessibilityLabel = "Time picker",
  style,
  testID,
  ...props
}: NativeTimePickerProps) {
  // `useControllableState` is typed for an optional value, but this component's
  // value is never undefined — `current` below always normalises one. Copying at
  // the boundary keeps the published callback type `(TimePickerValue) => void`
  // rather than widening it to something callers would have to handle.
  const [raw, setValue] = useControllableState<TimePickerValue | undefined>(
    value,
    defaultValue ? normalizeTimeValue(defaultValue, step) : undefined,
    (next) => onValueChange?.(normalizeTimeValue(next, step)),
  );
  const current = useMemo(
    () => normalizeTimeValue(raw ?? { hours: 0, minutes: 0 }, step),
    [raw, step],
  );

  const minuteValues = useMemo(() => minutesForStep(step), [step]);
  const shown = formatTimeValue(current, format);

  const commit = (next: Partial<TimePickerValue>) => {
    // Normalise BEFORE reporting: a consumer must never receive 18:75.
    setValue(normalizeTimeValue({ ...current, ...next }, step));
  };

  return (
    <View
      {...props}
      testID={testID ?? "kern-time-picker"}
      role="group"
      accessibilityLabel={accessibilityLabel}
      style={style}
    >
      <Field
        label="Hour"
        // 24h lists all 24 hours directly; 12h lists 1–12 and leans on the
        // period field. The first version reused the 12-entry list for both and
        // ran the 24h labels back through `toTwentyFourHour`, which produced
        // 13…24,0…12 — a real bug my own test caught.
        values={
          format === "12h"
            ? Array.from({ length: 12 }, (_, i) => i)
            : Array.from({ length: 24 }, (_, i) => i)
        }
        selectedIndex={
          format === "12h"
            ? Math.max(shown.hours % 12 === 0 ? 11 : (shown.hours % 12) - 1, 0)
            : current.hours
        }
        format={(h) =>
          format === "12h" ? String(h + 1) : String(h).padStart(2, "0")
        }
        onSelect={(i) => {
          if (format === "12h") {
            commit({ hours: toTwentyFourHour(i + 1, shown.period) });
          } else {
            commit({ hours: i });
          }
        }}
      />
      <Field
        label="Minute"
        values={minuteValues}
        selectedIndex={Math.max(minuteValues.indexOf(current.minutes), 0)}
        format={(m) => String(m).padStart(2, "0")}
        onSelect={(i) => commit({ minutes: minuteValues[i] })}
      />
      {format === "12h" ? (
        <Field
          label="Period"
          values={[0, 1]}
          selectedIndex={shown.period === "AM" ? 0 : 1}
          format={(p) => (p === 0 ? "AM" : "PM")}
          onSelect={(i) =>
            commit({
              hours: toTwentyFourHour(shown.hours, i === 0 ? "AM" : "PM"),
            })
          }
        />
      ) : null}
    </View>
  );
}
