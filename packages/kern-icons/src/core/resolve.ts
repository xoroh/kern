/**
 * Icon resolution — the only place we decide *what* to paint.
 *
 * Both renderers (`render/Icon.tsx`, `render/Icon.native.tsx`) call into here
 * and then just emit the result, which is what keeps outline/filled, size, and
 * colour semantics identical across web and mobile.
 *
 * Everything is synchronous and local: the shape registry is committed
 * TypeScript, so there is no network, no async boundary, and no suspension —
 * an icon resolves during render on the server and on the device alike.
 */

import { ICON_WEIGHTS } from "../sets/material/shapes";
import { resolveIconName } from "./naming";
import { getIconSet } from "./registry";
import type {
  IconBaseProps,
  IconShape,
  IconShapeOptions,
  IconSize,
  IconWeight,
  ResolvedIcon,
} from "./types";
import { ICON_DEFAULT_WEIGHT, ICON_SIZE } from "./types";

/** Canonical viewBox. Every committed shape is already on this grid. */
export const ICON_VIEW_BOX = "0 0 24 24";

/** Paint used when a caller does not pass `color`, so icons follow the text role. */
export const ICON_DEFAULT_COLOR = "currentColor";

const isDev = (): boolean =>
  typeof process !== "undefined" && process.env.NODE_ENV !== "production";

const warned = new Set<string>();

/** Warns once per distinct message so a bad name in a list cannot spam the console. */
function warnOnce(key: string, message: string): void {
  if (!isDev() || warned.has(key)) return;
  warned.add(key);
  console.error(`[@xoroh/kern-icons] ${message}`);
}

/** Resolves a size token or explicit value to dp/px. */
export function resolveIconSize(size: IconSize | undefined): number {
  if (size === undefined) return ICON_SIZE.default;
  if (typeof size === "number") {
    if (!Number.isFinite(size) || size <= 0) {
      warnOnce(
        `size:${String(size)}`,
        `invalid size ${String(size)} — falling back to ${ICON_SIZE.default}`,
      );
      return ICON_SIZE.default;
    }
    return size;
  }
  // Widened deliberately: `size` is typed as a token union, but this is a public
  // boundary and untyped callers (server payloads, `as` casts, JS consumers) do
  // reach it with arbitrary strings. The guard below is what keeps that from
  // rendering an `undefined`px icon.
  const token = (ICON_SIZE as Readonly<Partial<Record<string, number>>>)[size];
  if (token === undefined) {
    warnOnce(
      `size:${size}`,
      `unknown size token "${size}" — falling back to ${ICON_SIZE.default}`,
    );
    return ICON_SIZE.default;
  }
  return token;
}

/** Resolves the paint colour, defaulting to `currentColor`. */
export function resolveIconColor(color: string | undefined): string {
  return color === undefined || color === "" ? ICON_DEFAULT_COLOR : color;
}

/** Weights that actually have local shape data, lightest first. */
export function getAvailableIconWeights(): ReadonlyArray<IconWeight> {
  return ICON_WEIGHTS;
}

/**
 * Picks the weight to render.
 *
 * When the requested weight was never synced, the nearest available one is used
 * rather than failing — a design that asks for 300 on a build that only ships
 * 400 still renders, and says so in dev.
 */
export function resolveIconWeight(weight: IconWeight | undefined): IconWeight {
  const available: ReadonlyArray<IconWeight> = getAvailableIconWeights();
  if (available.length === 0) return ICON_DEFAULT_WEIGHT;

  const requested = weight ?? ICON_DEFAULT_WEIGHT;
  if (available.includes(requested)) return requested;

  let nearest = available[0] ?? ICON_DEFAULT_WEIGHT;
  for (const candidate of available) {
    if (Math.abs(candidate - requested) < Math.abs(nearest - requested))
      nearest = candidate;
  }
  warnOnce(
    `weight:${requested}`,
    `weight ${requested} has no local shape data — using ${nearest}. ` +
      `Sync it with \`WEIGHT=${requested} bun run sync\` and regenerate.`,
  );
  return nearest;
}

/**
 * Resolves an icon name plus the fill/weight axes to paint-ready geometry.
 *
 * Returns `null` for a name that is not in a registered set, which happens when
 * a dynamic value (server payload, persisted preference) is cast to
 * `IconNameInput`. Callers render nothing rather than throwing, so a stale name
 * in stored user data cannot take down a screen.
 */
export function getIconShape(
  name: string,
  options: IconShapeOptions = {},
): ResolvedIcon | null {
  const resolved = resolveIconName(name, options.set);
  if (resolved === null) {
    warnOnce(
      `name:${name}`,
      `"${name}" is not in the icon catalog. Add it to config/kern-icon-set.txt ` +
        "(or drop it in assets/brand/) and run `bun run generate`.",
    );
    return null;
  }

  const filled = options.filled ?? false;
  const weight = resolveIconWeight(options.weight);
  const set = getIconSet(resolved.set);
  if (!set) {
    warnOnce(
      `set:${resolved.set}`,
      `no icon set registered as "${resolved.set}"`,
    );
    return null;
  }

  const map = set.shapes[weight];
  if (!map) {
    warnOnce(
      `weight-missing:${resolved.set}:${weight}`,
      `no shape registry for weight ${weight} in set "${resolved.set}"`,
    );
    return null;
  }

  const shape: IconShape | undefined = map[resolved.name];
  if (!shape) {
    warnOnce(
      `shape:${resolved.set}:${resolved.name}`,
      `no shape data for "${resolved.name}" at weight ${weight}`,
    );
    return null;
  }

  const filledIsOutline = filled && shape.f === undefined;
  const d = filled ? (shape.f ?? shape.o) : shape.o;

  return {
    d,
    fillRule: shape.r === "evenodd" ? "evenodd" : "nonzero",
    weight,
    filled,
    filledIsOutline,
    weightSubstituted: weight !== (options.weight ?? ICON_DEFAULT_WEIGHT),
  };
}

/**
 * Convenience guard for dynamic call sites: throws for a name that resolves to
 * nothing. Prefer {@link getIconShape}'s `null` return in UI code; this is for
 * build scripts and tests where a bad name should fail loudly.
 */
export function assertIconName(value: string): void {
  if (resolveIconName(value) !== null) return;
  throw new Error(`[@xoroh/kern-icons] "${value}" is not a valid IconName`);
}

/** Everything a renderer needs to paint one icon. */
export interface IconPaint {
  /** Path data on the `0 0 24 24` grid. */
  readonly d: string;
  readonly fillRule: "evenodd" | "nonzero";
  /** Resolved edge length in dp/px. */
  readonly size: number;
  /** Resolved paint colour. */
  readonly color: string;
  readonly weight: IconWeight;
  readonly filled: boolean;
}

/**
 * Resolves a full set of icon props to paint-ready values in one call.
 *
 * This is the shared implementation behind `useIcon` on both platforms, so a
 * hook-driven custom renderer (canvas, map marker, notification icon) paints
 * identically to `<Icon />`.
 */
export function resolveIconPaint(props: IconBaseProps): IconPaint | null {
  const shape = getIconShape(props.name, {
    filled: props.filled,
    set: props.set,
  });
  if (!shape) return null;
  return {
    d: shape.d,
    fillRule: shape.fillRule,
    size: resolveIconSize(props.size),
    color: resolveIconColor(props.color),
    weight: shape.weight,
    filled: shape.filled,
  };
}
