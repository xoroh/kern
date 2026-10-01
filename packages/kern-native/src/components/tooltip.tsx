import type { ReactNode } from "react";
import { Pressable, type PressableProps, StyleSheet, View } from "react-native";
import { useKernScheme } from "../theme";
import { useControllableState } from "../utils/useControllableState";
import { Text } from "./text";

/**
 * M3 plain Tooltip — a short label that supplements an element the user has
 * focused, and nothing more.
 *
 * **Why this exists natively.** M3 specifies Tooltips for the touch platform
 * (its own availability is Compose-first), so a native tooltip is not a kern
 * invention and this is not a web-only asymmetry. `review-m3` ruled it a GAP,
 * not a registerable deliberate asymmetry, superseding the older "no mobile
 * analogue" line in `docs/conventions/parity.md`.
 *
 * **The declared divergence is the TRIGGER, not the component.** M3's trigger
 * is hover OR focus. Touch has no hover, so the native side implements the half
 * that exists there:
 *
 *   - **FOCUS is the trigger.** It is M3-conformant as written (SPECS-6 /
 *     D-026.1′) because focus genuinely exists on RN — keyboard, switch, TV and
 *     assistive-technology focus all deliver `onFocus`.
 *   - **HOVER is absent and is not simulated.** No long-press, no tap-to-open
 *     gesture. The touch affordance (long-press? inline hint? focus only?) is
 *     `design-system-lead`'s open ruling (D-026.1′ / SPECS-6), and inventing a
 *     gesture here would make the component's behaviour a kern invention that
 *     consumers then have to discover — the same reasoning that put the
 *     extended FAB's collapse on an imperative handle instead of a gesture M3
 *     does not define.
 *
 * **The hint is ALWAYS on the accessibility tree, open or not.** This is the
 * part that makes the component correct on touch rather than merely present, and
 * it is M3's NC-3 negative ("a tooltip must not hide crucial information"). A
 * surface that only exists while focused would put the text behind an
 * interaction a touch user may never have: a screen-reader user who focuses the
 * trigger hears nothing until the surface opens, and a tooltip is by definition
 * supplementary — so `accessibilityHint` carries the text on the trigger at all
 * times. The visible surface is a visual convenience on top of that, never the
 * only delivery.
 *
 * **The surface is INERT.** M3's plain tooltip holds a label and nothing else —
 * no links, no buttons — so it exposes no interactive role and ignores touches.
 * Making it focusable or pressable would let a tooltip trap a touch, which is
 * the other NC-3 negative.
 *
 *   <Tooltip label="Save" hint="Saves your draft">
 *     <Text>Save</Text>
 *   </Tooltip>
 *
 * Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`).
 */
export type NativeTooltipProps = Omit<
  PressableProps,
  "children" | "style" | "onPress" | "ref" | "accessibilityRole"
> & {
  /** The trigger's own accessible name. */
  label: string;
  /**
   * The supplementary text. Carried as `accessibilityHint` whether or not the
   * surface is showing, so the information is never trapped behind the trigger.
   */
  hint: string;
  /** Trigger content. */
  children?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for the uncontrolled case. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Which side of the trigger the surface sits on. M3 default is above. */
  placement?: "top" | "bottom";
  testID?: string;
};

export function Tooltip({
  label,
  hint,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = "top",
  testID,
  accessibilityHint,
  ...props
}: NativeTooltipProps) {
  const scheme = useKernScheme();
  const [isOpen, setOpen] = useControllableState(
    open,
    defaultOpen,
    onOpenChange,
  );
  const shown = isOpen ?? false;

  return (
    <View style={styles.root}>
      <Pressable
        {...props}
        testID={testID ?? "kern-tooltip-trigger"}
        accessibilityRole="button"
        accessibilityLabel={label}
        // The hint is merged rather than replaced: a host that supplied its own
        // hint has not asked to lose it, and M3's obligation is that the
        // supplementary text REACHES the user.
        accessibilityHint={
          accessibilityHint ? `${accessibilityHint}. ${hint}` : hint
        }
        accessibilityState={{ expanded: shown }}
        focusable
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </Pressable>
      {shown ? (
        <View
          testID="kern-tooltip-content"
          // role="text", not a role of its own: the plain M3 tooltip is a label,
          // and web measures the same way (its popup carries no `role`). Making
          // it a `dialog`/`menu` here would be a native-only invention.
          accessibilityRole="text"
          // Inert: a supplementary label never takes a touch, so a touch landing
          // on it must reach the trigger underneath rather than be swallowed.
          pointerEvents="none"
          style={[
            styles.surface,
            placement === "top" ? styles.above : styles.below,
            {
              backgroundColor: scheme.color.inverseSurface,
              borderRadius: Number.parseFloat(scheme.shape["extra-small"]),
            },
          ]}
        >
          <Text
            variant="label"
            style={{ color: scheme.color.inverseOnSurface }}
          >
            {hint}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    // `relative` with no clipping, so the absolutely-positioned surface can sit
    // outside the trigger's box without being cut off by an ancestor.
    position: "relative",
  },
  surface: {
    position: "absolute",
    alignSelf: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: 256,
  },
  above: { bottom: "100%", marginBottom: 6 },
  below: { top: "100%", marginTop: 6 },
});
