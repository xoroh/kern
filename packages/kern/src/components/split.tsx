import { Children, type ComponentPropsWithRef, isValidElement } from "react";
import { cn } from "../utils/cn";

export type SplitProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /**
   * Two or three equal columns. A hint, not a promise — the component renders
   * the children it is actually given rather than padding or truncating to a
   * declared number. Matches native `Split`.
   */
  columns?: 2 | 3;
  /**
   * Accessible name for the split region. A layout still needs one: without it
   * a screen-reader user has no way to announce the region before entering it.
   */
  label?: string;
  children?: React.ReactNode;
};

/**
 * An N-column split layout: the last genuine gap in the composition tranche.
 *
 * `Pane` covers a single region and `ListDetail` a FIXED navigation / list /
 * detail arrangement, so neither could split an arbitrary column count.
 *
 * The dividers are drawn the same way native draws them — a hairline GAP over an
 * outline-variant CONTAINER background, so the background shows through between
 * columns. Putting a border on each child instead would look plausible and be
 * wrong twice: the first column would get a leading border and the last a
 * trailing one, at every column count.
 */
export function Split({
  columns = 2,
  label = "Split",
  children,
  className,
  ...props
}: SplitProps) {
  const items = Children.toArray(children);
  void columns;

  return (
    <div
      data-slot="split"
      role="group"
      aria-label={label}
      className={cn(
        "kern-split flex min-h-0 w-full flex-1 gap-px bg-(--md-sys-color-outline-variant)",
        className,
      )}
      {...props}
    >
      {items.map((child, i) => (
        <div
          key={isValidElement(child) && child.key != null ? child.key : i}
          data-slot="split-column"
          data-column={i}
          // `minmax(0, 1fr)` is the native equivalent of `flex: 1` +
          // `minWidth: 0`: equal share, but a long child may still shrink below
          // its content instead of pushing a sibling off screen.
          className="min-w-0 flex-1 bg-(--md-sys-color-surface)"
        >
          {child}
        </div>
      ))}
    </div>
  );
}