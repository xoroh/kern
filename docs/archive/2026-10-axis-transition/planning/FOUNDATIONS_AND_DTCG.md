# Foundations and DTCG

Status: design specification; DTCG work is a **P2 foundation prerequisite**, not post-Preview work. See decisions ADR-P04/P05 and `KERN-017`–`KERN-023`.

Pinned interchange reference: [DTCG Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/), fetched/checked during planning. It is a stable Final Community Group Report dated 2025-10-28, **not a W3C Recommendation**. Use its normative clauses, not inconsistent nonnormative examples, as conformance evidence. Kern's validation schema is an implementation artifact; no official released JSON Schema is assumed from the spec's exploratory editor note.

## Current source truth

`packages/kern-tokens/src/tokens.json` is the custom canonical reference data; `tokens.ts` imports it directly. `src/themes/kern.json` has real hex role tables, despite pipeline comments describing palette binding; these are equal-value duplicates, not executable aliases today. `resolve.ts:105` resolves base(mode) → contrast overlay → preset overrides. `sharp/brand/compact/demo` are override-only; `m3` aliases `kern`. Matrix = 2 modes × 3 contrasts × 5 presets = 30 cells (`pipeline.ts:161`). `gen-css.mjs` reads tokens, base roles and the committed matrix, and additionally hardcodes a dark elevation shadow table; eliminate that second value source deliberately, with golden output first.

Dimensions currently preserved: sparse palettes with `{oklch,srgb}`, 11 spectrum hues on familiar steps, base values, Inter/families/font-face metadata, 15 typescale roles and emphasized scale, ten shape entries, L0–L5 elevation dp/shadows, standard/expressive motion easing/duration/spring schemes, five interaction-state opacities, spacing scale, focus/size/feedback primitives and component mappings. Runtime helper modules `motion.ts`, `feedback.ts`, `functional.ts`, `focus.ts`, `sizes.ts`, `expressive-shapes.ts`, `seed-theme.ts`, `presets.ts`, `tones.ts`, `variants.ts` are capabilities, not JSON noise to delete.

## Canonical decision

Keep a **versioned Kern authoring schema** as authoritative storage; normalize it to a typed platform-neutral token graph, then project to DTCG 2025.10 and renderer runtime output. Do not simultaneously maintain a second editable DTCG mirror. This minimizes changes to the existing resolver/themes and preserves sparse palettes and Kern-specific motion data while making interoperability real now. DTCG import is a validated conversion into the authoring graph, not execution of arbitrary external configuration.

Proposed files (not present): `src/schema.ts`, `src/schema.json`, `src/token-graph.ts`, `src/dtcg/{import,export,validate}.ts`, generator `scripts/gen-dtcg.mjs`, golden fixtures. Source schema version and DTCG spec version are distinct; conversion provenance belongs in namespaced `$extensions` (e.g. `org.xoroh.kern`), not an invented DTCG token type. Avoid requiring Style Dictionary at runtime; add a generator dependency only if a specific tested conversion saves meaningful maintenance.

## Names, roles and representations

Canonical graph paths use dotted ids (`ref.palette.primary.600`, `sys.color.light.primary`, `sys.type.body.large`, `comp.button.filled.container`), while old TS camelCase and public CSS `--md-sys-*`, `--md-comp-*`, `--spectrum-*`, generic app bridge names remain compatibility projections. Reference tokens carry values; system roles carry explicit reference ids where the source has a known binding; component aliases resolve system roles. Inline one-offs require a documented rationale. Never manufacture missing sparse palette steps by interpolation during migration.

Dotted ids are graph addresses, **not literal DTCG JSON key names**: exported group/token names cannot contain dots/braces or start with reserved `$`. Implement group `$type` inheritance, reserved `$root` tokens, `$extends` deep merging with whole-token replacement, curly-brace chained aliases and **required local RFC6901 `$ref` JSON Pointers**, including `$value`/composite property/array indexing and `~0`/`~1` escaping. Reject remote URL/file pointers without an explicitly separate trusted transport; local pointer support must not be mistaken for unsafe dereferencing. Detect cycles separately in aliases, group inheritance and pointers. Honor/preserve descriptions, deprecation and unknown vendor extensions. Add these conformance fixtures to KERN-018/020; a color-only curly-brace exporter is not full Format interoperability.

Material owns 45 standard roles plus 13 registered Kern deviations (58 total, `kern-roles.ts`): primary/secondary/tertiary and on/container/fixed pairs, surface/container ladder and ink, outline/inverse/scrim/shadow, error and success/warning/info families, surfaceTonal. Preserve fill/ink pairing and waiver rationale. Semantic role provenance is provider metadata, not a runtime plugin registry. No arbitrary consumer role creation inside a Material preset; custom app tokens can extend a separate namespaced group.

| Kern foundation | DTCG projection | Runtime policy |
|---|---|---|
| OKLCH palette + sRGB | `color` object with colorSpace/components/alpha; compiled sRGB/provenance in extension if necessary | Math uses canonical color; CSS/native consume validated sRGB; existing rounding/output preserved |
| Shape/spacing/size/typescale sizes | `dimension` with value/unit | Web px/rem; native dp conversion explicitly documented. Percentages are not guessed into dimensions. |
| Typeface/weight/type composite | `fontFamily`, `fontWeight`, `typography` composites using supported field types | Inter behavior preserved; lineHeight normalized to DTCG number semantics, legacy px output retained via graph metadata |
| State opacity | `number` in [0,1] | CSS percent/RN number derived from one value; no extra focus-visible state |
| Motion duration/easing | `duration` (ms/s), `cubicBezier` | Legacy short/medium aliases remain; reduced motion produces tested fallbacks |
| Springs/algorithm/scheme selections | Standard typed numeric tokens + namespaced extensions for semantics/references | No fake `spring` DTCG type; unsupported algorithm imports return structured diagnostics |
| Elevation | `shadow` composites plus dp `dimension` token | Shadow and physical elevation are separate; light/dark shadow tables belong to canonical data |
| Feedback shapes/variants | Supported scalars plus namespaced metadata | Geometry/behavior remains TS implementation, not DTCG source code |

