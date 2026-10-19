/**
 * Playground — ground-up, authentic Material Design 3 Theme & System Creator.
 *
 * Full-bleed 3-section workbench layout:
 * - Section 1: M3 Navigation Rail on the left with logo, destinations, and bottom utilities.
 * - Section 2: Editor / Selection Pane with its own header and independent scroll container.
 * - Section 3: Live Preview Canvas Stage with its own header, viewports, and independent canvas.
 * - No global top header: each pane owns its 64px header and scroll boundary.
 * - Authentic M3 Canon: Tonal elevation surfaces, zero harsh wireframe border lines,
 *   cohesive dynamic color schemes where every button, container, and surface belongs to the seed.
 */

import {
  Badge,
  Banner,
  Button,
  Card,
  Chip,
  Dialog,
  ExtendedFab,
  LinearProgress,
  SegmentedButton,
  Switch,
  Table,
  Tabs,
} from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import catalogJson from "@xoroh/kern-m3/themes/index.json";
import {
  type CustomTheme,
  getVariant,
  hexToOklch,
  listVariants,
  makeHueRamp,
  resolveThemeDetails,
  resolveThemeLayers,
  shapeVarName,
  themeIds,
  varName,
} from "@xoroh/kern-tokens";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "../../showcase/copy-button";
import { BLOCK_VIEWS, installCommand } from "../blocks/registry";
import {
  T_BODY,
  T_BODY_MD,
  T_BODY_SM,
  T_CODE,
  T_KICKER,
  T_LABEL,
  T_SECTION,
  T_SUB,
} from "../shared/systems/type-scale";
import { FOCUS_RING, STATE_LAYERS, TRANSITION } from "../shared/systems/ui";
import {
  isHex6,
  PLAYGROUND_DEFAULTS,
  type PlaygroundContrast,
  type PlaygroundDensity,
  type PlaygroundFont,
  type PlaygroundState,
  type PlaygroundSystem,
} from "./playground-state";

/* ---------------------------------------------------------------- kit ---- */

/** Multi-system options supported by the Playground. */
const SYSTEM_OPTIONS = [
  {
    id: "m3" as const,
    label: "Material 3",
    tagline: "Google M3 Token Science & Tonal Elevation Ladder",
    icon: "palette" as const,
  },
  {
    id: "astryx" as const,
    label: "Astryx",
    tagline: "High-Contrast Architectural & Precision UI System",
    icon: "view_quilt" as const,
  },
  {
    id: "shadcn" as const,
    label: "shadcn / UI",
    tagline: "Tailwind CSS HSL Semantic Component Tokens",
    icon: "layers" as const,
  },
] as const;

const ASTRYX_PALETTES = [
  { id: "cyan", name: "Electric Cyan", hex: "#06b6d4" },
  { id: "lime", name: "Cyber Lime", hex: "#84cc16" },
  { id: "violet", name: "Hyper Violet", hex: "#8b5cf6" },
  { id: "orange", name: "Flame Orange", hex: "#f97316" },
  { id: "pink", name: "Laser Pink", hex: "#ec4899" },
  { id: "mono", name: "Stark Mono", hex: "#38bdf8" },
] as const;

const SHADCN_PALETTES = [
  { id: "zinc", name: "Zinc", hex: "#18181b" },
  { id: "slate", name: "Slate", hex: "#475569" },
  { id: "indigo", name: "Indigo", hex: "#4f46e5" },
  { id: "rose", name: "Rose", hex: "#e11d48" },
  { id: "orange", name: "Orange", hex: "#ea580c" },
  { id: "blue", name: "Blue", hex: "#2563eb" },
] as const;

const SHADCN_RADIUS_OPTIONS = [
  { label: "0", factor: 0 },
  { label: "0.3rem", factor: 0.35 },
  { label: "0.5rem", factor: 0.6 },
  { label: "0.75rem", factor: 0.9 },
  { label: "1.0rem", factor: 1.25 },
] as const;

const ASTRYX_RADIUS_OPTIONS = [
  { label: "Sharp (0px)", factor: 0 },
  { label: "Micro (4px)", factor: 0.35 },
  { label: "Standard (8px)", factor: 0.75 },
  { label: "Rounded (12px)", factor: 1.2 },
] as const;

/** 12 Curated M3 seed colors for instant palette selection. */
const SEED_PALETTES = [
  { id: "purple", name: "M3 Purple", hex: "#6750a4" },
  { id: "indigo", name: "Indigo", hex: "#4338ca" },
  { id: "blue", name: "Royal Blue", hex: "#1d4ed8" },
  { id: "cyan", name: "Cyan", hex: "#0284c7" },
  { id: "teal", name: "Teal", hex: "#0f766e" },
  { id: "emerald", name: "Emerald", hex: "#059669" },
  { id: "amber", name: "Amber", hex: "#d97706" },
  { id: "orange", name: "Orange", hex: "#ea580c" },
  { id: "rose", name: "Rose", hex: "#e11d48" },
  { id: "violet", name: "Violet", hex: "#7c3aed" },
  { id: "slate", name: "Slate", hex: "#334155" },
  { id: "mono", name: "Charcoal", hex: "#262626" },
] as const;

/** Shape corner radius presets. */
const RADIUS_OPTIONS = [
  { label: "Sharp", factor: 0 },
  { label: "Compact", factor: 0.5 },
  { label: "Standard", factor: 1.0 },
  { label: "Rounded", factor: 2.0 },
] as const;

