# P2c-2 — the kern-primitives API shape + extraction scope

**Author:** design-system-lead · **Date:** 2026-10-02 · **Spec. Research + tree measurement; nothing built this turn.**
Feeds kern-lead's P2c-3 (extraction). The CTO may need to rule items in §6 — they are flagged, not decided.

## 0. What was measured, not assumed

| fact | value | how |
|---|---|---|
| same-named components on both renderers | **62** | filename intersection, `packages/kern/src/components` × `packages/kern-native/src/components` |
| of those, importing `@xoroh/kern-primitives` | **0** | source scan |
| real consumers of the package | **28 files — 25 native, 2 web, 1 mcp** | repo-wide grep, dist excluded |
| packages already on the primitive | `useControllableState`, `createRovingModel`/`useRovingModel`, `useSelection`/`toggleSelection`, `formatTimeValue`/`minutesForStep` | `src/index.ts` |

**The headline finding: the extraction is running at ~40% (25 native / 2 web).** The primitive is
doing real work on the native side and almost none on web. That asymmetry is the thing this spec has
to fix, and it is not a completeness complaint — it is a *risk* finding: the layer's defining property
is that it is renderer-agnostic, and a package used 12:1 by one renderer has not yet been tested as
the shared kernel.

## 1. Two layers, two jobs

### Layer 1 — `@xoroh/kern-primitives` (renderer-agnostic logic)

No DOM. No `react-native`. No tokens. No `@xoroh/kern` (it pulls react-dom + Base UI, and would make
the extraction circular).

**The gate rule, preserved VERBATIM — this is the contract, not a style preference:**

> So this resolves the **transitive closure** of relative and workspace imports and checks every file
> in it. The first hit is reported with the full import chain, because "primitives imports kern-tokens"
> is a fact someone can act on and "primitives imports utils/overlay-styles" is not.
>
> A per-file grep is not sufficient, and that is a demonstrated fact, not a preference. During the
> `SheetSurface` split a theme-coupled helper was placed in `utils/overlay-styles.ts`… The candidate
> file was clean; its dependency was not: `sheet-surface → overlay-styles → kern-tokens`. A grep of
> the extracted file finds nothing.

That reasoning is why the gate exists and it must not be re-derived. Two things must not be "improved":
**the transitive walk**, and the **wholesale token ban** — the gate's own comment is right that
narrowing to symbols would need real export-graph analysis, and faking it with a string match
recreates the proxy-for-the-property failure this repo keeps hitting.

### Layer 2 — the widget layer (Base UI-shaped)

Namespaces of parts (`Sheet.Root/Trigger/Portal/Backdrop/Viewport/Popup`), each part rendering the
most appropriate element by default, with a **`render` escape hatch** for element substitution.

**The standing rule, carried from P2b-2's behaviour test: never a wrapper `div` where a part will
do.** A component that emits one CSS property or owns no state is not a component. That test already
cut 8 native-only rows; the same judgement governs extraction.

## 2. Per-primitive extraction table

`genuinely shared?` = the behaviour must be identical on both renderers or it does not belong here.
`M3-free?` = free of visual/spec decisions (a token or an M3 value makes it a visual decision).

| primitive | layer | genuinely shared? | M3-free? | source | notes |
|---|---|---|---|---|---|
| `useControllableState` | 1 | ✅ yes | ✅ | landed | the 2-copy extraction that motivated the package |
| `useRovingModel` / `createRovingModel` | 1 | ✅ yes | ✅ | landed | tree-shaped roving focus |
| `useSelection` / `toggleSelection` / `normalizeSelection` | 1 | ✅ yes | ✅ | landed | the single- vs multi-select axis |
| `formatTimeValue` / `minutesForStep` | 1 | ✅ yes | ✅ | landed | time arithmetic, not a time *style* |
| **`useCollection`** *(new)* | 1 | ✅ yes | ✅ | **React Aria** | §4 — the highest-value addition |
| `useOverlayModality` | 1 | ✅ yes | ✅ | extract from `SheetSurface` | inert-others / focus containment, both renderers |
| `useDismissable` | 1 | ✅ yes | ✅ | extract from sheet/menu | scrim press, Escape, focus return — **one owner** |
| `useTypeahead` | 1 | ✅ yes | ✅ | React Aria | folds into `useCollection` |
| `useMergeRefs` | 1 | ✅ yes | ✅ | extract from `render` usage | what makes `render` interop work |
| focus-visible policy | 1 | ✅ yes | ⚠️ borderline | **CTO ruling** | is the focus ring a token decision? §6 |
| Dialog / Sheet / Popover / Menu widgets | 2 | ✅ yes | ❌ tokens | **Base UI** | stay in the widget layer; never move down |
| Pressable / Touchable | 2 | ✅ yes | ⚠️ | extract from `kern-primitives` | §6: is a press primitive Layer 1 or 2? |
| M3 token values, shape scale, spacing | — | ❌ | ❌ | `kern-tokens` | **never** in this package |

