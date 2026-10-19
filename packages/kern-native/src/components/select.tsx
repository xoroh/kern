import {
  SelectBackdrop,
  SelectItem as AxisSelectItem,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from "@xoroh/axis";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import {
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { menuStyles } from "./menu";
import { Text } from "./text";

export type NativeSelectOption = {
  value: string;
  label: string;
};

export function selectStyles(scheme: ResolvedTheme = defaultScheme()): {
  trigger: ViewStyle;
} {
  return {
    trigger: {
      minHeight: 56,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: scheme.color.outline,
      borderRadius: Number.parseFloat(scheme.shape["extra-small"]),
      backgroundColor: scheme.color.surface,
      paddingHorizontal: 16,
    },
  };
}

export type NativeSelectProps = {
  options: NativeSelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * M3 select — one value from a known set, on the Axis `SelectRoot` compound.
 *
 * The open list paints through `SelectPortal` at the app's root `PortalHost`
 * (no RN `Modal` of its own: one root presents every layer). `onDismiss`
 * fires when the list goes away WITHOUT a selection — scrim press, system
 * back, escape — so a caller can tell a pick (`onValueChange`) from a
 * bail-out. Choosing an option never fires `onDismiss`.
 */
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select",
  accessibilityLabel = "Select",
  disabled = false,
  onDismiss,
  style,
  testID,
}: NativeSelectProps) {
  const scheme = useKernScheme();
  const styles = menuStyles(scheme);
  return (
    <View testID={testID ?? "kern-select"}>
      <SelectRoot
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        onDismiss={onDismiss}
        disabled={disabled}
        items={options}
      >
        <SelectTrigger
          accessibilityLabel={accessibilityLabel}
          disabled={disabled}
          style={[
            selectStyles(scheme).trigger,
            { opacity: disabled ? 0.38 : 1 },
            style,
          ]}
        >
          <SelectValue
            placeholder={placeholder}
            style={({ placeholder: showingPlaceholder }) =>
              showingPlaceholder
                ? { color: scheme.color.onSurfaceVariant }
                : undefined
            }
          />
          <Text variant="body">▾</Text>
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
          />
          <SelectPositioner>
            <SelectPopup style={styles.card}>
              {options.map((option) => (
                <AxisSelectItem
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  accessibilityLabel={option.label}
                  style={({ selected }) => ({
                    minHeight: 48,
                    justifyContent: "center",
                    paddingHorizontal: 12,
                    borderRadius: Number.parseFloat(
                      scheme.shape["extra-small"],
                    ),
                    backgroundColor: selected
                      ? scheme.color.surfaceTonal
                      : "transparent",
                  })}
                >
                  <Text>{option.label}</Text>
                </AxisSelectItem>
              ))}
            </SelectPopup>
          </SelectPositioner>
        </SelectPortal>
      </SelectRoot>
    </View>
  );
}
