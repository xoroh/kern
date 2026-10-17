/**
 * Kern expressive shapes — additive morph-shape library (pure data).
 *
 * M3 Expressive (May 2025) added 35 shapes plus shape morphing to the Material
 * Shape Library (Figma Design Kit + Jetpack Compose; Android Views partial;
 * Web unavailable). The shapes fall into a few parametric families — rounded
 * polygons, notched "cookie" rings, multi-point bursts, floral scallops — and
 * M3 consumes them in exactly four places: the loading indicator (a looping
 * morph through seven shapes, 48dp footprint / 38dp container), standard
 * button groups (press morph between adjacent buttons), buttons + icon
 * buttons (round/square resting shapes with a pressed-state morph), and the
 * wavy progress-indicator configuration.
 *
 * Kern deliberately does NOT morph: static radii are pinned (`full` pills,
 * `small` cards, `medium` dropdowns — see the Shape section of the kern
 * skill). So this module ships the *forms* as decorative-only art geometry,
 * never as interaction state. No animation, no press morph, no morph API.
 *
 * What this module is:
 *
 * - Named shape definitions as pure data (a parametric descriptor + the core
 *   corner token the form extends), with a fail-loud registry mirroring the
 *   `registerHue` / `getHue` pattern in `./tones`.
 * - One deterministic sampler (`sampleExpressiveShape`) and one SVG path
 *   builder (`expressiveShapePath`) shared by every renderer, so web and
 *   native can never drift by a rounding rule nobody wrote down.
 *
 * What this module is NOT: vertex-exact copies of Compose's RoundedPolygon
 * presets. The upstream vertex tables are not vendored anywhere in this repo
 * (`docs/design-systems/m3-usable/` carries the shape principles and
 * consumers, not the 35 names/vertices), so these are Kern-authored
 * parameterizations of the same families. Matching Compose vertex-for-vertex
 * is a documented follow-up, not a silent claim.
 *
 * The 10-entry core `shape` scale in `tokens.json` is untouched — these forms
 * live beside it under their own names, and each one records which core
 * corner it extends via `extendsCorner`.
 *
 * Pure TypeScript — no React, no DOM, no React Native.
 */

export const EXPRESSIVE_SHAPE_BOX = 100;

/** The 10-entry core corner scale these forms extend (read-only reference). */
export const CORE_SHAPE_TOKENS = [
  "none",
  "extra-small",
  "small",
  "medium",
  "large",
  "large-increased",
  "extra-large",
  "extra-large-increased",
  "extra-extra-large",
  "full",
] as const;

export type CoreShapeToken = (typeof CORE_SHAPE_TOKENS)[number];

export const EXPRESSIVE_SHAPE_FAMILIES = [
  "rounded",
  "cookie",
  "burst",
  "floral",
  "angular",
] as const;

export type ExpressiveShapeFamily = (typeof EXPRESSIVE_SHAPE_FAMILIES)[number];

export type ExpressiveShapeGeometry =
  | {
      kind: "superellipse";
      /** 2 = ellipse, 4 = soft square, higher = boxier. Range 1–16. */
      exponent: number;
      /** Width / height. 1 = square box, >1 = wider. Range 0.25–4. */
      aspect?: number;
      rotationDeg?: number;
    }
  | {
      kind: "scallop";
      /** Notch count (cookie scoops / clover leaves). Integer 2–24. */
      lobes: number;
      /** Notch depth as a fraction of radius. Range 0–0.5. */
      depth: number;
      rotationDeg?: number;
    }
  | {
      kind: "star";
      /** Point count; the polygon has 2× vertices. Integer 2–24. */
      points: number;
      /** Valley radius / peak radius. Near 1 = gentle ripple. 0.05–0.98. */
      innerRatio: number;
      rotationDeg?: number;
    };

export interface ExpressiveShapeDef {
  /** kebab-case id, e.g. "cookie-4". */
  name: string;
  family: ExpressiveShapeFamily;
  description: string;
  /** The core corner token this form builds on. Never a new radius. */
  extendsCorner: CoreShapeToken;
  geometry: ExpressiveShapeGeometry;
}

