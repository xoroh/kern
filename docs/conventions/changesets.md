# Changeset policy

Status: current

Every change to a published package carries a changeset, in the same commit.
The workflow that consumes them lives in [`../releases.md`](../releases.md);
this page is the rule for writing one.

## When a changeset is required

| Change | Changeset |
| --- | --- |
| Public API of any `packages/*` package (added, removed, or re-typed export) | yes |
| Behavior, visual output, or token values of a published package | yes |
| New dependency or a changed peer range | yes |
| `packages/*/package.json` `exports`, `files`, `sideEffects` | yes |
| Tests only, inside a package | no |
| Comment or JSDoc only, no behavior change | no |
| `docs/`, `.agents/skills/`, `AGENTS.md`, root markdown | no |
| `scripts/**`, `.github/**`, CI config | no |

Rule of thumb: if a consumer upgrading the package could observe a
difference, it needs a changeset.

## Choosing the bump

- **patch** — bug fix, no API surface change.
- **minor** — a new export, a new optional prop, a new component, a new
  theme preset. Anything additive.
- **major** — a removed or renamed export, a changed prop type, a dropped
  platform. Kern is pre-1.0, so this is rare, and `0.x` majors still ship
  as `0.x.0` until `1.0.0`.

While on `0.x`, treat breaking changes as normal and land them as minors with
a changeset body that says what broke — consumers are told to track latest.

## Naming the packages

List exactly the packages whose **published surface or behavior** changed.
A change confined to `packages/kern/src/components/button.tsx` needs
`"@xoroh/kern": patch` only. Adding a component that depends on a token
change in `kern-tokens` needs both:

```md
---
"@xoroh/kern": minor
"@xoroh/kern-tokens": patch
---

Button: add `variant="tonal"`; `surface-tonal` role value adjusted for 4.5:1
on `surface`.
```

Multiple packages in one changeset is normal and expected — that is what the
packages split produced. Do not list a package just because it was touched
in the working tree.

`@xoroh/cli` is `private: true`. Changesets may name it (it versions
internally) but it never publishes.

## Writing the body

The body becomes `CHANGELOG.md` verbatim and is the only release note a
consumer reads. Write for someone upgrading:

- Lead with what changed, named concretely (`Button`, `TopAppBar`,
  `surface-tonal`) — not "various improvements".
- Say what breaks, and the migration, when anything does.
- No commit hashes, no PR numbers, no "see the diff".

Good:

```md
---
"@xoroh/kern-native": minor
---

Native composition: `NavigationDrawer` and `BottomSheet` ship in
`kern-native`. Mount `KernThemeProvider` before rendering them — outside a
provider they resolve the static light scheme.
```

Bad:

```md
---
"@xoroh/kern": patch
---

fix stuff
```

## The failure mode to avoid

A non-changeset markdown file in `.changeset/` breaks the whole release
toolchain: `changeset status` and `changeset version` both throw on parse,
so nothing versions and nothing publishes — with an error that points at a
parse failure, not at the stray file.

Before merging, run:

```bash
bun x changeset status
```

It exits non-zero if any file in `.changeset/` is malformed. If it throws
inside `@changesets/parse`, inspect every `.changeset/*.md` file's front
matter: it must be either a valid changeset (package names + bump) or
deleted. Issue templates and notes do not belong in that directory.

Only `.changeset/config.json` and real changesets live in `.changeset/`.

## Verifying

```bash
bun x changeset status   # parses cleanly, lists pending bumps
bun run check:publish    # publint + are-the-types-wrong, all 6 packages
```