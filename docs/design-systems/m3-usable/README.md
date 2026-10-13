# m3-usable — curated M3 data for making Kern correct

Small, committable extracts from the full local M3 archive
(`docs/design-systems/m3-archive/`, git-ignored, ~5 GB, stays on disk).
The archive is the evidence locker; **this folder is the workbench**:
every file here exists to answer "what does M3 actually specify?" while
building or auditing Kern.

## Layout

| Path | Content | Built from |
|------|---------|------------|
| `tokens/` | `color.md` (every sys role → palette → light/dark hex), `typescale.md`, `shape.md`, `elevation.md`, `motion.md`, `state.md` | `code/material-web/tokens/` + `versions/v0_192/` |
| `components/*.md` (36) | Full page texts (overview, specs, guidelines, accessibility), key dp measurements, illustration files resolvable to `m3-archive/illustrations/files/` | `spec/components/<name>/{overview,specs,guidelines,accessibility}/` |
| `foundations/` | layout, interaction, content-design, design-tokens, designing, writing, building-for-all, overview, usability, customization, glossary | `spec/foundations/…` |
| `styles/` | color, typography, shape, elevation, motion, icons, spacing | `spec/styles/…` |
| `react-native-paper.md` | Paper v6 theme files, MD3 theme keys, component inventory | `code/react-native-paper/src/` |
| `parity-gaps.md` | M3 part → Kern status (**B**/W/N/G/R) + system-level gaps | kern tree (generated 2026-10-10 — verify before planning) |
| `tools/extract.py` | the generator (reads archive, writes here, never touches archive) | — |

## How to use it for Kern correctness

1. **Tokens:** compare `tokens/*.md` against `packages/kern-tokens/src/tokens.json`
   (via `.agents/skills/kern/references/kern-tokens.md`). Any value that
   differs is either a declared Kern deviation or a bug.
2. **Components:** before touching a Kern component, read its
   `components/<name>.md` — measurements, states, color roles, a11y target
   sizes — then check the implementation. Discrepancies go to `parity-gaps.md`.
3. **Pictures:** illustration lines point at
   `../m3-archive/illustrations/files/<sha>.<ext>` (content-addressed).
   The archive is local-only; do not link it from committed docs — describe,
   don't embed.
4. **Gaps:** `parity-gaps.md` is generated, not gospel. Confirm each row
   against package exports and `docs/design-systems/matrix.md`.

## Regenerating

```bash
python3 docs/design-systems/m3-usable/tools/extract.py
```

Safe to re-run any time (deterministic, overwrites this folder only).
If the archive is refreshed (new SHAs in `m3-archive/manifest.json`),
re-run and diff.
