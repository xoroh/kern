# Decisions

> Rule: the roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

Status: current. Date: 2026-10-16.

- Vision: [`../VISION.md`](../VISION.md). Roadmap (single source for planned work): [`../architecture/kern-axis-migration-and-roadmap.md`](../architecture/kern-axis-migration-and-roadmap.md). Earlier ADRs: [`../adr/`](../adr/) (001–006).
- This folder records owner decisions dated 2026-10-16. Each file has context, decision, rationale, status, date. The roadmap §I remains the execution register; these files are the durable record, not a second plan.

| ADR | Decision | Roadmap link |
| --- | --- | --- |
| [007](007-axis-native-foundation.md) | Axis is the native foundation; `kern-primitives` dropped once Axis is ready | D-FOUNDATION-CHOICE, D-DEP |
| [008](008-system-scoped-urls.md) | System-scoped URLs (superseded: tabs URL per 018, no redirects per 020) | D-STRUCTURE |
| [009](009-generated-registry-and-system-flag.md) | One generated component registry feeding site, CLI and MCP, plus `--system` | D-STRUCTURE |
| [010](010-kern-m3-rename-and-no-global-registration.md) | Rename `kern-material-3` to `kern-m3` (hard rename, no alias); `@xoroh/kern` does not register M3 globally | D-STRUCTURE |
| [011](011-install-docs-release-availability.md) | Install docs: npm commands marked “available at release”, source install primary until publish | D-RELEASE (hold) |
| [012](012-cli-publishable.md) | Kern CLI is publishable in 0.1.0 | D-CLI-PUBLISH |
| [013](013-docs-depth.md) | Docs depth: full pages for top 20, correct thin pages for the rest | D-DOCS-DEPTH |
| [014](014-button-variant-names.md) | M3 button variant names (hard cut, no deprecation) | D-BUTTON-NAMES |
| [015](015-state-props-base-ui-names.md) | State props follow Base UI names (`checked`, `pressed`) | Parity / contract |
| [016](016-hct-tonal-palettes.md) | M3 colors use HCT tonal palettes and full color roles | D-HCT |
| [017](017-per-system-packages.md) | Per-system preset package plus per-platform widget packages | D-STRUCTURE |
| [018](018-component-page-tabs.md) | Docs one page per component at `/components/<system>/<name>` with Web/Native tabs (supersedes 008) | D-STRUCTURE |
| [019](019-ai-chat-in-kern.md) | AI chat styled parts and blocks live in Kern, voice deferred | — (placement) |
| [020](020-no-backward-compat.md) | No backward compatibility before the first public release (0.1.0 Preview) | Owner rule |
