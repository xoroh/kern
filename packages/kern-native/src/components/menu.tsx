import {
  MenuArrow as AxisMenuArrow,
  MenuBackdrop as AxisMenuBackdrop,
  MenuCheckboxItem as AxisMenuCheckboxItem,
  MenuCheckboxItemIndicator as AxisMenuCheckboxItemIndicator,
  MenuClear as AxisMenuClear,
  MenuEmpty as AxisMenuEmpty,
  MenuGroup as AxisMenuGroup,
  MenuGroupLabel as AxisMenuGroupLabel,
  MenuInput as AxisMenuInput,
  MenuItem as AxisMenuItem,
  MenuLinkItem as AxisMenuLinkItem,
  MenuPopup as AxisMenuPopup,
  MenuPortal as AxisMenuPortal,
  MenuPositioner as AxisMenuPositioner,
  MenuRadioGroup as AxisMenuRadioGroup,
  MenuRadioItem as AxisMenuRadioItem,
  MenuRadioItemIndicator as AxisMenuRadioItemIndicator,
  MenuRoot as AxisMenuRoot,
  MenuSeparator as AxisMenuSeparator,
  MenuSubmenuContent as AxisMenuSubmenuContent,
  MenuSubmenuRoot as AxisMenuSubmenuRoot,
  MenuSubmenuTrigger as AxisMenuSubmenuTrigger,
  MenuTrigger as AxisMenuTrigger,
  type MenuArrowProps,
  type MenuBackdropProps,
  type MenuCheckboxItemIndicatorProps,
  type MenuCheckboxItemProps,
  type MenuClearProps,
  type MenuEmptyProps,
  type MenuGroupLabelProps,
  type MenuGroupProps,
  type MenuInputProps,
  type MenuItemProps,
  type MenuLinkItemProps,
  type MenuPopupProps,
  type MenuPortalProps,
  type MenuPositionerProps,
  type MenuRadioGroupProps,
  type MenuRadioItemIndicatorProps,
  type MenuRadioItemProps,
  type MenuRootProps,
  type MenuSeparatorProps,
  type MenuSubmenuContentProps,
  type MenuSubmenuRootProps,
  type MenuSubmenuTriggerProps,
  type MenuTriggerProps,
} from "@xoroh/axis";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { DISABLED_CONTENT_OPACITY } from "./state-layer";
import { Text } from "./text";

export type NativeMenuItem = {
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
};

export function menuStyles(scheme: ResolvedTheme = defaultScheme()): {
  card: ViewStyle;
} {
  return {
    card: {
      // M3 menu width: 112dp min, 280dp max; container is surface-container.
      minWidth: 112,
      maxWidth: 280,
      borderRadius: Number.parseFloat(scheme.shape.small),
      backgroundColor: scheme.color.surfaceContainer,
      padding: 8,
    },
  };
}

