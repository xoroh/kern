/**
 * Icon contract — framework-agnostic types and tokens shared by every renderer.
 *
 * This module is the reason the web and native renderers can stay thin: all of
 * the icon semantics (name resolution, fill axis, weight axis, size tokens) are
 * decided once in `resolve.ts`, and both platforms just paint the result.
 */

import type { IconName } from "../sets/material/names";
import type { MaterialSymbolsName } from "../sets/material/symbols";
import type { IconSemantic } from "./semantic";

/** `set:name` — a name qualified to a specific registered set. */
export type IconQualifiedName = `${string}:${string}`;

/**
 * Anything an `Icon` renderer accepts as `name`: a full Material Symbols glyph
 * (snake_case), a committed `IconName` (kebab-case), a semantic meaning alias,
 * or a `set:name` qualification. All four are compile-time checked — a wrong
 * glyph name fails `tsc`.
 */
export type IconNameInput =
  | MaterialSymbolsName
  | IconName
  | IconSemantic
  | IconQualifiedName;

/** A resolved `set` / `name` pair — the form the registry is keyed by. */
export interface ResolvedIconName {
  /** Registered set id. */
  readonly set: string;
  /** Canonical kebab-case name within that set. */
  readonly name: string;
}

/**
 * Material Symbols weight axis. This package ships **400** by default: on the
 * upstream 960-unit grid, weight 400 renders as a 2px-equivalent stroke at
 * 24dp, which is the icon baseline.
 *
 * Additional weights are an opt-in resync (`WEIGHT=300 bun run sync`) plus a
 * regenerate; the registry below is keyed by weight so nothing else changes.
 */
export type IconWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700;

/** Every weight on the Material Symbols axis, lightest first. */
export const ICON_WEIGHTS_AXIS = [
  100, 200, 300, 400, 500, 600, 700,
] as const satisfies readonly IconWeight[];

/** The weight components use when the caller does not specify one. */
export const ICON_DEFAULT_WEIGHT: IconWeight = 400;

/**
 * Normalized geometry for one icon.
 *
 * Path data is already re-based onto the canonical `0 0 24 24` grid at build
 * time, so renderers emit a single `<path>` and never scale, translate, or
 * re-parse anything. Keys are short because this object is instantiated once
 * per icon in the committed registry.
 */
export interface IconShape {
  /** FILL 0 (outline) path data. */
  readonly o: string;
  /**
   * FILL 1 (filled) path data. Omitted when the source has no filled variant —
   * outline-only marks reuse `o`, and `getIconShape` handles that.
   */
  readonly f?: string;
  /** Set to `evenodd` when the source geometry needs it (overlapping subpaths). */
  readonly r?: "evenodd";
}

/**
 * Shapes keyed by canonical icon name within one set at one weight.
 *
 * Keys are open (`string`), not the `IconName` union: drop-in sets carry their
 * own names, and `IconName` is only the default set's compile-time union. The
 * registry-integrity tests hold the default set's keys to `IconName`.
 */
export type IconShapeMap = Readonly<Partial<Record<string, IconShape>>>;

/** Shapes for a subset of the catalog (one generated chunk). */
export type IconWeightShapeMap = IconShapeMap;

/** Shape data keyed by the Material Symbols weight axis. */
export type IconWeightRegistry = Readonly<
  Partial<Record<IconWeight, IconShapeMap>>
>;

/**
 * Icon size scale, in device-independent pixels.
 *
 * `default` (24) is the canonical icon size and matches the viewBox 1:1, so it
 * renders crisply with no resampling. `compact`/`small` are for dense rows and
 * inline text; `display` is the full chrome size. `ICON_TOUCH_TARGET` is the
 * 48dp minimum hit target, used for the padding box of an icon button rather
 * than the glyph itself.
 */
export const ICON_SIZE = {
  compact: 16,
  small: 18,
  medium: 20,
  default: 24,
  large: 32,
  xlarge: 40,
  display: 48,
} as const;

export type IconSizeToken = keyof typeof ICON_SIZE;

/** A size is either a token or an explicit dp/px value. */
export type IconSize = IconSizeToken | number;

