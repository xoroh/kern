/**
 * The theme studio — one app for theme configuration and per-family knobs.
 *
 * WHAT IT IS: the Playground's destination. The theme axes live in the URL
 * first (`studio-state`), so a shared link reopens the exact theme and a
 * refresh keeps it. The sidebar is the M3 canon section order top to bottom
 * (Presets → Seed color → Contrast → Scheme → Shape → Elevation → Export);
 * the stage judges the theme across surfaces, not one card; below it, a
 * per-family configurator panel puts the component knobs in the same app.
 *
 * STATE MODEL: three explicit, independent axes — `preset`, `mode`
 * (light/dark), `contrast` (standard/medium/high) — plus the seed and shape
 * scalars. Each axis has ONE named setter below (`setPreset`, `setMode`,
 * `setContrast`…); no axis is ever derived from another. The URL/storage
 * contract still serialises mode as `dark=1/0` (see `studio-state`), but the
 * UI reads and writes it as `mode` exactly once per setter.
 *
 * PRESET PICKER (presentation-only split):
 *   01 base rows (kern / sharp / compact) with live swatches,
 *   "+ New brand…" — the `brand` empty template with a prefilled export,
 *   "Tenant (session)" — `demo` + anything `registerVariant` added, badged.
 *
 * SNIPPET = STAGE: `jsonSource`/`presetSource`/`cssSource` and the preview's
 * CSS vars resolve from the same overrides object, so the export cannot
 * describe a theme the stage is not showing.
 */

import {
  Badge,
  Banner,
  Button,
  Card,
  Chip,
  Field,
  Input,
  Switch,
} from "@xoroh/kern";
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
import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState } from "react";
import { Configurator } from "../../showcase/configurator";
import { CopyButton } from "../../showcase/copy-button";
import { CONFIGURATORS, configuratorFor } from "../../showcase/registry";
import { seedOverrides } from "../../theme-studio/seed";
import {
  isHex6,
  STUDIO_DEFAULTS,
  type StudioContrast,
  type StudioState,
} from "../../theme-studio/studio-state";
import {
  T_BODY_SM,
  T_CODE,
  T_LABEL,
  T_SECTION,
  T_SMALL_TITLE,
} from "../shared/systems/type-scale";
import {
  CARD,
  FOCUS_RING,
  INK,
  INK_SOFT,
  LINK,
  PILL_ACTIVE,
  PILL_REST,
  STATE_LAYERS,
  TRANSITION,
} from "../shared/systems/ui";

/* ---------------------------------------------------------------- kit ---- */

/** One sidebar/panel group: a tonal section (surface-container-low, small corner). */
const GROUP =
  "flex flex-col gap-3 rounded-(--md-sys-shape-corner-large-increased) bg-(--md-sys-color-surface-container) p-5";
/** Field/group label — sentence case, label-small, secondary ink. */
const FIELD = `m-0 ${T_LABEL} ${INK_SOFT}`;
const DOT = "block size-4 rounded-full border border-black/20";
/** A picker row: ≥48dp, transparent at rest with the shared state layers. */
const ROW = `flex min-h-12 w-full cursor-pointer items-center gap-2.5 rounded-(--md-sys-shape-corner-small) px-3 text-left ${T_BODY_SM} ${INK_SOFT} ${STATE_LAYERS} ${TRANSITION} hover:text-(--md-sys-color-on-surface) ${FOCUS_RING}`;
/** Selected row — the selected pair (secondary-container), never border + fill. */
const ROW_ON = `bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)`;
/** Segmented control container — hairline only, no fill (one expression). */
const SEG_WRAP = `flex gap-1 rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-surface-container-high) p-1`;
/** One segment: ≥48dp, state layers, small corner. */
const SEG = `flex min-h-12 flex-1 cursor-pointer items-center justify-center px-3 ${T_BODY_SM} ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING}`;
const SEG_ON = `rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)`;
const SEG_OFF = `rounded-(--md-sys-shape-corner-full) ${INK_SOFT} hover:text-(--md-sys-color-on-surface)`;
/** A shape chip — pill geometry, selected uses the kit's selected pair. */
const CHIP = `inline-flex min-h-12 cursor-pointer items-center px-3 ${T_BODY_SM} ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING}`;
/** A code/token literal line. */
const CODE_LINE = `m-0 ${T_CODE} ${INK_SOFT}`;

const CATALOG = (
  catalogJson as { themes: { id: string; name: string; description: string }[] }
).themes;

