---
"@xoroh/kern-native": minor
---

**BREAKING — the native public barrel no longer exports four symbols.**

Long overdue by this changeset set. It records `bab98e3`, which landed during
the D-030 alpha work and retired four parity rows without a version note.

**Removed from `@xoroh/kern-native`'s public exports:**

| Was | Why | Replaced by |
|---|---|---|
| `loaderColor` | An implementation detail of `Loader`, not a component. Retired by a review-m3 ruling; the function still exists internally in `components/loader.tsx` and `Loader` still applies it. | nothing — call `Loader`, not its colour helper |
| `AppsSheet` + `AppsSheetProps` | Phantom rows left by the P2b-2 merge: never a real component surface. | `ActionSheet` + `ActionSheetProps` |
| `CreateSheet` + `CreateSheetProps` | Same — a duplicate of the create flow under a second name. | `ActionSheet` + `ActionSheetProps` |

**Action for consumers:** if you imported `loaderColor`, `AppsSheet` or
`CreateSheet` from `@xoroh/kern-native`, switch to `Loader` or `ActionSheet`.
Nothing that was a real, documented surface was removed.

The registry also gained the native-only rows that merge actually introduced —
`action-sheet`, `sheet-surface`, `bottom-sheet-surface`, `boot-splash` — so the
counts reconcile at **313 rows: 45 shared / 25 native-only / 34 web-only / 0
stubs**. Regenerated `packages/mcp` manifests, `docs/components.md` and the site
manifest follow from that.