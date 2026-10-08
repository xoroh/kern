---
"@xoroh/kern-mcp": patch
---

Fix the token tools and harden the agent on-ramp.

`get_tokens` and `list_themes` read token data from `packages/kern/*`,
which does not exist — tokens ship in `@xoroh/kern-tokens` — so both tools
failed even inside the monorepo with `KERN_REPO_ROOT` set. They now resolve
against `packages/kern-tokens` (`src/tokens.json`, `src/themes/*.json`).
`get_tokens` accepts the real catalog ids (`kern`, `sharp`, `brand`,
`compact`, `demo` plus `base`; `m3` still resolves as the legacy alias for
`kern`) instead of the stale enum that named a nonexistent `m3.json` and
omitted `kern`/`demo`. `design_audit` carries all twelve `kern` skill audit
categories (adds Navigation, Content). Tool handlers move to `src/tools.ts`
so the zero-to-screen loop test can import them without starting the server;
`src/index.ts` is wiring only, payloads unchanged.
