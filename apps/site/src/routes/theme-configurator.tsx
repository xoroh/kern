/**
 * /theme-configurator — the theme studio (shadcn-studio pattern, kern rules).
 *
 * 280px sidebar, top-to-bottom: 01 scheme preset rows (3 live swatches =
 * primary/secondary/surface-container) → 02 brand seed (one-line caption,
 * details hold the rest) → 03 shape chips+slider → 04 Light/Dark +
 * Standard/Medium/High segmented → 05 sticky export footer (PRIMARY action
 * Copy-preset-`.json` prefilled `themes/<id>.json`, TS/CSS secondary, Reset).
 * Right: live preview — real components from `@xoroh/kern` in a container
 * whose CSS vars are the resolved theme, so the preview IS the tokens, not
 * a picture of them. Below: the export sources built from the SAME resolved
 * object (the configurator-harness rule: the fence cannot drift from the
 * stage).
 *
 * HONESTY BOUNDARIES (stated on the page, not just here):
 *  - The seed recomputes the PRIMARY FAMILY ONLY (4 roles x 2 modes) via the
 *    package's own `makeHueRamp` + nearest-step M3 baseline-tone mapping
 *    (`src/theme-studio/seed.ts`). Secondary/tertiary/error/surface stay on
 *    the selected preset. No HCT scheme algorithm is claimed.
 *  - Radius scale multiplies px corner values and rounds to 0.5px; `full`
 *    (9999px) passes through — scaling a pill to an ellipse would be a
 *    different decision wearing this one's name.
 *  - The preview is a component assembly, NOT registry blocks: blocks do not
 *    exist yet (showcase route is an honest placeholder). Nothing here is
 *    called a block.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Badge, Button, Card, Chip } from "@xoroh/kern";
import {
  type CustomTheme,
  getVariant,
  listVariants,
  resolveThemeDetails,
  resolveThemeLayers,
  shapeVarName,
  themeIds,
  varName,
} from "@xoroh/kern-tokens";
import { useMemo, useState } from "react";
import { SiteLayout } from "../domains/shared/chrome/site-layout";
import { CopyButton } from "../showcase/copy-button";
import { routeHead } from "../domains/shared/systems/seo";
import {
  T_BODY,
  T_BODY_SM,
  T_LABEL,
  T_PAGE,
  T_SECTION,
  T_SMALL_TITLE,
} from "../domains/shared/systems/type-scale";
import { seedOverrides } from "../theme-studio/seed";

export const Route = createFileRoute("/theme-configurator")({
  head: () =>
    routeHead("Theme configurator", "Theme studio — tune tokens and preview them on real components."),
  component: ThemeConfigurator,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const PANEL =
  "rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) p-5";
const FIELD = `m-0 ${T_LABEL} ${INK_SOFT} uppercase`;
const DOT = "block size-4 rounded-full border border-black/20";
const SEG_WRAP =
  "flex gap-1 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) p-1";
const SEG_ON = `flex-1 rounded-(--md-sys-shape-corner-extra-small) bg-(--md-sys-color-primary) px-2 py-1.5 text-center ${T_BODY_SM} text-(--md-sys-color-on-primary)`;
const SEG_OFF = `flex-1 rounded-(--md-sys-shape-corner-extra-small) px-2 py-1.5 text-center ${T_BODY_SM} ${INK_SOFT} hover:bg-(--md-sys-color-surface-container-high)`;
const EXPORT_FILE = "themes/studio-theme.json";

function isHex6(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v);
}

/** px values scale; anything else (full) passes through untouched. */
function scaleShape(
  shape: Record<string, string>,
  factor: number,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(shape)) {
    const m = /^([0-9.]+)px$/.exec(v);
    if (!m) {
      out[k] = v;
      continue;
    }
    out[k] = `${Math.round(Number(m[1]) * factor * 2) / 2}px`;
  }
  return out;
}

const SHAPE_CHIPS = [
  { label: "Compact", factor: 0.5 },
  { label: "Regular", factor: 1 },
  { label: "Round", factor: 2 },
] as const;

