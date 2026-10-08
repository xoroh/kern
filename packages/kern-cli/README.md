# @xoroh/kern-cli (scoped, unpublished)

Installer for Kern: `kern add <component>`.

Mode 1 (`kern add`) is shipped: `src/` implements vendored web-component
install — `add.ts` (copy + receipt), `closure.ts` (transitive relative-import
closure), `manifest.ts` (registry seam over `packages/mcp/src/manifest.ts`),
`kern.ts` (CLI entry) — covered by `add.test.ts`. Web-only; native is refused
until the Metro asset story is scoped. Private and never published until the
remaining commands ship.

Coming next: `kern list`, `kern diff`, `kern upgrade` (receipts in
`<dest>/kern.receipt.json` already record the kern version + file hashes those
commands compare against).

Mode 2 needs no command: `bun add @xoroh/kern` for the versioned dependency.
