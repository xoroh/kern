# `@xoroh/kern-primitives`

Status: current

The un-styled behaviour kernel shared by the Kern web and native renderers.
Controllable state, overlay modality, roving focus, dismiss policy and wiring,
focus trap, portal registry, positioning math, presence, press, slot merging,
time values, a11y plumbing and the collection/selection model — the logic both
renderers must implement identically, carrying no visual decision.

## Install

```bash
bun add @xoroh/kern-primitives
```

Requires React `>=18` as a peer dependency.

## What is in it

16 kernel modules (source of truth: `src/*.ts`):

| Module | Exports | Purpose |
|---|---|---|
| `a11y` | `createIdScope` · `resolveDir` · `VISUALLY_HIDDEN_STYLE` | Stable ids, text direction, screen-reader-only style |
| `collection` | `createCollectionModel` · `useCollection` | Collection tree, focus + selection for composite widgets |
| `dismissPolicy` | `createDismissPolicy` · `dismissTriggersFor` | May this surface dismiss; must a close affordance exist |
| `dismissWiring` | `dismissBranchesFor` · `shouldDismissOn` | Which concrete signal closes which surface |
| `focusTrap` | `createFocusTrapModel` · `nextTrapIndex` · `resolveAutofocus` | Tab looping + autofocus events for modal surfaces |
| `mergeRefs` | `mergeRefs` · `assignRef` · `useMergeRefs` | Compose callback and object refs without losing either |
| `overlayModality` | `createOverlayModality` · `useOverlayModality` · `useOverlayRegistration` | Which overlay layer owns keyboard + screen-reader focus |
| `portal` | `createPortalRegistry` · `resolvePortalTarget` | Owned overlay host: mount order, mount/unmount |
| `positioning` | `resolveFloatingOrigin` · `clampRectToViewport` | Anchor math + viewport clamping for floating surfaces |
| `presence` | `createPresenceModel` · `nextPresenceState` · `usePresence` | Exit-animation suspension: mounted → exiting → unmounted |
| `press` | `createPressModel` · `usePress` · `isPressActivationKey` | Pressed state + Enter/Space activation keys |
| `roving` | `createRovingModel` · `useRovingModel` | Roving-tabindex keyboard focus for toolbars, tabs, menus |
| `selection` | `normalizeSelection` · `isSelected` · `toggleSelection` · `useSelection` | Single/multiple selection helpers shared by both renderers |
| `slot` | `mergeSlotProps` · `composeEventHandlers` | Prop merging for element substitution (Trigger as-child) |
| `time` | `minutesForStep` · `normalizeTimeValue` · `formatTimeValue` · `toTwentyFourHour` | 24-hour-internal time values, step grid, 12h/24h rendering |
| `useControllableState` | `useControllableState` | One state hook for controlled/uncontrolled components |

## The boundary

This package may not import `@xoroh/kern-tokens` or `@xoroh/kern-native`. A
primitive that reads a colour has made a visual decision, and the same source
can then no longer be the shared kernel for a second renderer.

The `check:primitives` gate enforces this over the **transitive** import
closure, not a per-file grep — the graph is the property being protected, not
the individual file.

## Usage

These are headless hooks and factories; you render the markup.

### `a11y` — ids, direction, visually-hidden

```tsx
import { createIdScope, resolveDir, VISUALLY_HIDDEN_STYLE } from "@xoroh/kern-primitives";

const ids = createIdScope("dialog");
const triggerId = ids.nextId(); // "dialog-1"
const dir = resolveDir({ defaultDir: "ltr" }); // "ltr"
// web: <span style={VISUALLY_HIDDEN_STYLE}>Close</span>
// native: map VISUALLY_HIDDEN_STYLE onto the hidden-text host
```

### `collection` — composite-widget tree

```tsx
import { createCollectionModel } from "@xoroh/kern-primitives";

const model = createCollectionModel({
  nodes: [{ key: "a", label: "Alpha" }, { key: "b", label: "Beta" }],
  focusedKey: null,
  selectedKeys: [],
  selectionMode: "single",
});
model.getCount(); // 2
```

### `dismissPolicy` — may it dismiss, must it show close

