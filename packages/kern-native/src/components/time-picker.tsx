import {
  formatTimeParts,
  formatTimeValue,
  minutesForStep,
  normalizeTimeValue,
  type TimePickerFormat,
  type TimePickerValue,
  toTwentyFourHour,
  useControllableState,
  useRovingModel,
} from "@xoroh/axis";
import { type ResolvedTheme, tokens } from "@xoroh/kern-tokens";
import { useMemo, useState } from "react";
import {
  Pressable,
  Text as RNText,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { Circle, Line, Svg } from "react-native-svg";
import { defaultScheme, useKernScheme } from "../theme";

/**
 * Time picker — hour, minute and (in 12-hour mode) period, as listboxes the
 * user traverses, or as an M3 clock-face dial. The `presentation` prop picks
 * the face; the value contract does not move with it.
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
 * disagree. The dial presentation reuses the same models: each visible ring is
 * one roving axis over its numbers, so selection state flows through exactly
 * one path in both presentations.
 *
 * ## 12-hour is presentation, never state
 *
 * The value is 24-hour internally, always — `normalizeTimeValue` and
 * `toTwentyFourHour` do the conversion. Choosing "3 PM" reports `hours: 15`, and
 * re-opening in 24-hour mode shows `15`. A picker that stored 12-hour state
 * would drift the moment a consumer persisted it.
 *
 * ## Dial geometry (shared with web)
 *
 * The face is 256dp. Numbers sit on a circle of radius 96, top = 12/00/00,
 * clockwise. A 24-hour hour face adds an inner ring (radius 60) for 12,1–11
 * while the outer ring carries 00,13–23 — a single ring of 24 would put 40dp
 * targets ~26dp apart. Outer dots are 40dp, inner 32dp; minute faces with more
 * than twelve options label only the five-minute marks and render the rest as
 * 8dp dots (M3's minute face), every dot still pressable. Pressing an hour
 * advances to the minute face, matching M3; the AM/PM selector below the face
 * reuses the listbox `Field`, which is what M3 puts there anyway.
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
 * The dial face is a second `role="list"` of `option`s, so this divergence
 * covers both presentations, not just the listbox one.
 */

export function timeFieldStyles(
  selected: boolean,
  scheme: ResolvedTheme = defaultScheme(),
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
  // biome-ignore lint/correctness/noUnusedFunctionParameters: destructured to EXCLUDE this key from the rest spread below; the binding is load-bearing and deleting or renaming it changes what is spread.
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
  // biome-ignore lint/correctness/noUnusedFunctionParameters: destructured to EXCLUDE this key from the rest spread below; the binding is load-bearing and deleting or renaming it changes what is spread.
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

// ---------------------------------------------------------------------------
// Dial presentation: an SVG clock face (rings + hand, decorative) with one
// Pressable per number positioned by angle. No drag handling: on touch the
// press IS the selection, so press-to-select covers what drag covers on web.
// ---------------------------------------------------------------------------

const DIAL_SIZE = 256;
const DIAL_CENTER = DIAL_SIZE / 2;
const DIAL_FACE_RADIUS = 120;
const DIAL_RING_RADIUS = 96;
const DIAL_INNER_RADIUS = 60;
const DIAL_DOT = 40;
const DIAL_INNER_DOT = 32;
const DIAL_MINOR_DOT = 24;

type DialOption = {
  /** Committed value: a 24-hour hour, or a minute on the step grid. */
  value: number;
  /** Accessible name suffix AND visible label ("Hour 9", "Minute 05"). */
  text: string;
  /** Clockwise from the top, in radians. */
  angle: number;
  radius: number;
  dot: number;
  labeled: boolean;
};

/** dp point for an angle (clockwise from top) and radius. */
function dialPoint(angle: number, radius: number): { x: number; y: number } {
  return {
    x: DIAL_CENTER + radius * Math.sin(angle),
    y: DIAL_CENTER - radius * Math.cos(angle),
  };
}

/**
 * One dial ring: decorative SVG plus one Pressable per number. The roving
 * model is the same one the listbox fields use — controlled by the selected
 * index, reporting presses — so selection state flows through one path.
 */
function DialRing({
  faceTestID,
  label,
  options,
  selectedIndex,
  handAngle,
  handRadius,
  showInnerRing,
  onSelect,
}: {
  faceTestID: string;
  label: string;
  options: readonly DialOption[];
  selectedIndex: number;
  handAngle: number;
  handRadius: number;
  showInnerRing: boolean;
  onSelect: (index: number) => void;
}) {
  const scheme = useKernScheme();
  const roving = useRovingModel({
    count: options.length,
    orientation: "both",
    loop: true,
    activeIndex: selectedIndex,
    onActiveIndexChange: onSelect,
  });
  const hand = dialPoint(handAngle, handRadius);

  return (
    <View
      testID={faceTestID}
      // Same divergence as the listbox fields above: RN has no `listbox` in
      // its Role union, so the ring of options is a `list`. Kept identical so
      // assistive tech hears one consistent structure in both presentations.
      role="list"
      accessibilityLabel={label}
      style={{ width: DIAL_SIZE, height: DIAL_SIZE }}
    >
      <Svg
        width={DIAL_SIZE}
        height={DIAL_SIZE}
        viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <Circle
          cx={DIAL_CENTER}
          cy={DIAL_CENTER}
          r={DIAL_FACE_RADIUS}
          fill={scheme.color.surfaceContainer}
          stroke={scheme.color.outlineVariant}
          strokeWidth={1}
        />
        <Circle
          cx={DIAL_CENTER}
          cy={DIAL_CENTER}
          r={DIAL_RING_RADIUS}
          fill="none"
          stroke={scheme.color.outlineVariant}
          strokeWidth={1}
        />
        {showInnerRing ? (
          <Circle
            cx={DIAL_CENTER}
            cy={DIAL_CENTER}
            r={DIAL_INNER_RADIUS}
            fill="none"
            stroke={scheme.color.outlineVariant}
            strokeWidth={1}
          />
        ) : null}
        {/* Halo under the selected number, then the hand, then the hub. */}
        <Circle
          cx={hand.x}
          cy={hand.y}
          r={20}
          fill={scheme.color.primaryContainer}
        />
        <Line
          x1={DIAL_CENTER}
          y1={DIAL_CENTER}
          x2={hand.x}
          y2={hand.y}
          stroke={scheme.color.primary}
          strokeWidth={2}
        />
        <Circle
          cx={DIAL_CENTER}
          cy={DIAL_CENTER}
          r={4}
          fill={scheme.color.primary}
        />
      </Svg>
      {options.map((option, i) => {
        const described = roving.describe(i);
        const selected = described.isTabbable;
        const point = dialPoint(option.angle, option.radius);
        const labelText = `${label} ${option.text}`;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="option"
            accessibilityLabel={labelText}
            accessibilityState={{ selected, disabled: described.disabled }}
            disabled={described.disabled}
            onPress={() => {
              if (!described.disabled) onSelect(i);
            }}
            testID={`kern-time-dial-option-${labelText}`}
            // Minor minute dots are small targets; widen what counts as a hit
            // without widening the layout (neighbours sit ~10dp apart at
            // step 1, so layout width cannot grow).
            hitSlop={option.labeled ? undefined : 8}
            style={{
              position: "absolute",
              left: point.x,
              top: point.y,
              width: option.dot,
              height: option.dot,
              transform: [
                { translateX: -option.dot / 2 },
                { translateY: -option.dot / 2 },
              ],
              borderRadius: option.dot / 2,
              backgroundColor: selected
                ? scheme.color.primaryContainer
                : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {option.labeled ? (
              <RNText
                style={{
                  fontSize: option.dot >= DIAL_DOT ? 16 : 14,
                  fontWeight: selected ? "600" : "400",
                  color: selected
                    ? scheme.color.onPrimaryContainer
                    : scheme.color.onSurface,
                }}
              >
                {option.text}
              </RNText>
            ) : (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: selected
                    ? scheme.color.onPrimaryContainer
                    : scheme.color.onSurfaceVariant,
                }}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Which face the picker shows. `listbox` (default) is the current Field UI;
 * `dial` is the M3 clock face over the same state. Reported values are
 * identical either way.
 */
export type NativeTimePickerPresentation = "listbox" | "dial";

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
  /**
   * Which face the picker shows. `listbox` (default) is three fields;
   * `dial` is the M3 clock face. Same state, same value contract.
   */
  presentation?: NativeTimePickerPresentation;
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
  presentation = "listbox",
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

  // Dial-only: which ring is showing. Always declared (hooks cannot be
  // conditional), ignored by the listbox presentation.
  const [dialMode, setDialMode] = useState<"hour" | "minute">("hour");

  const minuteValues = useMemo(() => minutesForStep(step), [step]);
  const shown = formatTimeValue(current, format);
  // Display strings come from the Axis time model (`formatTimeParts`):
  // localized digits plus the locale day period. The selection math below
  // stays numeric (`shown`/`toTwentyFourHour`); only what is PAINTED goes
  // through the model, so display can never drift from the value contract.
  const scheme = useKernScheme();

  const commit = (next: Partial<TimePickerValue>) => {
    // Normalise BEFORE reporting: a consumer must never receive 18:75.
    setValue(normalizeTimeValue({ ...current, ...next }, step));
  };

  const listbox = (
    <>
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
          format === "12h"
            ? formatTimeParts(
                { hours: toTwentyFourHour(h + 1, shown.period), minutes: 0 },
                format,
              ).hours
            : formatTimeParts({ hours: h, minutes: 0 }, format).hours
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
        format={(m) =>
          formatTimeParts({ hours: 0, minutes: m }, format).minutes
        }
        onSelect={(i) => commit({ minutes: minuteValues[i] })}
      />
      {format === "12h" ? (
        <Field
          label="Period"
          values={[0, 1]}
          selectedIndex={shown.period === "AM" ? 0 : 1}
          format={(p) =>
            formatTimeParts({ hours: p === 0 ? 9 : 15, minutes: 0 }, "12h")
              .period ?? (p === 0 ? "AM" : "PM")
          }
          onSelect={(i) =>
            commit({
              hours: toTwentyFourHour(shown.hours, i === 0 ? "AM" : "PM"),
            })
          }
        />
      ) : null}
    </>
  );

  // Dial options. Hour order is outer ring then inner ring (00,13–23, then
  // 12,1–11); the selected INDEX is therefore the position in that order, not
  // the hour itself.
  const dialHourOptions: readonly DialOption[] =
    format === "12h"
      ? Array.from({ length: 12 }, (_, i) => ({
          value: toTwentyFourHour(i + 1, shown.period),
          text: formatTimeParts(
            { hours: toTwentyFourHour(i + 1, shown.period), minutes: 0 },
            format,
          ).hours,
          angle: (i / 12) * Math.PI * 2,
          radius: DIAL_RING_RADIUS,
          dot: DIAL_DOT,
          labeled: true,
        }))
      : [
          ...Array.from({ length: 12 }, (_, i) => ({
            value: i === 0 ? 0 : i + 12,
            text: formatTimeParts(
              { hours: i === 0 ? 0 : i + 12, minutes: 0 },
              format,
            ).hours,
            angle: (i / 12) * Math.PI * 2,
            radius: DIAL_RING_RADIUS,
            dot: DIAL_DOT,
            labeled: true,
          })),
          ...Array.from({ length: 12 }, (_, i) => ({
            value: i === 0 ? 12 : i,
            text: formatTimeParts(
              { hours: i === 0 ? 12 : i, minutes: 0 },
              format,
            ).hours,
            angle: (i / 12) * Math.PI * 2,
            radius: DIAL_INNER_RADIUS,
            dot: DIAL_INNER_DOT,
            labeled: true,
          })),
        ];
  const dialHourOuter = current.hours === 0 || current.hours >= 13;
  const dialHourRingIndex = dialHourOuter
    ? current.hours === 0
      ? 0
      : current.hours - 12
    : current.hours === 12
      ? 0
      : current.hours;
  const dialHourSelectedIndex =
    format === "12h"
      ? Math.max(shown.hours % 12 === 0 ? 11 : (shown.hours % 12) - 1, 0)
      : dialHourOuter
        ? dialHourRingIndex
        : 12 + dialHourRingIndex;
  const dialHourHand =
    format === "12h"
      ? {
          angle: ((shown.hours % 12) / 12) * Math.PI * 2,
          radius: DIAL_RING_RADIUS,
        }
      : {
          angle: (dialHourRingIndex / 12) * Math.PI * 2,
          radius: dialHourOuter ? DIAL_RING_RADIUS : DIAL_INNER_RADIUS,
        };

  const dialMinuteOptions: readonly DialOption[] = minuteValues.map((m) => {
    // Twelve or fewer options all get labels; past that only the five-minute
    // marks do and the rest are dots — the web face does exactly the same.
    const labeled = m % 5 === 0 || minuteValues.length <= 12;
    return {
      value: m,
      text: formatTimeParts({ hours: 0, minutes: m }, format).minutes,
      angle: (m / 60) * Math.PI * 2,
      radius: DIAL_RING_RADIUS,
      dot: labeled ? DIAL_DOT : DIAL_MINOR_DOT,
      labeled,
    };
  });

  const dial = (
    <View testID="kern-time-dial" style={{ gap: 12, alignItems: "center" }}>
      <View
        role="group"
        accessibilityLabel="Select hour or minute"
        style={{ flexDirection: "row", gap: 8 }}
      >
        {[
          { mode: "hour" as const, text: "Hour" },
          { mode: "minute" as const, text: "Minute" },
        ].map(({ mode, text }) => {
          const active = dialMode === mode;
          return (
            <Pressable
              key={mode}
              accessibilityLabel={`Show ${text.toLowerCase()}s`}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setDialMode(mode)}
              testID={`kern-time-dial-mode-${mode}`}
              style={{
                minWidth: 48,
                minHeight: 48,
                paddingHorizontal: 16,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: Number.parseFloat(scheme.shape.full),
                backgroundColor: active
                  ? scheme.color.primaryContainer
                  : "transparent",
              }}
            >
              <RNText
                style={{
                  fontSize: 14,
                  fontWeight: active ? "600" : "400",
                  color: active
                    ? scheme.color.onPrimaryContainer
                    : scheme.color.onSurfaceVariant,
                }}
              >
                {text}
              </RNText>
            </Pressable>
          );
        })}
      </View>

      {dialMode === "hour" ? (
        <DialRing
          faceTestID="kern-time-dial-face"
          label="Hour"
          options={dialHourOptions}
          selectedIndex={dialHourSelectedIndex}
          handAngle={dialHourHand.angle}
          handRadius={dialHourHand.radius}
          showInnerRing={format === "24h"}
          onSelect={(i) => {
            const option = dialHourOptions[i];
            if (option) {
              commit({ hours: option.value });
              // A press confirms the hour (M3 advances to minutes).
              setDialMode("minute");
            }
          }}
        />
      ) : (
        <DialRing
          faceTestID="kern-time-dial-face"
          label="Minute"
          options={dialMinuteOptions}
          selectedIndex={Math.max(minuteValues.indexOf(current.minutes), 0)}
          handAngle={(current.minutes / 60) * Math.PI * 2}
          handRadius={DIAL_RING_RADIUS}
          showInnerRing={false}
          onSelect={(i) => {
            const option = dialMinuteOptions[i];
            if (option) commit({ minutes: option.value });
          }}
        />
      )}

      {format === "12h" ? (
        <Field
          label="Period"
          values={[0, 1]}
          selectedIndex={shown.period === "AM" ? 0 : 1}
          format={(p) =>
            formatTimeParts({ hours: p === 0 ? 9 : 15, minutes: 0 }, "12h")
              .period ?? (p === 0 ? "AM" : "PM")
          }
          onSelect={(i) =>
            commit({
              hours: toTwentyFourHour(shown.hours, i === 0 ? "AM" : "PM"),
            })
          }
        />
      ) : null}
    </View>
  );

  return (
    <View
      {...props}
      testID={testID ?? "kern-time-picker"}
      role="group"
      accessibilityLabel={accessibilityLabel}
      style={style}
    >
      {presentation === "dial" ? dial : listbox}
    </View>
  );
}
