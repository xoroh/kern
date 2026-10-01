# Code conventions

How Kern components are authored. Patterns only — imports name what they
must, and on web those names are real: `cva` from
`class-variance-authority`, `cn` from `../../utils/cn`.

## Anatomy (one file per component)

Behavior parts + a variant map + class merge + `data-slot` + named exports:

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";

const buttonVariants = cva(
  "kern-button relative inline-flex items-center justify-center rounded-(--md-sys-shape-corner-full) focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary)",
  {
    variants: {
      variant: {
        primary:
          "bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary)",
        tonal:
          "bg-(--md-sys-color-surface-tonal) text-(--md-sys-color-on-surface)",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export type ButtonProps = ComponentPropsWithRef<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({ variant, className, ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}
```

Note what is in the class string: **roles only**
(`--md-sys-color-primary`, `--md-sys-shape-corner-full`). No raw hex, no
`text-gray-700`. That is what makes dark mode and the contrast levels work
without a single conditional.

Rules: one file (`button.tsx`), test beside it (`button.test.tsx`),
exported from `packages/kern/src/components/index.ts` only when real. Stubs
throw and stay unwired — see `docs/conventions/stubs.md`.

### State styling

Bind state styling to the `data-*` attributes the primitive already emits,
never to JS state:

```tsx
className="hover:bg-(--md-sys-color-primary)/90 disabled:opacity-50"
```

Behavior lives in the primitive; appearance reacts to what it emits.

## Naming

- `kern-<name>` class prefix, `data-slot="<name>"` on the root element.
- File name is kebab-case (`field-message.tsx`); the export is PascalCase
  (`FieldMessage`). Keep a concept in one file even when it has several
  parts: `accordion.tsx` exports `AccordionRoot`, `AccordionItem`,
  `AccordionHeader`, `AccordionTrigger`, and `AccordionPanel`. Split into
  multiple files only when a part is large enough to stand alone.
- Types: `*Props`. Native adds `Native*Props` where React Native's event and
  style types force it (`NativeButtonProps`). Never a `Native` prefix on a
  component name.

## Variants

Variant names are global and mean the same on every component:

| Prop | Meaning | Values |
|---|---|---|
| `variant` on `Button` | emphasis | `primary`, `tonal`, `ghost`, `destructive` |
| `variant` on `Card` | elevation treatment | `filled`, `outlined`, `elevated` |
| `variant` on `Text` | type-scale role | `body`, `label`, `title`, `headline` |
| `variant` on `FieldMessage` | intent | `description`, `error` |
| `variant` on `Badge` | shape | `dot`, `count` |
| `variant` on `Chip` | kind | `assist`, `filter`, `suggestion` |
| `size` | scale | `default`, `sm`, `icon` where the component supports it |
| `orientation` | axis | `horizontal`, `vertical` |

The meaning of `variant` is **frozen per component** and identical on native
— one prop name never carries two meanings. A component offers the subset
that fits it; it never renames. The full table is in
`docs/platform-parity.md`.

## Slots

Multipart components expose named parts sharing one variant context
(`title`, `description`, `actions`). Compose base parts through context
instead of rebuilding them under a new name. If you catch yourself writing a
component whose job is "a `Dialog` but different", you are rebuilding a
solved pattern — use a slot.

## Styling

- Token-bound utilities only, roles never raw values.
- No runtime styling, no consumer-side codegen.
- Spacing from the numeric scale (`--spacing-4` = 16px), not from invented
  names — see [`layout-and-responsive.md`](layout-and-responsive.md).
- Never resolve a role at module scope. Web components read the CSS variable
  (so they follow the theme); native components call `useKernScheme()`.

## Mobile translation

Same file shape, three extra rules:

1. **Platform-gate classes that only exist on web** — hover, focus rings,
   cursor. They have no native equivalent and must not be smuggled across.
2. **A cascading text context for slotted children** — native has no DOM
   inheritance, so a slotted `Text` must resolve its own variant.
3. **Paired text variants next to every variant map** — if `Card` has
   `filled`, the card's text must have a matching treatment.

Native components take `style` and `testID`, read color from
`useKernScheme()`, and default `testID` to `kern-<name>` so tests and E2E
selectors are stable.

## Composite rule

Complex components reuse base parts through context. Never rebuild a
solved pattern under a new name.