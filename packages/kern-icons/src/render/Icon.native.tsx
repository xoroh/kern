import type { SvgProps } from "react-native-svg";
import Svg, { Path } from "react-native-svg";
import { ICON_VIEW_BOX } from "../core/resolve";
import type { IconBaseProps, IconSize } from "../core/types";
import { useIcon } from "./useIcon";

/**
 * Props accepted by `<Icon />`.
 *
 * Own props win over the raw `react-native-svg` ones they replace, and
 * everything else (`style`, `onPress`, accessibility props, …) passes straight
 * through to the underlying `<Svg />`.
 */
export type IconProps = Omit<
  SvgProps,
  "width" | "height" | "viewBox" | "fill" | "children" | "color"
> & {
  /** Which icon to render. Fully type-checked against the shipped catalog. */
  readonly name: IconBaseProps["name"];
  /** Registered set for unqualified names. Defaults to the default set. */
  readonly set?: string;
  /** FILL 1 (filled) vs FILL 0 (outline). Defaults to outline; `true` marks selection. */
  readonly filled?: boolean;
  /** Rendered size: a size token or any explicit dp/px. Defaults to 24. */
  readonly size?: IconSize;
  /** Paint colour. Defaults to `currentColor` so icons follow the text role. */
  readonly color?: string;
  /**
   * Accessible name. When omitted the icon is treated as decorative, which is
   * correct next to a visible text label.
   */
  readonly title?: string;
  /** Test hook, rendered as `testID`. */
  readonly testID?: string;
};

/** Props for a wrapper component, where `name` is already bound. */
export type StaticIconProps = Omit<IconProps, "name">;

/** Native icon: one `<Svg><Path>` via `react-native-svg`. */
export function Icon({
  name,
  set,
  filled,
  size,
  color,
  title,
  testID,
  ...rest
}: IconProps) {
  const paint = useIcon({ name, set, filled, size, color, title, testID });
  if (paint === null) return null;
  return (
    <Svg
      width={paint.size}
      height={paint.size}
      viewBox={ICON_VIEW_BOX}
      fill="none"
      testID={testID}
      accessibilityRole={title ? "image" : undefined}
      accessibilityLabel={title}
      {...rest}
    >
      <Path
        d={paint.d}
        fill={paint.color}
        fillRule={paint.fillRule}
        clipRule={paint.fillRule}
      />
    </Svg>
  );
}