## 3. Sequence by RENDERER-INDEPENDENCE, not component count

Component count is the wrong sort key: a count of 62 would schedule 62 extractions and land the
easy ones first. The right key is *"how close to the boundary is this?"* — extract the most
boundary-adjacent, most-shared behaviour first, because that is where the graph gate earns its keep.

**Wave 1 — one owner for behaviour that is already duplicated (highest risk of divergence today).**
`useDismissable`, `useOverlayModality`, `useMergeRefs`. All three exist in both renderers today with
independent implementations; a fix to one silently does not reach the other. This is the
`useControllableState` failure mode repeating.

**Wave 2 — the missing capability.** `useCollection` (§4). Nothing to extract; new ground.

**Wave 3 — close the 12:1 asymmetry.** Re-point the **2** web consumers and audit the 62
same-named components for behaviour that is genuinely shared but currently re-implemented per side.
Sequenced by *boundary proximity*, not name: start with the composites that already import a
primitive (`checkbox-group`, `tabs`, `menu`, `select`) since they are the most likely to own
duplicated state logic.

**Wave 4 — widget layer hygiene.** No new widgets; only replace wrapper-div shapes with parts.

## 4. The collection/selection model — the highest-value NEW primitive

This is the one thing to **port rather than re-derive**, because keyboard interaction is *specified
behaviour* (WAI-ARIA authoring practices), not taste. React Aria is the only one of the four
libraries that ships it as a standalone model.

**Shape** (React Aria's, deliberately):

| concern | contract |
|---|---|
| node model | a `Collection<T>` built from any data source — **not** a DOM tree, so it works for a virtualised list |
| keyboard | arrow keys, Home/End, PageUp/PageDown, **type-ahead** over labels |
| focus | one roving tab stop; the focused node and the selected node are **independent** |
| selection | `selectionMode: none \| single \| multiple`, `selectionFollowsFocus` for the two behaviours to stay in step |
| empty / disabled | both first-class: a disabled node is focusable-but-not-selectable |
| rendering | the consumer maps `node => render(node)`, so the model never touches the DOM |

**Why it belongs in Layer 1:** it is pure logic over `(collection, key, inputEvent)`. Both renderers
can implement it, and RN needs it *more* than web — a mobile list is virtualised by default.

**Relationship to the existing primitives:** `useRovingModel` stays (tree-shaped keyboard nav);
`useCollection` is the data-shaped sibling. They should share the key-normalisation helper rather than
each growing one.

## 5. Gate changes this spec implies (for kern-lead / review)

1. **`check:primitives` should assert the ratio, not just the boundary.** Today it proves the layer
   is clean. A gate that also reported *"Layer 1 is used by 25 native files and 2 web"* would have
   surfaced the 12:1 asymmetry at the moment it appeared, instead of at audit.
2. **A "no wrapper div" lint is tempting and I recommend against it.** It is a proxy — a wrapper div
   can be legitimate. The behaviour test is a judgement; encode it in review, not in a regex.

## 6. Rulings needed — flagged, not decided

1. **Is the focus-visible ring a token decision?** If the focus ring reads a token it is a visual
   decision and **cannot** be Layer 1; it stays in each renderer. My reading: yes, it is, so focus
   *policy* (which element is focusable, when the ring appears) is Layer 1 while the ring *rendering*
   is Layer 2. **CTO ruling wanted** — it changes where `useFocusRing` lands.
2. **Is a `Pressable`/`Touchable` primitive Layer 1 or Layer 2?** It owns behaviour (press, long-press,
   press-and-hold) but its surface is visual. If Layer 1, kern owns a primitive React Native already
   ships. **CTO ruling wanted.**
3. **Does kern-primitives publish at all?** If it is public, the API is a compatibility promise and
   the `render` prop in particular must be stable. If internal, it can move. **CTO ruling wanted** —
   it changes how conservative the naming must be.

## 7. What this does NOT change

- The two-layer split and the graph gate stand. `check-primitives.mjs` is untouched by this spec.
- No widget moves into Layer 1. A component that reads a token is a visual decision by definition.
- rn-primitives is **not** adopted: its components cannot be shared with a DOM renderer, which is the
  whole point of the layer. It informed the shape only.
