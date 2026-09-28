# `@xoroh/kern`

Status: current

M3-based UI core: web (React) + native (React Native) + shared theme,
one package, subpath exports.

## Install

```bash
bun add @xoroh/kern
```

Requires Tailwind CSS v4: map utilities to roles with `@theme inline`
(see the theme stylesheet), and import the theme once:

```tsx
import "@xoroh/kern/theme";
```

## Exports

| Import | What |
|---|---|
| `@xoroh/kern` | Web components (React) |
| `@xoroh/kern/native` | Native components (React Native, StyleSheet + tokens) |
| `@xoroh/kern/theme` | Theme CSS variables |
| `@xoroh/kern/tokens` | Tokens as TypeScript (`tokens.json` is the source) |
| `@xoroh/kern/utils` | `cn` and other pure helpers |

## Components (web)

```tsx
import { Button } from "@xoroh/kern";

<Button variant="primary">Save</Button>;
// variant: primary | tonal | ghost — size: default | sm | icon
```

```tsx
import { Input, Label, Textarea } from "@xoroh/kern";

<Label htmlFor="email">Email</Label>;
<Input id="email" placeholder="you@co.com" />;
<Input id="email" error aria-describedby="email-error" />;
<Textarea id="notes" placeholder="Details" />;
```

```tsx
import { Checkbox, Switch, RadioGroup, RadioGroupItem } from "@xoroh/kern";

<Checkbox aria-label="Accept" />;
<Switch aria-label="Notifications" />;
<RadioGroup aria-label="Plan" defaultValue="free">
  <RadioGroupItem value="free">Free</RadioGroupItem>
  <RadioGroupItem value="pro">Pro</RadioGroupItem>
</RadioGroup>;
```

```tsx
import { Badge, Chip, Card, Text, Separator, FieldMessage } from "@xoroh/kern";

<Badge>3</Badge>; // variant: dot | count
<Chip variant="filter" selected>Active</Chip>;
<Card variant="filled">…</Card>; // filled | outlined | elevated
<Text variant="title">Hello</Text>; // body | label | title | headline
<Separator />;
<FieldMessage variant="error">Required</FieldMessage>;
```

## Themes

Presets in `src/theme/themes/`: `m3` (default), `sharp` (premium),
`brand` (customer template). Same components, swapped tokens.

```tsx
import { applyKernTheme, resolveTheme, useKernTheme } from "@xoroh/kern/tokens";

resolveTheme("dark"); // role → value table
applyKernTheme(document.documentElement, "dark"); // write vars + .dark
const { mode, toggle } = useKernTheme(); // persisted + OS default
```

## Blocks

Use-case packs in `src/blocks/<usecase>/` (mobility first): composed
components + preset themes on core primitives. Blocks depend on core,
never the reverse — see `../../docs/conventions/file-ownership.md`.

```tsx
import { Button } from "@xoroh/kern/native";

<Button variant="primary" label="Save" onPress={save} />;
// same names, same variants, same tokens — StyleSheet, no styling deps
```

## Status

13 web components real (tested); 12 native components real (style maps
plus Jest render tests). Stub files throw until implemented and stay out
of the exports.

## Testing

- Web + unit: `bun run test` (vitest).
- Native render: `bun run test:native` (Jest + RN preset + RNTL).
  Two rules: `await render(...)` (RNTL v14 renders async) and wrap
  state-changing presses in `await act(async () => …)` (React 19
  concurrent flush races plain assertions).
