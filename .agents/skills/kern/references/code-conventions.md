# Code conventions

How Kern components are authored. Patterns only — no library names;
imports name what they must.

## Anatomy (one file per component)

Behavior parts + variant map + class merge + `data-slot` + named exports:

```tsx
import { Parts } from "behavior-parts";
import { variantMap, type VariantProps } from "variant-maps";
import { cn } from "../../utils/cn";

const buttonVariants = variantMap("kern-button", {
  variants: {
    variant: { primary: "kern-button--primary", ghost: "kern-button--ghost" },
  },
  defaultVariants: { variant: "primary" },
});

export type ButtonProps = PartsProps & VariantProps<typeof buttonVariants>;

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <Parts.Root data-slot="button" className={cn(buttonVariants({ variant }), className)} {...props} />
  );
}

export { buttonVariants };
```

Rules: one file (`button.tsx`), test beside it (`button.test.tsx`),
exported from the package barrel only when real. Stubs throw and stay
unwired.

## Variants

Variant names are global and mean the same on every component:
`primary` (filled, highest emphasis), `tonal` (soft fill), `ghost`
(text-like), `destructive` (error role). Sizes: `default`, `sm`, `icon`.
A component offers the subset that fits it — never renames.

## Slots

Multipart components expose named parts sharing one variant context
(`title`, `description`, `actions`). No duplicate subcomponents: compose
base parts through context instead of rebuilding them.

## Styling

Token-bound utilities only, roles never raw values. No runtime styling,
no consumer-side codegen. State styling follows data attributes the
behavior parts already emit.

## Mobile translation

Same file shape, three extra rules: platform-gate classes that exist
only on web (hover, focus rings), a cascading text context for slotted
children, and paired text variants next to every variant map.

## Composite rule

Complex components reuse base parts through context. Never rebuild a
solved pattern under a new name.
