import { useRovingModel } from "@xoroh/kern-primitives";
import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import { type ElementRef, useMemo, useRef } from "react";
import {
  type LayoutChangeEvent,
  Pressable,
  Text as RNText,
  ScrollView,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";

/**
 * Carousel — a set of items shown one at a time, navigated by index.
 *
 * ## What it owns
 *
 * - **Which item is active**, controlled or uncontrolled, reported through
 *   `onIndexChange`. Out-of-range values are clamped so a carousel can never
 *   blank itself.
 * - **One tab stop for the item track.** The group is a single stop and the
 *   active item is the one inside it — the roving model, from
 *   `@xoroh/kern-primitives`. This is the first consumer of that primitive.
 * - **Wrap or clamp.** `loop: false` is the M3 default: at the last item, Next
 *   is disabled rather than wrapping to the first.
 * - **Disabled** stops navigation and removes the controls from the tab order.
 *
 * ## Two deliberate platform substitutions
 *
 * **`aria-roledescription="carousel"` has no native equivalent.** Web announces
 * the region AND each item as a carousel; React Native's `Role` union has no
 * roledescription concept at all. The region is therefore `role="group"` with a
 * label, and the active item carries the selection state. A screen reader on
 * native hears "group, <label>" where the web says "carousel, <label>". Recorded
 * rather than papered over: it is a real difference, not a styling choice.
 *
 * **There are no arrow keys on a touch device**, so the roving model's traversal
 * is driven by pressing an item or the Next/Previous controls. The MODEL is
 * shared; only the input mechanism is per-platform. The model's `isTabbable` maps
 * onto `accessibilityState.selected` here, where web would map it onto `tabIndex`.
 *
 * ## Scrolling
 *
 * The track is a horizontal `ScrollView` and a press scrolls the active item
 * into view — so the touch idiom (swipe) and the accessibility model (one active
 * item) cannot disagree. Swiping does NOT change the active index on its own;
 * the host decides, via `onIndexChange`, because a carousel that silently
 * re-indexes on a flick makes the control unpredictable for anyone using
 * assistive tech.
 */

export type CarouselLayout = "single" | "peek";

export function carouselStyles(
  active: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
): { track: ViewStyle; item: ViewStyle; control: ViewStyle } {
  const diameter = Number.parseFloat(tokens.spacing["space-400"]);
  return {
    track: { flexGrow: 1, borderRadius: Number.parseFloat(scheme.shape.large) },
    item: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      opacity: active ? 1 : 0.4,
    },
    control: {
      minWidth: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Number.parseFloat(scheme.shape.full),
    },
  };
}

export type CarouselItem = {
  /** Stable identity — used as the React key and for item labelling. */
  value: string;
  content?: ReactNode;
  /**
   * Accessible name. Falls back to `value`. Required in practice: an item with
   * no name is announced as an unlabelled object, which is not a slide anyone
   * can act on.
   */
  accessibilityLabel?: string;
  disabled?: boolean;
};

export type NativeCarouselProps = {
  items: readonly CarouselItem[];
  /** Controlled active index. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Name for the carousel region. */
  accessibilityLabel?: string;
  /** Wrap from last to first. M3's default is to clamp. */
  loop?: boolean;
  disabled?: boolean;
  layout?: CarouselLayout;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Carousel({
  items,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  accessibilityLabel = "Carousel",
  loop = false,
  disabled = false,
  layout = "single",
  style,
  testID,
}: NativeCarouselProps) {
  const scheme = useKernScheme();
  const count = items.length;

  // The roving model is the single source of "which item is active" for the
  // track AND the controls, so the dot row and the content can never disagree.
  const roving = useRovingModel({
    count,
    orientation: "horizontal",
    loop,
    activeIndex: indexProp,
    defaultActiveIndex: defaultIndex,
    onActiveIndexChange: onIndexChange,
    isDisabled: (i) => disabled || Boolean(items[i]?.disabled),
  });
  const active = roving.activeIndex;
  const styles = carouselStyles(true, scheme);
  const trackRef = useRef<ElementRef<typeof ScrollView>>(null);

  const go = (next: number) => {
    if (disabled) return;
    roving.setActive(next);
  };

  return (
    <View
      testID={testID ?? "kern-carousel"}
      // `role="group"`, not accessibilityRole — see the header on why
      // roledescription is unavailable.
      role="group"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={style}
    >
      <ScrollView
        ref={trackRef}
        horizontal
        pagingEnabled={layout === "single"}
        showsHorizontalScrollIndicator={false}
        testID="kern-carousel-track"
        onLayout={(event: LayoutChangeEvent) => {
          const { width } = event.nativeEvent.layout;
          // Keep the visual track on the model's active item, so swiping and
          // the accessibility model cannot show different slides.
          if (width > 0) {
            trackRef.current?.scrollTo({ x: active * width, animated: true });
          }
        }}
        contentContainerStyle={[
          styles.track,
          // `peek` shows the neighbours; `single` fills the viewport.
          layout === "peek" ? { columnGap: 8 } : null,
        ]}
      >
        {items.map((item, i) => {
          const described = roving.describe(i);
          const label = item.accessibilityLabel ?? item.value;
          const isDisabled = disabled || Boolean(item.disabled);
          return (
            <Pressable
              key={item.value}
              testID={`kern-carousel-item-${item.value}`}
              // An item is an image-like slide, and the ACTIVE one carries the
              // group's single selection state. Inactive items stay in the tree
              // but are not the selected stop, which is how a screen reader
              // reports "1 of 5" rather than five unranked objects.
              accessibilityRole="image"
              accessibilityLabel={label}
              accessibilityState={{
                selected: described.isTabbable,
                disabled: isDisabled,
              }}
              disabled={isDisabled}
              onPress={() => go(i)}
              style={[
                { width: "100%" },
                carouselStyles(described.isActive, scheme).item,
              ]}
            >
              {item.content}
            </Pressable>
          );
        })}
      </ScrollView>

      <View
        testID="kern-carousel-dots"
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: Number.parseFloat(tokens.spacing["space-75"]),
          marginTop: Number.parseFloat(tokens.spacing["space-100"]),
        }}
      >
        {items.map((item, i) => {
          const described = roving.describe(i);
          return (
            <Pressable
              key={item.value}
              testID={`kern-carousel-dot-${item.value}`}
              accessibilityRole="button"
              accessibilityLabel={`${item.accessibilityLabel ?? item.value}, ${i + 1} of ${count}`}
              accessibilityState={{
                selected: described.isActive,
                disabled: disabled || Boolean(item.disabled),
              }}
              disabled={disabled || Boolean(item.disabled)}
              onPress={() => go(i)}
              style={[styles.control]}
            >
              <View
                style={{
                  width: described.isActive ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: described.isActive
                    ? scheme.color.primary
                    : scheme.color.outlineVariant,
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
