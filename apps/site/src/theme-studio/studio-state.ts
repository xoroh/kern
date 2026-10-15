/**
 * Studio & Playground state — the theme knobs, shareable and persistent.
 *
 * WHAT THIS IS: the theme playground's state lives in the URL first (a shared
 * link reopens the exact theme) with localStorage as the second authority
 * (a refresh keeps the knobs) and defaults third. Every read is validated:
 * a corrupt stored value or a hand-mangled query string falls back per-key,
 * never renders a broken theme.
 *
 * The URL mapping is the CONTRACT — `studioSearchToState` and
 * `stateToStudioSearch` are pure and round-trip, so a shared link cannot
 * drift from what the sender saw. Params are short (`seed`, `preset`,
 * `dark`, `contrast`, `radius`, `font`, `density`) and absent keys mean "use the default",
 * not "clear the theme".
 */

export type StudioContrast = "standard" | "medium" | "high";

export const STUDIO_CONTRASTS: readonly StudioContrast[] = [
  "standard",
  "medium",
  "high",
];

export const STUDIO_FONTS = [
  "inter",
  "roboto",
  "system",
  "geist",
  "mono",
] as const;
export type StudioFont = (typeof STUDIO_FONTS)[number];

export const STUDIO_DENSITIES = [
  "compact",
  "standard",
  "comfortable",
] as const;
export type StudioDensity = (typeof STUDIO_DENSITIES)[number];

export type StudioState = {
  /** Seed hex, `#rrggbb`. The primary-family approximation reads this. */
  seed: string;
  /** Preset id (kern / sharp / compact / brand / demo or a session tenant). */
  preset: string;
  dark: boolean;
  contrast: StudioContrast;
  /** Corner scale factor, 0.5–2. */
  radius: number;
  /** Active typeface family for typography tokens preview. */
  font?: StudioFont;
  /** UI density / spacing scale. */
  density?: StudioDensity;
};

export const STUDIO_DEFAULTS: StudioState = {
  seed: "#6750a4",
  preset: "material-3",
  dark: false,
  contrast: "standard",
  radius: 1,
};

export const STUDIO_STORAGE_KEY = "kern.playground.v1";

