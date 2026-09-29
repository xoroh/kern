/**
 * Icon set registry — the multi-set model.
 *
 * See `IconSet` for the contract. The default set (`material`) is registered at
 * load from the generated registry; drop-in sets from `assets/sets/` arrive
 * through `EXTRA_SETS`.
 */

import { EXTRA_SETS } from "../sets";
import { ICON_NAMES } from "../sets/material/names";
import { ICON_SHAPES } from "../sets/material/shapes";
import type { IconSet } from "./types";

/** The set unqualified names resolve against. */
export const DEFAULT_ICON_SET = "material";

const registry = new Map<string, IconSet>();

/** Registers (or replaces) a named icon set. */
export function registerIconSet(set: string, iconSet: IconSet): void {
  registry.set(set, iconSet);
}

/** Looks up a registered set. */
export function getIconSet(set: string): IconSet | undefined {
  return registry.get(set);
}

/** Ids of every registered set, sorted. */
export function listIconSets(): ReadonlyArray<string> {
  return [...registry.keys()].sort();
}

registerIconSet(DEFAULT_ICON_SET, {
  names: new Set(ICON_NAMES),
  shapes: ICON_SHAPES,
});

for (const [id, iconSet] of Object.entries(EXTRA_SETS)) {
  registerIconSet(id, iconSet);
}
