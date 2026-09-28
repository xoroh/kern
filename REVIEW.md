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
>    skill phantom symbols, apps/docs scripts + dead links, MCP manifest exports,
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
> v2 keeps every v1 claim that re-verified, corrects counts/wording where v1 was slightly off, and adds §15–§21 (new blockers v1 underweighted).
> Living doc: re-run with the prompt above, move fixes to ## Fixed log, delete obsolete — repeat till Blocking is empty.

## Fixed log

> Move ✅ FIXED items here on each re-run. One line each: `YYYY-MM-DD @<commit> — §N title — proof (e.g. tokens.css now has 26 roles, grep var(-- = 34 hits)`. Delete the full blocker section when moved. Blocking is "perfect" when empty and this log holds everything.

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

## 13. The showcase site does not exist — AGREE

`apps/docs/index.html` (24 lines) self-declares: *"Previews render here once the docs app is wired."* `index.html:15` links `#tokens` — no such id. `package.json` has no `scripts`, no dependency on `@xoroh/kern` (cannot render Kern), appears in zero CI steps. `docs/README.md` promises `llms.txt` — missing. `README.md:7,12` advertises live `ui.xoroh.org`. Build it or delete it + remove claim.

## 14. `packages/mcp` advertises a nonexistent export — AGREE (v2 corrects count/wording)

`manifest.ts:167-173` → `{name:"radio", export:"Radio", status:"real"}` but `radio.tsx` exports `RadioGroup` + `RadioItem` — no `Radio`. `generate-manifest.mjs:13-48` derives export mechanically with hardcoded special-case only for `Button`; any multi-export file breaks it. Duplicate `button/native` at `:111-117` + `:188-194` → **13 native entries for 12 files** (v1 said 14/13 — off by one, substance identical). v2 correction: `get_component` uses `Array.find` so first wins **deterministically**, not nondeterministically — still wrong, second entry dead. Also `mcp/README.md:24` documents `real/stub/tangled/review`; type is `"real"|"stub"` only.

---

# MAJOR — component layer (v1 kept, v2 notes inline)

## Web — AGREE overall

**Correctness:** no default `type` (submit-in-form bug); 9/14 reject `ref` at type level (`ButtonHTMLAttributes` without `RefAttributes`) but forward at runtime via React 19 ref-as-prop — breaks on React 18; `className`-as-function accepted by Base UI types, silently dropped by `clsx`; `RadioGroup` generic erased (`value: unknown`); Chip controlled-only.
**Accessibility:** error color-only (violates own `component-catalog.md:175` error-icon rule); focus `ring-black/40` ≈2.8:1 fails WCAG 1.4.11 3:1 + invisible on dark; placeholder `#999`/`#a3a3a3` fail 4.5:1; `on-success #fff` on `success #16a34a` ≈3.3:1 fails AA while `outline #d4d4d4` documented "3:1" is 1.48:1; web Button 40/32/40 + Chip 32 vs own 48dp rule; `Text` always `<p>`, `Card` always `<div>` (no `as`/`asChild`); `RadioGroupItem` className lands on `<label>` not the circle; `Badge dot` empty span invisible to AT; no group label/error surface.
**Discipline:** `card.tsx` shadow contradicts docs (16px blur vs 30) + violates "shadows floating-only, never standard cards" (v2 note: filled now `0_4px_16px :8`, elevated `0_8px_30px :10` — citation shifted, claim stands); `size="icon"` 40px < 48dp; `text-[13px]` off scale; duplication (focus ring 5×, `disabled:opacity-50` 7×, error border 2×, `border-black/20 bg-white` 3× — no shared `focusRing`/`control` cva); `variants` overloaded 6 ways; `Textarea` accepts `children`; 6/14 export `*Variants`, 8 don't.

## React Native — AGREE (v2 corrects 2 bullets)

Parity renames confirmed (`Divider≠Separator`, `RadioItem≠RadioGroupItem`, `Native*Props≠*Props`, `label:string≠children`); `packages/kern/README.md:84` shows native `label="Save"` as web example; no `Label`/`Textarea` on native (all fields unlabelled, no `nativeID`/`accessibilityLabelledBy`); `alert` Android-only (no iOS path, no `accessibilityLiveRegion`/`announceForAccessibility`); `ListItem`/`Badge` no label (v2 correction: `Divider` **does** set `accessibilityRole="none"` `:39` — still hidden from AT); Checkbox `label` a11y-only, never rendered; `RadioItem` outside group silently no-ops (fake default context, not `null`); `useControllableState` correct shape but no updater form (double-press same frame → stuck), stale controlled→uncontrolled snap, no dev warning, **zero tests**; no `ThemeProvider`/`useColorScheme` (light-only, `tokens.base.background` unreferenced); no Inter/`fontFamily`/font asset; no `StyleSheet`/`memo`/`FlatList`/`KeyboardAvoidingView`/`SafeAreaView`/`hitSlop`/`maxFontSizeMultiplier`; `radio.tsx:53` UMD-global `React` with no import (resolves only via `tsconfig.json:11 types:["node"]`; `tsconfig.build.json:9 types:[]` builds a different program — CI typechecks one, builds the other); `radio.tsx` 2-components-1-file violates own `code-conventions.md:6` and causes MCP phantom-`Radio`.

