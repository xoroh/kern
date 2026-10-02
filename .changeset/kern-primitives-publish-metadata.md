---
"@xoroh/kern-primitives": patch
---

**Publish-ready metadata: the tarball now carries the README and the licence.**

`package.json` declared `files: ["dist", "README.md", "LICENSE"]` while neither
`README.md` nor `LICENSE` existed in the package. npm drops entries for absent
files **without error**, so `npm pack --dry-run` produced a 5-file tarball
containing only `dist/` and `package.json` — a published library with no README
and no licence file, shipped silently. `publint`, `attw`, `typecheck` and the
test suite are all blind to this: they inspect the manifest and the types, never
the packed contents.

Three fixes, all verified by reading the packed file list:

1. **`LICENSE` added** — copied from the repo root. Byte-identical
   (`md5 1bf2790b2d7851e2d58f497f4d4812dd`) to the root `LICENSE` and to all five
   other package `LICENSE` files, so every published package now carries the same
   MIT text. `files` was left truthful rather than weakened to hide the gap.
2. **`README.md` added** — real content: install, the export table, the
   no-tokens boundary enforced by `check:primitives`, and a worked example
   written against the actual `useRovingModel` signature.
3. **`publishConfig` added** — `{"access": "public", "provenance": true}`,
   matching all five siblings. Without it this package could not publish scoped
   or produce provenance attestations.

`npm pack --dry-run` now lists **7 files**: `LICENSE`, `README.md`,
`dist/index.{js,cjs,d.ts,d.cts}` and `package.json`.

**Process note.** This was a "metadata claims a thing that does not exist"
defect, which is exactly the class that reaches a registry unnoticed. The
detection step is one command — `npm pack --dry-run` plus reading the listing —
and it is now a blocking clause in every package's acceptance rather than a
one-off instruction.