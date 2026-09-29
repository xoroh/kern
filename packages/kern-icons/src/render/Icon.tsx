import type { SVGProps } from "react";
import { ICON_VIEW_BOX } from "../core/resolve";
import type { IconBaseProps, IconSize } from "../core/types";
import { useIcon } from "./useIcon";

/**
 * Props accepted by `<Icon />`.
 *
 * Own props win over the DOM attributes they replace; everything else
 * (`className`, `style`, event handlers, `data-*`) passes through to the `<svg>`.
 */
export type IconProps = Omit<
  SVGProps<SVGSVGElement>,
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
   * Accessible name. When omitted the icon is treated as decorative and hidden
   * from assistive technology — which is correct next to a visible text label.
   */
  readonly title?: string;
  /** Test hook, rendered as `data-testid`. */
  readonly testID?: string;
};

/** Props for a wrapper component, where `name` is already bound. */
export type StaticIconProps = Omit<IconProps, "name">;

/** Web icon: one inline `<svg><path>`, SSR-safe, no runtime measurement. */
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
    <svg
      width={paint.size}
      height={paint.size}
      viewBox={ICON_VIEW_BOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      data-testid={testID}
      {...rest}
    >
      <path
        d={paint.d}
        fill={paint.color}
        fillRule={paint.fillRule}
        clipRule={paint.fillRule}
      />
    </svg>
  );
}
