import type { ComponentPropsWithRef } from "react";
import { Button, type ButtonAnchorProps } from "./button";

export type LinkButtonProps = Omit<
  ButtonAnchorProps,
  "type" | "value" | "onClick"
> & {
  /**
   * Destination. Required — a link without an `href` is a button wearing
   * link paint; use `Button` for that. Passed straight to the anchor, so
   * routing libraries compose by URL rather than by element takeover.
   */
  href: string;
  onClick?: ComponentPropsWithRef<"a">["onClick"];
};

/**
 * LinkButton — the button treatment on a navigation control.
 *
 * This is a BRIDGE onto `Button`, not a second implementation: every
 * axis (variant, color, size, shape, block, loading, icon) and the anchor
 * attributes (`target`, `rel`, `download`) are Button's, and the render
 * is Button's `href` branch — so the link and the button cannot drift
 * into two treatments. Deliberately there is no `asChild` prop here:
 * element takeover (a router `<Link>` swallowing the anchor) is exactly
 * what the composition rule forbids, and `href` already composes with
 * routers by URL. Guarded by
 * `packages/kern/src/composition.test.ts`, which fails any new `asChild`
 * that does not carry the mutual-exclusion bridge.
 */
export function LinkButton({
  href,
  onClick,
  iconPosition,
  ...props
}: LinkButtonProps) {
  if (process.env.NODE_ENV !== "production" && iconPosition === "end") {
    // M3 forbids trailing icons on link buttons: the outbound cue lives at
    // the inline start, and a trailing icon reads as a second action.
    console.warn(
      'LinkButton: `iconPosition="end"` is ignored — M3 link buttons cannot carry trailing icons.',
    );
  }
  return (
    <Button
      href={href}
      onClick={onClick as ButtonAnchorProps["onClick"]}
      iconPosition={iconPosition === "end" ? "start" : iconPosition}
      {...props}
    />
  );
}
