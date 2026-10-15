---
"@xoroh/kern-contracts": minor
"@xoroh/kern-cli": minor
"@xoroh/kern": patch
"@xoroh/kern-native": patch
"@xoroh/kern-tokens": patch
"@xoroh/kern-icons": patch
"@xoroh/kern-mcp": patch
---

OSS transformation implementation: new contracts package and distributable CLI,
compiled styles, DTCG interchange, and the gate-suite corrections.

- New `@xoroh/kern-contracts` (minor): versioned provider/component/block/
  icon/install metadata types, fail-loud validators, JSON schema artifact.
- `@xoroh/kern-cli` (minor): publishable binary + programmatic API, bundled
  registry/blocks/token-CSS payloads, transactional installs, receipt v2,
  list/diff/upgrade, native platform selection, kern.json project config.
- `@xoroh/kern` (patch): `./styles` compiled entry; `./theme` forwards to the
  token package (the stale kern-theme import is gone); RichTooltip namespace;
  shape-scale radii.
- `@xoroh/kern-native` (patch): Snackbar level-3 dp correction, Fab `lowered`
  variant, no module-scope theme capture.
- `@xoroh/kern-tokens` (patch): canonical shadowDark values, DTCG 2025.10
  export/import/validation, Xoroh compatibility preset, approved M3 baseline
  test values.
- `@xoroh/kern-icons` (patch): account-balance glyph curated (1341 total),
  web render parity suite, distribution proof.
- `@xoroh/kern-mcp` (patch): native source routing fix, icon/block discovery,
  install planning with labelled evidence, DTCG + validate tools.
