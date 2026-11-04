import {
  mergeSlotProps,
  type SlotProps,
  useControllableState,
} from "@xoroh/axis";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import {
  cloneElement,
  type ElementRef,
  isValidElement,
  type ReactNode,
  type Ref,
} from "react";
import {
  ActivityIndicator,
  I18nManager,
  Pressable,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { DISABLED_CONTENT_OPACITY, StateLayer } from "./state-layer";

export type IconButtonVariant = "standard" | "filled" | "tonal" | "outlined";

/**
 * M3 Expressive icon-button size ladder:
 * XS 32dp · S 40dp (default) · M 56dp · lg 96dp · xl 136dp · 2xl 96dp · 3xl 136dp.
 */
export type NativeIconButtonSize =
  | "xs"
  | "sm"
  | "default"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

export type NativeIconButtonShape = "pill" | "square";
export type NativeIconButtonWidth = "default" | "narrow" | "wide";

const ICON_BUTTON_BOX: Record<NativeIconButtonSize, number> = {
  xs: 32,
  sm: 36,
  default: 40,
  md: 56,
  lg: 96,
  xl: 136,
  "2xl": 96,
  "3xl": 136,
};

const ICON_BUTTON_SQUARE_RADIUS: Record<NativeIconButtonSize, number> = {
  xs: 8,
  sm: 8,
  default: 12,
  md: 12,
  lg: 16,
  xl: 28,
  "2xl": 28,
  "3xl": 28,
};

const ICON_BUTTON_PRESSED_RADIUS: Record<NativeIconButtonSize, number> = {
  xs: 4,
  sm: 4,
  default: 8,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 16,
  "3xl": 16,
};

export type NativeIconButtonStyleOptions = {
  shape?: NativeIconButtonShape;
  width?: NativeIconButtonWidth;
  toggle?: boolean;
  activePress?: boolean;
};

export function iconButtonStyles(
  variant: IconButtonVariant,
  pressed: boolean,
  disabled: boolean,
  scheme: ResolvedTheme = defaultScheme(),
  size: NativeIconButtonSize = "default",
  options: NativeIconButtonStyleOptions = {},
): ViewStyle {
  const {
    shape = "pill",
    width = "default",
    toggle = true,
    activePress = false,
  } = options;
  const box = ICON_BUTTON_BOX[size];
  const widthFactor = width === "narrow" ? 0.75 : width === "wide" ? 4 / 3 : 1;
  const pillRadius = Number.parseFloat(scheme.shape.full);
  const squareRadius = ICON_BUTTON_SQUARE_RADIUS[size];
  const pressedRadius = ICON_BUTTON_PRESSED_RADIUS[size];

  const isSelected = toggle && pressed;
  const restingRadius =
    shape === "square"
      ? isSelected
        ? pillRadius
        : squareRadius
      : isSelected
        ? squareRadius
        : pillRadius;
  const borderRadius = activePress && !disabled ? pressedRadius : restingRadius;

  const base: ViewStyle = {
    width: Math.round(box * widthFactor),
    height: box,
    alignItems: "center",
    justifyContent: "center",
    borderRadius,
    overflow: "hidden",
    opacity: disabled ? DISABLED_CONTENT_OPACITY : 1,
  };

  if (isSelected) {
    switch (variant) {
      case "filled":
        return {
          ...base,
          backgroundColor: scheme.color.primary,
        };
      case "tonal":
        return {
          ...base,
          backgroundColor: scheme.color.secondaryContainer,
        };
      case "outlined":
        return {
          ...base,
          backgroundColor: scheme.color.inverseSurface,
        };
      default:
        return base;
    }
  }

  switch (variant) {
    case "filled":
      return {
        ...base,
        // Toggle-unselected filled uses surfaceContainerHighest; non-toggle filled uses primary!
        backgroundColor: toggle
          ? scheme.color.surfaceContainerHighest
          : scheme.color.primary,
      };
    case "tonal":
      return {
        ...base,
        backgroundColor: toggle
          ? scheme.color.surfaceContainerHighest
          : scheme.color.secondaryContainer,
      };
    case "outlined":
      return {
        ...base,
        borderWidth: 1,
        borderColor: scheme.color.outlineVariant,
      };
    default:
      return base;
  }
}

/**
 * Icon ink for the variant + toggle state. Mirrors the web `text-*` roles:
 * the icon always pairs with its container, so contrast holds no matter
 * which treatment or state renders.
 */
export function iconButtonIconColor(
  variant: IconButtonVariant,
  pressed: boolean,
  scheme: ResolvedTheme = defaultScheme(),
  toggle = true,
): string {
  const isSelected = toggle && pressed;
  if (isSelected) {
    switch (variant) {
      case "filled":
        return scheme.color.onPrimary;
      case "tonal":
        return scheme.color.onSecondaryContainer;
      case "outlined":
        return scheme.color.inverseOnSurface;
      default:
        return scheme.color.primary;
    }
  }
  switch (variant) {
    case "filled":
      return toggle ? scheme.color.primary : scheme.color.onPrimary;
    case "tonal":
      return toggle
        ? scheme.color.onSurfaceVariant
        : scheme.color.onSecondaryContainer;
    default:
      return scheme.color.onSurfaceVariant;
  }
}

export function pressIsCancelled(event?: {
  isDefaultPrevented?: () => boolean;
}): boolean {
  return typeof event?.isDefaultPrevented === "function"
    ? event.isDefaultPrevented()
    : false;
}

export type NativeIconButtonProps = Omit<
  PressableProps,
  "children" | "style" | "onPress" | "accessibilityRole" | "testID" | "ref"
> & {
  /** REQUIRED. The accessible name — there is no visible text to supply one. */
  label: string;
  /** Accessible name when the toggle is selected. */
  selectedLabel?: string;
  ref?: Ref<ElementRef<typeof Pressable>>;
  /** Container variant. */
  variant?: IconButtonVariant;
  /** M3 Expressive size: XS 32dp up to XL 136dp. Defaults to the 40dp S. */
  size?: NativeIconButtonSize;
  /** Container shape: pill (default) or square. */
  shape?: NativeIconButtonShape;
  /** Horizontal proportion: narrow (3/4), default (square), wide (4/3). */
  width?: NativeIconButtonWidth;
  /** Icon content (alias for children, matching Web IconButton). */
  icon?: ReactNode;
  /** Alternate icon rendered when toggle is selected. */
  selectedIcon?: ReactNode;
  /** The icon element. */
  children?: ReactNode;
  /** Explicit toggle mode flag (also auto-enabled when pressed/defaultPressed/onPressedChange is passed). */
  toggle?: boolean;
  /** Toggle form: controlled pressed state. */
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Soft-disabled: paints disabled treatment while staying discoverable. */
  softDisabled?: boolean;
  /** Shows an inline loading indicator and blocks interaction. */
  loading?: boolean;
  /** Mirrors the icon horizontally in RTL contexts. */
  flipIcon?: boolean;
  disabled?: boolean;
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
  testID?: string;
};

export function IconButton({
  label,
  selectedLabel,
  variant = "standard",
  size = "default",
  shape = "pill",
  width = "default",
  icon,
  selectedIcon,
  children,
  toggle: toggleProp,
  pressed: pressedProp,
  defaultPressed,
  onPressedChange,
  softDisabled = false,
  loading = false,
  flipIcon = false,
  disabled = false,
  onPress,
  hitSlop,
  style,
  testID,
  ref,
  ...props
}: NativeIconButtonProps) {
  const scheme = useKernScheme();
  // Backward compatible: if caller passes toggle, pressed, defaultPressed, or onPressedChange, it acts as a toggle.
  const isToggle =
    toggleProp ??
    (pressedProp !== undefined ||
      defaultPressed !== undefined ||
      onPressedChange !== undefined);

  const [isPressedRaw, setPressed] = useControllableState<boolean>(
    pressedProp,
    defaultPressed ?? false,
    (next) => {
      onPressedChange?.(next);
    },
  );
  const isPressed = isToggle ? (isPressedRaw ?? false) : false;
  const blocked = disabled || loading || softDisabled;
  const box = ICON_BUTTON_BOX[size];
  const styles = iconButtonStyles(variant, isPressed, blocked, scheme, size, {
    shape,
    width,
    toggle: isToggle,
  });
  const ink = iconButtonIconColor(variant, isPressed, scheme, isToggle);
  const rawGlyph =
    isToggle && isPressed && selectedIcon ? selectedIcon : (icon ?? children);
  const rtlStyle =
    flipIcon && I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined;
  const tinted = isValidElement<{ style?: StyleProp<TextStyle> }>(rawGlyph)
    ? cloneElement(
        rawGlyph,
        mergeSlotProps<SlotProps>(
          { style: [{ color: ink }, rtlStyle] },
          rawGlyph.props,
        ),
      )
    : rawGlyph;

  const activeLabel =
    isToggle && isPressed && selectedLabel ? selectedLabel : label;

  return (
    <Pressable
      {...props}
      ref={ref}
      testID={testID ?? "kern-icon-button"}
      role="button"
      accessibilityRole="button"
      accessibilityLabel={activeLabel}
      aria-selected={isPressed}
      aria-pressed={isToggle ? isPressed : undefined}
      aria-disabled={blocked}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      hitSlop={
        hitSlop ?? {
          top: Math.max(0, (48 - box) / 2),
          bottom: Math.max(0, (48 - box) / 2),
          left: Math.max(0, (48 - box) / 2),
          right: Math.max(0, (48 - box) / 2),
        }
      }
      onPress={(event) => {
        if (blocked) return;
        onPress?.(event);
        if (isToggle && !pressIsCancelled(event)) setPressed(!isPressed);
      }}
      style={({ pressed: pressedNow }) => [
        pressedNow && !blocked
          ? iconButtonStyles(variant, isPressed, blocked, scheme, size, {
              shape,
              width,
              toggle: isToggle,
              activePress: true,
            })
          : styles,
        typeof style === "function" ? style({ pressed: pressedNow }) : style,
      ]}
    >
      {({ pressed: pressedNow }) => (
        <>
          {loading ? <ActivityIndicator size="small" color={ink} /> : tinted}
          <StateLayer
            ink={ink}
            radius={Number(
              styles.borderRadius ?? Number.parseFloat(scheme.shape.full),
            )}
            visible={pressedNow && !blocked}
          />
        </>
      )}
    </Pressable>
  );
}

export function IconButtonTarget({
  children,
  style,
  testID,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  return (
    <View
      testID={testID ?? "kern-icon-button-target"}
      style={[
        {
          minWidth: 48,
          minHeight: 48,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