export type NativeMenuProps = {
  trigger: ReactNode;
  triggerLabel: string;
  items: NativeMenuItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export {
  AxisMenuArrow as MenuArrow,
  AxisMenuBackdrop as MenuBackdrop,
  AxisMenuCheckboxItem as MenuCheckboxItem,
  AxisMenuCheckboxItemIndicator as MenuCheckboxItemIndicator,
  AxisMenuClear as MenuClear,
  AxisMenuEmpty as MenuEmpty,
  AxisMenuGroup as MenuGroup,
  AxisMenuGroupLabel as MenuGroupLabel,
  AxisMenuInput as MenuInput,
  AxisMenuItem as MenuItem,
  AxisMenuLinkItem as MenuLinkItem,
  AxisMenuPopup as MenuPopup,
  AxisMenuPortal as MenuPortal,
  AxisMenuPositioner as MenuPositioner,
  AxisMenuRadioGroup as MenuRadioGroup,
  AxisMenuRadioItem as MenuRadioItem,
  AxisMenuRadioItemIndicator as MenuRadioItemIndicator,
  AxisMenuRoot as MenuRoot,
  AxisMenuSeparator as MenuSeparator,
  AxisMenuSubmenuContent as MenuSubmenuContent,
  AxisMenuSubmenuRoot as MenuSubmenuRoot,
  AxisMenuSubmenuTrigger as MenuSubmenuTrigger,
  AxisMenuTrigger as MenuTrigger,
  type MenuArrowProps,
  type MenuBackdropProps,
  type MenuCheckboxItemIndicatorProps,
  type MenuCheckboxItemProps,
  type MenuClearProps,
  type MenuEmptyProps,
  type MenuGroupLabelProps,
  type MenuGroupProps,
  type MenuInputProps,
  type MenuItemProps,
  type MenuLinkItemProps,
  type MenuPopupProps,
  type MenuPortalProps,
  type MenuPositionerProps,
  type MenuRadioGroupProps,
  type MenuRadioItemIndicatorProps,
  type MenuRadioItemProps,
  type MenuRootProps,
  type MenuSeparatorProps,
  type MenuSubmenuContentProps,
  type MenuSubmenuRootProps,
  type MenuSubmenuTriggerProps,
  type MenuTriggerProps,
};

/**
 * M3 menu — an anchored list of actions on the Axis `MenuRoot` compound.
 *
 * The open popup paints through `MenuPortal` at the app's root `PortalHost`
 * (no RN `Modal` of its own: one root presents every layer — Android back,
 * stacking and dismissal belong to the `OverlayRoot` the compound owns).
 * Dismissal paths: scrim press, system back and escape reach `onDismiss`;
 * choosing an item fires its `onSelect` first, then `onDismiss`, then closes.
 */
export function Menu({
  trigger,
  triggerLabel,
  items,
  open,
  defaultOpen,
  onOpenChange,
  onDismiss,
  style,
  testID,
}: NativeMenuProps) {
  const scheme = useKernScheme();
  const styles = menuStyles(scheme);
  return (
    <View testID={testID ?? "kern-menu"}>
      <AxisMenuRoot
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        onDismiss={onDismiss}
      >
        <AxisMenuTrigger
          aria-label={triggerLabel}
          style={{ minHeight: 48, justifyContent: "center" }}
        >
          {trigger}
        </AxisMenuTrigger>
        <AxisMenuPortal>
          <AxisMenuBackdrop style={{ backgroundColor: scheme.color.scrim }} />
          <AxisMenuPositioner>
            <AxisMenuPopup style={[styles.card, style]}>
              {items.map((item) => (
                <AxisMenuItem
                  key={item.label}
                  aria-label={item.label}
                  disabled={item.disabled}
                  onClick={() => {
                    item.onSelect?.();
                    onDismiss?.();
                  }}
                  style={({ disabled }) => ({
                    minHeight: 48,
                    justifyContent: "center",
                    paddingHorizontal: 12,
                    borderRadius: Number.parseFloat(
                      scheme.shape["extra-small"],
                    ),
                    opacity: disabled ? DISABLED_CONTENT_OPACITY : 1,
                  })}
                >
                  <Text>{item.label}</Text>
                </AxisMenuItem>
              ))}
            </AxisMenuPopup>
          </AxisMenuPositioner>
        </AxisMenuPortal>
      </AxisMenuRoot>
    </View>
  );
}

Menu.Root = AxisMenuRoot;
Menu.Trigger = AxisMenuTrigger;
Menu.Portal = AxisMenuPortal;
Menu.Positioner = AxisMenuPositioner;
Menu.Backdrop = AxisMenuBackdrop;
Menu.Popup = AxisMenuPopup;
Menu.Arrow = AxisMenuArrow;
Menu.Item = AxisMenuItem;
Menu.CheckboxItem = AxisMenuCheckboxItem;
Menu.CheckboxItemIndicator = AxisMenuCheckboxItemIndicator;
Menu.RadioGroup = AxisMenuRadioGroup;
Menu.RadioItem = AxisMenuRadioItem;
Menu.RadioItemIndicator = AxisMenuRadioItemIndicator;
Menu.SubmenuRoot = AxisMenuSubmenuRoot;
Menu.SubmenuTrigger = AxisMenuSubmenuTrigger;
Menu.SubmenuContent = AxisMenuSubmenuContent;
Menu.Group = AxisMenuGroup;
Menu.GroupLabel = AxisMenuGroupLabel;
Menu.Separator = AxisMenuSeparator;
Menu.Clear = AxisMenuClear;
Menu.Empty = AxisMenuEmpty;
Menu.Input = AxisMenuInput;
Menu.LinkItem = AxisMenuLinkItem;