export function isHex6(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

const CONTRASTS = STUDIO_CONTRASTS;

function clampRadius(n: number): number {
  if (!Number.isFinite(n)) return STUDIO_DEFAULTS.radius;
  return Math.min(2, Math.max(0.5, Math.round(n * 4) / 4));
}

/**
 * Validate one raw value per key. Anything invalid falls back to the
 * default for that key alone — `?seed=nope&radius=3` yields
 * `{ seed: default, radius: 2 }`, not a rejected state.
 */
export function studioSearchToState(
  params: Record<string, string | undefined>,
  defaults: StudioState = STUDIO_DEFAULTS,
): StudioState {
  const rawPreset = params.preset?.trim();
  const rawSeed = params.seed?.trim();
  const rawDark = params.dark?.trim();
  const rawContrast = params.contrast?.trim() as StudioContrast | undefined;
  const rawRadius = params.radius !== undefined ? Number(params.radius) : undefined;
  const rawFont = params.font?.trim() as StudioFont | undefined;
  const rawDensity = params.density?.trim() as StudioDensity | undefined;

  const out: StudioState = {
    seed: rawSeed && isHex6(rawSeed) ? rawSeed.toLowerCase() : defaults.seed,
    preset:
      rawPreset && /^[a-z0-9-]+$/i.test(rawPreset)
        ? rawPreset
        : defaults.preset,
    dark:
      rawDark === undefined
        ? defaults.dark
        : rawDark === "1" || rawDark === "true",
    contrast:
      rawContrast && CONTRASTS.includes(rawContrast)
        ? rawContrast
        : defaults.contrast,
    radius: rawRadius === undefined ? defaults.radius : clampRadius(rawRadius),
  };

  if (rawFont && STUDIO_FONTS.includes(rawFont)) {
    out.font = rawFont;
  } else if (defaults.font) {
    out.font = defaults.font;
  }

  if (rawDensity && STUDIO_DENSITIES.includes(rawDensity)) {
    out.density = rawDensity;
  } else if (defaults.density) {
    out.density = defaults.density;
  }

  return out;
}

/**
 * State → URL params. Keys at their default are OMITTED so the common
 * theme shares as `/playground` and not as a wall of query noise.
 */
export function stateToStudioSearch(
  state: StudioState,
  defaults: StudioState = STUDIO_DEFAULTS,
): Record<string, string> {
  const out: Record<string, string> = {};
  if (state.seed !== defaults.seed) out.seed = state.seed;
  if (state.preset !== defaults.preset) out.preset = state.preset;
  if (state.dark !== defaults.dark) out.dark = state.dark ? "1" : "0";
  if (state.contrast !== defaults.contrast) out.contrast = state.contrast;
  if (state.radius !== defaults.radius) out.radius = String(state.radius);
  if (state.font && state.font !== defaults.font && state.font !== "inter") {
    out.font = state.font;
  }
  if (
    state.density &&
    state.density !== defaults.density &&
    state.density !== "standard"
  ) {
    out.density = state.density;
  }
  return out;
}

/** Parse `?a=b&c=d` (or a full search string) into state. */
export function searchToState(
  search: string,
  defaults: StudioState = STUDIO_DEFAULTS,
): StudioState {
  const params: Record<string, string> = {};
  const cleaned = search.startsWith("?") ? search.slice(1) : search;
  for (const pair of cleaned.split("&")) {
    if (!pair) continue;
    const [k, v = ""] = pair.split("=");
    if (k) params[decodeURIComponent(k)] = decodeURIComponent(v);
  }
  return studioSearchToState(params, defaults);
}

/** State → `?a=b&c=d`. Empty (all defaults) yields `""`. */
export function stateToSearch(
  state: StudioState,
  defaults: StudioState = STUDIO_DEFAULTS,
): string {
  const params = stateToStudioSearch(state, defaults);
  const pairs = Object.entries(params).map(
    ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`,
  );
  return pairs.length > 0 ? `?${pairs.join("&")}` : "";
}

/** localStorage read, validated per key. SSR-safe: no `window`, no crash. */
export function loadStudioState(
  defaults: StudioState = STUDIO_DEFAULTS,
  read: (() => string | null) | null = defaultRead,
): StudioState {
  if (!read) return defaults;
  try {
    const raw = read();
    if (!raw) return defaults;
    return studioSearchToState(
      JSON.parse(raw) as Record<string, string>,
      defaults,
    );
  } catch {
    return defaults;
  }
}

/**
 * localStorage write. SSR-safe and failure-safe (private mode, quota).
 *
 * Persists the STRING-PARAM map, not the typed object: URL and storage then
 * share one validator (`studioSearchToState`), so a stored `dark: true`
 * cannot parse differently from a `?dark=1`.
 */
export function saveStudioState(
  state: StudioState,
  write: ((value: string) => void) | null = defaultWrite,
): void {
  if (!write) return;
  try {
    write(JSON.stringify(stateToStudioSearch(state)));
  } catch {
    // A theme that cannot persist is still a usable theme.
  }
}

function defaultRead(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(STUDIO_STORAGE_KEY) ?? localStorage.getItem("kern.studio.v1");
}

function defaultWrite(value: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STUDIO_STORAGE_KEY, value);
}

// Playground nomenclature aliases
export type PlaygroundContrast = StudioContrast;
export const PLAYGROUND_CONTRASTS = STUDIO_CONTRASTS;
export const PLAYGROUND_FONTS = STUDIO_FONTS;
export type PlaygroundFont = StudioFont;
export const PLAYGROUND_DENSITIES = STUDIO_DENSITIES;
export type PlaygroundDensity = StudioDensity;
export type PlaygroundState = StudioState;
export const PLAYGROUND_DEFAULTS = STUDIO_DEFAULTS;
export const PLAYGROUND_STORAGE_KEY = STUDIO_STORAGE_KEY;
export const playgroundSearchToState = studioSearchToState;
export const stateToPlaygroundSearch = stateToStudioSearch;
export const searchToPlaygroundState = searchToState;
export const playgroundStateToSearch = stateToSearch;
export const loadPlaygroundState = loadStudioState;
export const savePlaygroundState = saveStudioState;
