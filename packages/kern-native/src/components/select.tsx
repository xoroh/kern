import {
  SelectArrow as AxisSelectArrow,
  SelectBackdrop as AxisSelectBackdrop,
  SelectGroup as AxisSelectGroup,
  SelectGroupLabel as AxisSelectGroupLabel,
  SelectItem as AxisSelectItem,
  SelectItemIndicator as AxisSelectItemIndicator,
  SelectItemText as AxisSelectItemText,
  SelectPopup as AxisSelectPopup,
  SelectPortal as AxisSelectPortal,
  SelectPositioner as AxisSelectPositioner,
  SelectRoot as AxisSelectRoot,
  SelectScrollDownArrow as AxisSelectScrollDownArrow,
  SelectScrollUpArrow as AxisSelectScrollUpArrow,
  SelectSeparator as AxisSelectSeparator,
  SelectTrigger as AxisSelectTrigger,
  SelectValue as AxisSelectValue,
  type SelectArrowProps,
  type SelectBackdropProps,
  type SelectGroupLabelProps,
  type SelectGroupProps,
  type SelectItemIndicatorProps,
  type SelectItemProps,
  type SelectItemTextProps,
  type SelectPopupProps,
  type SelectPortalProps,
  type SelectPositionerProps,
  type SelectRootProps,
  type SelectScrollDownArrowProps,
  type SelectScrollUpArrowProps,
  type SelectSeparatorProps,
  type SelectTriggerProps,
  type SelectValueProps,
} from "@xoroh/axis";
import { Icon } from "@xoroh/kern-icons";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import { type StyleProp, View, type ViewStyle } from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { menuStyles } from "./menu";
import { DISABLED_CONTENT_OPACITY } from "./state-layer";
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
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onValueChange?: (value: string | string[]) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  multiple?: boolean;
  alignItemWithTrigger?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export {
  AxisSelectArrow as SelectArrow,
  AxisSelectBackdrop as SelectBackdrop,
  AxisSelectGroup as SelectGroup,
  AxisSelectGroupLabel as SelectGroupLabel,
  AxisSelectItem as SelectItem,
  AxisSelectItemIndicator as SelectItemIndicator,
  AxisSelectItemText as SelectItemText,
  AxisSelectPopup as SelectPopup,
  AxisSelectPortal as SelectPortal,
  AxisSelectPositioner as SelectPositioner,
  AxisSelectRoot as SelectRoot,
  AxisSelectScrollDownArrow as SelectScrollDownArrow,
  AxisSelectScrollUpArrow as SelectScrollUpArrow,
  AxisSelectSeparator as SelectSeparator,
  AxisSelectTrigger as SelectTrigger,
  AxisSelectValue as SelectValue,
  type SelectArrowProps,
  type SelectBackdropProps,
  type SelectGroupLabelProps,
  type SelectGroupProps,
  type SelectItemIndicatorProps,
  type SelectItemProps,
  type SelectItemTextProps,
  type SelectPopupProps,
  type SelectPortalProps,
  type SelectPositionerProps,
  type SelectRootProps,
  type SelectScrollDownArrowProps,
  type SelectScrollUpArrowProps,
  type SelectSeparatorProps,
  type SelectTriggerProps,
  type SelectValueProps,
};

/**
 * M3 select — one or more values from a known set, on the Axis `SelectRoot` compound.
 *
 * The open list paints through `SelectPortal` at the app's root `PortalHost`
 * (no RN `Modal` of its own: one root presents every layer). `onDismiss`
 * fires when the list goes away WITHOUT a selection — scrim press, system
 * back, escape — so a caller can tell a pick (`onValueChange`) from a
 * bail-out. Choosing an option in single-select closes the list; multi-select
 * keeps it open and reports the updated array.
 */
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select",
  accessibilityLabel = "Select",
  disabled = false,
  multiple = false,
  alignItemWithTrigger = true,
  open,
  defaultOpen,
  onOpenChange,
  onDismiss,
  style,
  testID,
}: NativeSelectProps) {
  const scheme = useKernScheme();
  const styles = menuStyles(scheme);
  return (
    <View testID={testID ?? "kern-select"}>
      <AxisSelectRoot
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onDismiss={onDismiss}
        disabled={disabled}
        multiple={multiple}
        items={options}
      >
        <AxisSelectTrigger
          accessibilityLabel={accessibilityLabel}
          disabled={disabled}
          style={[
            selectStyles(scheme).trigger,
            { opacity: disabled ? DISABLED_CONTENT_OPACITY : 1 },
            style,
          ]}
        >
          <AxisSelectValue
            placeholder={placeholder}
            style={({ placeholder: showingPlaceholder }) =>
              showingPlaceholder
                ? { color: scheme.color.onSurfaceVariant }
                : undefined
            }
          />
          <Icon name="arrow-drop-down" />
        </AxisSelectTrigger>
        <AxisSelectPortal>
          <AxisSelectBackdrop style={{ backgroundColor: scheme.color.scrim }} />
          <AxisSelectPositioner alignItemWithTrigger={alignItemWithTrigger}>
            <AxisSelectPopup style={styles.card}>
              {options.map((option) => (
                <AxisSelectItem
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  accessibilityLabel={option.label}
                  style={({ selected }) => ({
                    minHeight: 48,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 12,
                    borderRadius: Number.parseFloat(
                      scheme.shape["extra-small"],
                    ),
                    backgroundColor: selected
                      ? scheme.color.surfaceTonal
                      : "transparent",
                  })}
                >
                  <AxisSelectItemText>
                    <Text>{option.label}</Text>
                  </AxisSelectItemText>
                  <AxisSelectItemIndicator>
                    <Icon name="check" size={18} />
                  </AxisSelectItemIndicator>
                </AxisSelectItem>
              ))}
            </AxisSelectPopup>
          </AxisSelectPositioner>
        </AxisSelectPortal>
      </AxisSelectRoot>
    </View>
  );
}

Select.Root = AxisSelectRoot;
Select.Trigger = AxisSelectTrigger;
Select.Value = AxisSelectValue;
Select.Portal = AxisSelectPortal;
Select.Positioner = AxisSelectPositioner;
Select.Backdrop = AxisSelectBackdrop;
Select.Popup = AxisSelectPopup;
Select.Arrow = AxisSelectArrow;
Select.ScrollUpArrow = AxisSelectScrollUpArrow;
Select.ScrollDownArrow = AxisSelectScrollDownArrow;
Select.Group = AxisSelectGroup;
Select.GroupLabel = AxisSelectGroupLabel;
Select.Item = AxisSelectItem;
Select.ItemText = AxisSelectItemText;
Select.ItemIndicator = AxisSelectItemIndicator;
Select.Separator = AxisSelectSeparator;
