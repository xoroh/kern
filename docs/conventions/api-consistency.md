# API consistency (R2, re-homed T1)

Status: current

The four R2 API rules plus the derived-color rule, ported from the
platform fork's R2 series into the tree that owns them. The fork
(`xoroh-platform/libs/kern`) consumes these; nothing is rebuilt there.
`DESIGN.md` exists only in the fork — this page is where kern/ owns the
same rules. All additions were aliases: nothing renamed, nothing removed.

Related: [Parity policy](./parity.md) (`variant` meaning frozen per
component, same size scale where the platform allows it).

## 1. Sizes — `KernSize` foundation

`KernSize = 'sm' | 'md' | 'lg'` (`KERN_SIZES`, `@xoroh/kern-tokens`).
Component props keep their own names and map onto it:

| Component prop | Maps onto `KernSize` | Notes |
|---|---|---|
| TopAppBar `small` / `medium` / `large` (web) | `sm` / `md` / `lg` | M3 names kept as the alias (`TOP_APP_BAR_SIZE_TO_KERN_SIZE`) |
| TopAppBar `small` / `medium` (native) | `sm` / `md` | `center` is alignment, not scale — intentionally absent |
| Button `default` (both renderers) | `md` | Same metrics — automatic |
| Button `sm` (both renderers) | `sm` | Stable name |
| Button `icon` (both renderers) | — (absent) | Shape, not scale — hand-migrate |

Guarded by `sizes.test.ts` in both packages (foundation exactness,
map exhaustiveness, absent-by-design assertions).

## 2. Variants — M3 names as aliases, Kern extensions documented

Both Buttons ship `elevated | primary | tonal | outlined | ghost`.
M3 aliases resolve to existing styles, normalized once at the top of
each Button — every style switch below still matches Kern names, so
existing rendering cannot change:

| M3 alias | Resolves to | Notes |
|---|---|---|
| `filled` | `primary` | Same fill |
| `text` | `ghost` | Same borderless shape |

`elevated` already exists on both renderers, so it is not an alias.
`ghost` (borderless text button) and `destructive` (error-filled button,
expressed by the caller with `error`/`on-error` roles) are Kern
extensions — recorded here, never claimed as M3.

## 3. Composition — `render` for new parts, `asChild` grandfathered

Base UI settled on the `render` prop; Radix-style `asChild` survives
only as a bridge onto it. The rule:

- New parts take `render`, never `asChild`.
- An `asChild` prop must use the mutual-exclusion bridge
  `render={asChild ? (children as React.ReactElement) : render}` —
  both accepted, never both active. Guarded by
  `packages/kern/src/composition.test.ts`, which scans both renderer
  trees (comments stripped first, so prose cannot satisfy it).
- A custom `asChild` child must forward its ref — a non-forwarding
  child silently breaks focus management.

kern/ currently has no `asChild` definitions, so the guard constrains
future code rather than describing present code.

## 4. Taxonomy — one layer map

`scaffolds/` (app frames), `blocks/` (top-app-bar, search, status),
`panes/` (content splits), `navigation/` (rail/drawer). Mapped onto
this tree: web `src/start/` carries the four layers as modules
(`blocks`, `navigation`, `panes`, `scaffolds`, plus `link` and
`top-app-bar`); components stay in `src/components/`. Native keeps
`components/` flat plus `parity/` — it has no scaffold layer yet, so
new app-frame code must introduce `scaffolds/` rather than settling in
`components/` (recorded, not hidden, per the parity policy).

Guarded by `src/start/taxonomy.test.ts` (the four layers stay
barrel-exported).

## 5. Color — every usage derived, never a typed hex

Web consumes `var(--md-sys-color-*)`, native consumes
`scheme.color.*`. A hex literal in a component is a defect: it moves
to tokens, or to a per-domain token with a recorded reason.
Enforcement: `check:contrast` fails any theme role whose value is not
a `tokens.json` palette step, and `tokens.test.ts` pins the approved
seed values — the rule here is the statement of intent those gates
enforce.
