import { type ResolvedTheme, tokens } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernTheme } from "../theme";
import { StateLayer } from "./state-layer";

export function listItemStyles(
  scheme: ResolvedTheme = defaultScheme(),
  selected = false,
): {
  row: ViewStyle;
  title: TextStyle;
  supporting: TextStyle;
} {
  return {
    row: {
      minHeight: 56,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: Number.parseFloat(tokens.spacing["space-150"]),
      overflow: "hidden" as const,
      // M3 selected list item: secondary-container fill, large corners.
      ...(selected
        ? {
            backgroundColor: scheme.color.secondaryContainer,
            borderRadius: Number.parseFloat(scheme.shape.large),
          }
        : null),
    },
    title: {
      fontSize: 14,
      color: selected
        ? scheme.color.onSecondaryContainer
        : scheme.color.onSurface,
    },
    supporting: { fontSize: 12, color: scheme.color.onSurfaceVariant },
  };
}

export type NativeListItemProps = Omit<
  PressableProps,
  "children" | "style" | "onPress" | "accessibilityRole" | "accessibilityLabel"
> & {
  title: string;
  supporting?: string;
  /**
   * Leading media slot (avatar, icon, …). WP1a 10-way list variants:
   * unlike web's decorative leading span, native renders the slot visibly
   * with no aria-hidden wrapper — the row's accessible name already comes
   * from `title`/`supporting`, and hiding slotted MEDIA would also hide
   * nothing informative either way. Interactive controls still do NOT
   * belong here (use the selectable `List` variant's labelled rows).
   */
  leading?: ReactNode;
  /** Trailing metadata/action slot. */
  trailing?: ReactNode;
  onPress?: PressableProps["onPress"];
  accessibilityLabel?: string;
  accessibilityRole?: PressableProps["accessibilityRole"];
  /**
   * M3 selected state: secondary-container fill with 16dp corners, ink
   * on-secondary-container.
   */
  selected?: boolean;
  style?: PressableProps["style"];
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export function ListItem({
  title,
  supporting,
  leading,
  trailing,
  contentStyle,
  titleStyle,
  testID,
  onPress,
  disabled,
  selected = false,
  accessibilityLabel,
  accessibilityRole,
  style,
  ...props
}: NativeListItemProps) {
  const { scheme } = useKernTheme();
  const styles = listItemStyles(scheme, selected);
  const radius = selected ? Number.parseFloat(scheme.shape.large) : 0;
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-list-item"}
      accessibilityRole={accessibilityRole ?? (onPress ? "button" : "none")}
      accessibilityLabel={
        accessibilityLabel ?? [title, supporting].filter(Boolean).join(", ")
      }
      disabled={disabled}
      onPress={onPress}
      style={({ pressed: pressedNow }) => [
        styles.row,
        typeof style === "function" ? style({ pressed: pressedNow }) : style,
      ]}
    >
      {({ pressed: pressedNow }) => (
        <>
          {leading}
          <View style={[{ flex: 1 }, contentStyle]}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            {supporting ? (
              <Text style={styles.supporting}>{supporting}</Text>
            ) : null}
          </View>
          {trailing}
          <StateLayer
            ink={scheme.color.onSurface}
            radius={radius}
            visible={pressedNow && !disabled}
          />
        </>
      )}
    </Pressable>
  );
}