/** Font families supported by the playground. */
const FONT_OPTIONS: Array<{
  id: PlaygroundFont;
  name: string;
  family: string;
}> = [
  {
    id: "inter",
    name: "Inter",
    family: "Inter, system-ui, -apple-system, sans-serif",
  },
  {
    id: "roboto",
    name: "Roboto",
    family: "Roboto, system-ui, -apple-system, sans-serif",
  },
  {
    id: "system",
    name: "System",
    family:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  {
    id: "geist",
    name: "Geist",
    family: "'Geist', 'Plus Jakarta Sans', system-ui, sans-serif",
  },
  {
    id: "mono",
    name: "Mono",
    family: "ui-monospace, 'JetBrains Mono', 'Fira Code', monospace",
  },
];

/** UI Spacing & density options. */
const DENSITY_OPTIONS: Array<{
  id: PlaygroundDensity;
  name: string;
}> = [
  { id: "compact", name: "Compact" },
  { id: "standard", name: "Standard" },
  { id: "comfortable", name: "Spacious" },
];

const CATALOG = (
  catalogJson as { themes: { id: string; name: string; description: string }[] }
).themes;

function presetLabel(id: string): string {
  return CATALOG.find((entry) => entry.id === id)?.name ?? id;
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

/**
 * Derives a complete, authentic Material Design 3 color scheme from any seed hex.
 * Guarantees proper M3 tone mappings:
 * - Light: Primary T40, onPrimary T100, PrimaryContainer T90, onPrimaryContainer T10
 * - Dark: Primary T80, onPrimary T20, PrimaryContainer T30, onPrimaryContainer T90
 * - Secondary and Tertiary ramps derived with proportional chroma and hue shifts
 * - Neutral and Neutral Variant surfaces subtly tinted with the seed hue
 */
function deriveM3Scheme(seedHex: string, dark: boolean) {
  try {
    const ramp = makeHueRamp({ hex: seedHex });
    const base = hexToOklch(seedHex);
    const secRamp = makeHueRamp({
      hue: base.h,
      chroma: Math.min(base.c * 0.45, 0.05),
    });
    const tertRamp = makeHueRamp({
      hue: (base.h + 60) % 360,
      chroma: Math.min(base.c * 0.75, 0.08),
    });
    const neuRamp = makeHueRamp({ hue: base.h, chroma: 0.012 });
    const neuVarRamp = makeHueRamp({ hue: base.h, chroma: 0.024 });

    if (!dark) {
      return {
        primary: ramp["600"].srgb,
        "on-primary": "#ffffff",
        "primary-container": ramp["100"].srgb,
        "on-primary-container": ramp["900"].srgb,
        secondary: secRamp["600"].srgb,
        "on-secondary": "#ffffff",
        "secondary-container": secRamp["100"].srgb,
        "on-secondary-container": secRamp["900"].srgb,
        tertiary: tertRamp["600"].srgb,
        "on-tertiary": "#ffffff",
        "tertiary-container": tertRamp["100"].srgb,
        "on-tertiary-container": tertRamp["900"].srgb,
        surface: neuRamp["50"].srgb,
        "on-surface": neuRamp["900"].srgb,
        "surface-variant": neuVarRamp["100"].srgb,
        "on-surface-variant": neuVarRamp["700"].srgb,
        "surface-container-lowest": "#ffffff",
        "surface-container-low": neuRamp["50"].srgb,
        "surface-container": neuRamp["100"].srgb,
        "surface-container-high": neuRamp["200"].srgb,
        "surface-container-highest": neuRamp["300"].srgb,
        outline: neuVarRamp["500"].srgb,
        "outline-variant": neuVarRamp["200"].srgb,
      };
    }

    return {
      primary: ramp["200"].srgb,
      "on-primary": ramp["900"].srgb,
      "primary-container": ramp["700"].srgb,
      "on-primary-container": ramp["100"].srgb,
      secondary: secRamp["200"].srgb,
      "on-secondary": secRamp["900"].srgb,
      "secondary-container": secRamp["700"].srgb,
      "on-secondary-container": secRamp["100"].srgb,
      tertiary: tertRamp["200"].srgb,
      "on-tertiary": tertRamp["900"].srgb,
      "tertiary-container": tertRamp["700"].srgb,
      "on-tertiary-container": tertRamp["100"].srgb,
      surface: neuRamp["950"].srgb,
      "on-surface": neuRamp["100"].srgb,
      "surface-variant": neuVarRamp["800"].srgb,
      "on-surface-variant": neuVarRamp["300"].srgb,
      "surface-container-lowest": neuRamp["950"].srgb,
      "surface-container-low": neuRamp["900"].srgb,
      "surface-container": neuRamp["800"].srgb,
      "surface-container-high": neuRamp["700"].srgb,
      "surface-container-highest": neuRamp["600"].srgb,
      outline: neuVarRamp["400"].srgb,
      "outline-variant": neuVarRamp["800"].srgb,
    };
  } catch {
    return null;
  }
}

function deriveAstryxScheme(seedHex: string, dark: boolean) {
  try {
    const ramp = makeHueRamp({ hex: seedHex });
    if (!dark) {
      return {
        primary: ramp["600"].srgb,
        "on-primary": "#ffffff",
        "primary-container": "#f1f5f9",
        "on-primary-container": ramp["700"].srgb,
        secondary: "#0f172a",
        "on-secondary": "#ffffff",
        "secondary-container": "#f8fafc",
        "on-secondary-container": "#0f172a",
        tertiary: ramp["500"].srgb,
        "on-tertiary": "#ffffff",
        "tertiary-container": "#f1f5f9",
        "on-tertiary-container": "#0f172a",
        surface: "#ffffff",
        "on-surface": "#020617",
        "surface-variant": "#f1f5f9",
        "on-surface-variant": "#475569",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f8fafc",
        "surface-container": "#f1f5f9",
        "surface-container-high": "#e2e8f0",
        "surface-container-highest": "#cbd5e1",
        outline: "#94a3b8",
        "outline-variant": "#e2e8f0",
      };
    }
    return {
      primary: ramp["400"].srgb,
      "on-primary": "#020617",
      "primary-container": "#0f172a",
      "on-primary-container": ramp["300"].srgb,
      secondary: "#e2e8f0",
      "on-secondary": "#020617",
      "secondary-container": "#1e293b",
      "on-secondary-container": "#f8fafc",
      tertiary: ramp["300"].srgb,
      "on-tertiary": "#020617",
      "tertiary-container": "#1e293b",
      "on-tertiary-container": "#f8fafc",
      surface: "#020617",
      "on-surface": "#f8fafc",
      "surface-variant": "#0f172a",
      "on-surface-variant": "#94a3b8",
      "surface-container-lowest": "#020617",
      "surface-container-low": "#0b0f19",
      "surface-container": "#0f172a",
      "surface-container-high": "#1e293b",
      "surface-container-highest": "#334155",
      outline: "#475569",
      "outline-variant": "#1e293b",
    };
  } catch {
    return null;
  }
}

function deriveShadcnScheme(seedHex: string, dark: boolean) {
  try {
    const ramp = makeHueRamp({ hex: seedHex });
    if (!dark) {
      return {
        primary: ramp["700"].srgb,
        "on-primary": "#ffffff",
        "primary-container": "#f4f4f5",
        "on-primary-container": "#18181b",
        secondary: "#f4f4f5",
        "on-secondary": "#18181b",
        "secondary-container": "#f4f4f5",
        "on-secondary-container": "#18181b",
        tertiary: ramp["600"].srgb,
        "on-tertiary": "#ffffff",
        "tertiary-container": "#f4f4f5",
        "on-tertiary-container": "#18181b",
        surface: "#ffffff",
        "on-surface": "#09090b",
        "surface-variant": "#f4f4f5",
        "on-surface-variant": "#71717a",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#ffffff",
        "surface-container": "#fafafa",
        "surface-container-high": "#f4f4f5",
        "surface-container-highest": "#e4e4e7",
        outline: "#e4e4e7",
        "outline-variant": "#e4e4e7",
      };
    }
    return {
      primary: ramp["300"].srgb,
      "on-primary": "#09090b",
      "primary-container": "#27272a",
      "on-primary-container": "#fafafa",
      secondary: "#27272a",
      "on-secondary": "#fafafa",
      "secondary-container": "#27272a",
      "on-secondary-container": "#fafafa",
      tertiary: ramp["400"].srgb,
      "on-tertiary": "#09090b",
      "tertiary-container": "#27272a",
      "on-tertiary-container": "#fafafa",
      surface: "#09090b",
      "on-surface": "#fafafa",
      "surface-variant": "#18181b",
      "on-surface-variant": "#a1a1aa",
      "surface-container-lowest": "#09090b",
      "surface-container-low": "#09090b",
      "surface-container": "#18181b",
      "surface-container-high": "#27272a",
      "surface-container-highest": "#3f3f46",
      outline: "#27272a",
      "outline-variant": "#27272a",
    };
  } catch {
    return null;
  }
}

function deriveThemeScheme(
  system: PlaygroundSystem,
  seedHex: string,
  dark: boolean,
) {
  if (system === "astryx") return deriveAstryxScheme(seedHex, dark);
  if (system === "shadcn") return deriveShadcnScheme(seedHex, dark);
  return deriveM3Scheme(seedHex, dark);
}

const BASE_PRESET_IDS = ["material-3", "sharp", "compact"] as const;
const NEW_BRAND_ID = "brand";

type PlaygroundMode = "light" | "dark";
type RailDestination = "theme" | "code";
type ThemeSubTab = "base" | "tokens";
type PreviewView = "dashboard" | "matrix" | "blocks" | "palettes";
type ViewportSize = "desktop" | "tablet" | "mobile";

export function Playground({
  state: propState,
  onChange,
}: {
  state: PlaygroundState;
  onChange: (next: PlaygroundState) => void;
}) {
  const [state, setState] = useState<PlaygroundState>(propState);
  useEffect(() => {
    setState(propState);
  }, [propState]);

  const updateState = (next: PlaygroundState) => {
    setState(next);
    onChange(next);
  };

  const activeSystem: PlaygroundSystem = state.system ?? "m3";
  const selectSystem = (system: PlaygroundSystem) => {
    if (system === "astryx") {
      updateState({
        ...state,
        system,
        seed: ASTRYX_PALETTES[0].hex,
        radius: 0.75,
      });
      setSeedText(ASTRYX_PALETTES[0].hex);
    } else if (system === "shadcn") {
      updateState({
        ...state,
        system,
        seed: SHADCN_PALETTES[0].hex,
        radius: 0.6,
      });
      setSeedText(SHADCN_PALETTES[0].hex);
    } else {
      updateState({
        ...state,
        system,
        seed: SEED_PALETTES[0].hex,
        radius: 1.0,
      });
      setSeedText(SEED_PALETTES[0].hex);
    }
  };
  const { seed: seedHex, preset, dark, contrast, radius } = state;
  const currentFont = state.font ?? "inter";
  const currentDensity = state.density ?? "standard";

  // Navigation rail active view
  const [activeRail, setActiveRail] = useState<RailDestination>("theme");

  // Section 2 (Editor Pane) internal states
  const [themeSubTab, setThemeSubTab] = useState<ThemeSubTab>("base");
  const [seedText, setSeedText] = useState(seedHex);
  const [tokenSearch, setTokenSearch] = useState("");
  const [tokenFilter, setTokenFilter] = useState<
    "all" | "color" | "shape" | "type"
  >("all");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string>("all");

  // Section 3 (Preview Stage) internal states
  const [previewView, setPreviewView] = useState<PreviewView>("dashboard");
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [exportOpen, setExportOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);

  // Interactive demo states inside preview
  const [demoSwitch1, setDemoSwitch1] = useState(true);
  const [demoSwitch2, setDemoSwitch2] = useState(false);
  const [demoRange, setDemoRange] = useState("35");
  const [selectedSegment, setSelectedSegment] = useState<string[]>(["7d"]);

  /* -------------------------------------------------- axes & setters ---- */

  const axes = useMemo(
    () => ({
      preset,
      mode: (dark ? "dark" : "light") as PlaygroundMode,
      contrast,
      font: currentFont,
      density: currentDensity,
    }),
    [preset, dark, contrast, currentFont, currentDensity],
  );

  const setSeed = (seed: string) => updateState({ ...state, seed });
  const setPreset = (nextPreset: string) =>
    updateState({ ...state, preset: nextPreset });
  const setMode = (mode: PlaygroundMode) =>
    updateState({ ...state, dark: mode === "dark" });
  const setContrast = (next: PlaygroundContrast) =>
    updateState({ ...state, contrast: next });
  const setRadius = (next: number) => updateState({ ...state, radius: next });
  const setFont = (font: PlaygroundFont) => updateState({ ...state, font });
  const setDensity = (density: PlaygroundDensity) =>
    updateState({ ...state, density });

  function onSeedText(v: string) {
    setSeedText(v);
    if (isHex6(v)) setSeed(v.toLowerCase());
  }

  function reset() {
    setSeedText(PLAYGROUND_DEFAULTS.seed);
    updateState({ ...PLAYGROUND_DEFAULTS });
  }

  function shuffle() {
    const randomSeed =
      SEED_PALETTES[Math.floor(Math.random() * SEED_PALETTES.length)].hex;
    setSeedText(randomSeed);
    const randomRadius =
      RADIUS_OPTIONS[Math.floor(Math.random() * RADIUS_OPTIONS.length)].factor;
    updateState({
      ...state,
      seed: randomSeed,
      radius: randomRadius,
    });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  // Session / tenant presets
  const registryIds = useMemo(() => listVariants().map(String), []);
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

  /* ------------------------------------------------ theme computation ---- */

  const currentColors = useMemo(
    () => deriveThemeScheme(activeSystem, seedHex, dark),
    [activeSystem, seedHex, dark],
  );

  const theme: CustomTheme = useMemo(() => {
    const selection = (themeIds() as string[]).includes(preset)
      ? preset
      : getVariant(preset);
    const light = resolveThemeLayers("light", contrast, selection);
    const darkLayers = resolveThemeLayers("dark", contrast, selection);

    const lightScheme = deriveThemeScheme(activeSystem, seedHex, false) ?? {};
    const darkScheme = deriveThemeScheme(activeSystem, seedHex, true) ?? {};

    const shape = scaleShape(
      resolveThemeDetails("light", contrast, selection as never).shape,
      radius,
    );

    return {
      id: "playground-theme",
      extends: "material-3",
      overrides: {
        color: {
          light: { ...light.deltas, ...lightScheme },
          dark: { ...darkLayers.deltas, ...darkScheme },
        },
        shape,
      },
    };
  }, [activeSystem, seedHex, preset, contrast, radius]);

  const resolved = useMemo(() => {
    const scheme = resolveThemeLayers(axes.mode, axes.contrast, preset).scheme;
    return {
      color: {
        ...scheme,
        ...(theme.overrides.color?.[axes.mode] ?? {}),
        ...(currentColors ?? {}),
      },
      shape: theme.overrides.shape ?? {},
    };
  }, [axes.mode, axes.contrast, preset, theme, currentColors]);

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

  // Selected font family string
  const activeFontFamily = useMemo(
    () =>
      FONT_OPTIONS.find((f) => f.id === currentFont)?.family ??
      FONT_OPTIONS[0].family,
    [currentFont],
  );

  /* --------------------------------- M3 Tonal Ramp generation ---- */

  const tonalRamps = useMemo(() => {
    try {
      const baseOklch = hexToOklch(seedHex);
      const primaryRamp = makeHueRamp({ hex: seedHex });
      const secondaryRamp = makeHueRamp({
        hue: baseOklch.h,
        chroma: Math.min(baseOklch.c * 0.45, 0.05),
      });
      const tertiaryRamp = makeHueRamp({
        hue: (baseOklch.h + 60) % 360,
        chroma: Math.min(baseOklch.c * 0.75, 0.08),
      });
      const neutralRamp = makeHueRamp({
        hue: baseOklch.h,
        chroma: 0.012,
      });

      return {
        primary: primaryRamp,
        secondary: secondaryRamp,
        tertiary: tertiaryRamp,
        neutral: neutralRamp,
      };
    } catch {
      return null;
    }
  }, [seedHex]);

  /* ------------------------------------------------ export formats ---- */

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
    return `import {
  defineThemePreset,
} from "@xoroh/kern-tokens";

export const playgroundTheme = defineThemePreset({
  id: "playground-theme",
  extends: "material-3",
  overrides: {
    color: ${colorJson},
    shape: ${shapeJson},
  },
});`;
  }, [theme]);

  const cssSource = useMemo(
    () =>
      `:root {\n${Object.entries(vars)
        .filter(([k]) => k.startsWith("--"))
        .map(([k, v]) => `  ${k}: ${v};`)
        .join("\n")}\n}`,
    [vars],
  );

  const cliSource = `npx @xoroh/kern-cli theme add ${preset} --seed "${seedHex}" --radius ${radius}`;

  // Filtered CSS tokens for Token variables tab
  const displayedTokens = useMemo(() => {
    const search = tokenSearch.trim().toLowerCase();
    return Object.entries(vars)
      .filter(([name]) => name.startsWith("--"))
      .filter(([name]) => {
        if (tokenFilter === "color") return name.includes("-color-");
        if (tokenFilter === "shape") return name.includes("-shape-");
        if (tokenFilter === "type")
          return name.includes("-typescale-") || name.includes("font");
        return true;
      })
      .filter(([name, val]) => {
        if (!search) return true;
        return (
          name.toLowerCase().includes(search) ||
          val.toLowerCase().includes(search)
        );
      })
      .sort(([a], [b]) => a.localeCompare(b));
  }, [vars, tokenSearch, tokenFilter]);

  function handleCopyToken(tokenName: string, val: string) {
    navigator.clipboard?.writeText(val);
    setCopiedToken(tokenName);
    setTimeout(() => setCopiedToken(null), 1500);
  }

  // Filtered blocks list
  const filteredBlocks = useMemo(() => {
    if (selectedBlock === "all") return BLOCK_VIEWS;
    return BLOCK_VIEWS.filter((b) => b.entry.name === selectedBlock);
  }, [selectedBlock]);

  return (
    <div
      style={
        {
          ...vars,
          fontFamily: activeFontFamily,
        } as CSSProperties
      }
      className="flex h-screen w-screen flex-1 min-h-0 overflow-hidden bg-(--sys-color-surface-container-low) text-(--sys-color-on-surface)"
    >
      {/* ================================================================= */}
      {/* SECTION 1: M3 NAVIGATION RAIL (80dp Canonical M3 Specification)   */}
      {/* ================================================================= */}
      <aside
        aria-label="Playground App Rail"
        className="flex h-full w-20 shrink-0 flex-col items-center justify-between bg-(--sys-color-surface-container-low) py-4 select-none z-10"
      >
        {/* Top: Logo & M3 Rail Destinations */}
        <div className="flex w-full flex-col items-center gap-5">
          {/* Logo / Brand Anchor */}
          <a
            href="/"
            title="Kern Home"
            aria-label="Kern Home"
            className={`flex size-12 items-center justify-center rounded-(--sys-shape-corner-large) bg-(--sys-color-primary) text-(--sys-color-on-primary) ${TRANSITION} ${STATE_LAYERS}`}
          >
            <Icon name="palette" size={24} />
          </a>

          {/* Destination Icon Buttons (M3 Navigation Rail) */}
          <nav
            aria-label="Playground Destinations"
            className="flex w-full flex-col items-center gap-3"
          >
            {/* 1. Theme */}
            <button
              type="button"
              onClick={() => setActiveRail("theme")}
              title="Theme Tokens & Colors"
              className={`group flex flex-col items-center gap-1.5 ${FOCUS_RING}`}
            >
              <span
                className={`flex h-8 w-14 items-center justify-center rounded-full ${TRANSITION} ${
                  activeRail === "theme"
                    ? "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container)"
                    : "text-(--sys-color-on-surface-variant) hover:bg-(--sys-color-surface-container-high) hover:text-(--sys-color-on-surface)"
                }`}
              >
                <Icon name="palette" size={20} />
              </span>
              <span
                className={`${T_LABEL} ${
                  activeRail === "theme"
                    ? "text-(--sys-color-on-surface)"
                    : "text-(--sys-color-on-surface-variant)"
                }`}
              >
                Theme
              </span>
            </button>

            {/* 3. Code & Tokens */}
            <button
              type="button"
              onClick={() => setActiveRail("code")}
              title="Generated Code & Presets"
              className={`group flex flex-col items-center gap-1.5 ${FOCUS_RING}`}
            >
              <span
                className={`flex h-8 w-14 items-center justify-center rounded-full ${TRANSITION} ${
                  activeRail === "code"
                    ? "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container)"
                    : "text-(--sys-color-on-surface-variant) hover:bg-(--sys-color-surface-container-high) hover:text-(--sys-color-on-surface)"
                }`}
              >
                <Icon name="code" size={20} />
              </span>
              <span
                className={`${T_LABEL} ${
                  activeRail === "code"
                    ? "text-(--sys-color-on-surface)"
                    : "text-(--sys-color-on-surface-variant)"
                }`}
              >
                Code
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Rail Actions */}
        <footer className="flex w-full flex-col items-center gap-2 pt-2">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => setMode(axes.mode === "light" ? "dark" : "light")}
            title={
              axes.mode === "light"
                ? "Switch to Dark Mode"
                : "Switch to Light Mode"
            }
            aria-label="Toggle Light and Dark Mode"
            className={`flex size-10 items-center justify-center rounded-full text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface) ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING}`}
          >
            <Icon
              name={axes.mode === "light" ? "sunny" : "nightlight"}
              size={20}
            />
          </button>

          {/* Randomize / Shuffle */}
          <button
            type="button"
            onClick={shuffle}
            title="Randomize Theme"
            aria-label="Randomize Theme"
            className={`flex size-10 items-center justify-center rounded-full text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface) ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING}`}
          >
            <Icon name="refresh" size={20} />
          </button>

          {/* Reset Defaults */}
          <button
            type="button"
            onClick={reset}
            title="Reset to Defaults"
            aria-label="Reset to Defaults"
            className={`flex size-10 items-center justify-center rounded-full text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface) ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING}`}
          >
            <Icon name="close" size={20} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
            className={`flex size-10 items-center justify-center rounded-full text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface) ${STATE_LAYERS} ${TRANSITION} ${FOCUS_RING}`}
          >
            <Icon name="fullscreen" size={20} />
          </button>
        </footer>
      </aside>

      {/* ================================================================= */}
      {/* SECTION 2: EDITOR / SELECTION PANE (M3 Tonal Container)           */}
      {/* ================================================================= */}
      <section
        aria-label="Playground Editor Pane"
        className="flex h-full w-[360px] shrink-0 flex-col bg-(--sys-color-surface-container) overflow-hidden z-0"
      >
        {/* Section 2 Header (64px) */}
        <header className="flex h-16 shrink-0 items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <h2
              id="editor-pane-title"
              className={`m-0 ${T_BODY} text-(--sys-color-on-surface)`}
            >
              {activeRail === "theme" ? "Theme Editor" : "Theme Code"}
            </h2>
          </div>

          {/* Header Context Controls */}
          <div className="flex items-center gap-2">
            {activeRail === "theme" && (
              <div className="flex items-center">
                <label htmlFor="pane-preset-select" className="sr-only">
                  Theme Preset
                </label>
                <select
                  id="pane-preset-select"
                  value={preset}
                  onChange={(e) => setPreset(e.target.value)}
                  className={`h-8 rounded-full border-0 bg-(--sys-color-surface-container-high) px-3 ${T_BODY_SM} text-(--sys-color-on-surface) ${FOCUS_RING}`}
                >
                  <optgroup label="Core Presets">
                    {BASE_PRESET_IDS.map((id) => (
                      <option key={id} value={id}>
                        {presetLabel(id)}
                      </option>
                    ))}
                  </optgroup>
                  <option value={NEW_BRAND_ID}>+ Custom Brand</option>
                  {tenantIds.length > 0 ? (
                    <optgroup label="Tenants / Session">
                      {tenantIds.map((id) => (
                        <option key={id} value={id}>
                          {presetLabel(id)}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                </select>
              </div>
            )}

            {activeRail === "code" && (
              <CopyButton text={cssSource} label="Copy CSS" />
            )}
          </div>
        </header>

        {/* Section 2 Sub-Tabs (for Theme Editor) */}
        {activeRail === "theme" && (
          <div className="flex w-full px-5">
            <button
              type="button"
              onClick={() => setThemeSubTab("base")}
              className={`flex-1 pb-2.5 text-center ${T_BODY_SM} ${TRANSITION} relative ${
                themeSubTab === "base"
                  ? "text-(--sys-color-primary)"
                  : "text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
              }`}
            >
              Base Tokens
              {themeSubTab === "base" && (
                <span className="absolute bottom-0 inset-x-4 h-0.5 rounded-full bg-(--sys-color-primary)" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setThemeSubTab("tokens")}
              className={`flex-1 pb-2.5 text-center ${T_BODY_SM} ${TRANSITION} relative ${
                themeSubTab === "tokens"
                  ? "text-(--sys-color-primary)"
                  : "text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
              }`}
            >
              Token Variables
              {themeSubTab === "tokens" && (
                <span className="absolute bottom-0 inset-x-4 h-0.5 rounded-full bg-(--sys-color-primary)" />
              )}
            </button>
          </div>
        )}

        {/* Section 2 Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* VIEW: THEME -> BASE STYLES */}
          {activeRail === "theme" && themeSubTab === "base" && (
            <div className="flex flex-col gap-6">
              {/* 0. Design System Architecture (First Choice) */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`${T_KICKER} uppercase text-(--sys-color-on-surface-variant)`}
                  >
                    Design System
                  </span>
                  <span
                    className={`${T_LABEL} font-mono px-2 py-0.5 rounded-full bg-(--sys-color-primary)/15 text-(--sys-color-primary)`}
                  >
                    {
                      SYSTEM_OPTIONS.find((sys) => sys.id === activeSystem)
                        ?.label
                    }
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-high)">
                  {SYSTEM_OPTIONS.map((sys) => {
                    const isSelected = activeSystem === sys.id;
                    return (
                      <button
                        key={sys.id}
                        type="button"
                        onClick={() => selectSystem(sys.id)}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-(--sys-shape-corner-medium) text-center ${TRANSITION} ${FOCUS_RING} ${
                          isSelected
                            ? "bg-(--sys-color-surface-container) text-(--sys-color-on-surface)"
                            : "text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon name={sys.icon} size={15} />
                          <span className={`${T_BODY_SM}`}>{sys.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p
                  className={`m-0 ${T_LABEL} text-(--sys-color-on-surface-variant)`}
                >
                  {
                    SYSTEM_OPTIONS.find((sys) => sys.id === activeSystem)
                      ?.tagline
                  }
                </p>
              </div>

              {/* 1. Primary Seed & Colors */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`${T_KICKER} uppercase text-(--sys-color-on-surface-variant)`}
                  >
                    Seed Color
                  </span>
                  <span className={`${T_CODE} text-(--sys-color-primary)`}>
                    {seedHex.toUpperCase()}
                  </span>
                </div>

                {/* Swatches Grid (System-Adapted) */}
                <div className="grid grid-cols-6 gap-2 pt-1">
                  {(activeSystem === "astryx"
                    ? ASTRYX_PALETTES
                    : activeSystem === "shadcn"
                      ? SHADCN_PALETTES
                      : SEED_PALETTES
                  ).map((palette) => {
                    const isSelected =
                      seedHex.toLowerCase() === palette.hex.toLowerCase();
                    return (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => {
                          setSeed(palette.hex);
                          setSeedText(palette.hex);
                        }}
                        title={palette.name}
                        className={`group relative flex size-9 items-center justify-center rounded-full ${TRANSITION} ${STATE_LAYERS} ${FOCUS_RING} ${
                          isSelected
                            ? "ring-2 ring-(--sys-color-primary) ring-offset-2 ring-offset-(--sys-color-surface-container)"
                            : ""
                        }`}
                        style={{ backgroundColor: palette.hex }}
                      >
                        {isSelected ? (
                          // Data-viz: the check sits on an arbitrary seed hex,
                          // so no theme role can guarantee contrast — white
                          // with a scrim shadow is the legible choice, same
                          // as chart ink on data fills.
                          <span className="flex items-center justify-center text-white drop-shadow-sm">
                            <Icon name="check" size={16} />
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Hex Pill Input */}
                <div className="flex items-center gap-2 pt-2">
                  <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
                    <input
                      type="color"
                      aria-label="Custom Hex Color"
                      value={isHex6(seedText) ? seedText : seedHex}
                      onChange={(e) => onSeedText(e.target.value)}
                      className="absolute inset-0 size-full cursor-pointer opacity-0"
                    />
                    <div
                      className="size-full"
                      style={{
                        backgroundColor: isHex6(seedText) ? seedText : seedHex,
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    aria-label="Hex color value"
                    value={seedText}
                    spellCheck={false}
                    onChange={(e) => onSeedText(e.target.value)}
                    placeholder="#6750a4"
                    className={`h-9 flex-1 rounded-full border-0 bg-(--sys-color-surface-container-high) px-4 ${T_CODE} text-(--sys-color-on-surface) ${FOCUS_RING}`}
                  />
                </div>
              </div>

              {/* 2. Shape / Radius */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`${T_KICKER} uppercase text-(--sys-color-on-surface-variant)`}
                  >
                    Corner Radius Scale
                  </span>
                  <span
                    className={`${T_CODE} text-(--sys-color-on-surface-variant)`}
                  >
                    {radius.toFixed(2)}x
                  </span>
                </div>

                {/* Radius Presets (System-Adapted) */}
                <div
                  className={`grid gap-1.5 ${activeSystem === "shadcn" ? "grid-cols-5" : "grid-cols-4"}`}
                >
                  {(activeSystem === "astryx"
                    ? ASTRYX_RADIUS_OPTIONS
                    : activeSystem === "shadcn"
                      ? SHADCN_RADIUS_OPTIONS
                      : RADIUS_OPTIONS
                  ).map((opt) => {
                    const isSelected = radius === opt.factor;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setRadius(opt.factor)}
                        className={`flex py-2 items-center justify-center rounded-(--sys-shape-corner-medium) text-center ${T_BODY_SM} ${TRANSITION} ${FOCUS_RING} ${
                          isSelected
                            ? "bg-(--sys-color-primary) text-(--sys-color-on-primary)"
                            : "bg-(--sys-color-surface-container-high) text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Slider */}
                <input
                  type="range"
                  aria-label="Corner radius multiplier"
                  min={0.25}
                  max={2.5}
                  step={0.25}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-(--sys-color-surface-container-highest) accent-(--sys-color-primary)"
                />
              </div>

              {/* 3. Typography / Fonts */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`${T_KICKER} uppercase text-(--sys-color-on-surface-variant)`}
                  >
                    Font Family
                  </span>
                  <span
                    className={`${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                  >
                    {FONT_OPTIONS.find((f) => f.id === currentFont)?.name}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {FONT_OPTIONS.map((fontOpt) => {
                    const isSelected = currentFont === fontOpt.id;
                    return (
                      <button
                        key={fontOpt.id}
                        type="button"
                        onClick={() => setFont(fontOpt.id)}
                        className={`px-2 py-2 rounded-(--sys-shape-corner-medium) text-center ${T_BODY_SM} ${TRANSITION} ${FOCUS_RING} ${
                          isSelected
                            ? "bg-(--sys-color-primary) text-(--sys-color-on-primary)"
                            : "bg-(--sys-color-surface-container-high) text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
                        }`}
                      >
                        {fontOpt.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Density / Metrics */}
              <div className="flex flex-col gap-3">
                <span
                  className={`${T_KICKER} uppercase text-(--sys-color-on-surface-variant)`}
                >
                  UI Density
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {DENSITY_OPTIONS.map((dens) => {
                    const isSelected = currentDensity === dens.id;
                    return (
                      <button
                        key={dens.id}
                        type="button"
                        onClick={() => setDensity(dens.id)}
                        className={`px-2 py-2 rounded-(--sys-shape-corner-medium) text-center ${T_BODY_SM} ${TRANSITION} ${FOCUS_RING} ${
                          isSelected
                            ? "bg-(--sys-color-primary) text-(--sys-color-on-primary)"
                            : "bg-(--sys-color-surface-container-high) text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
                        }`}
                      >
                        {dens.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: THEME -> ADVANCED TOKENS */}
          {activeRail === "theme" && themeSubTab === "tokens" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`${T_KICKER} uppercase text-(--sys-color-on-surface-variant)`}
                  >
                    CSS Token Variables
                  </span>
                  <span
                    className={`${T_CODE} text-(--sys-color-on-surface-variant)`}
                  >
                    {displayedTokens.length} active
                  </span>
                </div>

                {/* Search Bar */}
                <input
                  type="search"
                  aria-label="Search design tokens"
                  value={tokenSearch}
                  onChange={(e) => setTokenSearch(e.target.value)}
                  placeholder="Filter tokens..."
                  className={`h-9 w-full rounded-full border-0 bg-(--sys-color-surface-container-high) px-4 ${T_BODY_SM} text-(--sys-color-on-surface) ${FOCUS_RING}`}
                />

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {(["all", "color", "shape", "type"] as const).map(
                    (filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setTokenFilter(filter)}
                        className={`rounded-full px-3 py-1 ${T_BODY_SM} ${TRANSITION} ${
                          tokenFilter === filter
                            ? "bg-(--sys-color-primary) text-(--sys-color-on-primary)"
                            : "bg-(--sys-color-surface-container-high) text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Token List */}
              <div className="flex flex-col divide-y divide-(--sys-color-outline-variant)/15 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-2">
                {displayedTokens.length === 0 ? (
                  <div
                    className={`p-4 text-center ${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                  >
                    No tokens match "{tokenSearch}"
                  </div>
                ) : (
                  displayedTokens.slice(0, 100).map(([tokenName, tokenVal]) => {
                    const isColor =
                      tokenVal.startsWith("#") ||
                      tokenVal.startsWith("rgb") ||
                      tokenVal.startsWith("oklch");
                    return (
                      <div
                        key={tokenName}
                        className="flex items-center justify-between gap-2 p-2 hover:bg-(--sys-color-surface-container-high)/50 rounded-(--sys-shape-corner-medium)"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          {isColor ? (
                            <span
                              className="size-3.5 shrink-0 rounded-full"
                              style={{ backgroundColor: tokenVal }}
                            />
                          ) : null}
                          <span
                            className={`truncate ${T_CODE} text-(--sys-color-on-surface)`}
                          >
                            {tokenName}
                          </span>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                          <span
                            className={`${T_CODE} text-(--sys-color-on-surface-variant)`}
                          >
                            {tokenVal}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyToken(tokenName, tokenVal)}
                            title={`Copy ${tokenName}`}
                            className="flex size-6 items-center justify-center rounded-full hover:bg-(--sys-color-surface-container-highest)"
                          >
                            <Icon
                              name={
                                copiedToken === tokenName
                                  ? "check"
                                  : "content-copy"
                              }
                              size={13}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* VIEW: CODE & TOKENS */}
          {activeRail === "code" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span
                  className={`${T_KICKER} uppercase text-(--sys-color-on-surface-variant)`}
                >
                  Direct Token Exports
                </span>
                <p
                  className={`m-0 ${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                >
                  Ready to copy and paste into your project.
                </p>
              </div>

              <Tabs.Root defaultValue="css">
                <Tabs.List className="mb-3">
                  <Tabs.Tab value="css">CSS</Tabs.Tab>
                  <Tabs.Tab value="ts">TypeScript</Tabs.Tab>
                  <Tabs.Tab value="json">JSON</Tabs.Tab>
                  <Tabs.Tab value="cli">CLI</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="css" className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span
                      className={`${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                    >
                      Tailwind v4 / CSS
                    </span>
                    <CopyButton text={cssSource} label="Copy CSS" />
                  </div>
                  <pre
                    className={`m-0 max-h-96 overflow-auto rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-3 ${T_CODE} whitespace-pre`}
                  >
                    {cssSource}
                  </pre>
                </Tabs.Panel>

                <Tabs.Panel value="ts" className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span
                      className={`${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                    >
                      @xoroh/kern-tokens Preset
                    </span>
                    <CopyButton text={presetSource} label="Copy TS" />
                  </div>
                  <pre
                    className={`m-0 max-h-96 overflow-auto rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-3 ${T_CODE} whitespace-pre`}
                  >
                    {presetSource}
                  </pre>
                </Tabs.Panel>

                <Tabs.Panel value="json" className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span
                      className={`${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                    >
                      DTCG JSON Tokens
                    </span>
                    <CopyButton text={jsonSource} label="Copy JSON" />
                  </div>
                  <pre
                    className={`m-0 max-h-96 overflow-auto rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-3 ${T_CODE} whitespace-pre`}
                  >
                    {jsonSource}
                  </pre>
                </Tabs.Panel>

                <Tabs.Panel value="cli" className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span
                      className={`${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                    >
                      Terminal Command
                    </span>
                    <CopyButton text={cliSource} label="Copy CLI" />
                  </div>
                  <pre
                    className={`m-0 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-3 ${T_CODE} whitespace-pre`}
                  >
                    {cliSource}
                  </pre>
                </Tabs.Panel>
              </Tabs.Root>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 3: LIVE PREVIEW STAGE (M3 Canvas Stage)                   */}
      {/* ================================================================= */}
      <section
        aria-label="Playground Live Preview"
        className="flex h-full flex-1 min-w-0 flex-col overflow-hidden bg-(--sys-color-surface-container-lowest)"
      >
        {/* Section 3 Header / Toolbar (64px) */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 bg-(--sys-color-surface-container-low) px-6">
          {/* Left: Canvas View Selector Pills */}
          <div className="flex items-center gap-1 rounded-full bg-(--sys-color-surface-container-high) p-1">
            {(
              [
                { id: "dashboard", label: "Dashboard", icon: "dashboard" },
                { id: "matrix", label: "Components", icon: "widgets" },
                { id: "blocks", label: "Blocks", icon: "layers" },
                { id: "palettes", label: "Palettes", icon: "palette" },
              ] as const
            ).map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setPreviewView(v.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full ${T_BODY_SM} ${TRANSITION} ${FOCUS_RING} ${
                  previewView === v.id
                    ? "bg-(--sys-color-primary) text-(--sys-color-on-primary)"
                    : "text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
                }`}
              >
                <Icon name={v.icon} size={16} />
                <span>{v.label}</span>
              </button>
            ))}
          </div>

          {/* Center: Viewport Switcher */}
          <div className="hidden sm:flex items-center gap-1 rounded-full bg-(--sys-color-surface-container-high) p-1">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              title="Desktop Viewport (100%)"
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${T_BODY_SM} ${TRANSITION} ${
                viewport === "desktop"
                  ? "bg-(--sys-color-surface-container) text-(--sys-color-on-surface)"
                  : "text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
              }`}
            >
              <Icon name="desktop-windows" size={16} />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport("tablet")}
              title="Tablet Viewport (768px)"
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${T_BODY_SM} ${TRANSITION} ${
                viewport === "tablet"
                  ? "bg-(--sys-color-surface-container) text-(--sys-color-on-surface)"
                  : "text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
              }`}
            >
              <Icon name="tablet" size={16} />
              <span className="hidden md:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              title="Mobile Viewport (390px)"
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${T_BODY_SM} ${TRANSITION} ${
                viewport === "mobile"
                  ? "bg-(--sys-color-surface-container) text-(--sys-color-on-surface)"
                  : "text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
              }`}
            >
              <Icon name="mobile" size={16} />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Right: Contrast Switcher & Export Action */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1 rounded-full bg-(--sys-color-surface-container-high) p-1">
              {(["standard", "medium", "high"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setContrast(c)}
                  className={`px-3 py-1 rounded-full ${T_BODY_SM} ${TRANSITION} ${FOCUS_RING} ${
                    contrast === c
                      ? "bg-(--sys-color-surface-container) text-(--sys-color-on-surface)"
                      : "text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
                  }`}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setExportOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Icon name="download" size={16} />
              <span>Export</span>
            </Button>
          </div>
        </header>

        {/* Section 3 Scrollable Canvas */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex items-start justify-center">
          <div
            className={`w-full ${TRANSITION} ${
              viewport === "mobile"
                ? "max-w-[390px]"
                : viewport === "tablet"
                  ? "max-w-[768px]"
                  : "max-w-5xl"
            }`}
          >
            {/* CANVAS 1: OPS DASHBOARD SCREEN */}
            {previewView === "dashboard" && (
              <div className="flex flex-col gap-6 rounded-(--sys-shape-corner-extra-large) bg-(--sys-color-surface) p-6 lg:p-8">
                {/* Dashboard Top App Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-(--sys-shape-corner-large) bg-(--sys-color-primary-container) text-(--sys-color-on-primary-container)">
                      <Icon name="cloud" size={22} />
                    </div>
                    <div className="flex flex-col">
                      <h3
                        id="dashboard-title"
                        className={`m-0 ${T_SUB} text-(--sys-color-on-surface)`}
                      >
                        Production Cluster US-East
                      </h3>
                      <span
                        className={`${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                      >
                        Kubernetes v1.31 • 48 Pods Active •{" "}
                        {
                          SYSTEM_OPTIONS.find((sys) => sys.id === activeSystem)
                            ?.label
                        }{" "}
                        Engine
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Chip variant="filter">
                      <Icon name="check-circle" size={16} />{" "}
                      <span>Healthy</span>
                    </Chip>
                    <Button variant="ghost" size="icon" aria-label="Settings">
                      <Icon name="settings" size={20} />
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setTestDialogOpen(true)}
                    >
                      Configure Routing
                    </Button>
                  </div>
                </div>

                {/* Dashboard Hero Banner */}
                <Banner
                  icon={<Icon name="info" size={20} />}
                  className="rounded-(--sys-shape-corner-large)"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                    <div className="flex flex-col">
                      <span
                        className={`${T_BODY_MD} text-(--sys-color-on-info-container)`}
                      >
                        Zero-downtime Canary Deployment Ready
                      </span>
                      <span
                        className={`${T_BODY_SM} text-(--sys-color-on-info-container)/90`}
                      >
                        All 48 edge proxies synchronized with Kern dynamic color
                        tokens. Traffic ramp is set to 25%.
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="self-start sm:self-auto shrink-0"
                    >
                      Rollout Canary
                    </Button>
                  </div>
                </Banner>

                {/* 3 KPI Metric Cards (Authentic M3 Filled Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-high) p-5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`${T_KICKER} uppercase text-(--sys-color-on-surface-variant)`}
                      >
                        API Throughput
                      </span>
                      <Badge variant="count">+14.2%</Badge>
                    </div>
                    <span
                      className={`${T_SECTION} text-(--sys-color-on-surface)`}
                    >
                      42.8k req/s
                    </span>
                    <LinearProgress value={78} />
                    <span
                      className={`${T_LABEL} text-(--sys-color-on-surface-variant)`}
                    >
                      Peak window: 45.2k req/s
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-high) p-5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`${T_KICKER} uppercase text-(--sys-color-on-surface-variant)`}
                      >
                        p99 Latency
                      </span>
                      <Badge variant="count">-8ms</Badge>
                    </div>
                    <span
                      className={`${T_SECTION} text-(--sys-color-on-surface)`}
                    >
                      18.4 ms
                    </span>
                    <LinearProgress value={24} />
                    <span
                      className={`${T_LABEL} text-(--sys-color-on-surface-variant)`}
                    >
                      SLA Threshold: 50.0 ms
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-high) p-5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`${T_KICKER} uppercase text-(--sys-color-on-surface-variant)`}
                      >
                        Global Error Rate
                      </span>
                      <Badge variant="count">0.002%</Badge>
                    </div>
                    <span
                      className={`${T_SECTION} text-(--sys-color-on-surface)`}
                    >
                      0.002 %
                    </span>
                    <LinearProgress value={4} />
                    <span
                      className={`${T_LABEL} text-(--sys-color-on-surface-variant)`}
                    >
                      Zero 5xx in the last 4 hours
                    </span>
                  </div>
                </div>

                {/* Main 2-Column Workload & Controls Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Workload Table */}
                  <div className="lg:col-span-2 flex flex-col gap-4 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="dns" size={18} />
                        <h4
                          id="active-workloads-title"
                          className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface)`}
                        >
                          Active Microservices
                        </h4>
                      </div>

                      <SegmentedButton.Root
                        value={selectedSegment}
                        onValueChange={(val) => val && setSelectedSegment(val)}
                      >
                        <SegmentedButton.Item value="24h">
                          24h
                        </SegmentedButton.Item>
                        <SegmentedButton.Item value="7d">
                          7d
                        </SegmentedButton.Item>
                        <SegmentedButton.Item value="30d">
                          30d
                        </SegmentedButton.Item>
                      </SegmentedButton.Root>
                    </div>

                    <Table.Root>
                      <Table.Head>
                        <Table.Row>
                          <Table.Header>Service</Table.Header>
                          <Table.Header>Replica Count</Table.Header>
                          <Table.Header>Health</Table.Header>
                          <Table.Header className="text-right">
                            Actions
                          </Table.Header>
                        </Table.Row>
                      </Table.Head>
                      <Table.Body>
                        {[
                          {
                            name: "auth-gateway",
                            replicas: "12 / 12",
                            status: "Healthy",
                          },
                          {
                            name: "billing-worker",
                            replicas: "6 / 6",
                            status: "Healthy",
                          },
                          {
                            name: "search-indexer",
                            replicas: "18 / 18",
                            status: "Healthy",
                          },
                          {
                            name: "media-transcoder",
                            replicas: "8 / 8",
                            status: "Healthy",
                          },
                        ].map((row) => (
                          <Table.Row key={row.name}>
                            <Table.Cell className={`${T_CODE}`}>
                              {row.name}
                            </Table.Cell>
                            <Table.Cell className={`${T_BODY_SM}`}>
                              {row.replicas}
                            </Table.Cell>
                            <Table.Cell>
                              <Badge variant="count">{row.status}</Badge>
                            </Table.Cell>
                            <Table.Cell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="px-2"
                              >
                                Logs
                              </Button>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </div>

                  {/* Right Column: Policies & FAB */}
                  <div className="flex flex-col justify-between gap-4 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-5">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <Icon name="shield" size={18} />
                        <h4
                          id="security-policies-title"
                          className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface)`}
                        >
                          Security Guardrails
                        </h4>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span
                            className={`${T_BODY_SM} text-(--sys-color-on-surface)`}
                          >
                            mTLS Enforcement
                          </span>
                          <span
                            className={`${T_LABEL} text-(--sys-color-on-surface-variant)`}
                          >
                            Mutual TLS on internal mesh
                          </span>
                        </div>
                        <Switch
                          checked={demoSwitch1}
                          onCheckedChange={setDemoSwitch1}
                          aria-label="Toggle mTLS enforcement"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span
                            className={`${T_BODY_SM} text-(--sys-color-on-surface)`}
                          >
                            Strict Rate Limiting
                          </span>
                          <span
                            className={`${T_LABEL} text-(--sys-color-on-surface-variant)`}
                          >
                            Max 1,000 req/min per IP
                          </span>
                        </div>
                        <Switch
                          checked={demoSwitch2}
                          onCheckedChange={setDemoSwitch2}
                          aria-label="Toggle strict rate limiting"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 pt-2">
                        <div
                          className={`flex items-center justify-between ${T_BODY_SM}`}
                        >
                          <span className="text-(--sys-color-on-surface)">
                            Autoscale Headroom
                          </span>
                          <span className="font-mono text-(--sys-color-primary)">
                            {demoRange}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="80"
                          value={demoRange}
                          onChange={(e) => setDemoRange(e.target.value)}
                          aria-label="Autoscale Headroom"
                          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-(--sys-color-surface-container-highest) accent-(--sys-color-primary)"
                        />
                      </div>
                    </div>

                    {/* M3 Floating Action Button */}
                    <div className="flex justify-end pt-4">
                      <ExtendedFab
                        label="Deploy Service"
                        icon={<Icon name="add" size={20} />}
                        onClick={() => setTestDialogOpen(true)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CANVAS 2: COMPONENT MATRIX */}
            {previewView === "matrix" && (
              <div className="flex flex-col gap-8 rounded-(--sys-shape-corner-extra-large) bg-(--sys-color-surface) p-6 lg:p-10">
                {/* 1. M3 Button Configurations */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3
                      id="m3-button-hierarchy-title"
                      className={`m-0 ${T_BODY} text-(--sys-color-on-surface)`}
                    >
                      Material 3 Button Configurations
                    </h3>
                    <span
                      className={`${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                    >
                      5 semantic M3 configurations
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-6">
                    <Button variant="primary">Filled Button</Button>
                    <Button variant="tonal">Tonal Button</Button>
                    <Button variant="elevated">Elevated Button</Button>
                    <Button variant="outlined">Outlined Button</Button>
                    <Button variant="ghost">Text Button</Button>
                    <Button variant="primary" disabled>
                      Disabled
                    </Button>
                  </div>
                </div>

                {/* 2. M3 Card Variants */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3
                      id="m3-card-variants-title"
                      className={`m-0 ${T_BODY} text-(--sys-color-on-surface)`}
                    >
                      Material 3 Card Variants
                    </h3>
                    <span
                      className={`${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                    >
                      Filled, Elevated, and Outlined
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card variant="filled" className="p-5 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`${T_BODY_SM} uppercase text-(--sys-color-primary)`}
                        >
                          Filled Card
                        </span>
                        <Icon name="check-circle" size={18} />
                      </div>
                      <span
                        className={`${T_BODY_MD} text-(--sys-color-on-surface)`}
                      >
                        Surface Container
                      </span>
                      <p
                        className={`m-0 ${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                      >
                        No border. Relies on tonal background contrast with the
                        parent canvas.
                      </p>
                    </Card>

                    <Card
                      variant="elevated"
                      className="p-5 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`${T_BODY_SM} uppercase text-(--sys-color-primary)`}
                        >
                          Elevated Card
                        </span>
                        <Icon name="trending-up" size={18} />
                      </div>
                      <span
                        className={`${T_BODY_MD} text-(--sys-color-on-surface)`}
                      >
                        Level 1 Shadow
                      </span>
                      <p
                        className={`m-0 ${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                      >
                        Soft elevation shadow lifts the card cleanly above the
                        surface.
                      </p>
                    </Card>

                    <Card
                      variant="outlined"
                      className="p-5 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`${T_BODY_SM} uppercase text-(--sys-color-primary)`}
                        >
                          Outlined Card
                        </span>
                        <Icon name="crop-square" size={18} />
                      </div>
                      <span
                        className={`${T_BODY_MD} text-(--sys-color-on-surface)`}
                      >
                        Outline Hairline
                      </span>
                      <p
                        className={`m-0 ${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                      >
                        Subtle outline border for distinct structural
                        separation.
                      </p>
                    </Card>
                  </div>
                </div>

                {/* 3. Selection Controls & Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Chips & Badges */}
                  <div className="flex flex-col gap-3 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-5">
                    <h4
                      id="chips-badges-title"
                      className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface)`}
                    >
                      Chips & Badges
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Chip variant="filter" value>
                        <Icon name="check" size={16} />{" "}
                        <span>Selected Filter</span>
                      </Chip>
                      <Chip variant="filter">Filter Chip</Chip>
                      <Chip variant="input">
                        <span>Input Chip</span> <Icon name="close" size={14} />
                      </Chip>
                      <Badge variant="count">Status</Badge>
                      <Badge variant="dot" />
                    </div>
                  </div>

                  {/* Toggles & Segmented Buttons */}
                  <div className="flex flex-col gap-3 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-5">
                    <h4
                      id="selection-controls-title"
                      className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface)`}
                    >
                      Selection Controls
                    </h4>
                    <div className="flex flex-col gap-3 pt-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`${T_BODY_SM} text-(--sys-color-on-surface)`}
                        >
                          Active Notification Switch
                        </span>
                        <Switch
                          checked={demoSwitch1}
                          onCheckedChange={setDemoSwitch1}
                          aria-label="Demo switch"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`${T_BODY_SM} text-(--sys-color-on-surface)`}
                        >
                          Segmented Selection
                        </span>
                        <SegmentedButton.Root
                          value={selectedSegment}
                          onValueChange={(val) =>
                            val && setSelectedSegment(val)
                          }
                        >
                          <SegmentedButton.Item value="24h">
                            Day
                          </SegmentedButton.Item>
                          <SegmentedButton.Item value="7d">
                            Week
                          </SegmentedButton.Item>
                          <SegmentedButton.Item value="30d">
                            Month
                          </SegmentedButton.Item>
                        </SegmentedButton.Root>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CANVAS 3: COMPOSED BLOCKS */}
            {previewView === "blocks" && (
              <div className="flex flex-col gap-6">
                {/* Block Selector & Filter Bar */}
                <div className="flex items-center justify-between gap-4 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface) p-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setSelectedBlock("all")}
                      className={`px-3 py-1.5 rounded-full ${T_BODY_SM} ${TRANSITION} shrink-0 ${FOCUS_RING} ${
                        selectedBlock === "all"
                          ? "bg-(--sys-color-primary) text-(--sys-color-on-primary)"
                          : "bg-(--sys-color-surface-container) text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
                      }`}
                    >
                      All Blocks ({BLOCK_VIEWS.length})
                    </button>
                    {BLOCK_VIEWS.map((b) => (
                      <button
                        key={b.entry.name}
                        type="button"
                        onClick={() => setSelectedBlock(b.entry.name)}
                        className={`px-3 py-1.5 rounded-full ${T_BODY_SM} ${TRANSITION} shrink-0 ${FOCUS_RING} ${
                          selectedBlock === b.entry.name
                            ? "bg-(--sys-color-primary) text-(--sys-color-on-primary)"
                            : "bg-(--sys-color-surface-container) text-(--sys-color-on-surface-variant) hover:text-(--sys-color-on-surface)"
                        }`}
                      >
                        {b.entry.title}
                      </button>
                    ))}
                  </div>
                  <span
                    className={`hidden sm:inline ${T_CODE} text-(--sys-color-on-surface-variant) shrink-0`}
                  >
                    {filteredBlocks.length} visible
                  </span>
                </div>
                {filteredBlocks.map((b) => {
                  return (
                    <div
                      key={b.entry.name}
                      className="flex flex-col gap-4 rounded-(--sys-shape-corner-extra-large) bg-(--sys-color-surface) p-6 lg:p-8"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <h3
                            id={`block-title-${b.entry.name}`}
                            className={`m-0 ${T_BODY} text-(--sys-color-on-surface)`}
                          >
                            {b.entry.title}
                          </h3>
                          <span
                            className={`${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                          >
                            Category: {b.entry.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <code
                            className={`${T_LABEL} font-mono px-3 py-1 rounded-full bg-(--sys-color-surface-container-high) text-(--sys-color-on-surface-variant)`}
                          >
                            {installCommand(b.entry.name)}
                          </code>
                          <CopyButton
                            text={installCommand(b.entry.name)}
                            label="Copy CLI"
                          />
                        </div>
                      </div>

                      <div className="rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-6">
                        {b.render()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CANVAS 4: TONAL PALETTES */}
            {previewView === "palettes" && tonalRamps && (
              <div className="flex flex-col gap-8 rounded-(--sys-shape-corner-extra-large) bg-(--sys-color-surface) p-6 lg:p-10">
                <div className="flex flex-col gap-1">
                  <h3
                    id="tonal-ramps-title"
                    className={`m-0 ${T_SUB} text-(--sys-color-on-surface)`}
                  >
                    Material Design 3 Algorithmic Tonal Ladders
                  </h3>
                  <p
                    className={`m-0 ${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                  >
                    Complete 11-step ramps calculated via OKLCH color science
                    for seed{" "}
                    <span className="font-mono text-(--sys-color-primary)">
                      {seedHex}
                    </span>
                    .
                  </p>
                </div>

                {(
                  [
                    { name: "Primary Palette", ramp: tonalRamps.primary },
                    { name: "Secondary Palette", ramp: tonalRamps.secondary },
                    { name: "Tertiary Palette", ramp: tonalRamps.tertiary },
                    { name: "Neutral Palette", ramp: tonalRamps.neutral },
                  ] as const
                ).map(({ name, ramp }) => (
                  <div key={name} className="flex flex-col gap-3">
                    <h4
                      id={`palette-title-${name.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface)`}
                    >
                      {name}
                    </h4>

                    <div className="grid grid-cols-11 overflow-hidden rounded-(--sys-shape-corner-large)">
                      {/* Data-viz: cells paint arbitrary ramp hexes, so the
                          step/hex ink tracks the painted value (white on deep
                          tones, black on light) — theme roles cannot contrast
                          data fills. */}
                      {Object.entries(ramp).map(([toneStep, stepData]) => {
                        const hex = stepData.srgb;
                        const toneNum = Number(toneStep);
                        const isLightText = toneNum >= 500;
                        return (
                          <div
                            key={toneStep}
                            className="flex flex-col items-center justify-between p-3 h-24 text-center"
                            style={{ backgroundColor: hex }}
                          >
                            <span
                              className={`${T_LABEL} font-mono ${
                                isLightText ? "text-white" : "text-black"
                              }`}
                            >
                              {toneStep}
                            </span>
                            <span
                              className={`${T_LABEL} font-mono uppercase opacity-80 ${
                                isLightText ? "text-white" : "text-black"
                              }`}
                            >
                              {hex}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* EXPORT DIALOG MODAL                                               */}
      {/* ================================================================= */}
      <Dialog.Root open={exportOpen} onOpenChange={setExportOpen}>
        <Dialog.Content className="max-w-2xl bg-(--sys-color-surface) text-(--sys-color-on-surface) rounded-(--sys-shape-corner-extra-large) p-6">
          <Dialog.Title>Export Material 3 Theme</Dialog.Title>
          <Dialog.Description>
            Copy theme tokens in Tailwind v4, TypeScript preset, DTCG JSON, or
            CLI format.
          </Dialog.Description>

          <div className="mt-4 flex flex-col gap-4">
            <Tabs.Root defaultValue="css">
              <Tabs.List>
                <Tabs.Tab value="css">CSS Variables</Tabs.Tab>
                <Tabs.Tab value="ts">Preset (TS)</Tabs.Tab>
                <Tabs.Tab value="json">JSON</Tabs.Tab>
                <Tabs.Tab value="cli">CLI</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="css" className="mt-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span
                    className={`${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                  >
                    Paste into your globals.css
                  </span>
                  <CopyButton text={cssSource} label="Copy CSS" />
                </div>
                <pre
                  className={`m-0 max-h-72 overflow-auto rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-4 ${T_CODE} whitespace-pre`}
                >
                  {cssSource}
                </pre>
              </Tabs.Panel>

              <Tabs.Panel value="ts" className="mt-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span
                    className={`${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                  >
                    Use with @xoroh/kern-tokens
                  </span>
                  <CopyButton text={presetSource} label="Copy TypeScript" />
                </div>
                <pre
                  className={`m-0 max-h-72 overflow-auto rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-4 ${T_CODE} whitespace-pre`}
                >
                  {presetSource}
                </pre>
              </Tabs.Panel>

              <Tabs.Panel value="json" className="mt-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span
                    className={`${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                  >
                    W3C Design Token Community Group (DTCG)
                  </span>
                  <CopyButton text={jsonSource} label="Copy JSON" />
                </div>
                <pre
                  className={`m-0 max-h-72 overflow-auto rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-4 ${T_CODE} whitespace-pre`}
                >
                  {jsonSource}
                </pre>
              </Tabs.Panel>

              <Tabs.Panel value="cli" className="mt-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span
                    className={`${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
                  >
                    Run in your terminal
                  </span>
                  <CopyButton text={cliSource} label="Copy Command" />
                </div>
                <pre
                  className={`m-0 rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container-low) p-4 ${T_CODE} whitespace-pre`}
                >
                  {cliSource}
                </pre>
              </Tabs.Panel>
            </Tabs.Root>

            <div className="flex justify-end pt-2">
              <Button variant="tonal" onClick={() => setExportOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      {/* TEST ROUTING DIALOG */}
      <Dialog.Root open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <Dialog.Content className="max-w-md bg-(--sys-color-surface) text-(--sys-color-on-surface) rounded-(--sys-shape-corner-extra-large) p-6">
          <Dialog.Title>Configure Routing Engine</Dialog.Title>
          <Dialog.Description>
            Dynamic routing rules applied to cluster US-East.
          </Dialog.Description>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className={`${T_BODY_SM}`}>Edge Cache Acceleration</span>
              <Switch defaultChecked aria-label="Edge Cache" />
            </div>
            <div className="flex items-center justify-between">
              <span className={`${T_BODY_SM}`}>Automatic TLS Rotation</span>
              <Switch defaultChecked aria-label="TLS Rotation" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setTestDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => setTestDialogOpen(false)}
              >
                Apply Rules
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
