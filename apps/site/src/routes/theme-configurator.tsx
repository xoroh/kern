/**
 * /theme-configurator — the theme studio (shadcn-studio pattern, kern rules).
 *
 * Left: token controls (primary seed, scheme preset, radius scale, dark
 * toggle, contrast). Right: live preview — real components from `@xoroh/kern`
 * in a container whose CSS vars are the resolved theme, so the preview IS the
 * tokens, not a picture of them. Below: the preset source the knobs produce,
 * built from the SAME resolved object (the configurator-harness rule: the
 * fence cannot drift from the stage).
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
import catalogJson from "@xoroh/kern-tokens/themes/index.json";
import { useMemo, useState } from "react";
import { SiteLayout } from "../domains/shared/chrome/site-layout";
import { routeHead } from "../domains/shared/systems/seo";
import {
  T_BODY,
  T_BODY_SM,
  T_LABEL,
  T_PAGE,
  T_SECTION,
  T_SMALL_TITLE,
} from "../domains/shared/systems/type-scale";
import { CopyButton } from "../showcase/copy-button";
import { seedOverrides } from "../theme-studio/seed";

export const Route = createFileRoute("/theme-configurator")({
  head: () =>
    routeHead(
      "Theme configurator",
      "Theme studio — tune tokens and preview them on real components.",
    ),
  component: ThemeConfigurator,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const PANEL =
  "rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) p-5";
const FIELD = `m-0 ${T_LABEL} ${INK_SOFT} uppercase`;

// Display names for the preset picker, read from the package's own catalog
// (`themes/index.json`) — a new preset appears here with its name and
// description and no site edit, the same dynamic the preview relies on.
const CATALOG = (
  catalogJson as {
    themes: { id: string; name: string; description: string }[];
  }
).themes;
function presetLabel(id: string): string {
  return CATALOG.find((entry) => entry.id === id)?.name ?? id;
}
function presetDescription(id: string): string | undefined {
  return CATALOG.find((entry) => entry.id === id)?.description;
}

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

  const theme: CustomTheme = useMemo(() => {
    // One selection for every resolver: a ThemeId passes through, a registry
    // variant id resolves to its override object. Two spellings, one table.
    const selection = (themeIds() as string[]).includes(preset)
      ? preset
      : getVariant(preset);
    const light = resolveThemeLayers("light", contrast, selection);
    const dark = resolveThemeLayers("dark", contrast, selection);
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
          dark: { ...dark.deltas, ...seed.dark },
        },
        shape,
      },
    };
  }, [seedHex, defaultSeed, preset, contrast, radius]);

  const mode = dark ? "dark" : "light";
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
              Turn the knobs on the left; the components on the right re-render
              in the resolved theme. Everything right of this sentence reads CSS
              vars — the preview is the tokens. Copy the preset source and it
              resolves to exactly what you see.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[20rem_1fr]">
            {/* LEFT — controls */}
            <div className={`flex flex-col gap-5 ${PANEL} h-fit`}>
              <h2 id="controls" className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
                Token controls
              </h2>

              <label className="flex flex-col gap-2">
                <span className={FIELD}>Primary seed</span>
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
                <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                  Recomputes the primary family (primary, onPrimary, container,
                  onContainer — both modes). Everything else stays on the preset
                  below.
                </span>
              </label>

              <div className="flex flex-col gap-2">
                <span id="preset-label" className={FIELD}>
                  Scheme preset
                </span>
                <div
                  role="radiogroup"
                  aria-labelledby="preset-label"
                  className="flex flex-wrap gap-2"
                >
                  {presets.map((id) => (
                    <Button
                      key={id}
                      size="sm"
                      variant={preset === id ? "primary" : "tonal"}
                      aria-pressed={preset === id}
                      title={presetDescription(id)}
                      onClick={() => setPreset(id)}
                    >
                      {presetLabel(id)}
                    </Button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-2">
                <span className={FIELD}>
                  Radius scale — {radius.toFixed(2)}x
                </span>
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
                <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                  Multiplies px corners, rounded to 0.5px. `full` passes through
                  — a scaled pill is a different decision.
                </span>
              </label>

              <div className="flex items-center justify-between gap-3">
                <span id="dark-label" className={`${T_BODY_SM} ${INK}`}>
                  Dark mode
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={dark}
                  aria-labelledby="dark-label"
                  onClick={() => setDark((d) => !d)}
                  className={`relative flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-full border-2 px-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--md-sys-color-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--md-sys-color-surface-container-low) ${dark ? "justify-end border-(--md-sys-color-primary) bg-(--md-sys-color-primary)" : "border-(--md-sys-color-outline) bg-(--md-sys-color-surface)"}`}
                >
                  <span
                    aria-hidden="true"
                    className={`block rounded-full transition-all ${dark ? "size-5 bg-(--md-sys-color-on-primary)" : "size-4 bg-(--md-sys-color-outline)"}`}
                  />
                </button>
              </div>

              <label className="flex flex-col gap-2">
                <span className={FIELD}>Contrast</span>
                <select
                  aria-label="Contrast level"
                  value={contrast}
                  onChange={(e) =>
                    setContrast(
                      e.target.value as "standard" | "medium" | "high",
                    )
                  }
                  className={`w-full cursor-pointer appearance-none rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-transparent py-2 pr-8 pl-3 outline-none ${T_BODY_SM} ${INK} focus-visible:ring-2 focus-visible:ring-(--md-sys-color-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--md-sys-color-surface-container-low)`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='currentColor' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                  }}
                >
                  {(["standard", "medium", "high"] as const).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* RIGHT — live preview */}
            <div className="flex flex-col gap-4">
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
                  <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                    Resolves to exactly what you see — same object, both places.
                  </span>
                  <CopyButton text={presetSource} />
                </div>
                <pre
                  className={`m-0 max-h-96 overflow-auto rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface-container-highest) p-4 font-mono ${T_BODY_SM} ${INK} whitespace-pre`}
                >
                  {presetSource}
                </pre>
              </div>

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