function freezeDef(def: ExpressiveShapeDef): ExpressiveShapeDef {
  return Object.freeze({
    ...def,
    geometry: Object.freeze({ ...def.geometry }),
  });
}

export const EXPRESSIVE_SHAPES: readonly ExpressiveShapeDef[] = [
  freezeDef({
    name: "soft-square",
    family: "rounded",
    description:
      "Softened square — the rounded-polygon midpoint between box and circle.",
    extendsCorner: "small",
    geometry: { kind: "superellipse", exponent: 4 },
  }),
  freezeDef({
    name: "circle",
    family: "rounded",
    description: "Full-round form for dots, badges, and avatar masks.",
    extendsCorner: "full",
    geometry: { kind: "superellipse", exponent: 2 },
  }),
  freezeDef({
    name: "oval",
    family: "rounded",
    description: "Wide ellipse for pills and lozenge crops.",
    extendsCorner: "full",
    geometry: { kind: "superellipse", exponent: 2, aspect: 1.6 },
  }),
  freezeDef({
    name: "diamond",
    family: "angular",
    description: "Boxy superellipse turned 45° — tension against round forms.",
    extendsCorner: "small",
    geometry: { kind: "superellipse", exponent: 10, rotationDeg: 45 },
  }),
  freezeDef({
    name: "gem",
    family: "angular",
    description: "Four-point faceted spark for highlights and empty states.",
    extendsCorner: "small",
    geometry: { kind: "star", points: 4, innerRatio: 0.5 },
  }),
  freezeDef({
    name: "cookie-4",
    family: "cookie",
    description: "Four-scoop notched ring — the small M3 cookie form.",
    extendsCorner: "medium",
    geometry: { kind: "scallop", lobes: 4, depth: 0.16 },
  }),
  freezeDef({
    name: "cookie-9",
    family: "cookie",
    description: "Nine-scoop notched ring — the fine M3 cookie form.",
    extendsCorner: "medium",
    geometry: { kind: "scallop", lobes: 9, depth: 0.1 },
  }),
  freezeDef({
    name: "clover-4",
    family: "floral",
    description: "Deep four-lobe scallop for organic brand moments.",
    extendsCorner: "large",
    geometry: { kind: "scallop", lobes: 4, depth: 0.32 },
  }),
  freezeDef({
    name: "flower-8",
    family: "floral",
    description: "Eight-petal soft star for celebratory art.",
    extendsCorner: "full",
    geometry: { kind: "star", points: 8, innerRatio: 0.82 },
  }),
  freezeDef({
    name: "burst-12",
    family: "burst",
    description: "Twelve-point burst for attention moments (never for status).",
    extendsCorner: "full",
    geometry: { kind: "star", points: 12, innerRatio: 0.78 },
  }),
];

// ─── Registry (mirrors registerHue / getHue in ./tones) ─────────────

const registry = new Map<string, ExpressiveShapeDef>();
for (const def of EXPRESSIVE_SHAPES) {
  registry.set(def.name, def);
}

