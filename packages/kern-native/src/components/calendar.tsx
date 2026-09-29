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

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
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
  const [internal, setInternal] = useState(() =>
    startOfDay(defaultValue ?? valueProp ?? new Date()),
  );
  const [cursor, setCursor] = useState(() =>
    startOfDay(valueProp ?? defaultValue ?? new Date()),
  );
  const value = valueProp ? startOfDay(valueProp) : internal;
  const viewYear = cursor.getFullYear();
  const viewMonth = cursor.getMonth();
  const minDay = min ? startOfDay(min) : undefined;
  const maxDay = max ? startOfDay(max) : undefined;

  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1).getDay();
    const days = new Date(viewYear, viewMonth + 1, 0).getDate();
    const out: { key: string; date: Date | null }[] = [];
    for (let day = 1 - first; day <= days; day++)
      out.push({
        key: `day-${viewYear}-${viewMonth}-${day}`,
        date: day < 1 ? null : new Date(viewYear, viewMonth, day),
      });
    return out;
  }, [viewYear, viewMonth]);

  function pick(date: Date) {
    if (valueProp === undefined) setInternal(date);
    setCursor(date);
    onValueChange?.(date);
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
          onPress={() => setCursor(new Date(viewYear, viewMonth - 1, 1))}
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
          {MONTHS[viewMonth]} {viewYear}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => setCursor(new Date(viewYear, viewMonth + 1, 1))}
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
        {WEEKDAYS.map((day) => (
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
        {cells.map(({ key, date }) => {
          if (date === null)
            return <View key={key} style={{ width: `${100 / 7}%` }} />;
          const disabled =
            (minDay !== undefined && date < minDay) ||
            (maxDay !== undefined && date > maxDay);
          const selected = sameDay(date, value);
          return (
            <View
              key={date.getTime()}
              style={{ width: `${100 / 7}%`, alignItems: "center" }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={date.toDateString()}
                accessibilityState={{ selected, disabled }}
                disabled={disabled}
                hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
                onPress={() => pick(date)}
                style={{
                  width: daySize,
                  height: daySize,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: daySize / 2,
                  backgroundColor: selected
                    ? scheme.color.primary
                    : "transparent",
                  opacity: disabled ? 0.3 : 1,
                }}
              >
                <Text
                  style={
                    selected ? { color: scheme.color.onPrimary } : undefined
                  }
                >
                  {date.getDate()}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
