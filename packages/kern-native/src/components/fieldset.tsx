import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Text as RNText,
  type StyleProp,
  type TextStyle,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";

/**
 * M3 Fieldset — grouped controls with a shared legend and disabled state.
 *
 * ## Why this exists on native at all
 *
 * On the web this is a thin wrapper over `<fieldset>`, and the browser gives it
 * two behaviours for free:
 *
 *   1. the group is announced as a group, NAMED BY ITS LEGEND, and
 *   2. `disabled` on the fieldset disables EVERY descendant control.
 *
 * React Native has no `<fieldset>` and no such inheritance. A `View` with
 * `disabled` set is just a `View` — nothing downstream knows. So on native this
 * component owns real behaviour rather than restyling a browser default:
 *
 *   - it publishes `disabled` through context, and
 *   - `useFieldsetDisabled()` is the hook Kern's own controls read to opt in.
 *
 * That is the whole reason to build it natively instead of documenting "wrap
 * your inputs in a View": without a provider there is no way for a consumer to
 * ask "am I disabled?" and get an answer that includes its ancestors.
 *
 * ## Why the legend is the accessible NAME
 *
 * The legend is not a caption beside the group — it is what names the group. So
 * the name is derived from the legend rather than passed separately, because two
 * sources for one name is a way to have them disagree. An explicit
 * `accessibilityLabel` still wins, for the case where the legend is not text.
 *
 * Note this is `role`, not `accessibilityRole`: RN's ARIA-aligned `Role` union
 * carries `group`. Same reasoning as `meter.tsx` and `drawer.tsx`.
 */

type FieldsetContextValue = {
  disabled: boolean;
  /** The legend text, used as the group's accessible name. */
  legend?: string;
  /** Called by `FieldsetLegend` so the legend can name the group. */
  setLegend: (text: string | undefined) => void;
};

const FieldsetContext = createContext<FieldsetContextValue | null>(null);

/**
 * Read the inherited disabled state. Returns `false` outside a fieldset so a
 * control used standalone still works.
 *
 * Kern controls call this and OR it with their own `disabled`/`editable` prop,
 * so a control is disabled if it is disabled directly OR any ancestor fieldset
 * is — which is exactly the web's semantics.
 */
export function useFieldsetDisabled(): boolean {
  const ctx = useContext(FieldsetContext);
  return ctx?.disabled ?? false;
}

/** Read the fieldset context, or `null` outside a fieldset. */
export function useFieldset(): FieldsetContextValue | null {
  return useContext(FieldsetContext);
}

export function fieldsetStyles(
  disabled: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
): { root: ViewStyle; legend: TextStyle } {
  return {
    root: {
      borderWidth: 1,
      borderColor: scheme.color.outlineVariant,
      borderRadius: Number.parseFloat(scheme.shape.small),
      padding: Number.parseFloat(tokens.spacing["space-200"]),
      gap: Number.parseFloat(tokens.spacing["space-150"]),
      opacity: disabled ? 0.5 : 1,
    },
    legend: {
      fontSize: 14,
      fontWeight: "500",
      color: scheme.color.onSurface,
    },
  };
}

export type FieldsetProps = Omit<ViewProps, "children" | "style" | "role"> & {
  /**
   * Disables the group. On the web this is inherited by every descendant
   * automatically; on native it is published through context for
   * `useFieldsetDisabled()`.
   */
  disabled?: boolean;
  /**
   * Overrides the accessible name. Leave unset to name the group with its
   * legend, which is what the web does.
   */
  accessibilityLabel?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Fieldset({
  disabled = false,
  accessibilityLabel,
  children,
  style,
  testID,
  ...props
}: FieldsetProps) {
  const scheme = useKernScheme();
  const styles = fieldsetStyles(disabled, scheme);
  // Read the ANCESTOR's state before publishing our own. A nested fieldset
  // inherits: `<fieldset disabled><fieldset>` keeps everything disabled, which
  // is what the browser does and what a consumer nesting groups for layout
  // expects. Publishing our own `disabled` alone would silently re-enable the
  // whole inner group.
  const inherited = useFieldsetDisabled();
  const effectiveDisabled = disabled || inherited;

  // The legend NAMES the group, and the legend is a child element — its text is
  // not knowable at this render. `FieldsetLegend` registers it on mount. State,
  // not derivation, because a derived value here is always undefined.
  const [legend, setLegend] = useState<string | undefined>(undefined);

  // A `useState` setter is stable for the component's whole life, so it is
  // deliberately NOT a dependency — the linter is right about this, and an
  // earlier version of this comment claimed the opposite.
  const ctx = useMemo<FieldsetContextValue>(
    () => ({ disabled: effectiveDisabled, legend, setLegend }),
    [effectiveDisabled, legend],
  );

  return (
    <FieldsetContext.Provider value={ctx}>
      <View
        {...props}
        testID={testID ?? "kern-fieldset"}
        role="group"
        accessibilityLabel={accessibilityLabel ?? legend}
        accessibilityState={{ disabled: effectiveDisabled }}
        style={[styles.root, style]}
      >
        {children}
      </View>
    </FieldsetContext.Provider>
  );
}

export type FieldsetLegendProps = Omit<ViewProps, "children" | "style"> & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * The legend. Rendered inside the fieldset and, when it is the first child,
 * doubles as the group's accessible name.
 */
export function FieldsetLegend({
  children,
  style,
  testID,
  ...props
}: FieldsetLegendProps) {
  const scheme = useKernScheme();
  const styles = fieldsetStyles(false, scheme);
  const ctx = useContext(FieldsetContext);
  const text =
    typeof children === "string" || typeof children === "number"
      ? String(children)
      : undefined;

  // Register so the group can be NAMED by its legend. This is the whole point
  // of a fieldset: the legend is the group's accessible name, not a caption.
  // Cleared on unmount so a removed legend does not leave the group named.
  const { setLegend } = ctx ?? {};
  useEffect(() => {
    setLegend?.(text);
    return () => setLegend?.(undefined);
  }, [setLegend, text]);

  return (
    <View
      {...props}
      testID={testID ?? "kern-fieldset-legend"}
      style={[
        { paddingHorizontal: Number.parseFloat(tokens.spacing["space-25"]) },
        style,
      ]}
    >
      <RNText style={styles.legend}>{children}</RNText>
    </View>
  );
}

export type FieldsetItemProps = Omit<ViewProps, "children" | "style"> & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * A row inside a fieldset that renders itself disabled when the fieldset is.
 *
 * This is the opt-in part: a `View` cannot know it is disabled, so anything
 * interactive inside a fieldset must either be a Kern control that calls
 * `useFieldsetDisabled()`, or an item that visibly reflects it.
 */
export function FieldsetItem({
  children,
  style,
  testID,
  ...props
}: FieldsetItemProps) {
  const disabled = useFieldsetDisabled();
  return (
    <View
      {...props}
      testID={testID ?? "kern-fieldset-item"}
      accessibilityState={{ disabled }}
      style={[
        {
          minHeight: 48,
          justifyContent: "center",
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