---

# MAJOR — OSS hygiene (v1 kept, v2 adds packaging P0s)

All re-verified: **license contradiction** (`README:4` MIT + `:20` "MIT-safe" vs `:24` Apache + `LICENSE` Apache + 4 package.json `Apache-2.0`; v2 note: `apps/docs/package.json` has no `license` at all); **unfilled `LICENSE:187` `Copyright [yyyy]`** + `author` absent from all 5; missing `author/repository/homepage/bugs`; `README:15` native "planned" (ships 13 native); `README:18` `packages/cli` "placeholder" with **no `package.json`** (not a workspace member); `CONTRIBUTING:11,13` double "4.", prescribes `bun run test` but `mcp`/`emdash` have no test script + CI never tests them + omits `skills-ref` step; `docs/releases.md:19` → `TODO.md` which is **gitignored** (`.gitignore:6`) + stale (`release.yml` "local-only" but committed); `SECURITY:6` promises `0.1.x`, everything `0.0.0`; changeset `tidy-pandas-shake` "Button (web)" ships 14 web + 13 native across 5 subpaths (becomes npm CHANGELOG); `kern-emdash` **no build script**, `main`/`exports` → raw `src/*.ts`, `release.yml` never builds it, `blocks/button.ts:17` enum omits `tonal`, `README:25` calls `d1()` with no import; `brand.json` TODO-as-value; `mcp/README:24` status vocab mismatch; **no `engines`/`packageManager`**, CI `bun-version: latest` (unreproducible); missing `CHANGELOG/GOVERNANCE/SUPPORT/FUNDING/ISSUE_TEMPLATE/CODEOWNERS`; **no `prepare`** (only `prepublishOnly` → fresh workspace install resolves `exports` to missing `dist/`); hard `react-native` peer (no `peerDependenciesMeta` optional → web consumers warn, pnpm strict fails); **`./native` no `"react-native"` export condition** → Metro falls to CJS; `tokens.json` + 4 theme presets **not in `files`**; no `publint`/`are-the-types-wrong` despite exports map being the product; tokens inlined 3× (tsup bundles, no sourcemaps); `documentation.md:44` `Status:` rule ignored (~30/33 missing); per-component docs rule unsatisfiable by `apps/docs`.

---

# NEW (v2) — gaps v1 underweighted

## 15. React version support is undeclaredly narrow

`packages/kern/package.json:47-50` peers `react ^19.3.0` only. React 19 ref-as-prop is load-bearing (9 components rely on it at runtime while rejecting it in types). Either widen to `^18 || ^19` with `ComponentPropsWithRef` + conditional handling, or document 19-only as intentional and fix the 9 type signatures. Right now 18 consumers get silent `null` refs.

## 16. `tsconfig.json` ≠ `tsconfig.build.json` (footgun, promote to blocker)

`tsconfig.json:11 types:["node"]` vs `tsconfig.build.json:9 types:[]`; build `include:["src"]` excludes tests but `exclude` misses `*.rntest.*`. CI typechecks one program, builds another. The stray `.rntest.tsx` proves it. Fix: single base config, explicit `types:[]` + needed entries, `exclude: [test, rntest, setup]`, add `tsc -p tsconfig.build.json` to CI.

## 17. No API-stability / parity contract

`variants` = emphasis/elevation/typescale/validation/shape/kind (6 meanings); `Separator/Divider`, `RadioGroupItem/RadioItem`, `*Props/Native*Props`, `children/label`; `*Variants` exported 6/14. Missing doc is `references/platform-parity.md` (prop table web↔native + naming rules + boolean convention `checked/onCheckedChange`). Freeze before building on top — renames after 0.1.0 cost 10×.

## 18. Native has never executed (promote to blocker)

Null-stub double (`test-doubles/react-native.ts:4` `() => null` for View/Text/Pressable/TextInput, no `StyleSheet`/`Platform` exports — adopting correct fixes breaks the mock); both native test files import only pure style fns; 10/12 components zero behavioral coverage; `button.rntest.tsx` dead (vitest never matches `*.rntest.*`, uses `jest.fn` under vitest, queries `getByRole(name)` the Button never sets via `accessibilityLabel`); no RN/Expo app in monorepo. Decide: `react-native-web` render tests + minimal example app, or mark native `stub` in manifest + README and stop asserting 18dp/32dp as correct (`styles.test.ts:66-80` currently certifies HIG violations).

## 19. Packaging is not 0.1.0-shippable (promote to blocking batch)

