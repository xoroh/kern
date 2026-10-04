/** Foundation elevation — one group per LEVEL with two axes (`dp`, `shadow`). */
import { group, type Leaf, subgroups } from "./tokens";

export type ElevationLevel = { level: string; dp: unknown; shadow: unknown };

export const ELEVATION: Leaf[] = group("elevation");

/**
 * Elevation is one group per LEVEL with two axes (`dp`, `shadow`). The
 * flattened form is kept for lookup; the structured form is what the page
 * renders, so a level reads as a level and never as two loose leaves.
 */
export const ELEVATION_LEVELS: ElevationLevel[] = subgroups("elevation")
  .sort((a, b) => a.key.localeCompare(b.key))
  .map(({ key, node }) => ({
    level: key,
    dp: node.dp,
    shadow: node.shadow,
  }));
