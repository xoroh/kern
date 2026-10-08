# Part 09 — Onboarding (CLI / MCP / skill)

> NOTE: R8 lane report unreadable at synthesis time (history API outage). Content below follows the synthesis contract only; full file paths TBD pending lane-report recovery.

## Goal

Ship onboarding for the three use cases (CLI, MCP, skill), place the M3 system part, enforce the show/hide policy, and close the three truth-pass jobs.

## Research verdict

Onboarding is organized by use case rather than by tool: CLI, MCP, and skill each get a path, the M3 system part anchors the design story, a show/hide policy keeps progressive disclosure consistent, and three known truth-pass defects are fixed so onboarding never teaches a lie.

## Work items

- [ ] CLI use-case path (install → first run; paths TBD).
- [ ] MCP use-case path (server setup → first tool call).
- [ ] Skill use-case path (skill install → first invocation).
- [ ] Place M3 system part (location per R8 spec).
- [ ] Enforce show/hide policy (what is visible by default vs. disclosed).
- [ ] Truth-pass job: fix CLI README lie.
- [ ] Truth-pass job: fix MCP import-string defect.
- [ ] Truth-pass job: compact `get_tokens`.
- [ ] Gate: all three paths runnable end-to-end from a clean checkout.

## Design

M3-based onboarding pages: shared chrome (docs shell, stepper/progress pattern) is identical for CLI/MCP/skill; domain chrome is the per-use-case content (commands, configs, transcripts), with show/hide disclosure applied uniformly.

## Gates

- Three paths verified clean-checkout; M3 part placed; show/hide policy applied; truth-pass jobs closed.

## Out of scope

- Docs-shell internals (Part 03), demo coverage (Part 07).
