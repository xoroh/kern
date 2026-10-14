# Kern 0.1.0 Preview — draft notes (KERN-081)

Status: DRAFT. Publish only with the signed NO-GO checklist and KERN-084
authorization. Nothing here has shipped; every link below is to the tree, not
to a registry.

## What is new

- One Material 3 provider (`m3`) with explicit identity, separate web/native
  renderers, and a capability inventory that reconciles exactly (418 rows).
- Foundations with DTCG 2025.10 interchange: canonical authoring schema,
  normalized graph, validated export/import with roundtrip goldens, and a
  generated `dtcg.json` artifact.
- Distribution that works outside the checkout: compiled `./styles`, token
  adapters, publishable CLI with transactional installs and receipt v2,
  MCP discovery/planning tools, and consumer fixtures proving tarball
  installs end to end.
- Xoroh compatibility preset: the private black-primary/blue-secondary theme
  as an explicit, contrast-gated artifact — migration never silently rebrands.
- Docs site redesign (top header, M3 purple defaults) with verified install,
  upgrade and tool recipes.

## Upgrading

- Package consumers: `bun add @xoroh/kern @xoroh/kern-tokens`, one
  `import "@xoroh/kern/styles"` in the CSS entry. No Tailwind checkout scan.
- Source consumers: `kern add <name>` (hybrid default) or `--self-contained`
  for frozen values; `kern diff` to audit; `kern upgrade --apply` to update
  with owned edits preserved. Identical re-adds are no-ops.
- Theme authors: presets are override-only deltas validated by
  `defineThemePreset`; arbitrary role tables are rejected with the reason.

## Known limitations (not deferred — stated)

- Native one-sided elevation rows (13 sheet/menu/select concepts) are
  measured and reported, not yet adopted on the renderer.
- Device/simulator and screen-reader passes have not run. The migration
  tooling that shipped in-repo (codemod, leak gate, preset) stands on its own
  fixtures; no rollout is scheduled.
- 19 dependency advisories in the toolchain graph await triage (see NO_GO.md);
  none is in the shipped component runtime path.
- `scopedDeltas` theme projection covers standard contrast; nested
  preset+contrast propagation is pinned behavior, not extended output.
- The `account-balance` glyph was curated late in the cycle; consumers on
  older icon payloads resolve it to null (with dev warning), never wrong.

## Rollback

Revert only reviewed changes through normal reviewed changes. Never restore
by destructive checkout.