/** Minimum touch target for an interactive icon, in dp. */
export const ICON_TOUCH_TARGET = 48;

/** Build-time metadata for the committed shape data. */
export interface IconManifest {
  readonly viewBox: string;
  readonly precision: number;
  readonly weights: ReadonlyArray<number>;
  readonly defaultWeight: number;
  readonly counts: {
    readonly total: number;
    readonly material: number;
    readonly brand: number;
    /**
     * Icons whose FILL 1 geometry is identical to FILL 0, so the registry stores
     * the path once. Common upstream — a magnifier has no "filled" reading.
     */
    readonly filledReusesOutline: number;
  };
  readonly source: {
    readonly package: string;
    readonly version: string;
    readonly style: string;
    readonly weight: number;
    readonly opticalSize: number;
    readonly license: string;
    readonly licenseUrl: string;
  };
}

/**
 * Props every icon renderer accepts, independent of platform.
 *
 * Each renderer intersects this with its own SVG element props
 * (`SVGProps<SVGSVGElement>` on web, `SvgProps` on React Native) so callers
 * keep full access to `className`, `style`, `onPress`, and friends.
 */
export interface IconBaseProps {
  /**
   * Which icon to render: a semantic alias, a glyph name, or `set:name`.
   * Fully type-checked against the shipped catalog.
   */
  readonly name: IconNameInput;
  /**
   * Registered set to resolve an unqualified `name` against. Defaults to the
   * default set (`material`). Ignored when `name` is `set:name` or a semantic
   * alias with a qualified target.
   */
  readonly set?: string;
  /**
   * Switches between the FILL 0 (outline) and the FILL 1 (filled) geometry.
   * Defaults to `false`.
   *
   * The filled state marks **selection** and **active navigation**, not
   * decoration — a nav destination is filled while it is current. Both variants
   * are local, so toggling this never fetches and never re-layouts.
   */
  readonly filled?: boolean;
  /** Rendered size in dp/px, or a size token. Defaults to `default` (24). */
  readonly size?: IconSize;
  /** Paint colour. Defaults to `currentColor` so icons follow the text role. */
  readonly color?: string;
  /**
   * Accessible name. When omitted the icon is treated as decorative and hidden
   * from assistive technology — which is correct next to a visible text label.
   */
  readonly title?: string;
  /** Test hook (`data-testid` on web, `testID` on React Native). */
  readonly testID?: string;
}

/** The same props with `name` already bound — used by call sites that wrap `Icon`. */
export type StaticIconBaseProps = Omit<IconBaseProps, "name">;

/** Options accepted by {@link getIconShape}. */
export interface IconShapeOptions {
  readonly filled?: boolean;
  /** Set override for unqualified names — mirrors the `set` prop. */
  readonly set?: string;
  readonly weight?: IconWeight;
}

/** A resolved, ready-to-paint icon. */
export interface ResolvedIcon {
  readonly d: string;
  readonly fillRule: "evenodd" | "nonzero";
  readonly weight: IconWeight;
  readonly filled: boolean;
  /** True when the filled state fell back to the outline geometry. */
  readonly filledIsOutline: boolean;
  /** True when the requested weight was unavailable and a neighbour was used. */
  readonly weightSubstituted: boolean;
}

/**
 * Icon set registry — the multi-set model.
 *
 * A set is a named bag of shape data: `registerIconSet` makes it addressable,
 * `getIconSet`/`listIconSets` inspect it, and name resolution routes
 * `set:name` / `name` + `set` here. The default set (`material`) is registered
 * at load from the generated registry, so `<Icon name="search" />` works with
 * no setup; drop-in sets from `assets/sets/` arrive through `EXTRA_SETS`.
 *
 * Registering overwrites, deliberately: an app may replace the default set with
 * a subset (or a superset) at startup without opting out of the built-in data.
 */
export interface IconSet {
  /** Every name this set can resolve. Canonical kebab-case. */
  readonly names: ReadonlySet<string>;
  /** Shape data by Material Symbols weight axis value. */
  readonly shapes: IconWeightRegistry;
}
