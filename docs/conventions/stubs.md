# Stub policy

Status: current

A stub is a planned component that exists as a file but is not implemented.
Stubs let the roadmap name a surface before the work lands. They must be
obvious, unwired, and impossible to mistake for shipped code.

## Definition

A file is a stub when its source contains the marker string
`not implemented yet`. The inventory generator keys on exactly that string:

```js
const isStub = src.includes("not implemented yet");
```

Changing or removing the marker changes what `bun run generate:components`
reports, so treat the phrase as reserved syntax.

## Rules

1. **A stub throws on render.** It is a real module with a real export
   signature, so types stay honest — but calling it fails loudly.
2. **A stub is never wired into a barrel.** `index.ts` only re-exports a
   component whose implementation landed, with docs and a changeset in the
   same change. A stub that is exported is a bug.
3. **A stub has no tests.** Testing a throw is ceremony. Tests arrive with
   the implementation.
4. **A stub is never documented as available.** The site, the skills, and
   the package README describe only real components.
5. **Ship or delete.** The system law is hard cuts over deprecation
   machinery: a stub that is no longer planned is deleted outright, not left
   as a placeholder or turned into a warning shim.

## Why unwired

The inventory distinguishes `real` (implemented **and** exported from the
platform entry) from `stub`. That distinction is only meaningful if the two
cannot be confused at the import site. A stub that resolves at
`@xoroh/kern` is a component that type-checks and then throws in
production — worse than a missing export, because nothing warns you at
build time.

## Landing a stub

Same change, every time:

1. Implement the component.
2. Delete the `not implemented yet` throw.
3. Export it from the package barrel (`index.ts`) with its props type.
4. Add tests beside the file (`packages/kern/src/components/button.test.tsx` web,
   `packages/kern-native/src/components/button.rntest.tsx` native).
5. Add a changeset (see [`changesets.md`](changesets.md)).
6. Run `bun run generate:components` to refresh `docs/components.md`.
7. Update the site page and the parity page if coverage changed.

Steps 3 and 6 are what flip the status. Skip either and the docs keep
claiming a surface that does not exist.

## Current state

Zero stubs ship today: every component in `packages/kern/src/components/`
and `packages/kern-native/src/components/` is real. See
[`../components.md`](../components.md) for the generated status column.