---
"@xoroh/kern-primitives": patch
---

Move `useControllableState` into the primitives layer and give it tests.

Step 1 of the ratified extraction: the shared kernel, with 21 consumers, becomes
a single implementation in the layer both renderers depend on.

**It existed as two byte-identical copies**, one in `packages/kern/src/utils/`
and one in `packages/kern-native/src/utils/`, neither publicly exported and
neither tested. So the "shared" kernel was never actually shared, and a
divergence between the renderers would have been invisible until a consumer
misbehaved in the field. That is the real risk this closes; the move itself is
mechanical.

**15 tests, mutation-proven.** Four of the five mutations were caught by the
obvious assertions. Two needed tests that did not exist first:

- *"the controlled prop is the truth"* passes against a broken implementation,
  because `current` reads the controlled `value` and never consults `internal`.
  The write only becomes observable when the parent later drops the prop.
- *"the setter identity is stable"* passes with `[]` deps if the rerender passes
  the same `value`, because the deps stay referentially equal. Stability has to be
  checked across a render where the value actually changes.

Both are recorded in the test file, because the naive version of each is a test
that green-lights a bug.

One assertion turned out to be **wrong rather than weak**, and was corrected
rather than deleted: a new `onChange` closure *does* change the setter identity,
and it must — a stale `onChange` would call a consumer's handler after their
state moved on. The test now pins that as intended behaviour.

Verified: 15/15 pass; five mutations each caught (unconditional internal write,
missing `Object.is` guard, missing updater branch, missing mode-change warning,
`onChange` dropped from the deps); the extracted source is byte-identical to both
originals, restored from git; `check:primitives` PASS. The two original copies
are untouched — repointing 21 consumers is the next step, not this one.