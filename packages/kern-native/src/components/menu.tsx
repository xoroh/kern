import {
  MenuItem as AxisMenuItem,
  MenuBackdrop,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@xoroh/axis";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
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
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
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
  onDismiss,
  style,
  testID,
}: NativeMenuProps) {
  const scheme = useKernScheme();
  const styles = menuStyles(scheme);
  return (
    <View testID={testID ?? "kern-menu"}>
      <MenuRoot onDismiss={onDismiss}>
        <MenuTrigger
          accessibilityLabel={triggerLabel}
          style={{ minHeight: 48, justifyContent: "center" }}
        >
          {trigger}
        </MenuTrigger>
        <MenuPortal>
          <MenuBackdrop style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }} />
          <MenuPositioner>
            <MenuPopup style={[styles.card, style]}>
              {items.map((item) => (
                <AxisMenuItem
                  key={item.label}
                  accessibilityLabel={item.label}
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
                    opacity: disabled ? 0.5 : 1,
                  })}
                >
                  <Text>{item.label}</Text>
                </AxisMenuItem>
              ))}
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>
    </View>
  );
}
