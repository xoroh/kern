import { useSelection } from "@xoroh/kern-primitives";
import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { Text } from "./text";

export type NativeAccordionSection = {
  title: string;
  content: ReactNode;
  accessibilityLabel?: string;
};

export function accordionStyles(
  scheme: ResolvedTheme = resolveThemeDetails(),
): { container: ViewStyle; header: ViewStyle } {
  return {
    container: {
      borderWidth: 1,
      borderColor: scheme.color.outlineVariant,
      borderRadius: Number.parseFloat(scheme.shape.small),
      backgroundColor: scheme.color.surface,
      overflow: "hidden",
    },
    header: {
      minHeight: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
    },
  };
}

export type NativeAccordionProps = Omit<ViewProps, "children" | "style"> & {
  sections: NativeAccordionSection[];
  /** Controlled open section indexes. */
  expanded?: number[];
  defaultExpanded?: number[];
  onExpandedChange?: (expanded: number[]) => void;
  /** Allow several sections open at once. */
  multiple?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Accordion({
  sections,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  multiple = false,
  style,
  testID,
  ...props
}: NativeAccordionProps) {
  const scheme = useKernScheme();
  // Shared selection primitive, keyed by SECTION INDEX: `expanded` is public API
  // and has always been `number[]`, so the key type is generic rather than
  // string. The alternative — stringifying indices — would change the public
  // type to keep an internal detail tidy.
  const [open, setOpen] = useSelection({
    value: expanded,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange as (next: readonly number[]) => void,
    mode: multiple ? "multiple" : "single-toggle",
  });
  const styles = accordionStyles(scheme);
  function toggle(index: number) {
    setOpen(index);
  }
  return (
    <View
      {...props}
      testID={testID ?? "kern-accordion"}
      style={[styles.container, style]}
    >
      {sections.map((section, index) => {
        const isOpen = open.includes(index);
        const label = section.accessibilityLabel ?? section.title;
        return (
          <View key={section.title}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ expanded: isOpen }}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              onPress={() => toggle(index)}
              style={styles.header}
            >
              <Text variant="label">{section.title}</Text>
              <Text variant="body">{isOpen ? "−" : "+"}</Text>
            </Pressable>
            {isOpen ? (
              <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                {typeof section.content === "string" ? (
                  <Text>{section.content}</Text>
                ) : (
                  section.content
                )}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