Beyond v1's list: merging the current changeset publishes a broken tarball (raw TS in emdash, missing tokens/themes in files, CJS-via-Metro on native, missing dist on fresh install). Gate the Version Packages PR on: `prepare` build, `react-native` condition, optional peer, `files` including `tokens.json`+`themes/`, `publint` + `attw` in CI, `changeset status` in CI.

## 20. No visual / a11y testing strategy

Zero `axe`/`jest-axe`, zero keyboard/roving-focus (radiogroup), zero disabled-behavior, zero ref-merge tests; no Storybook/Ladle, no visual regression, no coverage thresholds; 4 tests assert hardcoded hex so tokenizing breaks the suite. For a design-system base this is P1, not polish.

## 21. Root orchestration + toolchain pinning

Root scripts = changeset/version/release/lint/format only. No root `typecheck/test/build`, no workspace aggregation, no `engines`/`packageManager`, `bun-version: latest` in both workflows. Pin (`mise`/`.nvmrc`/exact bun), add `packageManager`, document `skills-ref` step in CONTRIBUTING.

---

# Test coverage reality (v1 kept)

**Web:** 32 tests, zero axe/keyboard/disabled/ref/merge tests, no coverage config. `primitives.test.tsx` bucket for 3 homeless components; 4 tests assert hex; `button.test.tsx` never asserts `onClick` *not* called when disabled; `radio-group.test.tsx` never tests arrow-key roving focus.
**Native:** null-stub double makes rendering impossible; style-fn-only tests; misnamed "error uses error role" asserts only `.color`; 18dp/32dp certified as correct; no RN app → native layer never executed. Fix per §18: replace double with `react-native-web` or declare native untested.

---

# Prioritized roadmap (v2, supersedes v1)

## Blocking (do not build on top until done)

1. **Decide what Kern is** — (a) build role layer + `@theme` + dark mode now, or (b) rewrite skills to the 6 vars that exist. Unblocks everything. ~1 day.
2. **De-fabricate skills** — delete `behavior-parts`/`variant-maps` example, icon registry, `@rn-primitives` claim, "220 swatches", phantom theme registry/CSS vars/elevation/space; or banner each `Status: draft`. Highest agent-safety ROI.
3. **Web a11y 4-pack:** `data-disabled:` ×3, `data-indeterminate:` checkbox, `data-selected:` all chip variants, `type="button"` default.
4. **Native correctness:** spread-first + destructure `style` + compose `onPress`; `hitSlop`; press feedback (`android_ripple`/pressed fn); `useControllableState` updater + transition warning + tests.
5. **`Field` layer** (Base UI `field`/`fieldset`): `Root/Label/Description/Error`, `aria-describedby` generation, unified `error` convention — dissolves 5 blockers.
6. **License + identity + packaging gate:** fix MIT/Apache contradiction, fill copyright, add `author/repository/bugs/homepage` ×5, correct `README:4,15,18`, add `prepare`, `react-native` condition, optional peer, `files` += tokens/themes, `publint`+`attw`+`changeset status`+`tsc -p build` in CI, pin toolchain. **Do not merge Version Packages PR before this.**
7. **Native honesty gate:** `react-native-web` render tests or mark `stub`; fix/delete `button.rntest.tsx`, jest configs, tsconfig exclude; add or explicitly defer example app.

## Foundational (next)

8. `gen-tokens.mjs` + `prebuild` + equality test; extend `tokens.json` (spacing/radius/typography/elevation).
9. `KernThemeProvider` + `useKernTheme` + `useColorScheme` + Inter.
10. `ComponentPropsWithRef` ×9; fix `RadioGroup` generic; function-aware `cn`; export variant literal unions on web (native already does).
11. `apps/docs`: build properly or delete + remove `ui.xoroh.org` claim; add `llms.txt` or remove promise.
12. React 18-vs-19 decision (§15); `platform-parity.md` + naming/boolean freeze (§17).

## Consistency (after)

13. Reconcile ~9 web/native drifts; delete drift-certifying tests.
14. `GOVERNANCE/SUPPORT/CHANGELOG`/templates; fix CONTRIBUTING numbering; inline `TODO.md` into `docs/releases.md`, delete `TODO.md` (un-ignore or keep ignored-but-unreferenced — not both).
15. Missing references: forms/validation, a11y-as-practice, dark mode, RTL, motion, overlays, data tables, token pipeline, 0.x deprecation/migration policy.
16. Visual regression + axe + keyboard + coverage thresholds; delete hex-asserting tests.

---

## Bottom line (v2)

v1 was right and remains the most accurate document in the repo. v2's corrections are all sub-line (counts, determinism, 2 role/style nuances, provenance scope) — none overturn a blocker. v2's additions (§15–§21) promote three things to blocking that v1 left as background: **packaging is not shippable, native has never run, and the toolchain/typecheck split makes green fragile.**

Process discipline (CI perms, changesets, biome, exports map, skill structure) is above average for a first release. The system has one hardcoded hex per component and a docs layer describing a finished product. Fix items 1–7 above and you have something you can honestly build on; the rest is normal, tractable engineering.
