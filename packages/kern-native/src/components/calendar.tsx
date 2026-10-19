import {
  buildCalendarGrid,
  resolveCalendarMonthNames,
  resolveCalendarSelection,
  resolveLocaleFirstDay,
  shiftCalendarMonth,
  toCalendarDate,
  toCalendarMonth,
  parseCalendarDate,
  useControllableState,
} from "@xoroh/axis/models";
import { useMemo, useState } from "react";
import {
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { Text } from "./text";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toISO(date: Date): string {
  return toCalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
}

function fromISO(iso: string): Date {
  const parts = parseCalendarDate(iso);
  if (parts === null) return new Date();
  return new Date(parts.year, parts.monthIndex, parts.day);
}

export type NativeCalendarProps = Omit<ViewProps, "children" | "style"> & {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * M3 calendar, on the Axis calendar model.
 *
 * The grid, month names, weekday order, disabled bounds and selection all
 * resolve through `@xoroh/axis/models` (`buildCalendarGrid`,
 * `resolveCalendarMonthNames`, `resolveLocaleFirstDay`,
 * `resolveCalendarSelection`, `shiftCalendarMonth`); the viewed month and
 * the selection stay Kern-held (`useControllableState` for the value, a
 * local cursor for the month). Weekday headers are the model's locale
 * short names in locale first-day order — `Sun`, not the old hardcoded
 * two-letter set. Month stepping is DST-safe UTC arithmetic (local
 * `setDate` math skips days across DST transitions).
 */
export function Calendar({
  value: valueProp,
  defaultValue,
  onValueChange,
  min,
  max,
  accessibilityLabel = "Calendar",
  style,
  testID,
  ...props
}: NativeCalendarProps) {
  const scheme = useKernScheme();
  const [selected, setSelected] = useControllableState<Date | undefined>(
    valueProp ? startOfDay(valueProp) : undefined,
    defaultValue ? startOfDay(defaultValue) : undefined,
    (next) => {
      // `setSelected` below only ever stores Dates (invalid ISO falls back
      // to today), so `undefined` never reaches the caller — but the hook
      // types the channel as optional, hence the guard.
      if (next !== undefined) onValueChange?.(next);
    },
  );
  const [monthKey, setMonthKey] = useState(() => {
    const initial = selected ?? new Date();
    return toCalendarMonth(initial.getFullYear(), initial.getMonth());
  });

  const firstDay = resolveLocaleFirstDay();
  const monthNames = useMemo(() => resolveCalendarMonthNames(), []);
  const selectedISO = selected ? toISO(selected) : null;
  const minISO = min ? toISO(min) : undefined;
  const maxISO = max ? toISO(max) : undefined;

  const grid = useMemo(
    () =>
      buildCalendarGrid(monthKey, {
        firstDayOfWeek: firstDay,
        selected: selectedISO,
        minDate: minISO,
        maxDate: maxISO,
      }),
    [monthKey, firstDay, selectedISO, minISO, maxISO],
  );

  const [viewYear, viewMonth] = monthKey.split("-").map(Number) as [
    number,
    number,
  ];
  const monthIndex = viewMonth - 1;

  function pick(iso: string) {
    const resolved = resolveCalendarSelection(iso, {
      mode: "single",
      minDate: minISO,
      maxDate: maxISO,
    });
    if (resolved === null || resolved.value === null) return;
    const date = fromISO(resolved.value);
    setSelected(date);
    setMonthKey(toCalendarMonth(date.getFullYear(), date.getMonth()));
  }

  function stepMonth(delta: -1 | 1) {
    const next = shiftCalendarMonth(viewYear, monthIndex, delta);
    setMonthKey(toCalendarMonth(next.year, next.monthIndex));
  }

  const daySize = 40;
  return (
    <View
      {...props}
      testID={testID ?? "kern-calendar"}
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          borderWidth: 1,
          borderColor: scheme.color.outlineVariant,
          borderRadius: Number.parseFloat(scheme.shape.small),
          backgroundColor: scheme.color.surface,
          padding: 12,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => stepMonth(-1)}
          style={{
            minHeight: 48,
            minWidth: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text variant="title">‹</Text>
        </Pressable>
        <Text variant="label">
          {monthNames[monthIndex]} {viewYear}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => stepMonth(1)}
          style={{
            minHeight: 48,
            minWidth: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text variant="title">›</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {grid.weekdayNames.map((day) => (
          <View
            key={day}
            style={{
              width: `${100 / 7}%`,
              alignItems: "center",
              paddingVertical: 4,
            }}
          >
            <Text
              variant="label"
              style={{ color: scheme.color.onSurfaceVariant }}
            >
              {day}
            </Text>
          </View>
        ))}
        {grid.weeks.flatMap((week, weekIndex) =>
          week.map((cell, dayIndex) => {
            if (cell === null) {
              return (
                <View
                  key={`blank-${weekIndex}-${dayIndex}`}
                  style={{ width: `${100 / 7}%` }}
                />
              );
            }
            const date = fromISO(cell.iso);
            return (
              <View
                key={cell.iso}
                style={{ width: `${100 / 7}%`, alignItems: "center" }}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={date.toDateString()}
                  accessibilityState={{
                    selected: cell.selected,
                    disabled: cell.disabled,
                  }}
                  disabled={cell.disabled}
                  hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
                  onPress={() => pick(cell.iso)}
                  style={{
                    width: daySize,
                    height: daySize,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: daySize / 2,
                    backgroundColor: cell.selected
                      ? scheme.color.primary
                      : "transparent",
                    opacity: cell.disabled ? 0.3 : 1,
                  }}
                >
                  <Text
                    style={
                      cell.selected
                        ? { color: scheme.color.onPrimary }
                        : undefined
                    }
                  >
                    {cell.day}
                  </Text>
                </Pressable>
              </View>
            );
          }),
        )}
      </View>
    </View>
  );
}
