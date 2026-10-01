import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-theme";
import type { ReactNode } from "react";
import {
  Pressable,
  Text as RNText,
  ScrollView,
  type StyleProp,
  TextInput,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { useControllableState } from "../utils/useControllableState";
import { SheetHandle } from "./sheets";
import { Text } from "./text";

/**
 * Native counterparts of the K-02 web-extras set. Names are the canonical
 * ones from `docs/platform-parity.md`; `variants` keeps its frozen meaning
 * per component (Button=emphasis, Card=elevation, Text=type scale,
 * FieldMessage=intent, Badge=shape, Chip=kind). Each `variants` value on
 * this file is named for what it means in M3 terms, never for the web
 * component it mirrors.
 *
 * `Sonner` has no native counterpart by design: M3 expresses transient
 * messaging as a Snackbar, which `kern-native` already ships. A second name
 * for the same surface would break the naming law.
 */

export type CommandAction = {
  key: string;
  label: string;
  /** Group heading for the flat list (M3 "command group"). */
  group?: string;
  keywords?: string[];
  icon?: ReactNode;
  disabled?: boolean;
  onPress?: () => void;
};

/**
 * Command palette. M3 keeps it a modal dialog with a leading search field and
 * a grouped, scrollable action list — the native form of cmdk.
 */
export function Command({
  open,
  title,
  actions,
  query: controlledQuery,
  onQueryChange,
  onDismiss,
  emptyLabel = "No results",
  style,
  testID,
}: {
  open: boolean;
  title: string;
  actions: CommandAction[];
  query?: string;
  onQueryChange?: (query: string) => void;
  onDismiss?: () => void;
  emptyLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const scheme = useKernScheme();
  const [query, setQuery] = useControllableState<string>(
    controlledQuery,
    "",
    onQueryChange,
  );
  if (!open) return null;
  const needle = (query ?? "").trim().toLowerCase();
  const matches = actions.filter((action) => {
    if (needle === "") return true;
    return (
      action.label.toLowerCase().includes(needle) ||
      (action.keywords ?? []).some((word) =>
        word.toLowerCase().includes(needle),
      )
    );
  });
  const groups = [...new Set(matches.map((action) => action.group ?? ""))];
  return (
    <View
      testID={testID ?? "kern-command"}
      style={[
        {
          backgroundColor: scheme.color.surfaceContainerHigh,
          borderRadius: Number.parseFloat(scheme.shape["extra-large"]),
          maxHeight: "70%",
          paddingBottom: Number.parseFloat(tokens.spacing["space-100"]),
        },
        style,
      ]}
    >
      <SheetHandle />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: Number.parseFloat(tokens.spacing["space-150"]),
          marginHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
          marginBottom: Number.parseFloat(tokens.spacing["space-100"]),
        }}
      >
        <TextInput
          accessibilityLabel={title}
          placeholder={title}
          placeholderTextColor={scheme.color.onSurfaceVariant}
          value={query ?? ""}
          onChangeText={setQuery}
          autoCorrect={false}
          style={{
            flex: 1,
            minHeight: 48,
            color: scheme.color.onSurface,
            fontSize: 15,
          }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close command palette"
          onPress={onDismiss}
          style={{
            minWidth: 48,
            minHeight: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RNText style={{ color: scheme.color.onSurfaceVariant }}>×</RNText>
        </Pressable>
      </View>
      <ScrollView>
        {matches.length === 0 ? (
          <View
            style={{ padding: Number.parseFloat(tokens.spacing["space-200"]) }}
          >
            <Text
              variant="label"
              style={{ color: scheme.color.onSurfaceVariant }}
            >
              {emptyLabel}
            </Text>
          </View>
        ) : (
          groups.map((group) => (
            <View key={group || "ungrouped"}>
              {group ? (
                <View
                  style={{
                    paddingHorizontal: Number.parseFloat(
                      tokens.spacing["space-200"],
                    ),
                    paddingTop: Number.parseFloat(tokens.spacing["space-150"]),
                    paddingBottom: Number.parseFloat(
                      tokens.spacing["space-50"],
                    ),
                  }}
                >
                  <Text variant="label" style={{ color: scheme.color.primary }}>
                    {group}
                  </Text>
                </View>
              ) : null}
              {matches
                .filter((action) => (action.group ?? "") === group)
                .map((action) => (
                  <Pressable
                    key={action.key}
                    accessibilityRole="menuitem"
                    accessibilityLabel={action.label}
                    accessibilityState={{ disabled: Boolean(action.disabled) }}
                    disabled={action.disabled}
                    onPress={action.onPress}
                    style={({ pressed }) => ({
                      minHeight: 48,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: Number.parseFloat(tokens.spacing["space-150"]),
                      paddingHorizontal: Number.parseFloat(
                        tokens.spacing["space-200"],
                      ),
                      opacity: action.disabled ? 0.38 : pressed ? 0.82 : 1,
                    })}
                  >
                    {action.icon}
                    <RNText
                      numberOfLines={1}
                      style={{
                        flex: 1,
                        fontSize: 15,
                        color: scheme.color.onSurface,
                      }}
                    >
                      {action.label}
                    </RNText>
                  </Pressable>
                ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

export type SegmentedButtonOption = {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
};

/**
 * M3 segmented button: a joined row where the selection is carried by a
 * check on the selected segment, not by a separate fill. `variants` here
 * means selection behavior (single vs multiple), matching M3.
 */
export function SegmentedButton({
  options,
  value: controlledValue,
  values: controlledValues,
  defaultValue,
  defaultValues,
  onValueChange,
  onValuesChange,
  style,
  testID,
}: {
  options: SegmentedButtonOption[];
  value?: string;
  values?: string[];
  defaultValue?: string;
  defaultValues?: string[];
  onValueChange?: (value: string) => void;
  onValuesChange?: (values: string[]) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const scheme = useKernScheme();
  const multiple =
    controlledValues !== undefined || defaultValues !== undefined;
  const [single, setSingle] = useControllableState<string>(
    controlledValue,
    defaultValue ?? "",
    onValueChange,
  );
  const [multi, setMulti] = useControllableState<string[]>(
    controlledValues,
    defaultValues ?? [],
    onValuesChange,
  );
  const selected = multiple ? (multi ?? []) : [single ?? ""].filter(Boolean);

  return (
    <View
      testID={testID ?? "kern-segmented-button"}
      accessibilityRole="radiogroup"
      style={[
        {
          flexDirection: "row",
          borderWidth: 1,
          borderColor: scheme.color.outline,
          borderRadius: Number.parseFloat(scheme.shape.full),
          overflow: "hidden",
        },
        style,
      ]}
    >
      {options.map((option, index) => {
        const active = selected.includes(option.value);
        return (
          <Pressable
            key={option.value}
            accessibilityRole={multiple ? "checkbox" : "radio"}
            accessibilityState={{
              selected: active,
              disabled: Boolean(option.disabled),
            }}
            accessibilityLabel={option.label}
            disabled={option.disabled}
            onPress={() => {
              if (multiple) {
                setMulti((previous) => {
                  const current = previous ?? [];
                  return current.includes(option.value)
                    ? current.filter((entry) => entry !== option.value)
                    : [...current, option.value];
                });
              } else {
                setSingle(option.value);
              }
            }}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: 40,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: Number.parseFloat(tokens.spacing["space-100"]),
              paddingHorizontal: Number.parseFloat(tokens.spacing["space-150"]),
              borderLeftWidth: index === 0 ? 0 : 1,
              borderLeftColor: scheme.color.outline,
              backgroundColor: active
                ? scheme.color.secondaryContainer
                : "transparent",
              opacity: option.disabled ? 0.38 : pressed ? 0.82 : 1,
            })}
          >
            {option.icon}
            <RNText
              numberOfLines={1}
              style={{
                fontSize: 13,
                fontWeight: active ? "600" : "500",
                color: active
                  ? scheme.color.onSecondaryContainer
                  : scheme.color.onSurface,
              }}
            >
              {option.label}
            </RNText>
            {active ? (
              <RNText style={{ color: scheme.color.onSecondaryContainer }}>
                ✓
              </RNText>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export type CountryOption = {
  /** ISO 3166-1 alpha-2 or alpha-3 — opaque to the component. */
  code: string;
  label: string;
  dial?: string;
  disabled?: boolean;
};

/**
 * Country select. Country data arrives as a prop — Kern ships no country
 * dataset, so the host stays the source of truth for it.
 */
export function CountrySelect({
  options,
  value,
  onValueChange,
  style,
  testID,
}: {
  options: CountryOption[];
  value?: string;
  onValueChange: (code: string) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const scheme = useKernScheme();
  const selected = options.find((option) => option.code === value);
  return (
    <Pressable
      testID={testID ?? "kern-country-select"}
      accessibilityRole="combobox"
      accessibilityLabel="Country"
      accessibilityValue={{ text: selected?.label ?? "Select country" }}
      onPress={() => {
        const next = options.find((option) => !option.disabled);
        if (next) onValueChange(next.code);
      }}
      style={({ pressed }) => [
        {
          minHeight: 56,
          flexDirection: "row",
          alignItems: "center",
          gap: Number.parseFloat(tokens.spacing["space-150"]),
          paddingHorizontal: Number.parseFloat(tokens.spacing["space-200"]),
          borderWidth: 1,
          borderColor: scheme.color.outline,
          borderRadius: Number.parseFloat(scheme.shape.small),
          backgroundColor: scheme.color.surface,
          opacity: pressed ? 0.82 : 1,
        },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        <RNText style={{ fontSize: 11, color: scheme.color.onSurfaceVariant }}>
          {selected?.code ?? "—"}
        </RNText>
        <RNText
          numberOfLines={1}
          style={{ fontSize: 15, color: scheme.color.onSurface }}
        >
          {selected?.label ?? "Select country"}
        </RNText>
      </View>
      {selected?.dial ? (
        <RNText style={{ fontSize: 13, color: scheme.color.onSurfaceVariant }}>
          {selected.dial}
        </RNText>
      ) : null}
    </Pressable>
  );
}

/** `Banner` intents map 1:1 onto the M3 status roles. */
export type BannerVariant = "info" | "success" | "warning" | "error";

export function bannerStyles(
  variant: BannerVariant,
  scheme: ResolvedTheme = resolveThemeDetails(),
): {
  container: ViewStyle;
  title: TextStyle;
  body: TextStyle;
} {
  const fill = {
    info: scheme.color.infoContainer,
    success: scheme.color.successContainer,
    warning: scheme.color.warningContainer,
    error: scheme.color.errorContainer,
  }[variant];
  const ink = {
    info: scheme.color.onInfoContainer,
    success: scheme.color.onSuccessContainer,
    warning: scheme.color.onWarningContainer,
    error: scheme.color.onErrorContainer,
  }[variant];
  return {
    container: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: Number.parseFloat(tokens.spacing["space-150"]),
      padding: Number.parseFloat(tokens.spacing["space-200"]),
      borderRadius: Number.parseFloat(scheme.shape.medium),
      backgroundColor: fill,
    },
    title: { fontSize: 14, fontWeight: "600", color: ink },
    body: { fontSize: 13, color: ink },
  };
}

/**
 * Banner: a persistent, in-flow message for the whole region. Unlike a
 * snackbar it does not dismiss itself and carries at most one action.
 */
export function Banner({
  variant = "info",
  title,
  children,
  action,
  onDismiss,
  style,
  testID,
}: {
  variant?: BannerVariant;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const scheme = useKernScheme();
  const styles = bannerStyles(variant, scheme);
  return (
    <View
      testID={testID ?? "kern-banner"}
      accessibilityRole="alert"
      style={[styles.container, style]}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <RNText style={styles.title}>{title}</RNText>
        {children ? <RNText style={styles.body}>{children}</RNText> : null}
      </View>
      {action}
      {onDismiss ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Dismiss ${title}`}
          onPress={onDismiss}
          style={{
            minWidth: 48,
            minHeight: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RNText style={{ color: styles.title.color }}>×</RNText>
        </Pressable>
      ) : null}
    </View>
  );
}
