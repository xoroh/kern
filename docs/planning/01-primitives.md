# 01 — Primitives standalone (lane R1 verdict)

**Goal:** anyone can install and use `@xoroh/kern-primitives` without the kern ecosystem, find it by
searching "React Native headless primitives", and read per-module docs on its own subdomain.

**Research verdict:** shippable by construction today (only peer is `react >= 18` —
`packages/kern-primitives/package.json:46-48`; boundary over transitive closure bans tokens/renderers —
`scripts/check-primitives.mjs:1-60`; dual ESM/CJS + `publint`/`attw` — `package.json:19-44`), but invisible:
no nav section (`apps/site/src/systems/nav.ts:33-191`), README covers ~7/15 modules, description never says
"React Native", version `0.0.0` un-pinnable. Every kernel module returns data/decisions with the renderer
binding platform events (slot `slot.ts:13-24`, press `press.ts:14-20`, presence `presence.ts:15-21`, portal
`portal.ts:15-21`, dismiss `dismissPolicy.ts:21-30` + `dismissWiring.ts:13-25`) — adapter-ready by design.

**Design:** P domain = "Primitives" brand (renderer-agnostic kernel + RN-standalone install path). Per-module
pages (anatomy + API + example, Radix-style), install-first landing, M3-neutral chrome.

## Work items (ordered)

- [x] P0-truth: `kern-primitives` keywords + "React Native" in `package.json:2-4` description (searchability).
- [x] G2: README documents all 15 modules (missing today: a11y, dismissWiring, focusTrap, portal, positioning,
      presence, press, slot, time) + one usage example per kernel module, not just `useRovingModel`.
- [x] G1: decide subpath exports (`@xoroh/kern-primitives/presence`) vs documented barrel-only (`package.json:23-33).
      **Ruled 2026-10-09: barrel-only until 1.0.** Tree-shaking (`sideEffects: false` + ESM) already gives
      bundlers per-module granularity, so subpaths buy nothing today and cost a frozen export path per module
      (tsup multi-entry, per-subpath publint/attw, gate updates). Revisit when a consumer demonstrates a need
      tree-shaking cannot serve.
- [x] G8: route native Button through `useKernPress` (`presentation.tsx:228-244`) + slot-merge for icon slot
      (`button.tsx:230`) — today `kern-native/src/components/button.tsx:1-14` imports zero kernel modules while
      siblings (sheet-surface, dialog, tooltip, icon-button) already consume it.
- [x] G7: publish/document the binding contract (today `presentation.tsx:1-17` bindings are not barrel-exported).
      Document half landed (`docs/binding-contract.md`); publish half is founder-gated, out of scope here.
- [ ] G3/G4: primitives subdomain (install `bun add @xoroh/kern-primitives`, per-module pages, new
      `primitives-nav.ts` in `NavSection` shape); P links to C's `/components/mobile/*` for themed components.
- [x] G5: versioning story (publish — unblocks pinning). (`docs/versioning.md`; describes, never executes.)
- [x] G6 (above) + getting-started step 6 (`getting-started.tsx:72-89`) moves to P as "install without ecosystem".
- [ ] G3/G4: primitives subdomain (install `bun add @xoroh/kern-primitives`, per-module pages, new
      `primitives-nav.ts` in `NavSection` shape); P links to C's `/components/mobile/*` for themed components.
- [ ] G5: versioning story (publish — unblocks pinning).
- [ ] G6 (above) + getting-started step 6 (`getting-started.tsx:72-89`) moves to P as "install without ecosystem".
- [ ] 2nd-library adapter: **react-native-reusables (`@rn-primitives/*`)** — only headless-behavior fit (Slot/Presence/
      Portal/dismiss map 1:1; no compiler, no token engine; siblings Dialog/Menu/Popover/Tooltip scale with one
      recipe). Preconditions: G8 + G7 done + live-verify `Slot`/`Portal`/`asChild` exports. Rejected: gluestack
      (token engine fights `kern-tokens`), tamagui (compiler + system), dripsy/unistyles (styling, wrong category).

**Gates:** `check:primitives`, `check:pack`, `publint`/`attw`, `check:dist-exports`.
**Out of scope:** foreign design-system adapters; second role table (never).