function presetLabel(id: string): string {
  return CATALOG.find((entry) => entry.id === id)?.name ?? id;
}
function presetDescription(id: string): string | undefined {
  return CATALOG.find((entry) => entry.id === id)?.description;
}

/** px values scale; `full` passes through untouched. */
export function scaleShape(
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

/** The `brand` empty template — selecting "+ New brand…" lands here. */
const NEW_BRAND_ID = "brand";
const BASE_PRESET_IDS = ["kern", "sharp", "compact"] as const;

/** The light/dark axis, named — never read as a derived boolean downstream. */
type StudioMode = "light" | "dark";

type SwatchRow = {
  id: string;
  primary: string;
  secondary: string;
  surfaceContainer: string;
  badge?: "session";
};

export function ThemeStudio({
  state,
  onChange,
}: {
  state: StudioState;
  onChange: (next: StudioState) => void;
}) {
  const { seed: seedHex, preset, dark, contrast, radius } = state;
  const [seedText, setSeedText] = useState(seedHex);
  const [family, setFamily] = useState<string>("Button");

  /* -------------------------------------------------- the three axes ---- */

  /**
   * The theme axes, each explicit. `mode` is ONE value read here (from the
   * URL contract's `dark` flag) and consumed as `axes.mode` everywhere — no
   * call site re-derives it, and preset/contrast are never inferred from it.
   */
  const axes = useMemo(
    () => ({
      preset,
      mode: (dark ? "dark" : "light") as StudioMode,
      contrast,
    }),
    [preset, dark, contrast],
  );

  /* Named setters — one per knob. No `onChange({ ...state, … })` spread
     reaches a control; each axis is written by name only. */
  const setSeed = (seed: string) => onChange({ ...state, seed });
  const setPreset = (nextPreset: string) =>
    onChange({ ...state, preset: nextPreset });
  const setMode = (mode: StudioMode) =>
    onChange({ ...state, dark: mode === "dark" });
  const setContrast = (next: StudioContrast) =>
    onChange({ ...state, contrast: next });
  const setRadius = (next: number) => onChange({ ...state, radius: next });

  // Typing an invalid hex keeps the last good ramp — the preview never reads
  // a value makeHueRamp would reject.
  function onSeedText(v: string) {
    setSeedText(v);
    if (isHex6(v)) setSeed(v.toLowerCase());
  }

  function reset() {
    setSeedText(STUDIO_DEFAULTS.seed);
    onChange({ ...STUDIO_DEFAULTS });
  }

  // Scheme choices from BOTH authorities: built-in ThemeIds always resolve;
  // registry variants (`registerVariant`) appear here with no site edit.
  // Presentation-only split: base rows, then "+ New brand…", then tenants.
  const registryIds = useMemo(() => listVariants().map((v) => v.id), []);
  const tenantIds = useMemo(() => {
    const catalogTenants = CATALOG.map((entry) => entry.id).filter(
      (id) =>
        !BASE_PRESET_IDS.includes(id as (typeof BASE_PRESET_IDS)[number]) &&
        id !== NEW_BRAND_ID,
    );
    return [
      ...catalogTenants,
      ...registryIds.filter((id) => !catalogTenants.includes(id)),
    ];
  }, [registryIds]);

  const allIds = useMemo(
    () => [...BASE_PRESET_IDS, NEW_BRAND_ID, ...tenantIds] as string[],
    [tenantIds],
  );

  const swatchRows: SwatchRow[] = useMemo(
    () =>
      allIds.map((id) => {
        const selection = (themeIds() as string[]).includes(id)
          ? id
          : getVariant(id);
        const color = resolveThemeDetails(
          axes.mode,
          axes.contrast,
          selection as never,
        ).color;
        return {
          id,
          primary: color.primary,
          secondary: color.secondary,
          surfaceContainer: color.surfaceContainer,
          badge: tenantIds.includes(id) ? ("session" as const) : undefined,
        };
      }),
    [allIds, tenantIds, axes.mode, axes.contrast],
  );

  const theme: CustomTheme = useMemo(() => {
    const selection = (themeIds() as string[]).includes(preset)
      ? preset
      : getVariant(preset);
    const light = resolveThemeLayers("light", contrast, selection);
    const darkLayers = resolveThemeLayers("dark", contrast, selection);
    let seed: { light: Record<string, string>; dark: Record<string, string> };
    try {
      seed = seedOverrides(seedHex).color;
    } catch {
      seed = seedOverrides(STUDIO_DEFAULTS.seed).color;
    }
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
  }, [seedHex, preset, contrast, radius]);

  const resolved = useMemo(() => {
    const scheme = resolveThemeLayers(axes.mode, axes.contrast, preset).scheme;
    return {
      color: { ...scheme, ...(theme.overrides.color?.[axes.mode] ?? {}) },
      shape: theme.overrides.shape ?? {},
    };
  }, [axes.mode, axes.contrast, preset, theme]);

  const vars = useMemo(() => {
    const out: Record<string, string> = { colorScheme: axes.mode };
    for (const [role, value] of Object.entries(resolved.color)) {
      out[varName(role)] = value;
    }
    for (const [role, value] of Object.entries(resolved.shape)) {
      out[shapeVarName(role)] = value;
    }
    return out;
  }, [resolved, axes.mode]);

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

  // The export artifact is prefilled `themes/<id>.json` — the id follows the
  // selection, so "+ New brand…" exports as `themes/brand.json`.
  const exportFile = `themes/${preset}.json`;

  const row = (r: SwatchRow): ReactNode => {
    const selected = preset === r.id;
    return (
      // biome-ignore lint/a11y/useSemanticElements: ARIA radio pattern over styled picker buttons — a native radio cannot carry the swatch treatment, and these are pickers, not a form's radio set.
      <button
        key={r.id}
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={() => setPreset(r.id)}
        title={presetDescription(r.id)}
        className={`${ROW} ${selected ? ROW_ON : ""}`}
      >
        <span aria-hidden="true" className="flex shrink-0 items-center gap-1">
          <span className={DOT} style={{ backgroundColor: r.primary }} />
          <span className={DOT} style={{ backgroundColor: r.secondary }} />
          <span
            className={DOT}
            style={{ backgroundColor: r.surfaceContainer }}
          />
        </span>
        <span className={selected ? INK : undefined}>{presetLabel(r.id)}</span>
        {r.badge === "session" ? (
          <span
            className={`ml-auto rounded-(--md-sys-shape-corner-full) border border-(--md-sys-color-outline-variant) px-2 py-0.5 ${T_LABEL} ${INK_SOFT}`}
          >
            Tenant (session)
          </span>
        ) : null}
      </button>
    );
  };

  const familySpec = configuratorFor(family);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
      {/* SIDEBAR — 300px theme builder, M3 canon order (Presets → Seed
          color → Contrast → Scheme → Shape → Elevation → Export) */}
      <aside
        aria-label="Theme controls"
        className="flex h-fit w-full flex-col lg:w-[300px]"
      >
        <div className={`flex flex-col gap-4 ${CARD} p-5`}>
          <h2 id="controls" className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
            Theme builder
          </h2>

          {/* Presets — rows with live swatches + "+ New brand…" + tenants */}
          <div className={GROUP}>
            <span id="preset-label" className={FIELD}>
              Presets
            </span>
            <div
              role="radiogroup"
              aria-labelledby="preset-label"
              className="flex flex-col gap-1"
            >
              {swatchRows
                .filter((r) => BASE_PRESET_IDS.includes(r.id as never))
                .map(row)}
              <button
                type="button"
                onClick={() => setPreset(NEW_BRAND_ID)}
                title="Start a brand preset from the empty template — the export is prefilled as themes/brand.json"
                className={`${ROW} ${preset === NEW_BRAND_ID ? ROW_ON : ""}`}
              >
                <span aria-hidden="true">+</span>
                <span>New brand…</span>
              </button>
              {tenantIds.length > 0 ? (
                <>
                  <span className={`${FIELD} mt-1`}>Tenants</span>
                  {swatchRows.filter((r) => r.badge === "session").map(row)}
                </>
              ) : null}
            </div>
          </div>

          {/* Seed color — one line above the fold */}
          <div className={GROUP}>
            <span id="seed-label" className={FIELD}>
              Seed color
            </span>
            <span className="flex items-center gap-2">
              <input
                type="color"
                aria-label="Primary seed color"
                value={isHex6(seedText) ? seedText : seedHex}
                onChange={(e) => onSeedText(e.target.value)}
                className="h-12 w-16 cursor-pointer rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant) bg-transparent p-1"
              />
              <input
                type="text"
                aria-label="Primary seed hex value"
                value={seedText}
                spellCheck={false}
                onChange={(e) => onSeedText(e.target.value)}
                className={`min-h-12 w-28 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant) bg-transparent px-2 font-mono ${T_BODY_SM} ${INK} ${FOCUS_RING}`}
              />
            </span>
            <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
              Repaints the primary family; the preset keeps the rest.
            </p>
            <details>
              <summary
                className={`flex min-h-12 cursor-pointer items-center ${T_BODY_SM} ${INK} ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING}`}
              >
                What does the seed change?
              </summary>
              <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                Recomputes primary, onPrimary, container and onContainer in both
                modes from the seed&apos;s hue ramp at each role&apos;s M3
                baseline tone — an approximation, not the HCT scheme algorithm.
                Secondary, tertiary, error and surface stay on the preset.
              </p>
            </details>
          </div>

          {/* Contrast — standard / medium / high */}
          <div className={GROUP}>
            <span id="contrast-label" className={FIELD}>
              Contrast
            </span>
            <div
              role="radiogroup"
              aria-labelledby="contrast-label"
              className={SEG_WRAP}
            >
              {(["standard", "medium", "high"] as const).map((c) => (
                // biome-ignore lint/a11y/useSemanticElements: ARIA radio pattern over styled picker buttons — a native radio cannot carry the segment treatment, and these are pickers, not a form's radio set.
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={contrast === c}
                  onClick={() => setContrast(c)}
                  className={`${SEG} ${contrast === c ? SEG_ON : SEG_OFF}`}
                >
                  {c[0].toUpperCase()}
                  {c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Scheme — light / dark */}
          <div className={GROUP}>
            <span id="scheme-label" className={FIELD}>
              Scheme
            </span>
            <div
              role="radiogroup"
              aria-labelledby="scheme-label"
              className={SEG_WRAP}
            >
              {(
                [
                  { label: "Light", mode: "light" as const },
                  { label: "Dark", mode: "dark" as const },
                ] as const
              ).map((opt) => (
                // biome-ignore lint/a11y/useSemanticElements: ARIA radio pattern over styled picker buttons — a native radio cannot carry the segment treatment, and these are pickers, not a form's radio set.
                <button
                  key={opt.mode}
                  type="button"
                  role="radio"
                  aria-checked={axes.mode === opt.mode}
                  onClick={() => setMode(opt.mode)}
                  className={`${SEG} ${axes.mode === opt.mode ? SEG_ON : SEG_OFF}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shape — chips + slider */}
          <div className={GROUP}>
            <span id="shape-label" className={FIELD}>
              Shape — {radius.toFixed(2)}x
            </span>
            <div
              role="radiogroup"
              aria-labelledby="shape-label"
              className="flex flex-wrap gap-1.5"
            >
              {SHAPE_CHIPS.map((chip) => {
                const selected = radius === chip.factor;
                return (
                  // biome-ignore lint/a11y/useSemanticElements: ARIA radio pattern over styled picker buttons — a native radio cannot carry the chip treatment, and these are pickers, not a form's radio set.
                  <button
                    key={chip.label}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setRadius(chip.factor)}
                    className={`${CHIP} ${selected ? PILL_ACTIVE : PILL_REST}`}
                  >
                    {chip.label} {chip.factor}x
                  </button>
                );
              })}
            </div>
            {/* The slider keeps a 48dp target: the input spans the full
                height; the visible track is a pointer-events-none strip
                behind it. */}
            <div className="relative flex min-h-12 items-center">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 h-1 rounded-full bg-(--md-sys-color-surface-container-highest)"
              />
              <input
                type="range"
                aria-label="Corner radius scale factor"
                min={0.5}
                max={2}
                step={0.25}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className={`relative h-12 w-full cursor-pointer appearance-none bg-transparent outline-none ${FOCUS_RING} [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-(--md-sys-color-primary) [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-(--md-sys-color-primary)`}
              />
            </div>
            <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
              Scales px corners; `full` passes through.
            </p>
          </div>

          {/* Elevation — the honest stance: the ramp exists, it belongs to
              floating layers, and the studio deliberately has no knob. */}
          <div className={GROUP}>
            <span id="elevation-label" className={FIELD}>
              Elevation
            </span>
            <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
              Elevation is the M3 shadow ramp, and shadows belong to floating
              layers only — menus, dialogs, drawers. Resting content is flat by
              law, so the preview carries no resting shadow and this studio
              ships no elevation knob.
            </p>
            <p className={CODE_LINE}>--md-sys-elevation-level0 … level5</p>
          </div>

          {/* Export — sticky footer */}
          <div className="sticky bottom-0 -mx-5 -mb-5 flex flex-col gap-2 border-t border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) px-5 pt-4 pb-5">
            <span className={FIELD}>Export</span>
            <p className={`m-0 truncate font-mono ${T_BODY_SM} ${INK_SOFT}`}>
              {exportFile}
            </p>
            <CopyButton text={jsonSource} label="Copy preset .json" />
            <div className="flex flex-wrap items-center gap-2">
              <CopyButton text={presetSource} label="Copy TS" />
              <CopyButton text={cssSource} label="Copy CSS" />
              <button
                type="button"
                onClick={reset}
                className={`inline-flex min-h-12 cursor-pointer items-center px-2 ${T_BODY_SM} ${LINK} ${TRANSITION} ${FOCUS_RING}`}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT — gallery preview + per-family knobs + source */}
      <div className="flex min-w-0 flex-col gap-4">
        <h2 id="preview" className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
          Live preview
        </h2>
        <section
          aria-labelledby="preview"
          style={vars as CSSProperties}
          className={`flex flex-col gap-5 ${CARD} p-6`}
        >
          <Card>
            <div className="flex flex-col gap-3 p-5">
              <div className="flex items-center gap-2">
                <Badge>New</Badge>
                <span className={`font-mono ${T_BODY_SM} ${INK}`}>
                  {axes.mode} · {preset} · radius {radius.toFixed(2)}x
                </span>
              </div>
              <p className={`m-0 ${T_SECTION} ${INK}`}>
                Judge the theme across surfaces
              </p>
              <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                Primary, onPrimary, container and onContainer follow the seed
                ramp. Every surface below reads the same roles — one change,
                everywhere at once.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="tonal">Tonal</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Chip>Filter</Chip>
                <Chip>Assist</Chip>
              </div>
              <Field.Root>
                <Field.Label>Email address</Field.Label>
                <Field.Control placeholder="you@example.com" />
                <Field.Description>
                  We only use this for sign-in.
                </Field.Description>
              </Field.Root>
              <Input placeholder="Password" aria-label="Password" />
              <div className="flex items-center gap-3">
                <Switch aria-label="Notifications" defaultChecked />
                <Switch aria-label="Marketing" />
              </div>
              <Banner variant="info">Scheduled maintenance tonight</Banner>
            </div>
          </Card>
        </section>
        <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
          A component gallery for judging the theme across surfaces. Every pixel
          above resolves a role from the current knob positions.
        </p>

        {/* Per-family configurator panels, in the same app (the one customizer). */}
        <h2 id="family-knobs" className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
          Component knobs
        </h2>
        <div className={`flex flex-col gap-3 ${CARD} p-5`}>
          <label className={`flex flex-col gap-1 ${T_BODY_SM} ${INK_SOFT}`}>
            Family
            <select
              value={family}
              onChange={(e) => setFamily(e.target.value)}
              className={`min-h-12 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant) bg-transparent px-2 ${T_BODY_SM} ${INK} ${FOCUS_RING}`}
            >
              {Object.keys(CONFIGURATORS).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          {familySpec ? (
            <Configurator spec={familySpec} />
          ) : (
            <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
              No configurator for {family}.
            </p>
          )}
        </div>

        <h2 id="source" className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
          Preset source
        </h2>
        <div className={`flex flex-col gap-2 ${CARD} p-5`}>
          <div className="flex items-center justify-between gap-2">
            <span className={`m-0 truncate font-mono ${T_BODY_SM} ${INK_SOFT}`}>
              {exportFile} — resolves to exactly what you see.
            </span>
            <CopyButton text={jsonSource} label="Copy" />
          </div>
          <pre
            className={`m-0 max-h-96 overflow-auto rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface-container-low) p-4 font-mono ${T_BODY_SM} ${INK} whitespace-pre`}
          >
            {jsonSource}
          </pre>
        </div>

        <details className={`flex flex-col gap-2 ${CARD} p-5`}>
          <summary
            className={`flex min-h-12 cursor-pointer items-center ${T_BODY_SM} ${INK} ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING}`}
          >
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
              className={`m-0 max-h-96 overflow-auto rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface-container-low) p-4 font-mono ${T_BODY_SM} ${INK} whitespace-pre`}
            >
              {presetSource}
            </pre>
          </div>
        </details>

        <details className={`flex flex-col gap-2 ${CARD} p-5`}>
          <summary
            className={`flex min-h-12 cursor-pointer items-center ${T_BODY_SM} ${INK} ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING}`}
          >
            CSS variables
          </summary>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                The same roles the stage reads.
              </span>
              <CopyButton text={cssSource} />
            </div>
            <pre
              className={`m-0 max-h-96 overflow-auto rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface-container-low) p-4 font-mono ${T_BODY_SM} ${INK} whitespace-pre`}
            >
              {`{\n${cssSource}\n}`}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}
