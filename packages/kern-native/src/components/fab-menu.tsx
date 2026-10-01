import { type ReactNode, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useKernScheme } from "../theme";
import { overlayStyles } from "../utils/overlay-styles";
import { fabStyles } from "./fab";
import { menuStyles } from "./menu";
import { Text } from "./text";

const staticStyles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  item: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
});

/**
 * M3 FAB menu — a FAB that opens a menu of actions instead of firing one.
 *
 * What kern owns, and why RN has to be composed rather than delegated: there is
 * no Base UI here to lean on, so this component owns all of it outright.
 *
 * - **The trigger names itself.** An unnamed menu trigger is an unreachable
 *   menu, so the name defaults to the first action's label — the action most
 *   likely to be wanted — and `menuLabel` overrides it.
 * - **The menu inherits the trigger's name and adds none of its own.** Two
 *   competing names on one surface means the reader picks one arbitrarily, so
 *   `menuLabel` names the trigger and the popup stays unnamed.
 * - **Select-then-dismiss.** Choosing an action closes the menu, so the host
 *   never has to and cannot forget to.
 * - **The trigger icon may swap while open** (`openIcon`), which is how M3
 *   signals that the press will close rather than open.
 * - **Disabled actions** are announced disabled and refuse the press, rather
 *   than being silently inert.
 *
 * Actions are declared as data (`actions`), not composed children, so the menu
 * owns its dismissal without every consumer wiring each item's close.
 */
export type NativeFabMenuAction = {
  /** Stable identity for the action; also the React key. */
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  /** A hairline drawn between this action and the previous one. */
  separated?: boolean;
  onSelect?: () => void;
};

export type NativeFabMenuProps = {
  /** Accessible name of the trigger. Defaults to the first action's label. */
  label?: string;
  icon: ReactNode;
  /** Icon shown while the menu is open. Defaults to `icon`. */
  openIcon?: ReactNode;
  actions: NativeFabMenuAction[];
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for the uncontrolled case. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Overrides the trigger's accessible name (and therefore the menu's). */
  menuLabel?: string;
  variant?: "primary" | "tonal";
  testID?: string;
};

export function FabMenu({
  label,
  icon,
  openIcon,
  actions,
  open,
  defaultOpen = false,
  onOpenChange,
  menuLabel,
  variant = "primary",
  testID,
}: NativeFabMenuProps) {
  const scheme = useKernScheme();
  const card = menuStyles(scheme);
  // `open` is read ONLY when the host controls it. Feeding internal state back
  // in would make the component permanently controlled, `setOpen` would update
  // a value nothing reads, and the menu could never open — a controlled-looking
  // prop that silently kills the component.
  const controlled = open !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isOpen = controlled ? open : uncontrolled;

  const name = menuLabel ?? label ?? actions[0]?.label ?? "Actions";

  function setOpen(next: boolean) {
    if (!controlled) setUncontrolled(next);
    onOpenChange?.(next);
  }

  return (
    <View>
      <Pressable
        testID={testID ?? "kern-fab-menu"}
        accessibilityRole="button"
        accessibilityLabel={name}
        // `expanded` is the ARIA half of `aria-haspopup` + `aria-expanded`: on
        // RN it is the only way the trigger reports that it owns a popup.
        accessibilityState={{ expanded: isOpen }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPress={() => setOpen(!isOpen)}
        style={({ pressed }) => [
          fabStyles(variant, "default", scheme),
          { opacity: pressed ? 0.9 : 1 },
        ]}
      >
        {isOpen ? (openIcon ?? icon) : icon}
      </Pressable>
      <Modal
        // An empty action list renders NO surface at all: a trigger that opens
        // an empty box looks live and does nothing, which is worse than no
        // trigger. The trigger stays rendered and named, so the control does
        // not shift position when a host passes actions asynchronously.
        visible={isOpen && actions.length > 0}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={overlayStyles.scrim}>
          {/* No accessibilityLabel here, deliberately: the trigger already names
              the surface, and a second name would compete with it. */}
          <View accessibilityRole="menu" style={card.card}>
            {actions.map((action, index) => (
              <View key={action.key}>
                {action.separated && index > 0 ? (
                  <View
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                    style={[
                      staticStyles.separator,
                      { backgroundColor: scheme.color.outline },
                    ]}
                  />
                ) : null}
                <Pressable
                  accessibilityRole="menuitem"
                  accessibilityLabel={action.label}
                  accessibilityState={{ disabled: action.disabled }}
                  disabled={action.disabled}
                  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  onPress={() => {
                    action.onSelect?.();
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    staticStyles.item,
                    {
                      borderRadius: Number.parseFloat(
                        scheme.shape["extra-small"],
                      ),
                      backgroundColor: pressed
                        ? scheme.color.surfaceContainerHighest
                        : "transparent",
                      opacity: action.disabled ? 0.5 : 1,
                    },
                  ]}
                >
                  {action.icon}
                  <Text variant="label">{action.label}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}
