/**
 * The icon core — contract types, semantic aliases, name resolution, the set
 * registry, and paint resolution. Import from the package barrel; deep imports
 * are blocked by the `exports` map.
 */

export { resolveIconName } from "./naming";
export {
  DEFAULT_ICON_SET,
  getIconSet,
  listIconSets,
  registerIconSet,
} from "./registry";
export type { IconPaint } from "./resolve";
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
} from "./resolve";
export type { IconSemantic } from "./semantic";
export { SEMANTIC_ICONS } from "./semantic";
export type {
  IconBaseProps,
  IconManifest,
  IconNameInput,
  IconQualifiedName,
  IconSet,
  IconShape,
  IconShapeMap,
  IconShapeOptions,
  IconSize,
  IconSizeToken,
  IconWeight,
  IconWeightRegistry,
  IconWeightShapeMap,
  ResolvedIcon,
  ResolvedIconName,
  StaticIconBaseProps,
} from "./types";
export {
  ICON_DEFAULT_WEIGHT,
  ICON_SIZE,
  ICON_TOUCH_TARGET,
  ICON_WEIGHTS_AXIS,
} from "./types";
