import { useControllableState } from "@xoroh/kern-primitives";
import { useState } from "react";
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
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
  return (
    <View
      testID={testID ?? "kern-search"}
      style={[staticStyles.container, style]}
    >
      <TextInput
        {...props}
        accessibilityLabel={label}
        accessibilityRole="search"
        placeholderTextColor={scheme.color.onSurfaceVariant}
        value={query}
        onChangeText={setCurrent}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={() => onSearch?.(query)}
        returnKeyType="search"
        style={{
          flex: 1,
          minHeight: 56,
          borderWidth: 1,
          borderColor: focused ? scheme.color.primary : scheme.color.outline,
          borderRadius: Number.parseFloat(scheme.shape.small),
          backgroundColor: scheme.color.surface,
          paddingHorizontal: 16,
          fontSize: 16,
          color: scheme.color.onSurface,
        }}
      />
      {query ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => setCurrent("")}
          style={staticStyles.clear}
        >
          <Text variant="title">×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
