# @xoroh/kern-cli (scoped, unpublished)

Installer for Kern: `kern init <dir>` scaffolds the starter, `kern add <component>`
vendors one component.

`kern init` is shipped: `src/init.ts` copies `starters/web/` (app shell,
themed screen with the kern/sharp/brand/demo preset picker, the
tailwind-plus-tokens stylesheet pair) into `<dir>`, resolves the kern deps,
and stamps `<dest>/kern.receipt.json` — covered by `init.test.ts`, verified
by scaffolding into a scratch dir and running `bun install` + `vite build`
there. Pre-publish the deps are `file:` against your checkout (the registry
names 404 until the first publish); `--registry` emits the versioned names
for post-publish use.

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
