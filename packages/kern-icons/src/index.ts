/**
 * `@xoroh/kern-icons` — Material Symbols icon registry with web and React
 * Native renderers.
 *
 * Two layers:
 * - Full set, no gate: `MaterialSymbolsName` holds every synced glyph name.
 * - Semantic map, unification only: `SEMANTIC_ICONS` maps a recurring meaning
 *   to one decided symbol.
 *
 * The committed shape registry (`src/sets/`), resolution rules (`src/core/`),
 * and both renderers (`src/render/`) live here, so this package is the single
 * home of the icon system. Consumers import from this barrel only — deep
 * imports are blocked by the `exports` map.
 */

// ---------------------------------------------------------------------------
// Contract — names, meanings, fill, sizes
// ---------------------------------------------------------------------------

export { resolveIconName } from "./core/naming";
export type { IconSemantic } from "./core/semantic";
export { SEMANTIC_ICONS } from "./core/semantic";
export type { IconNameInput, IconQualifiedName } from "./core/types";
export { ICON_MANIFEST } from "./sets/material/manifest";
export type {
  BrandIconName,
  IconName,
  MaterialIconName,
} from "./sets/material/names";
export {
  BRAND_ICON_NAMES,
  ICON_COUNT,
  ICON_NAMES,
  isIconName,
  MATERIAL_ICON_NAMES,
} from "./sets/material/names";
export { ICON_SHAPES, ICON_WEIGHTS } from "./sets/material/shapes";
export type { MaterialSymbolsName } from "./sets/material/symbols";

// ---------------------------------------------------------------------------
// Registry — the multi-set model
// ---------------------------------------------------------------------------

export {
  DEFAULT_ICON_SET,
  getIconSet,
  listIconSets,
  registerIconSet,
} from "./core/registry";
export type { IconSet, ResolvedIconName } from "./core/types";

// ---------------------------------------------------------------------------
// Resolution — what to paint, decided once for every platform
// ---------------------------------------------------------------------------

export type { IconPaint } from "./core/resolve";
export {
  assertIconName,
  getAvailableIconWeights,
  getIconShape,
  ICON_DEFAULT_COLOR,
  ICON_VIEW_BOX,
  resolveIconColor,
  resolveIconPaint,
  resolveIconSize,
  resolveIconWeight,
} from "./core/resolve";
export type {
  IconBaseProps,
  IconManifest,
  IconShape,
  IconShapeMap,
  IconShapeOptions,
  IconSize,
  IconSizeToken,
  IconWeight,
  IconWeightRegistry,
  IconWeightShapeMap,
  ResolvedIcon,
  StaticIconBaseProps,
} from "./core/types";
export {
  ICON_DEFAULT_WEIGHT,
  ICON_SIZE,
  ICON_TOUCH_TARGET,
  ICON_WEIGHTS_AXIS,
} from "./core/types";

// ---------------------------------------------------------------------------
// Renderers
// ---------------------------------------------------------------------------

export type { IconProps, StaticIconProps } from "./render/Icon";
export { Icon } from "./render/Icon";
export { useIcon } from "./render/useIcon";
