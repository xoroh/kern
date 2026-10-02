---
"@xoroh/kern": patch
"@xoroh/kern-icons": patch
"@xoroh/kern-tokens": patch
---

M3 resting-elevation conformance, an icon usage gate, and the per-component doc
grammar (ladder Phase 2, `design-system-lead`).

**Resting elevation: six components were off-spec, and the gate that should have
caught it did not exist.** The P2 audit concluded that
`m3.material.io/styles/elevation` publishes no per-component numeric table, so
`dialog`, `alert-dialog` and `snackbar` were logged as unresolvable. **That
conclusion was wrong** — the overview page has no table, but
`/styles/elevation/tokens` publishes a "Component elevation" table mapping
resting level to component. Transcribed on 2026-10-01 into
`packages/kern-tokens/src/m3-elevation.ts`, which gives `check:kern` the target it
lacked. Against the real spec, six components diverged:

| component | was | now | M3 row |
|---|---|---|---|
| `fab` | level1 | **level3** | FAB |
| `extended-fab` | level1 | **level3** | Extended FAB |
| `dialog` | level2 | **level3** | Dialogs (modal) |
| `alert-dialog` | level2 | **level3** | Dialogs (modal) |
| `fab-menu` | level1 | **level3** | FAB menu (close button) |
| `sheet` | level2 | **level1** | Bottom/side sheet (modal) |

`sheet` moves *down* a level, and `card` (level1, Card (elevated)) was already
correct. The fix direction is toward parity, not away from it: native `fab`
already used `elevation: 3`. Prose comments naming the old level in
`extended-fab.tsx` and `fab-menu.tsx` were corrected in the same change so the
source does not contradict itself.

Components M3 does not tabulate (popover, select, combobox, snackbar, …) are
inventoried in `KERN_UNASSIGNED_ELEVATION` under deviation **K6** — recorded as
kern decisions, not asserted against a spec that does not speak about them.
`auditElevation` resolves elevation **transitively through local imports**,
because `menu`/`context-menu`/`menubar` carry theirs via `menu-classes.ts`; a
per-file grep reports them as carrying none.

**`bun run check:kern` gains a resting-elevation leg** (8/8 components conformant)
and reports the count. 5 mutations injected, 5 caught, files restored
byte-identical.

**`icons:check` gains a name-reachability leg — the first leg that looks at
consumers.** The other four validate the set against the upstream catalogue, so
"1340 icons ok" certified assets nothing renders: 43 of 1340 names are actually
reachable. The leg fails on a referenced name the curated set does not contain
(the drift class that let a hand-inlined `pencil` — not a Material name — into a
test) and *reports* unconsumed names without failing, since the set is
deliberately a catalogue and pruning it is a design decision, not a lint rule.

It resolves semantic aliases before checking, so `name="attach"` is accepted
against its pinned `material:attach-file` target per `core/naming.ts`; 2
mutations injected, both caught.

**`docs/conventions/component-docs.md`** specifies the six-section grammar
(metadata strip → showcase → features → customization → deviations → API) that
every component reference page must follow, with required/conditional per
section and the assertions a future validator will make. The grammar is
`draft`, not `current`: the pages do not exist yet, and a validator passing over
zero pages is exactly the "gate that changes nothing" failure mode.
