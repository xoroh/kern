import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
import { useMemo, useState } from "react";
import {
  Pressable,
  type StyleProp,
  TextInput,
  View,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { useControllableState } from "../utils/useControllableState";
import { inputStyles } from "./input";
import { Text } from "./text";

/**
 * M3 text field: free-text entry with a filtered suggestion list (P2b-3).
 *
 * ## What this owns, and why it is not a wrapper
 *
 * The web `Autocomplete` is four thin pass-throughs over Base UI's
 * `Autocomplete.*` parts, so on web the behaviour lives in the primitive. RN
 * has no equivalent primitive, so this component owns the behaviour itself:
 * the query, the filtered set, which suggestion is active, and the two ways
 * out (commit a suggestion, or dismiss). A component that only forwarded props
 * would have nothing to own.
 *
 * ## The measured divergences this deliberately does NOT encode
 *
 * Measured on web (`packages/kern/src/parity/probe2.test.tsx`, deleted after
 * the measurement) and recorded rather than copied:
 *
 * 1. **The empty state never renders on web.** With a query matching nothing,
 *    Base UI keeps `aria-expanded="true"` and emits no empty node, so the
 *    popup is an expanded box with zero options. Here the popup closes and
 *    `emptyMessage` is announced through the field's hint instead — a reader
 *    is better served by "no matches" than by an empty expanded list. This is
 *    a web fix owed by P2b-4, not a contract.
 * 2. **No `aria-activedescendant` analogue is invented.** RN has no
 *    activedescendant; the active suggestion is exposed as
 *    `accessibilityState.selected` on the row itself, which is the axis the
 *    parity contract already defines as `selected`.
 */

export type AutocompleteSuggestion = {
  /** Stable identity for keys and selection callbacks; not shown. */
  value: string;
  /** What the user reads and what lands in the field. */
  label: string;
  disabled?: boolean;
};

export type NativeAutocompleteProps = {
  suggestions: readonly AutocompleteSuggestion[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fired when a suggestion is committed. */
  onSelect?: (suggestion: AutocompleteSuggestion) => void;
  /** Fired when the popup opens or closes, including dismissal by blur. */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Case-insensitive substring match. A host with server-side or fuzzy
   * matching replaces this; the default is the honest local behaviour.
   */
  filter?: (suggestion: AutocompleteSuggestion, query: string) => boolean;
  accessibilityLabel?: string;
  placeholder?: string;
  /** Announced when nothing matches. Omit to stay silent. */
  emptyMessage?: string;
  disabled?: boolean;
  /** Rendered inside the field row, after the input. */
  accessory?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function autocompleteStyles(
  scheme: ResolvedTheme = resolveThemeDetails(),
): { popup: ViewStyle; option: ViewStyle; optionActive: ViewStyle } {
  return {
    popup: {
      marginTop: 4,
      borderRadius: Number.parseFloat(scheme.shape.small),
      borderWidth: 1,
      borderColor: scheme.color.outline,
      backgroundColor: scheme.color.surfaceContainer,
      overflow: "hidden",
    },
    option: {
      minHeight: 48,
      justifyContent: "center",
      paddingHorizontal: 16,
    },
    optionActive: { backgroundColor: scheme.color.surfaceTonal },
  };
}

/** The default filter: case-insensitive substring over the label. */
export function defaultAutocompleteFilter(
  suggestion: AutocompleteSuggestion,
  query: string,
): boolean {
  return suggestion.label.toLowerCase().includes(query.trim().toLowerCase());
}

/**
 * Free-text field with a filtered suggestion list.
 *
 * The popup opens when the field is focused AND the query matches at least one
 * suggestion, and closes on commit, on blur, and when the query stops
 * matching. A popup that opens on focus alone — before the user has typed
 * anything — shows the whole list over a field the user has not begun filling,
 * which is not what M3 describes.
 */
export function Autocomplete({
  suggestions,
  value,
  defaultValue = "",
  onValueChange,
  onSelect,
  onExpandedChange,
  filter = defaultAutocompleteFilter,
  accessibilityLabel = "Search",
  placeholder,
  emptyMessage,
  disabled = false,
  accessory,
  style,
  testID,
}: NativeAutocompleteProps) {
  const scheme = useKernScheme();
  const styles = autocompleteStyles(scheme);
  const [query, setQuery] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const text = query ?? defaultValue;

  const matches = useMemo(
    () => suggestions.filter((suggestion) => filter(suggestion, text)),
    [filter, suggestions, text],
  );

  // An empty query matches EVERY suggestion, so "matches.length > 0" alone
  // would open the popup on focus — a field the user has not begun filling,
  // covered by the whole list. M3 autocomplete opens on input, so an empty
  // (or whitespace-only) query opens nothing.
  const hasQuery = text.trim().length > 0;
  const expanded = focused && !disabled && hasQuery && matches.length > 0;
  const active = expanded ? (matches[activeIndex] ?? matches[0]) : undefined;

  const hint = [
    emptyMessage && matches.length === 0 && focused
      ? `${emptyMessage}`
      : undefined,
    expanded
      ? `${matches.length} ${matches.length === 1 ? "suggestion" : "suggestions"} available.`
      : undefined,
  ]
    .filter(Boolean)
    .join(". ");

  function commit(suggestion: AutocompleteSuggestion) {
    if (suggestion.disabled) return;
    setQuery(suggestion.label);
    setActiveIndex(0);
    setFocused(false);
    onExpandedChange?.(false);
    onSelect?.(suggestion);
  }

  return (
    <View testID={testID ?? "kern-autocomplete"} style={style}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          accessibilityRole="combobox"
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={hint || undefined}
          accessibilityState={{ expanded, disabled }}
          editable={!disabled}
          placeholder={placeholder}
          placeholderTextColor={scheme.color.onSurfaceVariant}
          testID="kern-autocomplete-input"
          value={text}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onExpandedChange?.(false);
          }}
          // The RN dismissal path: there is no Escape key on a touch device,
          // so the return key is what closes the popup.
          onSubmitEditing={() => {
            setFocused(false);
            onExpandedChange?.(false);
          }}
          style={[inputStyles(false, false, scheme), { flex: 1 }]}
        />
        {accessory}
      </View>
      {expanded ? (
        <View
          accessibilityRole="list"
          accessibilityLabel={`${accessibilityLabel} suggestions`}
          style={styles.popup}
        >
          {matches.map((suggestion) => {
            const isActive = suggestion === active;
            return (
              <Pressable
                key={suggestion.value}
                accessibilityRole="menuitem"
                accessibilityLabel={suggestion.label}
                accessibilityState={{
                  selected: isActive,
                  disabled: Boolean(suggestion.disabled),
                }}
                disabled={suggestion.disabled}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                onPress={() => commit(suggestion)}
                style={[styles.option, isActive ? styles.optionActive : null]}
              >
                <Text
                  style={{
                    color: suggestion.disabled
                      ? scheme.color.onSurfaceVariant
                      : scheme.color.onSurface,
                  }}
                >
                  {suggestion.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