function ThemeConfigurator() {
  // Scheme choices from BOTH authorities: the built-in ThemeIds always
  // resolve; registry variants appear here with no site edit when one is
  // registered upstream. `listVariants()` is empty today (measured — nothing
  // has called defineVariant in this tree), so a registry-only list would
  // render a blank control. Union, deduped, ThemeIds first.
  const presets = useMemo(() => {
    const ids = themeIds() as string[];
    for (const v of listVariants()) {
      if (!ids.includes(v.id)) ids.push(v.id);
    }
    return ids;
  }, []);
  const defaultSeed = useMemo(
    () => resolveThemeDetails("light", "standard", "kern").color.primary,
    [],
  );
  const [seedHex, setSeedHex] = useState(defaultSeed);
  const [seedText, setSeedText] = useState(defaultSeed);
  const [preset, setPreset] = useState<string>("kern");
  const [dark, setDark] = useState(false);
  const [contrast, setContrast] = useState<"standard" | "medium" | "high">(
    "standard",
  );
  const [radius, setRadius] = useState(1);

  // Typing an invalid hex keeps the last good ramp — the preview never reads
  // a value makeHueRamp would reject.
  function onSeedText(v: string) {
    setSeedText(v);
    if (isHex6(v)) setSeedHex(v);
  }

  function reset() {
    setSeedHex(defaultSeed);
    setSeedText(defaultSeed);
    setPreset("kern");
    setDark(false);
    setContrast("standard");
    setRadius(1);
  }

  const mode = dark ? "dark" : "light";

  // 01 — preset rows read live: each row's three dots resolve that preset
  // in the CURRENT mode + contrast, so the swatches match what selecting
  // the row would paint.
  const swatchRows = useMemo(
    () =>
      presets.map((id) => {
        const selection = (themeIds() as string[]).includes(id)
          ? id
          : getVariant(id);
        const color = resolveThemeDetails(mode, contrast, selection as never)
          .color;
        return {
          id,
          primary: color.primary,
          secondary: color.secondary,
          surfaceContainer: color.surfaceContainer,
        };
      }),
    [presets, mode, contrast],
  );

  const theme: CustomTheme = useMemo(() => {
    // One selection for every resolver: a ThemeId passes through, a registry
    // variant id resolves to its override object. Two spellings, one table.
    const selection = (themeIds() as string[]).includes(preset)
      ? preset
      : getVariant(preset);
    const light = resolveThemeLayers("light", contrast, selection);
    const darkLayers = resolveThemeLayers("dark", contrast, selection);
    let seed: { light: Record<string, string>; dark: Record<string, string> };
    try {
      seed = seedOverrides(seedHex).color;
    } catch {
      seed = seedOverrides(defaultSeed).color;
    }
    // Compact AND exact: preset deltas (empty when preset is kern at standard
    // contrast) plus the seed family. The preview below spreads the same two
    // objects over the full scheme, so snippet and stage resolve identically.
    const shape = scaleShape(
      resolveThemeDetails("light", contrast, selection as never).shape,
      radius,
    );
    return {
      id: "studio-theme",
      extends: "kern",
      overrides: {
        color: {
          light: { ...light.deltas, ...seed.light },
          dark: { ...darkLayers.deltas, ...seed.dark },
        },
        shape,
      },
    };
  }, [seedHex, defaultSeed, preset, contrast, radius]);

  const resolved = useMemo(() => {
    const scheme = resolveThemeLayers(mode, contrast, preset).scheme;
    return {
      color: { ...scheme, ...(theme.overrides.color?.[mode] ?? {}) },
      shape: theme.overrides.shape ?? {},
    };
  }, [mode, contrast, preset, theme]);

  const vars = useMemo(() => {
    const out: Record<string, string> = { colorScheme: mode };
    for (const [role, value] of Object.entries(resolved.color)) {
      out[varName(role)] = value;
    }
    for (const [role, value] of Object.entries(resolved.shape)) {
      out[shapeVarName(role)] = value;
    }
    return out;
  }, [resolved, mode]);

  // The missing export artifact: the actual `themes/<customer>.json` file
  // content — paste-ready, same object the preview resolves.
  const jsonSource = useMemo(
    () =>
      JSON.stringify(
        {
          id: theme.id,
          extends: theme.extends,
          overrides: theme.overrides,
        },
        null,
        2,
      ),
    [theme],
  );

  const presetSource = useMemo(() => {
    const colorJson = JSON.stringify(theme.overrides.color, null, 2);
    const shapeJson = JSON.stringify(theme.overrides.shape, null, 2);
    return `import { defineThemePreset } from "@xoroh/kern-tokens";

export const studioTheme = defineThemePreset({
  id: "studio-theme",
  extends: "kern",
  overrides: {
    color: ${colorJson},
    shape: ${shapeJson},
  },
});`;
  }, [theme]);

  const cssSource = useMemo(
    () =>
      Object.entries(vars)
        .filter(([k]) => k.startsWith("--"))
        .map(([k, v]) => `  ${k}: ${v};`)
        .join("\n"),
    [vars],
  );

  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[72rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-12">
          <header className="flex flex-col gap-3">
            <p className={`m-0 ${T_LABEL} ${INK_SOFT} uppercase`}>Studio</p>
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Theme configurator</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Tune the theme in the sidebar — the preview and the export
              update together.
            </p>
            <details>
              <summary className={`cursor-pointer ${T_BODY_SM} ${INK}`}>
                How this studio works
              </summary>
              <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
                Everything right of this sentence reads CSS vars — the preview
                is the tokens. Copy the preset source and it resolves to
                exactly what you see: snippet and stage share one object. The
                seed recomputes the primary family only; secondary, tertiary,
                error and surface stay on the preset. Contrast is argued from
                the mapping, not printed — the ratio function is not in the
                package&apos;s public API.
              </p>
            </details>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            {/* SIDEBAR — 280px theme builder, top to bottom */}
            <aside
              aria-label="Theme controls"
              className="flex h-fit w-full flex-col lg:w-[280px]"
            >
              <div className={`flex flex-col gap-5 ${PANEL}`}>
                <h2 id="controls" className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
                  Theme builder
                </h2>

                {/* 01 — preset rows with live swatches */}
                <div className="flex flex-col gap-2">
                  <span id="preset-label" className={FIELD}>
                    01 · Scheme preset
                  </span>
                  <div
                    role="radiogroup"
                    aria-labelledby="preset-label"
                    className="flex flex-col gap-1.5"
                  >
                    {swatchRows.map((row) => {
                      const selected = preset === row.id;
                      return (
                        <button
                          key={row.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setPreset(row.id)}
                          className={`flex w-full cursor-pointer items-center gap-2.5 rounded-(--md-sys-shape-corner-small) border px-3 py-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--md-sys-color-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--md-sys-color-surface-container-low) ${selected ? "border-(--md-sys-color-primary) bg-(--md-sys-color-primary-container)" : "border-(--md-sys-color-outline-variant) bg-transparent hover:bg-(--md-sys-color-surface-container-high)"}`}
                        >
                          <span
                            aria-hidden="true"
                            className="flex shrink-0 items-center gap-1"
                          >
                            <span
                              className={DOT}
                              style={{ backgroundColor: row.primary }}
                            />
                            <span
                              className={DOT}
                              style={{ backgroundColor: row.secondary }}
                            />
                            <span
                              className={DOT}
                              style={{
                                backgroundColor: row.surfaceContainer,
                              }}
                            />
                          </span>
                          <span
                            className={`${T_BODY_SM} ${selected ? INK : INK_SOFT}`}
                          >
                            {row.id}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 02 — brand seed, one line above the fold */}
                <div className="flex flex-col gap-2">
                  <span className={FIELD}>02 · Brand seed</span>
                  <span className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label="Primary seed color"
                      value={isHex6(seedText) ? seedText : seedHex}
                      onChange={(e) => onSeedText(e.target.value)}
                      className="h-9 w-14 cursor-pointer rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant) bg-transparent p-1"
                    />
                    <input
                      type="text"
                      aria-label="Primary seed hex value"
                      value={seedText}
                      spellCheck={false}
                      onChange={(e) => onSeedText(e.target.value)}
                      className={`w-24 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant) bg-transparent px-2 py-1 font-mono ${T_BODY_SM} ${INK}`}
                    />
                  </span>
                  <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                    Repaints the primary family; the preset keeps the rest.
                  </p>
                  <details>
                    <summary
                      className={`cursor-pointer ${T_BODY_SM} ${INK_SOFT}`}
                    >
                      What does the seed change?
                    </summary>
                    <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                      Recomputes primary, onPrimary, container and onContainer
                      in both modes from the seed&apos;s hue ramp at each
                      role&apos;s M3 baseline tone — an approximation, not the
                      HCT scheme algorithm. Secondary, tertiary, error and
                      surface stay on the preset.
                    </p>
                  </details>
                </div>

                {/* 03 — shape chips + slider */}
                <div className="flex flex-col gap-2">
                  <span id="shape-label" className={FIELD}>
                    03 · Shape — {radius.toFixed(2)}x
                  </span>
                  <div
                    role="radiogroup"
                    aria-labelledby="shape-label"
                    className="flex flex-wrap gap-1.5"
                  >
                    {SHAPE_CHIPS.map((chip) => {
                      const selected = radius === chip.factor;
                      return (
                        <button
                          key={chip.label}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setRadius(chip.factor)}
                          className={`cursor-pointer rounded-full border px-3 py-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--md-sys-color-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--md-sys-color-surface-container-low) ${T_BODY_SM} ${selected ? "border-(--md-sys-color-primary) bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary)" : "border-(--md-sys-color-outline-variant) bg-transparent text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high)"}`}
                        >
                          {chip.label} {chip.factor}x
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="range"
                    aria-label="Corner radius scale factor"
                    min={0.5}
                    max={2}
                    step={0.25}
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-(--md-sys-color-surface-container-highest) accent-(--md-sys-color-primary) outline-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--md-sys-color-surface-container-low) [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-(--md-sys-color-primary) [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-(--md-sys-color-primary)"
                  />
                  <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                    Scales px corners; `full` passes through.
                  </p>
                  <details>
                    <summary
                      className={`cursor-pointer ${T_BODY_SM} ${INK_SOFT}`}
                    >
                      How does the scale work?
                    </summary>
                    <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                      Every px corner multiplies by the factor and rounds to
                      0.5px. `full` (9999px) passes through untouched — a
                      scaled pill would be a different decision.
                    </p>
                  </details>
                </div>

                {/* 04 — mode + contrast segmented */}
                <div className="flex flex-col gap-2">
                  <span id="mode-label" className={FIELD}>
                    04 · Mode
                  </span>
                  <div
                    role="radiogroup"
                    aria-labelledby="mode-label"
                    className={SEG_WRAP}
                  >
                    {(
                      [
                        { label: "Light", active: !dark, onPick: () => setDark(false) },
                        { label: "Dark", active: dark, onPick: () => setDark(true) },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        role="radio"
                        aria-checked={opt.active}
                        onClick={opt.onPick}
                        className={`cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-primary) focus-visible:ring-inset ${opt.active ? SEG_ON : SEG_OFF}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <span id="contrast-label" className={FIELD}>
                    Contrast
                  </span>
                  <div
                    role="radiogroup"
                    aria-labelledby="contrast-label"
                    className={SEG_WRAP}
                  >
                    {(["standard", "medium", "high"] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        role="radio"
                        aria-checked={contrast === c}
                        onClick={() => setContrast(c)}
                        className={`cursor-pointer capitalize outline-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-primary) focus-visible:ring-inset ${contrast === c ? SEG_ON : SEG_OFF}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 05 — sticky export footer */}
                <div className="sticky bottom-0 -mx-5 -mb-5 flex flex-col gap-2 border-t border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) px-5 pt-4 pb-5">
                  <span className={FIELD}>05 · Export</span>
                  <p
                    className={`m-0 truncate font-mono ${T_BODY_SM} ${INK_SOFT}`}
                  >
                    {EXPORT_FILE}
                  </p>
                  <CopyButton
                    text={jsonSource}
                    label="Copy preset .json"
                  />
                  <div className="flex items-center gap-2">
                    <CopyButton text={presetSource} label="Copy TS" />
                    <CopyButton text={cssSource} label="Copy CSS" />
                    <button
                      type="button"
                      onClick={reset}
                      className={`cursor-pointer rounded-(--md-sys-shape-corner-small) px-2 py-1 ${T_BODY_SM} ${INK_SOFT} underline underline-offset-2 hover:text-(--md-sys-color-on-surface)`}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* RIGHT — live preview */}
            <div className="flex min-w-0 flex-col gap-4">
              <h2 id="preview" className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
                Live preview
              </h2>
              <section
                aria-labelledby="preview"
                style={vars as React.CSSProperties}
                className="flex flex-col gap-5 rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) p-6"
              >
                <Card>
                  <div className="flex flex-col gap-3 p-5">
                    <div className="flex items-center gap-2">
                      <Badge>New</Badge>
                      <span
                        className={`font-mono ${T_BODY_SM} text-(--md-sys-color-on-surface)`}
                      >
                        {mode} · {preset} · radius {radius.toFixed(2)}x
                      </span>
                    </div>
                    <p className={`m-0 ${T_SECTION} ${INK}`}>
                      The seed repaints this card
                    </p>
                    <p
                      className={`m-0 ${T_BODY_SM} text-(--md-sys-color-on-surface-variant)`}
                    >
                      Primary, onPrimary, container and onContainer follow the
                      seed ramp. Chips, badges and buttons below read the same
                      roles — one change, everywhere at once.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="primary">Primary</Button>
                      <Button variant="tonal">Tonal</Button>
                      <Button variant="outlined">Outlined</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Chip>Filter</Chip>
                      <Chip>Assist</Chip>
                    </div>
                  </div>
                </Card>
              </section>
              <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                A component assembly for judging the theme — not registry blocks
                (those do not exist yet). Every pixel above resolves a role from
                the current knob positions.
              </p>

              <h2 id="source" className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
                Preset source
              </h2>
              <div className={`flex flex-col gap-2 ${PANEL}`}>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`m-0 truncate font-mono ${T_BODY_SM} ${INK_SOFT}`}
                  >
                    {EXPORT_FILE} — resolves to exactly what you see.
                  </span>
                  <CopyButton text={jsonSource} label="Copy" />
                </div>
                <pre
                  className={`m-0 max-h-96 overflow-auto rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface-container-highest) p-4 font-mono ${T_BODY_SM} ${INK} whitespace-pre`}
                >
                  {jsonSource}
                </pre>
              </div>

              <details className={`flex flex-col gap-2 ${PANEL}`}>
                <summary className={`cursor-pointer ${T_BODY_SM} ${INK}`}>
                  TypeScript preset (defineThemePreset)
                </summary>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                      Same object, both places.
                    </span>
                    <CopyButton text={presetSource} />
                  </div>
                  <pre
                    className={`m-0 max-h-96 overflow-auto rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface-container-highest) p-4 font-mono ${T_BODY_SM} ${INK} whitespace-pre`}
                  >
                    {presetSource}
                  </pre>
                </div>
              </details>

              <details className={`flex flex-col gap-2 ${PANEL}`}>
                <summary className={`cursor-pointer ${T_BODY_SM} ${INK}`}>
                  Raw CSS vars for this mode ({mode})
                </summary>
                <pre
                  className={`m-0 max-h-72 overflow-auto rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface-container-highest) p-4 font-mono ${T_BODY_SM} ${INK_SOFT} whitespace-pre`}
                >
                  {cssSource}
                </pre>
              </details>
            </div>
          </div>

          <section
            aria-labelledby="boundaries"
            className="flex flex-col gap-3 border-t border-(--md-sys-color-outline-variant) pt-6"
          >
            <h2 id="boundaries" className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
              What the seed does and does not do
            </h2>
            <ul
              className={`m-0 flex list-disc flex-col gap-1 pl-5 ${T_BODY_SM} ${INK_SOFT}`}
            >
              <li>
                Recomputes 8 values: the primary family in both modes, via the
                package&apos;s own hue ramp at the nearest step to each
                role&apos;s M3 baseline tone — an approximation, not the HCT
                scheme algorithm.
              </li>
              <li>
                Leaves secondary, tertiary, error and surface families on the
                preset: a seed repainting error red would claim scheme rules
                this page does not implement.
              </li>
              <li>
                Contrast is argued from the mapping (M3&apos;s canonical pairs
                are designed to pass), not printed — the ratio function is not
                in the package&apos;s public API, so no number here is computed
                from an internal import.
              </li>
            </ul>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