```tsx
import { createDismissPolicy, dismissTriggersFor } from "@xoroh/kern-primitives";

const policy = createDismissPolicy({ dismissible: true, hasDismissHandler: true });
const triggers = dismissTriggersFor({ modal: true, hasVisibleClose: true });
policy.shouldDismiss("escape", true, triggers); // true when open
```

### `dismissWiring` — which signal closes which surface

```tsx
import { dismissBranchesFor, shouldDismissOn } from "@xoroh/kern-primitives";

const branches = dismissBranchesFor({ modal: true, dismissible: true, hasVisibleClose: true });
// { "outside-pointer": true, "focus-out": true, escape: true, "system-back": true, close: true }
shouldDismissOn("escape", true, branches); // true
```

### `focusTrap` — tab loop + autofocus event

```tsx
import { createFocusTrapModel, resolveAutofocus } from "@xoroh/kern-primitives";

const trap = createFocusTrapModel({ count: 3, loop: true });
trap.move("next"); // index arithmetic over stops; renderer maps indices to nodes
resolveAutofocus(3); // { type: "focus-stop", index: 0 }
```

### `mergeRefs` — compose refs

```tsx
import { useMergeRefs } from "@xoroh/kern-primitives";

const ref = useMergeRefs<HTMLDivElement>(forwardedRef, innerRef);
// <div ref={ref} /> — both refs receive the node, neither is lost
```

### `overlayModality` — which layer owns focus

```tsx
import { createOverlayModality, useOverlayModality, useOverlayRegistration } from "@xoroh/kern-primitives";

const registry = createOverlayModality();
useOverlayRegistration(registry, "dialog-1");
const state = useOverlayModality(registry); // { topId, ... }
```

### `portal` — owned overlay host

```tsx
import { createPortalRegistry, resolvePortalTarget } from "@xoroh/kern-primitives";

const portals = createPortalRegistry();
portals.mount("dialog-1");
portals.order(); // ["dialog-1"] — bottom-first
resolvePortalTarget({}); // "kern-portal-root"
```

### `positioning` — anchor math + clamping

```tsx
import { resolveFloatingOrigin, clampRectToViewport } from "@xoroh/kern-primitives";

const origin = resolveFloatingOrigin(
  { x: 100, y: 100, width: 80, height: 32 },
  { width: 200, height: 120 },
  { placement: "bottom", offset: 8 },
);
clampRectToViewport(origin, { width: 200, height: 120 }, { width: 1024, height: 768 }, 8);
```

### `presence` — exit-animation suspension

```tsx
import { usePresence } from "@xoroh/kern-primitives";

const { present, state, finishExit } = usePresence(open);
// state: "mounted" | "exiting" | "unmounted"
// closing moves to "exiting" (still rendered); call finishExit() on animationend
if (!present) return null;
```

### `press` — pressed state + activation keys

```tsx
import { usePress, isPressActivationKey } from "@xoroh/kern-primitives";

const { pressed, begin, end, cancel } = usePress({ onPress: save });
isPressActivationKey("Enter"); // true — Enter and " " only
// web: bind begin/end/cancel to pointer + key handlers; native: onPressIn/onPressOut
```

### `roving` — roving tabindex

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

### `selection` — single/multiple selection

```tsx
import { useSelection } from "@xoroh/kern-primitives";

const [selected, toggle] = useSelection({ mode: "multiple", defaultValue: [] });
toggle("row-1"); // adds or removes "row-1"
```

### `slot` — prop merging for element substitution

```tsx
import { mergeSlotProps } from "@xoroh/kern-primitives";

const props = mergeSlotProps(
  { onClick: open, className: "trigger" },
  { onClick: track, className: "consumer" },
);
// onClick chained (part first, consumer second); className concatenated
```

### `time` — 24-hour-internal time values

```tsx
import { normalizeTimeValue, formatTimeValue, minutesForStep } from "@xoroh/kern-primitives";

minutesForStep(15); // [0, 15, 30, 45]
const value = normalizeTimeValue({ hours: 15, minutes: 45 }, 15);
formatTimeValue(value, "12h"); // { hours: 3, period: "PM" }
```

### `useControllableState` — controlled/uncontrolled in one hook

```tsx
import { useControllableState } from "@xoroh/kern-primitives";

const [open, setOpen] = useControllableState(value, defaultValue, onChange);
// controlled when `value !== undefined`, uncontrolled otherwise
```

## Licence

MIT — see [LICENSE](./LICENSE).
