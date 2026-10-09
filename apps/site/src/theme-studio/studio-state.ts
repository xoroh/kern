/**
 * Studio state — the five theme knobs, shareable and persistent.
 *
 * WHAT THIS IS: the theme studio's state lives in the URL first (a shared
 * link reopens the exact theme) with localStorage as the second authority
 * (a refresh keeps the knobs) and defaults third. Every read is validated:
 * a corrupt stored value or a hand-mangled query string falls back per-key,
 * never renders a broken theme.
 *
 * The URL mapping is the CONTRACT — `studioSearchToState` and
 * `stateToStudioSearch` are pure and round-trip, so a shared link cannot
 * drift from what the sender saw. Params are short (`seed`, `preset`,
 * `dark`, `contrast`, `radius`) and absent keys mean "use the default",
 * not "clear the theme".
 */

export type StudioContrast = "standard" | "medium" | "high";

export type StudioState = {
  /** Seed hex, `#rrggbb`. The primary-family approximation reads this. */
  seed: string;
  /** Preset id (kern / sharp / compact / brand / demo or a session tenant). */
  preset: string;
  dark: boolean;
  contrast: StudioContrast;
  /** Corner scale factor, 0.5–2. */
  radius: number;
};

export const STUDIO_DEFAULTS: StudioState = {
  seed: "#6750a4",
  preset: "kern",
  dark: false,
  contrast: "standard",
  radius: 1,
};

export const STUDIO_STORAGE_KEY = "kern.studio.v1";

export function isHex6(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

const CONTRASTS: readonly StudioContrast[] = ["standard", "medium", "high"];

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
  const rawContrast = params.contrast as StudioContrast | undefined;
  const rawRadius =
    params.radius === undefined ? undefined : Number(params.radius);
  const rawDark = params.dark;
  return {
    seed:
      params.seed && isHex6(params.seed)
        ? params.seed.toLowerCase()
        : defaults.seed,
    preset:
      rawPreset && /^[a-z0-9][a-z0-9-]{0,63}$/i.test(rawPreset)
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
  return localStorage.getItem(STUDIO_STORAGE_KEY);
}

function defaultWrite(value: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STUDIO_STORAGE_KEY, value);
}
