# 09 — Onboarding: CLI + MCP + skills + system choice (lane R8 verdict)

**Goal:** the cleanest, fastest adoption path: choose system (M3 only today, own part with all rules + spec links)
→ install → use components. Each surface documents its use cases; show/hide policy enforced.

**Research verdict:** CLI fully implements Mode 1 (`add.ts`/`closure.ts`/`manifest.ts`/`kern.ts`, TS-compiler-API
closure "real parsers, not import-regexes" `closure.ts:8-9`, receipts forward-designed for `diff`/`upgrade`
`add.ts:10-11`) but README says "not implemented" (`kern-cli/README.md:1-6`; contradiction recorded
`docs/architecture.md:30`, tracker row 9 `docs/plan/README.md:28` "not planned"). Receipts refuse mixed versions
(`add.ts:154-158`), never auto-merge (`:108-114`); `kern list`/`diff`/`upgrade` referenced but nonexistent
(`add.ts:87-89`). MCP 5 tools (`mcp/src/index.ts:48-147`): list_components / get_component / get_tokens /
list_themes / design_audit + skill router (`kern-agents/SKILL.md`: llms.txt → per-page .md → mcp/index.json →
server → skill; never memory `:31-32`). Skills: `kern` authority (decision tree `:75-92`, anti-patterns `:116-127`,
12-category audit `:129-146`, 4-clause completeness `:13-40`) + `docs` upkeep (`change-routing.md`, done-ness).
Portability seam: second system honors `ManifestRow {name, export, platform, path, status}` (`kern-cli/src/
manifest.ts:16-22`; publish-time swap to bundled manifest documented `:1-11`).

**Design:** onboarding flow pages (choose → install → first screen), M3 part (roles/type/shape/elevation/motion/
states + spec links, references out to m3.material.io), use-case pages per surface. Same shell, docs domain.

## Work items (ordered)

- [x] P0-truth: CLI README + tracker row 9 tell the truth (Mode 1 shipped, unpublished); never direct users at lies.
- [x] MCP defects to MCP lane: native import string (`@xoroh/kern/native` vs parity-doc `@xoroh/kern-native`) +
      `get_tokens` missing `compact` (pipeline ships it — `docs/architecture.md:98`).
- [x] Use-case pages: CLI (scaffold shell `add`×N / single-component hybrid / `--self-contained` eject /
      Mode 2 `bun add` / receipt-audit-future-as-coming); MCP (inventory / pull-source / compare-presets /
      discover-themes / audit-screen); skills (zero-to-screen loop / compliance audit / correct authoring /
      docs-routing). Landed `/docs/use-cases` (`routes/docs/use-cases.tsx`, nav leaf "Use cases"): one section
      per surface, real tool/command names (list_components → design_audit, kern init/add, kern-agents/kern/
      docs skills), receipt-audit explicitly labeled coming. Includes the P5 block add (`kern add <block>`).
- [x] System-choice step: Mode 1 vendored vs Mode 2 depended up front (`kern.ts:10-11` dual delivery); M3 part
      with all rules; system #2 plugs via `ManifestRow` without rework. Landed: "Choose a system" leads the page —
      Mode 1 (vendored, hybrid/self-contained) vs Mode 2 (depended) side by side with real commands, M3 named as
      the system with the Foundations rules + spec links, and the `ManifestRow` seam recorded as the system-#2
      plug (no rework, none ships today).
- [x] Show/hide policy: show install/live/presets; `kern list`/`diff`/`upgrade`, MCP `KERN_REPO_ROOT` bundling
      (`mcp/README.md:30-34`), maturity-Preview-0.0.0 (`maturity.ts:8-10`) shown as coming/current — never as
      available. Extend the no-`kern-add`-tab precedent (`component-page.tsx:477`). Landed: "What is available,
      what is coming" two-column policy on the same page + an Admonition ("Coming is not available") naming the
      install-picker precedent; kern list/diff/upgrade, KERN_REPO_ROOT-free bundling, 0.1.0 publish and receipt
      audits sit under Coming; install/live/presets/receipts/MCP/skills under Available. Verified: CLI usage
      text already names diff/upgrade as step 3, never as shipped.

**Gates:** `check:docs` chain, skill-table tests, CLI smoke (`add.test.ts`).
**Out of scope:** building `kern list`/`diff`/`upgrade` (document as coming); foreign-system onboarding.
