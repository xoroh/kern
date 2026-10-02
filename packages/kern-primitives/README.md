# `@xoroh/kern-primitives`

Status: current

The un-styled behaviour kernel shared by the Kern web and native renderers.
Controllable state, overlay modality, roving focus, dismiss policy and the
collection/selection model — the logic that both renderers must implement
identically, carrying no visual decision.

## Install

```bash
bun add @xoroh/kern-primitives
```

Requires React `>=18` as a peer dependency.

## What is in it

| Export | Purpose |
|---|---|
| `useControllableState` | One state hook for controlled/uncontrolled components |
| `createCollectionModel` · `useCollection` | Collection tree and item registration for composite widgets |
| `createRovingModel` · `useRovingModel` | Roving-tabindex keyboard focus for toolbars, tabs, menus |
| `createOverlayModality` · `useOverlayModality` · `useOverlayRegistration` | Tracks which overlay layer owns the keyboard and screen-reader focus |
| `createDismissPolicy` · `dismissTriggersFor` | One dismissal rule for escape / outside-press / pointer-down |
| `mergeRefs` · `assignRef` · `useMergeRefs` | Compose callback and object refs without losing either |
| `isSelected` · `normalizeSelection` | Selection helpers shared by both renderers |

## The boundary

This package may not import `@xoroh/kern-tokens` or `@xoroh/kern-native`. A
primitive that reads a colour has made a visual decision, and the same source
can then no longer be the shared kernel for a second renderer.

The `check:primitives` gate enforces this over the **transitive** import
closure, not a per-file grep — the graph is the property being protected, not
the individual file.

## Usage

These are headless hooks and factories; you render the markup.

`useRovingModel` takes a single options object; `count` is required.

```tsx
import { useRovingModel } from "@xoroh/kern-primitives";

export function Toolbar({ items }: { items: string[] }) {
  const roving = useRovingModel({
    count: items.length,
    orientation: "horizontal",
    loop: true,
  });

  return (
    <div role="toolbar">
      {items.map((item, i) => (
        <button
          key={item}
          tabIndex={roving.activeIndex === i ? 0 : -1}
          onClick={() => roving.setActive(i)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
```

The model returns `activeIndex`, `setActive`, `next`, `previous`, `first`,
`last`, `describe`, `orientation` and `loop`. Pass `activeIndex` +
`onActiveIndexChange` to control it, or `defaultActiveIndex` to let it own the
state. See `packages/kern-native/src/components/carousel.tsx` for a full
consumer.

## Licence

MIT — see [LICENSE](./LICENSE).