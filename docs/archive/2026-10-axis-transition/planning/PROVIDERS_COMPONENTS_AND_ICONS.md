# Material provider, components and icons

Status: target contract. Existing APIs are identified below; metadata additions/tests are proposed.

## Identity, naming and ownership

Provider id **`m3`**, human label Material 3, spec generation and evidence snapshot separate from package semver. Retain current package names; README/descriptions and additive `providerManifest` remove ambiguity without a disruptive facade/rename. The old private Xoroh names (`kern-start`, `kern-expo`, `kern-react`) migrate through Xoroh-owned compatibility adapters, not permanent duplicate OSS packages. `@xoroh/kern/start` stays in web; native compositions stay at root. Contracts package is platform-free metadata, not a component implementation or primitives catchall.

Source evidence: web `src/components/index.ts`, `src/index.ts`, `src/start/index.ts`; native `src/index.ts`; independent theme adapters `kern/src/web-theme.ts` and `kern-native/src/theme.tsx`; `parity/contract.ts` imports nothing. `check:layers` confirms current renderer separation. Base UI stays web's behavioral base; native uses RN primitives and `kern-primitives`, with platform hosts for keyboard, modal, press, focus and fonts. No runtime `isNative` branches.

## Behavioral/capability contracts

Proposed metadata per component: entrypoint/export, renderer, UI tier, public props/axes, supported behaviors with evidence test paths, intentional unsupported behavior/reason, origin/spec evidence, token/icon/dependency requirements and platform mappings. Record `unknown` when not tested; registry presence alone means implemented/exported, not accessibility certified.

Common obligations preserve controlled/uncontrolled value/open stores and canonical `onValueChange`/`onOpenChange`; variant meanings are stable (Button=color config, Card=elevation, Chip=kind, Text=typescale). Keep aliases until a deliberate migration replaces them. Web array-valued segmented selection and native scalar/multiple APIs differ intentionally; contracts assert selection rather than force the same prop type.

| Family | Required behavioral preservation | Platform specialization |
|---|---|---|
| Press/button/link/toggle | disabled/loading/soft-disabled behavior, stable footprint, selected state/name, 48dp interaction area, controlled/uncontrolled callbacks | anchor href/ref/keyboard versus Pressable onPress/Linking host; native hitSlop/ripple |
| Fields/selection | named label, value changes, error/helper visibility and announcement, required/invalid/disabled state, option navigation | describedby/form/DOM events versus TextInput/accessibilityHint/native modal keyboard |
| Named surfaces | open state, naming, initial focus, dismissal and focus return, background modality | Escape/portal/Tab loop versus hardware back/Modal/accessibility isolation |
| Navigation | selected/current semantics, activation callbacks, disabled item, directional layouts | landmarks/roving focus/hover versus native safe area/back/gesture conventions |
| Content/progress | text role/type scale, captions, determinate min/max/value, busy/empty/loading announcements | semantic HTML versus RN role/label/value fields |
| Compositions | named regions, responsive panes, callback/slot seams, focus on drills and transitions | router adapter/web breakpoints versus host navigation/safe areas |

Every one-sided registry concept is classified as an API-part difference, equivalent native capability, intended platform feature, genuinely missing feature, or naming drift (`KERN-032`). Multipart row counts must not drive duplicate RN components. Sonner's imperative entrypoint and preview-card/HTML native-select can remain explicit asymmetries, but preserve native Snackbar/select functionality. Native Kbd/Tooltip already exist; do not plan them as missing based on stale prose. Native-only brand art/feedback must be kept or mapped, not deleted for symmetry.

Contract tests use observable role/name/state/callback/style input, not internal DOM anatomy. Native tests must include both Vitest pure/style suites and Jest/RNTL actual renders. Live device gesture/modal/screen-reader verification is distinct from RN-web gallery success. Critical parity blockers include named overlays, fields/errors, icon meaning, live theme changes and Xoroh-used features; decorative platform details can differ with an explicit rationale and tests.

## One canonical Material icon API

Keep `import { Icon } from "@xoroh/kern-icons"` on both platforms and existing props `name`, optional `set`, `filled`, `size`, `color`, `title`, `testID` plus host SVG props. Only the **Material family** is supported; the present asset line is **Material Symbols Rounded**, not classic Material Icons font ligatures. Preserve it rather than silently swap visually different glyphs. Confirm the owner's intended wording before public release; no additional family is required.

Canonical mapping lives in `src/core/semantic.ts` (42 aliases); examples: `back→material:arrow-back`, `calendar→material:calendar-month`, `account→material:account-circle`, `filter→material:filter-list`, `more→material:more-vert`, `tasks→material:task`. Full glyph inventory is `src/sets/material/names.ts`/`manifest.ts` (1340); canonical names are kebab-case with snake-case, qualified `material:name` and semantic inputs retained. Both renderers must resolve identical path/fill data for a given alias.

Current sources: `config/source.json` pins `@material-symbols/svg-400@0.47.2`, rounded, 400, source grid 960; pipeline `tools/{sync,generate,check}.ts` emits committed paths rebased to 24-grid. Default outline, filled fallback to outline when absent, sizes resolve named tokens or positive explicit values (default 24), invalid names return null and warn once in development. Preserve this production-safe behavior; add strict missing-name checks to build/registry/consumer validation and an optional explicit UI fallback. Never silently substitute an unrelated glyph for meaning-critical navigation.

Web emits inline `<svg><path>` with currentColor, decorative `aria-hidden`, named `role=img`/label. Native emits `react-native-svg`; current decorative path does not explicitly set hiding flags. Add native decorative/accessibility tests and explicit platform hiding behavior where required. Native currentColor inheritance is not assumed correct: test with native Text/View themes and use explicit resolved role color for component-owned icons if inheritance cannot be proven. Interactive name belongs on the parent control; a named icon must not cause duplicate announcements.

Preserve filled/outline semantics and upstream outline reuse metadata; do not expose unsupported weight/GRAD/optical axes as if all local shapes exist. Keep 48dp icon-button target separate from icon edge size. Directional aliases require explicit RTL mirroring rules/tests; logos and nondirectional icons must not flip automatically.

## Dependencies, licensing and bundling

Icons uses React peer and optional RN/SVG peers; web consumers must not acquire RN. Native renderer/SVG version must resolve compatibly with host Metro and deduplicate native module instances. Source-installed icon use either retains the icons package or vendors the exact mapping/path dependency closure with license notices and native renderer assets. No runtime fetch or font ligature setup is necessary for current SVG implementation.

`packages/kern-icons/THIRD_PARTY/NOTICE`, manifest/config Apache-2.0 and package MIT must be distributed with actual upstream license/attribution required for redistributed paths, not merely a URL claim. Verify Inter's font license and Base UI/native dependencies as well (`KERN-077`). Existing chunking is useful but dynamic registry lookup may retain the whole catalog; measure packed web/native bundles. Add optional generated static icon entrypoints only if the measured cost warrants them; preserve dynamic `Icon` for names from data. Tree-shaking is an acceptance measurement, not a source-layout assertion.

## Verification to implement

`KERN-024`–032: provider metadata/negative capability tests; export-preserving family fixtures; per-variant elevation parser and in-repo rulings; full form/overlay/navigation behavior; native theme/device/modal evidence; web SSR + native SVG icon render tests, every semantic mapping, missing/fill/size/RTL/decoration cases; license/integrity/glyph-count goldens; bundle budgets; reconciled gap matrix. Current `bun run icons:check`, renderer suites, `check:parity`, `check:contrast`, `check:elevation-parity` remain gates. New `test:icons:render`/contract test names are proposals, not existing runnable scripts.
