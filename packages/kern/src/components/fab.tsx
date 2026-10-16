import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { Children, isValidElement } from "react";
import { cn } from "../utils/cn";
import { FOCUS_RING_CLASS } from "./focus-ring";

const fabVariants = cva(
  `kern-fab relative inline-flex shrink-0 items-center justify-center gap-2 text-sm leading-5 font-medium tracking-[0.1px] shadow-(--sys-elevation-level3) hover:shadow-(--sys-elevation-level4) transition-[color,background-color,border-color,box-shadow] duration-200 ease-(--sys-motion-easing-standard) outline-none select-none ${FOCUS_RING_CLASS} disabled:pointer-events-none disabled:opacity-38 aria-disabled:pointer-events-none aria-disabled:opacity-38 after:absolute after:-inset-2 after:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 hover:before:opacity-[var(--sys-state-hover)] focus-visible:before:opacity-[var(--sys-state-focus)] active:before:opacity-[var(--sys-state-press)] disabled:before:opacity-0 aria-disabled:before:opacity-0 [&_svg]:shrink-0`,
  {
    variants: {
      // M3 FAB color styles (expressive, May 2025): the three containers
      // (primary/secondary/tertiary-container, renamed from primary/
      // secondary/tertiary to match the token roles) plus the three fills
      // (primary/secondary/tertiary with their on-colors). Surface exists
      // but is no longer recommended. Kern default is `surface`, NOT the
      // spec default (`primary-container`) — a declared deviation: the
      // neutral chrome treatment. Each pairs its container with its on-color
      // for label, icon, and state layer.
      color: {
        surface:
          "bg-(--sys-color-surface-container-high) text-(--sys-color-primary) before:bg-(--sys-color-primary) [&_svg]:size-6",
        primary:
          "bg-(--sys-color-primary-container) text-(--sys-color-on-primary-container) before:bg-(--sys-color-on-primary-container) [&_svg]:size-6",
        secondary:
          "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container) before:bg-(--sys-color-on-secondary-container) [&_svg]:size-6",
        tertiary:
          "bg-(--sys-color-tertiary-container) text-(--sys-color-on-tertiary-container) before:bg-(--sys-color-on-tertiary-container) [&_svg]:size-6",
        "primary-fill":
          "bg-(--sys-color-primary) text-(--sys-color-on-primary) before:bg-(--sys-color-on-primary) [&_svg]:size-6",
        "secondary-fill":
          "bg-(--sys-color-secondary) text-(--sys-color-on-secondary) before:bg-(--sys-color-on-secondary) [&_svg]:size-6",
        "tertiary-fill":
          "bg-(--sys-color-tertiary) text-(--sys-color-on-tertiary) before:bg-(--sys-color-on-tertiary) [&_svg]:size-6",
      },
      // M3 FAB sizes: small 40dp (deprecated — compact only), regular 56dp
      // (corner-large 16px, icon 24px), medium 80dp (expressive), large 96dp
      // (corner-extra-large 28px, icon 36px). Kern's `medium` (96px) is M3's
      // LARGE under its pre-expressive name — kept for back-compat, so the
      // expressive medium ships as `md`. Kern's `large` (128px) is an
      // extension past the spec.
      size: {
        default: "h-14 px-5 rounded-(--sys-shape-corner-large) [&_svg]:size-6",
        md: "h-20 w-20 px-0 rounded-(--sys-shape-corner-extra-large) [&_svg]:size-8",
        medium:
          "h-24 w-24 px-0 rounded-(--sys-shape-corner-extra-large) [&_svg]:size-9",
        large:
          "h-32 w-32 px-0 rounded-(--sys-shape-corner-extra-large) [&_svg]:size-9",
        sm: "h-10 px-4 rounded-(--sys-shape-corner-medium) [&_svg]:size-6",
        icon: "h-14 w-14 px-0 rounded-(--sys-shape-corner-large) [&_svg]:size-6",
      },
    },
    defaultVariants: { color: "surface", size: "default" },
  },
);

export type FabColor = NonNullable<VariantProps<typeof fabVariants>["color"]>;

export type FabProps = Omit<ComponentPropsWithRef<"button">, "color"> &
  VariantProps<typeof fabVariants> & {
    /** Accessible name for icon-only fabs. */
    "aria-label"?: string;
    /**
     * Lowered elevation (level1 + `surface-container-low` fill) for FABs
     * that should sit quieter in the layout. Per M3's `lowered` attribute.
     */
    lowered?: boolean;
  };

/** Floating action button for the single primary screen action. */
export function Fab({
  size,
  color,
  lowered = false,
  type = "button",
  className,
  children,
  ...props
}: FabProps) {
  // M3 geometry is content-driven: the FAB is square, the EXTENDED fab (with
  // a label) is a pill. An icon-only child on the default size resolves to
  // the icon geometry so it cannot render as a pill; an explicit `size`
  // always wins.
  const childArray = Children.toArray(children);
  const iconOnly =
    childArray.length > 0 && childArray.every((child) => isValidElement(child));
  const resolvedSize = size ?? (iconOnly ? "icon" : "default");
  if (
    process.env.NODE_ENV !== "production" &&
    (props.disabled || props["aria-disabled"] === true)
  ) {
    // M3 never disables the FAB: if the action is unavailable the FAB should
    // not appear. The prop still paints the treatment for hosts mid-migration,
    // but the warning names the spec rule.
    console.warn(
      "Fab: M3 does not define a disabled FAB — hide the action instead of disabling it.",
    );
  }
  return (
    <button
      data-slot="fab"
      className={cn(
        fabVariants({ size: resolvedSize, color }),
        lowered &&
          "bg-(--sys-color-surface-container-low) shadow-(--sys-elevation-level1) hover:shadow-(--sys-elevation-level2)",
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export { fabVariants };
