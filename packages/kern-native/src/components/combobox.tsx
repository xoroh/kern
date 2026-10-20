import { useControllableState } from "@xoroh/axis";
import { defaultCollectionMatch } from "@xoroh/axis/models";
import { Icon } from "@xoroh/kern-icons";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  type StyleProp,
  StyleSheet,
  TextInput,
  View,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { scrimStyle } from "../utils/overlay-styles";
import { inputStyles } from "./input";
import { DISABLED_CONTENT_OPACITY } from "./state-layer";
import { Text } from "./text";

export type NativeComboboxOption = {
  /** Stable identity for keys and selection callbacks; not shown. */
  value: string;
  /** What the user reads and what the trigger shows when selected. */
  label: string;
  disabled?: boolean;
};

export function comboboxStyles(scheme: ResolvedTheme = defaultScheme()): {
  option: ViewStyle;
  optionSelected: ViewStyle;
} {
  return {
    option: {
      minHeight: 48,
      justifyContent: "center",
      paddingHorizontal: 12,
      borderRadius: Number.parseFloat(scheme.shape["extra-small"]),
    },
    optionSelected: { backgroundColor: scheme.color.surfaceTonal },
  };
}

/** The default filter: case-insensitive substring over the label. */
export function defaultComboboxFilter(
  option: NativeComboboxOption,
  query: string,
): boolean {
  return defaultCollectionMatch(query, option.label);
}

const triggerStaticStyles = StyleSheet.create({
  trigger: {
    minHeight: 48,
    justifyContent: "center",
  },
});

/**
 * The transient popup card. M3 menu width caps (112dp min, 280dp max) on
 * surface-container, at the sheet 50% height cap, floating on the single
 * Kern structural shadow (level 2 = 3dp).
 */