function assertGeometry(geometry: ExpressiveShapeGeometry, name: string): void {
  const finite = (value: unknown): value is number =>
    typeof value === "number" && Number.isFinite(value);
  const fail = (why: string): never => {
    throw new Error(`Expressive shape ${name} has invalid geometry: ${why}`);
  };
  switch (geometry.kind) {
    case "superellipse":
      if (
        !finite(geometry.exponent) ||
        geometry.exponent < 1 ||
        geometry.exponent > 16
      ) {
        fail("superellipse.exponent must be within 1–16");
      }
      if (
        geometry.aspect !== undefined &&
        (!finite(geometry.aspect) ||
          geometry.aspect < 0.25 ||
          geometry.aspect > 4)
      ) {
        fail("superellipse.aspect must be within 0.25–4");
      }
      if (geometry.rotationDeg !== undefined && !finite(geometry.rotationDeg)) {
        fail("superellipse.rotationDeg must be finite");
      }
      break;
    case "scallop":
      if (
        !Number.isInteger(geometry.lobes) ||
        geometry.lobes < 2 ||
        geometry.lobes > 24
      ) {
        fail("scallop.lobes must be an integer within 2–24");
      }
      if (
        !finite(geometry.depth) ||
        geometry.depth < 0 ||
        geometry.depth > 0.5
      ) {
        fail("scallop.depth must be within 0–0.5");
      }
      if (geometry.rotationDeg !== undefined && !finite(geometry.rotationDeg)) {
        fail("scallop.rotationDeg must be finite");
      }
      break;
    case "star":
      if (
        !Number.isInteger(geometry.points) ||
        geometry.points < 2 ||
        geometry.points > 24
      ) {
        fail("star.points must be an integer within 2–24");
      }
      if (
        !finite(geometry.innerRatio) ||
        geometry.innerRatio < 0.05 ||
        geometry.innerRatio > 0.98
      ) {
        fail("star.innerRatio must be within 0.05–0.98");
      }
      if (geometry.rotationDeg !== undefined && !finite(geometry.rotationDeg)) {
        fail("star.rotationDeg must be finite");
      }
      break;
    default:
      fail(`unknown geometry kind`);
  }
}

/**
 * Install an expressive shape definition. Additive only — like `registerHue`,
 * it never touches the core scale. Invalid definitions throw.
 */
export function registerExpressiveShape(def: ExpressiveShapeDef): void {
  if (!/^[a-z][a-z0-9-]{1,31}$/.test(def.name)) {
    throw new Error(`Invalid expressive shape name: ${def.name}`);
  }
  if (!(EXPRESSIVE_SHAPE_FAMILIES as readonly string[]).includes(def.family)) {
    throw new Error(`Unknown expressive shape family: ${def.family}`);
  }
  if (!(CORE_SHAPE_TOKENS as readonly string[]).includes(def.extendsCorner)) {
    throw new Error(
      `Unknown core corner for expressive shape ${def.name}: ${def.extendsCorner}`,
    );
  }
  assertGeometry(def.geometry, def.name);
  registry.set(def.name, freezeDef(def));
}

/** Fail-loud lookup — rendering must never silently swap to the wrong form. */
export function getExpressiveShape(name: string): ExpressiveShapeDef {
  const def = registry.get(name);
  if (!def) {
    throw new Error(`Unknown expressive shape: ${name}`);
  }
  return def;
}

export function listExpressiveShapes(): string[] {
  return [...registry.keys()];
}

export function hasExpressiveShape(name: string): boolean {
  return registry.has(name);
}

// ─── Sampling + SVG path (one implementation, every renderer) ───────

const TAU = Math.PI * 2;

/** Sample counts per geometry kind — fixed, so paths are stable forever. */
export const EXPRESSIVE_SHAPE_SAMPLES = {
  superellipse: 64,
  scallop: 96,
} as const;

function signPow(value: number, power: number): number {
  return Math.sign(value) * Math.abs(value) ** power;
}

function rotatePoint(
  x: number,
  y: number,
  rotationDeg: number,
): [number, number] {
  const radians = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [
    0.5 + (x - 0.5) * cos - (y - 0.5) * sin,
    0.5 + (x - 0.5) * sin + (y - 0.5) * cos,
  ];
}

/**
 * Fit sampled points into the unit box (uniform scale, centered, aspect
 * preserved). Keeps rotated forms — e.g. the 45° diamond — drawable in any
 * square viewport instead of overflowing it.
 */
function normalizePoints(
  points: Array<[number, number]>,
): Array<[number, number]> {
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (const [x, y] of points) {
    x0 = Math.min(x0, x);
    x1 = Math.max(x1, x);
    y0 = Math.min(y0, y);
    y1 = Math.max(y1, y);
  }
  const scale = Math.min(1 / (x1 - x0), 1 / (y1 - y0));
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  return points.map(([x, y]) => [
    0.5 + (x - cx) * scale,
    0.5 + (y - cy) * scale,
  ]);
}

