/**
 * `@xoroh/kern-icons` (React Native) — same contract and registry as the web
 * entry, with the `react-native-svg` renderer.
 *
 * The `"react-native"` export condition points bundlers here. Everything
 * shared — names, semantic aliases, resolution, the set registry — comes from
 * the same modules the web entry uses; only `Icon` differs.
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

export type { IconProps, StaticIconProps } from "./render/Icon.native";
export { Icon } from "./render/Icon.native";
export { useIcon } from "./render/useIcon";
