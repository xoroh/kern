/**
 * Playground state — the theme & design system knobs, shareable and persistent.
 *
 * Ground-up state management for /playground:
 * - System-agnostic architecture: supports Material Design 3 (M3), Astryx, and shadcn.
 * - URL query parameters are the primary source of truth (sharable links recreate exact state).
 * - localStorage is the secondary authority for session persistence across refreshes.
 * - Robust fallback validation ensures invalid query params never crash the application.
 */

import {
  isHex6,
  STUDIO_CONTRASTS,
  STUDIO_DEFAULTS,
  STUDIO_DENSITIES,
  STUDIO_FONTS,
  type StudioContrast,
  type StudioDensity,
  type StudioFont,
  type StudioState,
  stateToStudioSearch,
  studioSearchToState,
} from "../../theme-studio/studio-state";

export {
  isHex6,
  STUDIO_CONTRASTS as PLAYGROUND_CONTRASTS,
  STUDIO_DENSITIES as PLAYGROUND_DENSITIES,
  STUDIO_FONTS as PLAYGROUND_FONTS,
  type StudioContrast as PlaygroundContrast,
  type StudioDensity as PlaygroundDensity,
  type StudioFont as PlaygroundFont,
};

export type PlaygroundSystem = "m3" | "astryx" | "shadcn";
export const PLAYGROUND_SYSTEMS: readonly PlaygroundSystem[] = [
  "m3",
  "astryx",
  "shadcn",
] as const;

export type PlaygroundState = StudioState & {
  system: PlaygroundSystem;
};

export const PLAYGROUND_DEFAULTS: PlaygroundState = {
  ...STUDIO_DEFAULTS,
  system: "m3",
};

export const PLAYGROUND_STORAGE_KEY = "kern.playground.system.v1";

/**
 * Validate query / stored params into a guaranteed valid PlaygroundState.
 */
export function playgroundSearchToState(
  params: Record<string, string | undefined>,
  defaults: PlaygroundState = PLAYGROUND_DEFAULTS,
): PlaygroundState {
  const base = studioSearchToState(params, defaults);
  const rawSystem = params.system?.trim().toLowerCase() as
    | PlaygroundSystem
    | undefined;

  return {
    ...base,
    system:
      rawSystem && PLAYGROUND_SYSTEMS.includes(rawSystem)
        ? rawSystem
        : defaults.system,
  };
}

/**
 * Serialize state to URL search parameters.
 * Keys at their default are omitted for clean URL sharing.
 */
export function stateToPlaygroundSearch(
  state: PlaygroundState,
  defaults: PlaygroundState = PLAYGROUND_DEFAULTS,
): Record<string, string> {
  const base = stateToStudioSearch(state, defaults);
  if (state.system && state.system !== defaults.system) {
    base.system = state.system;
  }
  return base;
}

/**
 * Load state from localStorage with safe fallback.
 */
export function loadPlaygroundState(): PlaygroundState {
  if (typeof window === "undefined") return PLAYGROUND_DEFAULTS;
  try {
    const raw = window.localStorage.getItem(PLAYGROUND_STORAGE_KEY);
    if (!raw) return PLAYGROUND_DEFAULTS;
    const parsed = JSON.parse(raw);
    return playgroundSearchToState(parsed);
  } catch {
    return PLAYGROUND_DEFAULTS;
  }
}

/**
 * Persist state to localStorage.
 */
export function savePlaygroundState(state: PlaygroundState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      PLAYGROUND_STORAGE_KEY,
      JSON.stringify(stateToPlaygroundSearch(state)),
    );
  } catch {
    // Ignore storage quota or permission failures
  }
}