function sampleGeometry(
  geometry: ExpressiveShapeGeometry,
): Array<[number, number]> {
  switch (geometry.kind) {
    case "superellipse": {
      const points: Array<[number, number]> = [];
      const count = EXPRESSIVE_SHAPE_SAMPLES.superellipse;
      for (let i = 0; i < count; i++) {
        const t = (i / count) * TAU;
        points.push(
          rotatePoint(
            0.5 + 0.5 * signPow(Math.cos(t), 2 / geometry.exponent),
            0.5 +
              (0.5 / (geometry.aspect ?? 1)) *
                signPow(Math.sin(t), 2 / geometry.exponent),
            geometry.rotationDeg ?? 0,
          ),
        );
      }
      return normalizePoints(points);
    }
    case "scallop": {
      const points: Array<[number, number]> = [];
      const count = EXPRESSIVE_SHAPE_SAMPLES.scallop;
      for (let i = 0; i < count; i++) {
        const t = (i / count) * TAU;
        const radius =
          0.5 *
          (1 - geometry.depth * (0.5 - 0.5 * Math.cos(geometry.lobes * t)));
        points.push(
          rotatePoint(
            0.5 + radius * Math.cos(t),
            0.5 + radius * Math.sin(t),
            geometry.rotationDeg ?? 0,
          ),
        );
      }
      return normalizePoints(points);
    }
    case "star": {
      const points: Array<[number, number]> = [];
      const rotation = geometry.rotationDeg ?? -90;
      for (let i = 0; i < geometry.points * 2; i++) {
        const t = (i / (geometry.points * 2)) * TAU;
        const radius = i % 2 === 0 ? 0.5 : 0.5 * geometry.innerRatio;
        points.push(
          rotatePoint(
            0.5 + radius * Math.cos(t),
            0.5 + radius * Math.sin(t),
            rotation,
          ),
        );
      }
      return normalizePoints(points);
    }
  }
}

export type ExpressiveShapePoint = { x: number; y: number };

/**
 * Sampled polygon for a shape in a `size`×`size` box, starting at angle 0
 * (east) and winding clockwise in screen coordinates (y down).
 */
export function sampleExpressiveShape(
  name: string,
  size = EXPRESSIVE_SHAPE_BOX,
): ExpressiveShapePoint[] {
  return sampleGeometry(getExpressiveShape(name).geometry).map(([x, y]) => ({
    x: x * size,
    y: y * size,
  }));
}

function formatCoordinate(value: number): string {
  return String(Number(value.toFixed(3)));
}

/**
 * Closed SVG path (`d`) for a shape in a `size`×`size` box, drawn in a
 * `0 0 EXPRESSIVE_SHAPE_BOX EXPRESSIVE_SHAPE_BOX` viewBox when
 * `size === EXPRESSIVE_SHAPE_BOX`. Corners are rounded with midpoint
 * quadratics — the same smoothing on every renderer, so the path string is
 * byte-identical on web and native for a given name + size.
 */
export function expressiveShapePath(
  name: string,
  size = EXPRESSIVE_SHAPE_BOX,
): string {
  const raw = sampleGeometry(getExpressiveShape(name).geometry);
  const points = raw.map(([x, y]) => [x * size, y * size] as [number, number]);
  const midpoint = (
    a: [number, number],
    b: [number, number],
  ): [number, number] => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const count = points.length;
  const start = midpoint(points[count - 1], points[0]);
  let d = `M ${formatCoordinate(start[0])} ${formatCoordinate(start[1])}`;
  for (let i = 0; i < count; i++) {
    const mid = midpoint(points[i], points[(i + 1) % count]);
    d +=
      ` Q ${formatCoordinate(points[i][0])} ${formatCoordinate(points[i][1])}` +
      ` ${formatCoordinate(mid[0])} ${formatCoordinate(mid[1])}`;
  }
  return `${d} Z`;
}
