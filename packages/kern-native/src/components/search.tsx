import {
  Button as AxisButton,
  Field as AxisField,
  Input as AxisInput,
  useControllableState,
} from "@xoroh/axis";
import { useState } from "react";
import {
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { Text } from "./text";

const staticStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clear: {
    minHeight: 48,
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});

export type NativeSearchProps = Omit<
  TextInputProps,
  "value" | "onChangeText" | "style"
> & {
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * R2 lexicon: domain action, not state. Query text lives in
   * `value`/`onValueChange`; this fires only on submit.
   */
  onSearch?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
};

export function Search({
  label = "Search",
  value,
  defaultValue = "",
  onValueChange,
  onSearch,
  style,
  testID,
  secureTextEntry,
  editable,
  multiline,
  numberOfLines,
  onBlur,
  onFocus,
  ...props
}: NativeSearchProps) {
  const scheme = useKernScheme();
  const [current, setCurrent] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const [focused, setFocused] = useState(false);
  const query = current ?? "";

  // State stays Kern-owned (controlled mirror into Axis Input — the
  // `Tooltip` precedent): the public value/defaultValue contract and the
  // clear affordance need the text here, while Axis owns the input
  // mechanics (submit/blur wiring, controlled plumbing).
  // NOTE (documented stripping, kept): a caller `onSubmitEditing` is ignored —
  // submit means `onSearch` in this component (configurator comment). It stays
  // in `...props` only so nothing else drops it; the slot wiring below wins.
  const commit = (text: string) => setCurrent(text);
  const clear = () => setCurrent("");
  const submit = () => {
    onSearch?.(query);
  };

  return (
    <AxisField
      testID={testID ?? "kern-search"}
      style={[staticStyles.container, style]}
    >
      <AxisInput
        value={query}
        onValueChange={commit}
        onSubmitEditing={submit}
        secureTextEntry={secureTextEntry}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        accessibilityLabel={label}
        style={{
          flex: 1,
          minHeight: 56,
          // M3 docked search bar: borderless surface-container-high stadium.
          // Focus shows on the container via the primary outline below.
          borderWidth: focused ? 1 : 0,
          borderColor: scheme.color.primary,
          borderRadius: Number.parseFloat(scheme.shape.full),
          backgroundColor: scheme.color.surfaceContainerHigh,
          paddingHorizontal: 24,
          fontSize: 16,
          color: scheme.color.onSurface,
        }}
        render={(slot) => {
          // SlotProps is an untyped record by design (Base UI parity), so
          // every prop is narrowed at the boundary — never cast blindly.
          const value = slot.value as string;
          const onChangeText = slot.onChangeText as
            | ((text: string) => void)
            | undefined;
          const onSubmitEditing = slot.onSubmitEditing as
            | (() => void)
            | undefined;
          const onSlotBlur = slot.onBlur as (() => void) | undefined;
          return (
            <TextInput
              {...props}
              value={value}
              onChangeText={onChangeText}
              onSubmitEditing={onSubmitEditing}
              onBlur={(event) => {
                onSlotBlur?.();
                onBlur?.(event);
                setFocused(false);
              }}
              onFocus={(event) => {
                onFocus?.(event);
                setFocused(true);
              }}
              placeholderTextColor={scheme.color.onSurfaceVariant}
              accessibilityRole="search"
              returnKeyType="search"
              secureTextEntry={slot.secureTextEntry as boolean | undefined}
              editable={slot.editable as boolean | undefined}
              multiline={slot.multiline as boolean | undefined}
              numberOfLines={slot.numberOfLines as number | undefined}
              accessibilityLabel={slot.accessibilityLabel as string | undefined}
              testID={slot.testID as string | undefined}
              style={slot.style as TextInputProps["style"]}
            />
          );
        }}
      />
      {query ? (
        <AxisButton
          accessibilityLabel="Clear search"
          onPress={clear}
          style={staticStyles.clear}
        >
          <Text variant="title">×</Text>
        </AxisButton>
      ) : null}
    </AxisField>
  );
}
