import data from "./tokens.json";

/**
 * M3 state-layer opacities — the single source of truth for every surface
 * that paints or names a state layer (site `StatesStrip`, prose, gates).
 *
 * Parsed from the canonical `tokens.json` `states` block, so docs can never
 * drift from the tokens they describe: the class of bug where component
 * pages taught focus/press 12% while the tokens ship 10%. Canonical per
 * m3.material.io interaction/states (`hover-state-layer-opacity` 8%,
 * `focus-state-layer-opacity` 10%, `pressed-state-layer-opacity` 10%,
 * `dragged-state-layer-opacity` 16%) plus kern's `disabled` 38% extension.
 * (material-web v0.192 still ships focus/pressed at 12% — stale relative
 * to the live spec; the live spec wins here.)
 * Fractions, not percents — suitable for `opacity` style values directly.
 */
function parsePercent(text: unknown): number {
  if (typeof text !== "string" || !text.endsWith("%")) {
    throw new Error(`state opacity is not a percent string: ${String(text)}`);
  }
  const value = Number.parseFloat(text) / 100;
  if (!Number.isFinite(value)) {
    throw new Error(`state opacity is not numeric: ${text}`);
  }
  return value;
}

const states = (data as { states: Record<string, unknown> }).states;

export const STATE_LAYER_OPACITIES = {
  hover: parsePercent(states["hover-opacity"]),
  focus: parsePercent(states["focus-opacity"]),
  press: parsePercent(states["press-opacity"]),
  drag: parsePercent(states["drag-opacity"]),
  disabled: parsePercent(states["disabled-opacity"]),
} as const;

export type StateLayer = keyof typeof STATE_LAYER_OPACITIES;
