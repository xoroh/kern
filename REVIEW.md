# Kern UI — Strict Review (v2, merged) — LIVING DOC

> ## AGENT PROMPT — copy/paste to re-run this review independently
> ```
> You are doing an independent strict re-audit of kern/ (open-source design-system base).
> Do NOT trust REVIEW.md below. Re-verify every claim from source + by running commands.
>
> 1. Baseline: `git log --oneline -3`, `git status --short`. Note the audited commit.
>    Run at clean HEAD (stash -u if dirty, pop after):
>    - from kern/: `bun run lint`
>    - from packages/kern/: `bun run typecheck`, `bun run test`, `bun run build`
>    Record exact output. If dirty-tree files break green, say so with filenames.
> 2. Re-check every BLOCKER §1–§21 + component/OSS/test sections with file:line evidence:
>    grep `var(--`, hardcoded hex, `@theme`, `tailwindcss`, `data-disabled` vs `disabled:`,
>    `indeterminate`, `aria-describedby`/`aria-invalid`, `{...props}` order, `hitSlop`,
>    `StyleSheet.create`, `Platform`, `aria-invalid` in RN types, tokens.json counts,
>    skill phantom symbols, apps/site scripts + dead links, MCP manifest exports,
>    license/author/files/peers/export-conditions/prepare/publint, tsconfig types split,
>    React peer range, test-double stub vs real renders.
> 3. For EACH item mark exactly one: ✅ FIXED (with commit + proof) | ❌ STILL OPEN (fresh evidence)
>    | ⚠️ PARTIALLY FIXED (what remains) | 🗑️ OBSOLETE (why no longer applicable).
>    Disagree with the old review wherever evidence says so — never accept it on faith.
> 4. Then UPDATE this file in place:
>    - Move ✅ FIXED items to `## Fixed log` (keep one line: what + commit + proof, delete the full section).
>    - Delete 🗑️ OBSOLETE items entirely.
>    - Shrink ⚠️ items to only the remaining sub-issue.
>    - Keep ❌ items with updated file:line + count.
>    - Update `Verified ground truth` table + header audit line (v3, v4… date + commit).
>    - Re-prioritize `Prioritized roadmap` so Blocking = only what is still open.
> 5. Rules: no code fixes in this pass (audit only), no new files unless asked,
>    keep `file:line` citations, keep this prompt block untouched.
>    Goal: repeat until Blocking is empty — that is "perfect".
> ```
>
> Audit v1: 2026-09-28 at commit `5e2a2f9` · Audit v2 (second agent, independent): 2026-09-28, re-verified at `5e2a2f9` + dirty-tree check.
> Audit v3: 2026-09-28 at `fb94d1a` + `3cd749c`, clean tree. All commands re-run; counts corrected.
> v2 keeps every v1 claim that re-verified, corrects counts/wording where v1 was slightly off, and adds §15–§21 (new blockers v1 underweighted).
> Living doc: re-run with the prompt above, move fixes to ## Fixed log, delete obsolete — repeat till Blocking is empty.

## Fixed log

> Move ✅ FIXED items here on each re-run. One line each: `YYYY-MM-DD @<commit> — §N title — proof (e.g. tokens.css now has 26 roles, grep var(-- = 34 hits)`. Delete the full blocker section when moved. Blocking is "perfect" when empty and this log holds everything.

- 2026-09-28 @fb94d1a — license wording Apache-2.0 (root README, skills line).
- 2026-09-28 @fb94d1a — CONTRIBUTING numbering 4,5,6.
- 2026-09-28 @fb94d1a — releases.md inlines TODO content, dead pointer dropped.
- 2026-09-28 @fb94d1a — manifest parses real exports (phantom Radio gone, vocab real|stub).
- 2026-09-28 @fb94d1a — cli package.json placeholder; site license; author/repo/homepage/bugs ×3.
- 2026-09-28 @fb94d1a — emdash enum tonal; README d1() import fixed.
- 2026-09-28 @fb94d1a — toolchain pinned (packageManager bun@1.3.8, engines, CI 1.3.8 ×2); root typecheck/test/build via --filter.
- 2026-09-28 @fb94d1a — tsconfig.build excludes *.rntest.*; native aria-invalid removed (RN drops it silently), FieldMessage-handoff comment.
- 2026-09-28 @fb94d1a — M3 metrics (buttons h-10, fields h-14) + skill value updates; Biome kept, TS 5.9 pin.
- 2026-09-28 @fb94d1a — native executes: Jest + RN 0.87 manual preset (mock bridge, haste→Platform map, IS_REACT_ACT_ENVIRONMENT), 4 render tests green.
- 2026-09-28 @3cd749c — manifest native-button true-dupe eliminated (27 entries, zero dupes, lint-clean generator).

---

## Verified ground truth (amended)

v1 ran everything at the clean commit. v2 re-ran and confirms — **with one scoping correction**:

| Command (run where) | v1 result | v2 result |
|---|---|---|
| `bun run lint` from `kern/` (root, `biome check .`) | ✅ clean, 70 files | ✅ confirmed **at clean `5e2a2f9`** (`Checked 70 files… No fixes applied`). Current dirty tree **fails** — see below |
| `bun run typecheck` from `packages/kern` (`tsc --noEmit`) | ✅ clean | ✅ at clean commit. Dirty tree **fails with 6 errors**, all from untracked `src/react-native/components/button.rntest.tsx` (`Cannot find name 'describe'/'it'/'expect'`, `Cannot use namespace 'jest'`) |
| `bun run test` from `packages/kern` (vitest) | ✅ 32 tests / 13 files | ✅ confirmed (13 passed, 32 passed) |
| `bun run build` from `packages/kern` (tsup + `tsc -p tsconfig.build.json`) | ✅ succeeds | ✅ confirmed (ESM + CJS success) |

**New finding (v2): the green baseline is fragile.** At time of v2 the tree was dirty:

```
M bun.lock, M packages/kern/package.json
?? REVIEW.md, ?? packages/kern/jest.config.cjs, ?? packages/kern/jest.setup.cjs
?? packages/kern/src/react-native/components/button.rntest.tsx
```

That single untracked `.rntest.tsx` breaks `typecheck` and root `lint`. `packages/kern` has no `lint` script; root has no `typecheck`/`test`/`build` scripts — commands only work from specific directories. Recommendation: add root orchestration scripts, make `tsconfig.build.json` exclude `*.rntest.*`, and either wire or delete the stray jest/rntest files (see §18).

**v3 ground truth (clean tree @fb94d1a):** `bun run lint` → 82 files clean. `bun run --filter @xoroh/kern typecheck` → clean. `bun run --filter @xoroh/kern test` → 13 files / 32 tests pass. `test:native` (Jest) → 4 pass. `bun run --filter @xoroh/kern build` → ESM+CJS+dts success. `bun run --filter site typecheck` → exit 0. tsconfig.build excludes `*.rntest.*` ✓. Root scripts exist ✓. `tsc -p tsconfig.build.json` still not in CI; `tsconfig.json types:["node","jest"]` vs build `types:[]` split remains.

---

## The one sentence (unchanged, v2 endorses)

**Kern is an excellent skeleton wrapped around a system that doesn't exist yet.**

Plumbing (monorepo, changesets, CI permissions, biome, exports map, progressive-disclosure skills) is well-built. The *actual design system* — tokens, theming, role layer, and 13 reference documents describing all of it — is roughly 15% implemented, while docs describe it as 100% shipped. An agent loading `.agents/skills/kern` will confidently write code that cannot run.

---

## What's actually strong (v2 endorses, no change)

- **No `any` anywhere** in either platform. Literal unions throughout, correct `cva` / `VariantProps` usage.
- **`src/react/**` has zero hooks.** No `useState`, `useEffect`, `useRef`, `useId`, no `Math.random`, no `Date.now`. Pure presentational layer → trivially SSR-safe and hydration-stable.
- **`cn` mechanics are correct** — `twMerge(clsx(...))` genuinely collapses the `error` border over the base border (verified by SSR dump). Merge order `cn(base, className)` then `{...props}` last is the right precedence.
- **The OKLCH → sRGB token decision is right.** Canonical OKLCH for web math, compiled hex for React Native, `#0b0b0c` / `#f5f5f4` naming. Real design-system thinking.
- **CI permissions are least-privilege and correct.** `contents: read` on CI (`ci.yml:9-10`); `contents:write + pull-requests:write + id-token:write` on release. `publishConfig.provenance: true` on `@xoroh/kern` and `@xoroh/kern-mcp`. Most OSS repos get this wrong. Amendment: `@xoroh/kern-emdash` (third publishable package per `docs/releases.md:3-5`) has **no `publishConfig` at all** — so "both" is 2-of-3, and the one without provenance is the one that publishes unbuilt TS (§OSS).
- **Skill files are structurally textbook** — valid frontmatter, correct progressive disclosure, both under the 150-line budget, all relative links resolve.
- **`file-ownership.md`'s layer model matches reality.** Every native import checked: zero cross-layer violations.

---

# BLOCKERS (v1 kept, v2 corrections inline)

## 1. The token system is disconnected from every component — AGREE (v2 re-verified)

```
$ grep -rn "var(--" packages/kern/src/react packages/kern/src/react-native | wc -l
0
$ grep -c "#dc2626\|#efefef\|#e5e5e5" packages/kern/src/react/components/*.tsx → 15 hardcoded hex
$ grep -rn "@theme" --include=*.css . → nothing (only README + skill refs)
$ grep -rn "tailwindcss" --include=package.json . → nothing (only tailwind-merge, a string util, not a compiler)
```

- `tokens.css` is **13 lines, 6 variables, zero color roles** (`--kern-neutral-800/-blue-600/-background/-foreground/-accent/-radius` only).
- `SKILL.md:91` says *"Don't hardcode colors — use `var(--md-sys-color-*)` roles."* **No `--md-sys-*` variable exists.**
- `packages/kern/README.md:14` says *"Requires Tailwind CSS v4: map utilities to roles with `@theme inline`."* Tailwind isn't a dependency, there is no `@theme` block, no compiler ever runs — class strings are never validated.
- `README.md:73-74` *"Same components, swapped tokens"* is false. Dark mode, four contrast modes, `m3`/`sharp`/`brand` presets are structurally unreachable.
- All 13 components emit `kern-*`; **zero CSS rules target `.kern-*`** — dead escape hatch.
- `tokens.json` = 21 palette steps + 4 base = **25 hexes, 5 hues** (neutral 11, blue 5, red 2, green 1, amber 2). No spacing/typography/shape/elevation (see §10).

**Root cause. Everything theming/token/docs/agent is downstream of it.**

## 2. `tokens.ts` says "Regenerate — do not hand-edit" — there is no generator — AGREE

`tokens.ts:1-3` + `tokens.json:2` describe a pipeline that does not exist. No codegen script, no equality test. Values happen to be in sync (25/25 verified) **by luck**. First hand-edit silently diverges web vs native. Root `package.json` has `culori` but nothing wires it.

**Fix:** `scripts/gen-tokens.mjs` (json → ts + css), run in `prebuild`, add `tokens.json ≡ tokens.ts ≡ tokens.css` test.

## 3. `Checkbox` draws a checkmark when it's indeterminate — AGREE

`checkbox.tsx:17-36` — Base UI renders `Indicator` on `checked || indeterminate`; SVG path is hardcoded check with no `data-indeterminate:` branch; `grep indeterminate src/` → 0. Parent "select all" announces `aria-checked="mixed"` and draws ✓. Fix: `data-indeterminate:` dash/minus branch.

## 4. Disabled styling is dead CSS on 3 of 5 form controls — AGREE

`checkbox.tsx:12`, `switch.tsx:12`, `radio-group.tsx:32` use `disabled:` on `<span>`/`<label>` roots (`CheckboxRoot`→`<span>`+hidden input, `SwitchRoot`→`<span>`, `RadioGroupItem` puts className on `<label>`, inner radio `:36-41` has no disabled variant). `:disabled` never matches. `grep data-disabled src/react` → 0, though Base UI emits it. SSR dump confirms `aria-disabled="true" data-disabled` with no `disabled` attr → **pixel-identical to enabled**. Fix: `data-disabled:` (Button/Chip/Input/Textarea use native elements so `disabled:` is valid there — scope fix to the 3).

## 5. `Chip`'s `selected` is a silent no-op for 2 of 3 variants — AGREE

`chip.tsx:12` only `filter` declares `data-selected:` styles; `:32` gates `aria-pressed` on `variant==="filter"`; `:16-19` `selected:{true:"",false:""}` is type-only widening. `<Chip variant="assist" selected>` sets `data-selected` + does nothing. Native `chip.tsx:65` handles all variants; web does not. Also controlled-only (no `defaultSelected`/`onSelectedChange`).

## 6. No form composition layer — `FieldMessage` is orphaned — AGREE

- `aria-describedby` appears **exactly once repo-wide**: README example pointing at an id nothing generates; 0 hits in `src/`.
- `aria-invalid` only on Input/Textarea, placed **before** `{...props}` (`input.tsx:12` vs `:18`) so consumer `aria-invalid={false}` defeats the red border. Checkbox/Switch/RadioGroup have **no error prop** — validation errors unannounced.
- Split convention: `error?:boolean` vs `FieldMessage variant="error"` (which alone sets `role="alert"`). Consumer must set both, impossible on 3 controls.
- `@base-ui/react/{field,fieldset}` ships in `node_modules`, **0 imports in `src/`**. Adding `Field.Root/Label/Description/Error` dissolves 5 sub-issues at once.

## 7. React Native: `{...props}` spread last silently breaks components — AGREE (v2 refines)

| File | Clobberable | Severity |
|---|---|---|
| `checkbox.tsx:65-72`, `switch.tsx:64-70`, `radio.tsx:105-112` (RadioItem) | `onPress` → control inert, `onValueChange` never fires | 🔴 behavioral |
| `list-item.tsx:46-49` | `style` → `minHeight:56` guarantee void (`styles.test.ts:55-57` certifies a guarantee code doesn't hold) | 🟡 |
| `button.tsx:72-78`, `chip.tsx:62-67`, `input`, `card`, `text`, `divider`, `field-message` | `style` destructured+array-merged (safe); `accessibilityRole/State` still clobberable | 🟡 a11y |

**v2 correction:** Checkbox/Switch type `Omit<PressableProps,"children"|"style">` — so `style` isn't just overwriteable, the component is **unstyleable at type level + still clobberable at runtime** via `...props`. Worse than v1 stated. Fix: spread first, destructure `style`/`onPress`/`accessibility*`, compose handlers.

## 8. React Native: `Input`'s error is invisible to assistive tech — AGREE

`input.tsx:33` uses `aria-invalid`, verified against installed RN 0.87.1 `ViewAccessibility.d.ts` (14 aliases: busy/checked/disabled/expanded/hidden/label/labelledby/live/modal/selected/valuemax/min/now/text — **no `aria-invalid`**; zero hits in RN `Libraries/`). Typechecks via DOM `AriaAttributes` leak, dropped on `RCTTextInput`. Screen-reader users never told field is invalid. Fix: `accessibilityState={{invalid:true}}` + error text linkage + iOS announcement path.

## 9. React Native has zero touch-target compliance and zero press feedback — AGREE

- `hitSlop`: 0 hits. Checkbox 18×18, Switch 52×32, Button 40/32/40, Chip 32 — all under iOS 44×44, no compensation.
- `android_ripple`/pressed-style-fn/`Animated`/`Haptic`: 0 hits. All six Pressables static style → zero visual acknowledgement.
- `StyleSheet.create`: 0 uses (sole mention is comment in `index.ts:2`); 12 style fns allocate fresh objects per render; `React.memo`: 0.
- `switch.tsx:38` `alignSelf: on ? "flex-end"` is **RTL-broken** (should mirror in RTL).
- `input.tsx:11` hardcodes `height:56`, no `multiline` branch, no `textAlignVertical` → multiline renders as 56dp box, Android text mis-centred.

## 10. `tokens.json` has no spacing, typography, shape, or elevation — AGREE

Only `palettes`+`base`. Every `16/999/8/0.12/11/14` in native is a magic number. Native reads raw palette steps, not roles → theme presets structurally impossible on native. Radius lives in `themes/m3.json`, not tokens.

## 11. Web↔native color drift, certified by the test suite — AGREE

| Intent | Web | Native |
|---|---|---|
| Button `tonal` / Chip `assist` | `#efefef` | `#e5e5e5` |
| Checkbox/Radio/Switch border | `black/20` = `#cccccc` | `#737373` |
| Input border | `#e6e6e6` | `#d4d4d4` |
| Input placeholder | `#999999` | `#a3a3a3` |
| FieldMessage description | `#666666` | `#525252` |

`button.test.ts:22` + `styles.test.ts:38` **assert the drift**. Shared token source exists to make this impossible. Fix: tokenize then delete/rewrite drift-certifying tests.

## 12. The skills document an API that does not exist — AGREE (highest severity)

All rows re-verified, zero hits in `src/` except noted:

| Documented | Reality |
|---|---|
| `--md-sys-color-*` (26 roles × light/dark), `--md-sys-shape-*`, `--md-sys-typescale-*`, `--md-sys-motion-*` | 0 exist |
| `--background/--primary/--secondary/--muted/--sidebar-*` | 0 exist (`--kern-background` ≠ `--background`) |
| `defineVariant/registerVariant/resolveTheme/applyKernTheme/useKernTheme/KernThemeProvider/assertCompleteScheme` | 0 exist |
| `@rn-primitives/*` for dialogs/sheets | not a dependency; no dialog/sheet exists |
| icon registry / icon-name union / generate script | no icon file in repo |
| `elevation.level1-5`, `elevationDp` | 0 exist (only numeric `elevation:8/4` + todos) |
| `space0–space900` | 0 exist |
| `behavior-parts`/`variant-maps`/`variantMap()`/`Parts` | 0 exist — real code uses `cva`; taught in `code-conventions.md:10-31`, the file `SKILL.md:54` routes agents to |
| `md-filled-button`/`md-list`/`md-dialog` ×~28 | `@material/web` not a dependency; copying them yields unrenderable markup |
| `ThemeToggle`/`ContrastToggle` | do not exist |
| "220 swatches — 11 hues × 10 steps" (`SKILL.md:92`) | 5 hues, 21 steps, 25 values |
| `#f6f6f6` canvas (`SKILL.md:39,78,96`) | real `#f5f5f5`; file contradicts itself `:39` vs `:78` |
| `#dcfce7/#fef9c3/#fee2e2/#7f1d1d/#545454/#c7c7c7` | none in `tokens.json` |
| `brand.json` `"TODO: brand primary hex"` as token value; `sharp.json:2` "no private equivalent exists" | shipped verbatim, returned by `get_tokens` |

`m3.json:27-31` admits it in `todo`: *"Land full light/dark role tables."* Skills document as shipped what source marks not built.

## 13. The showcase site exists as scaffold, not a site — PARTIAL (v3)

v1/v2: `apps/docs/index.html` (24 lines) self-declared *"Previews render here once the docs app is wired"*, dead `#tokens` link, no scripts, no `@xoroh/kern` dep, zero CI steps. v3: stub replaced — `apps/docs/` renamed `apps/site/` with a TanStack Start scaffold (router, Tailwind v4, Cloudflare entry, home renders real `Button` variants). Still open: no component pages, no `llms.txt`, no theme switcher. `README.md:7,12` advertises live `kern.xoroh.org` — not yet deployable until those land.

---

# MAJOR — component layer (v1 kept, v2 notes inline)

## Web — AGREE overall

**Correctness:** no default `type` (submit-in-form bug); 9/14 reject `ref` at type level (`ButtonHTMLAttributes` without `RefAttributes`) but forward at runtime via React 19 ref-as-prop — breaks on React 18; `className`-as-function accepted by Base UI types, silently dropped by `clsx`; `RadioGroup` generic erased (`value: unknown`); Chip controlled-only.
**Accessibility:** error color-only (violates own `component-catalog.md:175` error-icon rule); focus `ring-black/40` ≈2.8:1 fails WCAG 1.4.11 3:1 + invisible on dark; placeholder `#999`/`#a3a3a3` fail 4.5:1; `on-success #fff` on `success #16a34a` ≈3.3:1 fails AA while `outline #d4d4d4` documented "3:1" is 1.48:1; web Button 40/32/40 + Chip 32 vs own 48dp rule; `Text` always `<p>`, `Card` always `<div>` (no `as`/`asChild`); `RadioGroupItem` className lands on `<label>` not the circle; `Badge dot` empty span invisible to AT; no group label/error surface.
**Discipline:** `card.tsx` shadow contradicts docs (16px blur vs 30) + violates "shadows floating-only, never standard cards" (v2 note: filled now `0_4px_16px :8`, elevated `0_8px_30px :10` — citation shifted, claim stands); `size="icon"` 40px < 48dp; `text-[13px]` off scale; duplication (focus ring 5×, `disabled:opacity-50` 7×, error border 2×, `border-black/20 bg-white` 3× — no shared `focusRing`/`control` cva); `variants` overloaded 6 ways; `Textarea` accepts `children`; 6/14 export `*Variants`, 8 don't.

## React Native — PARTIAL (v3: executes now)

Render tests green (Button/Checkbox/Switch); RadioItem outside group still silently no-ops (fake default context, not `null`); `useControllableState` still no updater form, no dev warning; no `ThemeProvider`/`useColorScheme` (light-only); no Inter/`fontFamily` asset; no `hitSlop`/press feedback/`memo`; `radio.tsx` holds RadioGroup + RadioItem in one file. Remaining parity/a11y items: no `Label`/`Textarea` on native, `ListItem`/`Badge` unlabelled, Checkbox `label` a11y-only never rendered.

---

# MAJOR — OSS hygiene (v3: identity fixed, remainder below)

Still open, re-verified: **unfilled `LICENSE:187` `Copyright [yyyy]`**; `SECURITY:6` promises `0.1.x`, everything `0.0.0`; changeset `tidy-pandas-shake` "Button (web)" now ships 13 web + 13 native across 5 subpaths (becomes npm CHANGELOG); `kern-emdash` **no build script**, `main`/`exports` → raw `src/*.ts`, `release.yml` never builds it; `brand.json` TODO-as-value; missing `CHANGELOG/GOVERNANCE/SUPPORT/FUNDING/ISSUE_TEMPLATE/CODEOWNERS`; **no `prepare`** (only `prepublishOnly` → fresh workspace install resolves `exports` to missing `dist/`); hard `react-native` peer (no `peerDependenciesMeta` optional → web consumers warn, pnpm strict fails); **`./native` no `"react-native"` export condition** → Metro falls to CJS; `tokens.json` + theme presets **not in `files`**; no `publint`/`are-the-types-wrong` despite exports map being the product; `documentation.md:44` `Status:` rule ignored on most new files.

---

# NEW (v2) — gaps v1 underweighted

## 15. React version support is undeclaredly narrow

`packages/kern/package.json:47-50` peers `react ^19.3.0` only. React 19 ref-as-prop is load-bearing (9 components rely on it at runtime while rejecting it in types). Either widen to `^18 || ^19` with `ComponentPropsWithRef` + conditional handling, or document 19-only as intentional and fix the 9 type signatures. Right now 18 consumers get silent `null` refs.

## 16. tsconfig split remains — PARTIAL (v3)

Fixed: build excludes test/rntest files; root scripts work. Remaining: `tsc -p tsconfig.build.json` still not in CI (CI typechecks one program, builds another), and `tsconfig.json types:["node","jest"]` vs build `types:[]` is an undocumented split.

## 17. No API-stability / parity contract

`variants` = emphasis/elevation/typescale/validation/shape/kind (6 meanings); `Separator/Divider`, `RadioGroupItem/RadioItem`, `*Props/Native*Props`, `children/label`; `*Variants` exported 6/14. Missing doc is `references/platform-parity.md` (prop table web↔native + naming rules + boolean convention `checked/onCheckedChange`). Freeze before building on top — renames after 0.1.0 cost 10×.

## 18. Native executes now; example-app question remains — PARTIAL (v3)

Fixed: real Jest render tests (Button ×2, Checkbox, Switch) on RN 0.87 with a minimal documented mock bridge (`jest.setup.cjs`); async-render + act-flush rules recorded in package README. Remaining: no example/Expo app in monorepo; `useControllableState` still no updater form; hook tests absent; `test-doubles/` mock now only backs style-map unit tests.

## 19. Packaging: identity fixed, shippability still gated — PARTIAL (v3)

Fixed: license/author/repo/homepage/bugs, cli placeholder, site license, engines/packageManager, CI pins, root scripts, emdash enum + d1 import. Still gating 0.1.0: `prepare` build, `react-native` export condition, optional peer, `files` += `tokens.json`+`themes/`, `publint` + `attw` + `changeset status` + `tsc -p build` in CI, emdash build (raw TS), SECURITY promise vs `0.0.0`, changeset Button-only description.

## 20. No visual / a11y testing strategy

Zero `axe`/`jest-axe`, zero keyboard/roving-focus (radiogroup), zero disabled-behavior, zero ref-merge tests; no Storybook/Ladle, no visual regression, no coverage thresholds; 4 tests assert hardcoded hex so tokenizing breaks the suite. For a design-system base this is P1, not polish.

---

# Test coverage reality (v3)

**Web:** 32 tests green, still zero axe/keyboard/disabled/ref-merge tests, no coverage config. `button.test.tsx` never asserts `onClick` *not* called when disabled; `radio-group.test.tsx` never tests arrow-key roving focus.
**Native:** 4 Jest render tests green (Button/Checkbox/Switch execute for real) + 14 style-map unit tests. Still no axe/keyboard, no example app, hook updater form untested.

---

# Prioritized roadmap (v3, supersedes v2)

## Blocking (do not build on top until done)

1. **Role layer + `@theme` + dark mode** — or rewrite skills to the 6 vars that exist. Unblocks everything.
2. **De-fabricate skills** — icon registry, `@rn-primitives` claim (not a dependency), "220 swatches", phantom theme registry/CSS vars/elevation/space; `code-conventions.md` teaches `variantMap()`/`Parts` symbols that don't exist (real code uses `cva`) — switch to real names or mark pseudocode; or banner each `Status: draft`. Highest agent-safety ROI.
3. **Web a11y pack:** `data-disabled:` ×3, `data-indeterminate:` checkbox, `data-selected:` all chip variants, `type="button"` default.
4. **Native correctness:** spread-first + destructure `style` + compose `onPress`; `hitSlop`; press feedback; `useControllableState` updater + transition warning + tests.
5. **`Field` layer** (Base UI `field`/`fieldset`): `Root/Label/Description/Error`, `aria-describedby` generation, unified `error` convention.
6. **Packaging gate (remainder):** fill copyright, `prepare`, `react-native` condition, optional peer, `files` += tokens/themes, `publint`+`attw`+`changeset status`+`tsc -p build` in CI, SECURITY promise, changeset description. **Do not merge Version Packages PR before this.**

## Foundational (next)

7. `gen-tokens.mjs` + `prebuild` + equality test; extend `tokens.json` (spacing/radius/typography/elevation).
8. `KernThemeProvider` + `useKernTheme` + `useColorScheme` + Inter.
9. Refs + `RadioGroup` generic + function-aware `cn` + web variant literal unions.
10. `apps/site`: component pages + `llms.txt` + theme switcher (build/typecheck already in CI).
11. React 18-vs-19 decision (§15); `platform-parity.md` + naming/boolean freeze (§17).

## Consistency (after)

12. Reconcile web/native drifts; delete drift-certifying tests.
13. `GOVERNANCE/SUPPORT/CHANGELOG`/templates; delete local `TODO.md` (releases.md no longer references it).
14. Missing references: forms/validation, a11y-as-practice, dark mode, RTL, motion, overlays, data tables, token pipeline, 0.x deprecation policy.
15. Visual regression + axe + keyboard + coverage thresholds; delete hex-asserting tests.

---

## Bottom line (v3)

v1/v2 stand except where v3 marks fixed. Since the audits: native executes (Jest), toolchain pinned with root scripts, manifest exact, identity consistent, M3 metrics in code + skill. Still blocking 0.1.0: role layer, skill de-fabrication, component correctness (§3–9), Field layer, packaging gate. Everything else is sequenced above.

Process discipline (CI perms, changesets, biome, exports map, skill structure) is above average for a first release. The system has one hardcoded hex per component and a docs layer describing a finished product. Fix items 1–7 above and you have something you can honestly build on; the rest is normal, tractable engineering.