export function comboboxPopupStyles(scheme: ResolvedTheme = defaultScheme()): {
  card: ViewStyle;
} {
  return {
    card: {
      width: "100%",
      minWidth: 112,
      maxWidth: 280,
      maxHeight: "50%",
      borderRadius: Number.parseFloat(scheme.shape.medium),
      backgroundColor: scheme.color.surfaceContainer,
      padding: 16,
      shadowColor: scheme.color.shadow,
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
  };
}

export type NativeComboboxProps = {
  options: NativeComboboxOption[];
  /** Selected option value. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fired with the full option when one is committed. */
  onSelect?: (option: NativeComboboxOption) => void;
  /** Visibility of the option popup; passed through to the Popover. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Case-insensitive substring match over the label. A host with
   * server-side or fuzzy matching replaces this; the default is the
   * honest local behaviour.
   */
  filter?: (option: NativeComboboxOption, query: string) => boolean;
  accessibilityLabel?: string;
  placeholder?: string;
  /** Shown in the popup when nothing matches. */
  emptyMessage?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Type-to-filter single choice: a field trigger opens a transient popup
 * holding a filter field and a selectable option list.
 *
 * API decision vs web: web `Combobox` is multipart (`Root`/`Input`/`Item`/…)
 * over Base UI with the input AS the trigger. Native ships one flat
 * component with `options: { value, label }[]` (the `SegmentedButton` /
 * `Select` convention): the trigger is a read-only field display and the
 * filter field lives INSIDE the popup. That keeps one editable field on
 * screen at a time instead of nesting a `TextInput` inside the trigger
 * pressable.
 *
 * The popup is an inline centred `Modal` over the 30% Kern scrim — NOT the
 * compound `Popover` from `overlay-surfaces`, deliberately: that surface
 * wraps its content in a dismiss pressable (correct for an anchored hint),
 * which would swallow the filter field's taps, and it has no scrim or
 * outside-press dismissal. Dismissal here is scrim press, Android back
 * (`onRequestClose`), commit, and the trigger; placement centres on all
 * screens in v1 (anchor-relative positioning is a follow-up).
 *
 * The popup opens with the FULL list; typing narrows it. Committing an
 * option reports `onValueChange` + `onSelect`, shows its label in the
 * trigger, and closes. Options mirror the web listbox semantics through
 * the roles RN has: the list is `accessibilityRole="list"`, each option
 * carries the ARIA `role="option"` (the `accessibilityRole` union has no
 * `option` member) plus `aria-selected`, and the trigger
 * reports `expanded` (the `Menu` precedent).
 */
export function Combobox({
  options,
  value,
  defaultValue,
  onValueChange,
  onSelect,
  open,
  defaultOpen = false,
  onOpenChange,
  filter = defaultComboboxFilter,
  accessibilityLabel = "Choose an option",
  placeholder = "Select",
  emptyMessage = "No results found",
  disabled = false,
  style,
  testID,
}: NativeComboboxProps) {
  const scheme = useKernScheme();
  const styles = comboboxStyles(scheme);
  const popupStyles = comboboxPopupStyles(scheme);
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const [shown, setShown] = useControllableState(
    open,
    defaultOpen,
    onOpenChange,
  );
  // The query is plain `useState`: it is transient filter text, never
  // selection. It resets on commit and on dismiss so reopening always
  // starts from the full list.
  const [query, setQuery] = useState("");
  const text = query;
  const current = selected;

  const matches = useMemo(
    () => options.filter((option) => filter(option, text)),
    [filter, options, text],
  );
  const selectedOption = options.find((option) => option.value === current);

  function commit(option: NativeComboboxOption) {
    if (option.disabled) return;
    setSelected(option.value);
    setQuery("");
    setShown(false);
    onSelect?.(option);
  }

  function dismiss() {
    setQuery("");
    setShown(false);
  }

  const base = testID ?? "kern-combobox";
  const popupBase = `${base}-popup`;
  const countHint =
    matches.length === 0
      ? emptyMessage
      : `${matches.length} ${matches.length === 1 ? "option" : "options"} available.`;

  return (
    <View testID={base} style={style}>
      <Pressable
        testID={`${popupBase}-trigger`}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        aria-expanded={shown ?? false}
        aria-disabled={disabled}
        disabled={disabled}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        onPress={() => setShown(true)}
        style={triggerStaticStyles.trigger}
      >
        <View
          style={{
            minHeight: 56,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: scheme.color.outline,
            borderRadius: Number.parseFloat(scheme.shape["extra-small"]),
            backgroundColor: scheme.color.surface,
            paddingHorizontal: 16,
            opacity: disabled ? DISABLED_CONTENT_OPACITY : 1,
          }}
        >
          <Text
            style={
              selectedOption
                ? undefined
                : { color: scheme.color.onSurfaceVariant }
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <Icon name="arrow-drop-down" />
        </View>
      </Pressable>
      <Modal
        visible={shown ?? false}
        transparent
        animationType="fade"
        accessibilityViewIsModal
        onRequestClose={dismiss}
      >
        <View style={scrimStyle(scheme)}>
          <Pressable
            testID={`${popupBase}-scrim`}
            accessibilityRole="button"
            accessibilityLabel={`Dismiss ${accessibilityLabel}`}
            onPress={dismiss}
            style={StyleSheet.absoluteFill}
          />
          <View testID={`${popupBase}-content`} style={popupStyles.card}>
            <TextInput
              testID={`${base}-filter`}
              accessibilityLabel={`Filter ${accessibilityLabel}`}
              accessibilityHint={countHint}
              editable={!disabled}
              placeholder="Type to filter"
              placeholderTextColor={scheme.color.onSurfaceVariant}
              value={text}
              onChangeText={setQuery}
              style={[inputStyles(false, false, scheme), { marginBottom: 8 }]}
            />
            {matches.length > 0 ? (
              <View
                accessibilityRole="list"
                accessibilityLabel={`${accessibilityLabel} options`}
              >
                {matches.map((option) => {
                  const isSelected = option.value === current;
                  return (
                    <Pressable
                      key={option.value}
                      testID={`${base}-option-${option.value}`}
                      // Dual mapping (the Dialog precedent): `menuitem` is the
                      // closest real platform trait; `option` is the ARIA role
                      // the web listbox uses, which `accessibilityRole` cannot
                      // express.
                      accessibilityRole="menuitem"
                      role="option"
                      accessibilityLabel={option.label}
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      disabled={option.disabled}
                      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                      onPress={() => commit(option)}
                      style={[
                        styles.option,
                        isSelected ? styles.optionSelected : null,
                      ]}
                    >
                      <Text
                        style={
                          option.disabled
                            ? { color: scheme.color.onSurfaceVariant }
                            : undefined
                        }
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <Text
                testID={`${base}-empty`}
                style={{ color: scheme.color.onSurfaceVariant }}
              >
                {emptyMessage}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