Interchange also parses/validates/preserves the standard `strokeStyle`, `border`, `transition` and `gradient` composites even where no current Kern role projects them to component styles. A valid imported type outside a renderer's capabilities is retained in the graph with an explicit projection diagnostic; unsupported arbitrary type strings are invalid. Composite array aliasing/property pointers require tests. Do not silently flatten typography/shadow aliases, encode unsupported percent dimensions, or discard ordinary third-party metadata.

DTCG color syntax and composite field schemas must be pinned to the actual 2025.10 specification with fixtures; a `{ $type:"color", $value:"#..." }` example is **not** sufficient compatibility proof. Proposed export excerpt:

```json
{
  "ref": { "palette": { "primary": { "600": {
    "$type": "color",
    "$value": { "colorSpace": "srgb", "components": [0.4039215686, 0.3137254902, 0.6431372549], "alpha": 1 }
  } } } },
  "sys": { "color": { "light": { "primary": {
    "$type": "color", "$value": "{ref.palette.primary.600}"
  } } } }
}
```

This illustrates encoding, not a committed output golden or approved rounding precision.

## Themes and contexts

Base `kern` remains the default Material theme; preset identity and runtime provider identity are distinct. Represent mode/contrast/preset in a **Kern theme catalog/extension** and emit a standards-valid resolved DTCG document per selected context plus a reference-preserving base graph. Do not add nonstandard `$modes` while claiming pure Format Module compatibility. Keep import of ordinary token files useful without Kern extensions; return explicit loss/unsupported-field diagnostics rather than silently dropping themes.

Custom themes use validated override-only `defineThemePreset`, matching known roles/shapes. Extend validation to units/references and all contrast contexts. Today preset overrides apply after contrast overlays; changing that precedence requires a visual/API ruling, not an incidental adapter refactor. If an override invalidates high contrast, reject it or explicitly derive a tested overlay. Web subtree deltas need light/dark **and contrast** coverage; current `scopedDeltas` only handles standard contrast, so test nested preset/contrast propagation before extending output.

Default appearance is contested by dirty theme edits and stale skill values. Recommend retaining the current Material baseline as OSS default **subject to owner sign-off**, and deriving an explicit Xoroh compatibility preset from private application values. Do not restore blue secondary automatically or bless a red test by changing its expected string without a visual decision.

## References, validation, APIs

Graph resolution rejects missing refs, cycles (show complete cycle/path), ambiguous name collisions, incompatible types, nonfinite values, unsupported units, invalid color channels/alpha, unregistered roles and malformed composites. Resolve aliases deterministically and cache immutable results; no module-scope native theme capture. Import accepts unknown namespaced extensions as preserved metadata, but unsupported standard types and unsafe pointers return typed errors. Bound document size/depth; no URL/file dereference or prototype mutation from tokens.

Proposed additive APIs: `validateTokenSource`, `toDtcg`, `fromDtcg`, `resolveTokenGraph`, export of schema/version metadata and `./dtcg` artifacts. Existing `tokens`, theme APIs and JSON subpaths remain with explicit schema/version deprecation policy. Round trip promises semantic values/aliases and supported extension preservation, **not identical formatting** of arbitrary third-party JSON.

CSS outputs: ordinary variables/animations at tokens `./theme`, web `./theme` compatibility forwarding, optional `./tailwind` integration separately. Publish tones/motion/component-token CSS where used, not unexported checkout paths. Inter loading becomes an explicit opt-in font entry so native/unstyled consumers do not inherit DOM font-loading side effects; preserve documented web setup. Native schemes use sRGB numbers/strings and dp with no DOM/Tailwind parsing.

## Migration and golden acceptance

1. Approve default/Xoroh values and snapshot 30 resolved schemes plus CSS public variable sets, motion, elevation and TS types (`KERN-011`, `KERN-017`).
2. Add schema/graph and alias resolver without changing output (`KERN-018`).
3. Add exporter/importer covering every foundation above, malformed input fixtures, external standards-valid fixture, and diagnostic loss policy (`KERN-019`/020).
4. Move hardcoded dark elevation values into canonical inputs; generate identical approved values; compare CSS and native schemes (`KERN-021`).
5. Migrate generations to one normalized graph while preserving CSS names, enum/type names and preset ids; verify duplicate aliases and nested scopes (`KERN-022`).
6. Add seed/custom preset and host integration checks, Xoroh compatibility artifact and DTCG theme snapshots (`KERN-023`).

Existing checks: `bun run --filter @xoroh/kern-tokens test`, `bun run check:contrast`, `bun run check:theme-matrix`. **New tests to add**, not current scripts: DTCG semantic roundtrip/schema fixtures, cyclic/missing references, full foundation goldens, output reproducibility in disposable checkout, web/native context parity. Golden differences require a reviewed changeset and migration note; byte freshness is not itself proof of correctness.
