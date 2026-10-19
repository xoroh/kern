# @xoroh/kern-cli (scoped, unpublished)

Installer for Kern: `kern create <name>` scaffolds a new app, `kern init
<dir>` configures an existing project with the starter, `kern add
<component|block>` vendors code, `kern list/diff/upgrade` inspect and update
it, `kern feedback` files Preview feedback.

## Starters (C1-S Preview scope)

One supported starter: **Vite + React** (`starters/web/` — app shell, themed
screen with the material-3/sharp/brand/demo preset picker, tailwind-plus-
tokens stylesheet pair). `create`/`init` copy it into the target, resolve
the kern deps, stamp `<dest>/kern.receipt.json` + `<dest>/kern.json`
(renderer, pinned preset, package manager, mode), and print the install/run
commands. Verified by scaffolding into a scratch dir and running `bun
install` + `vite build` there, plus structural fixtures in `init.test.ts` /
`create.test.ts`. Next.js, TanStack Start, React Router, Expo, and monorepo
orchestrators are **not advertised** — unsupported targets are recorded here,
not implied. Pre-publish the deps are `file:` against your checkout (the
registry names 404 until the first publish); `--registry` emits the
versioned names for post-publish use.

`--pm bun|npm|pnpm|yarn` (default `bun`) selects the scaffold instructions;
`--preset <id>` (default `material-3`) pins the preset into `kern.json` so
later commands resolve against the user's preset. `kern add` reads both
back; it never rewrites `kern.json`.

## Install modes

Mode 1 (`kern add`) vendors component installs — `add.ts` (copy +
receipt), `closure.ts` (transitive relative-import closure), `manifest.ts`
(registry seam over `packages/mcp/src/manifest.ts`), `kern.ts` (CLI entry).
Web is the default; `--platform native` vendors the native row (Metro and
font setup ride in the printed instructions). Blocks are web-only in this
release — a block with no native manifest is refused aloud. Components
upgrade through the component planner, blocks through the block planner.
Customized files are preserved, never overwritten.

Mode 2 needs no command: `bun add @xoroh/kern` for the versioned dependency.

## Feedback (F1 Preview)

`kern feedback --category <bug|improvement|docs|compatibility|discovery>
--title <t> --description <d> [--component …] [--evidence … --consent]
[--dry-run]` validates against the shared `FeedbackReport` schema, discloses
exactly what would be stored, and saves to `.kern/feedback/` — then prints a
pre-filled GitHub issue URL the human files by hand. Nothing is sent
automatically, ever. `kern feedback digest` prints an evidence-linked
grouping for human triage (advisory only); `kern feedback prune [--days N]`
deletes inbox entries older than N days (default 90). Privacy: evidence
requires `--consent`; no secrets, telemetry, or personal data is collected;
retention is 90 days, deletion explicit. Transport: GitHub Issue Form
(`.github/ISSUE_TEMPLATE/kern-feedback.yml`); scope is CLI-only.
