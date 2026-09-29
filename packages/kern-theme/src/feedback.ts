/**
 * Kern Feedback — shared spec (framework-agnostic).
 *
 * M3 names rule here: Material Design 3 specifies **loading indicators**
 * (short indeterminate waits) and **progress indicators** (linear / circular
 * × determinate / indeterminate). Every platform projection (web `kern`,
 * native `kern-native`) implements these roles from this one spec; brand
 * expression (the shape trio and its styles) is a *style* of the loading
 * indicator, never a new concept.
 *
 * Pure TypeScript — no React, no DOM, no React Native — so web and native
 * resolve one identical variant set.
 */

// ─── M3 roles ─────────────────────────────────────────────────────

/** M3 progress-indicator families. */
export const PROGRESS_INDICATOR_KINDS = ["linear", "circular"] as const;

export type ProgressIndicatorKind = (typeof PROGRESS_INDICATOR_KINDS)[number];

/**
 * M3 behavior law, encoded: waits under this threshold stay indeterminate
 * (loading indicator); once progress is known — or the wait exceeds it —
 * switch to a determinate progress indicator and keep it accurate.
 */
export const SHORT_WAIT_MS = 5000;

// ─── Loading-indicator styles (brand expression) ──────────────────
// One engine, many styles. Four ship today; the rest are reserved in the
// spec until their renderers land.

export const LOADING_INDICATOR_STYLES = [
  "spinner",
  "dots",
  "bar",
  "shapes",
  "conveyor",
  "contained",
  "orbit",
  "morph",
  "assembly",
] as const;

export type LoadingIndicatorStyle = (typeof LOADING_INDICATOR_STYLES)[number];

/** Styles both renderers ship today. */
export const RENDERED_LOADING_STYLES = [
  "spinner",
  "dots",
  "bar",
  "shapes",
] as const;

export type RenderedLoadingStyle = (typeof RENDERED_LOADING_STYLES)[number];

/** Styles defined in the spec but not rendered yet (reserved). */
export const UNRENDERED_LOADING_STYLES: readonly LoadingIndicatorStyle[] =
  LOADING_INDICATOR_STYLES.filter(
    (style) =>
      !(RENDERED_LOADING_STYLES as readonly LoadingIndicatorStyle[]).includes(
        style,
      ),
  );

export function isLoadingStyleRendered(
  style: LoadingIndicatorStyle,
): style is RenderedLoadingStyle {
  return (RENDERED_LOADING_STYLES as readonly LoadingIndicatorStyle[]).includes(
    style,
  );
}

/** The platform default brand style (the heritage trio). */
export const DEFAULT_LOADING_STYLE: LoadingIndicatorStyle = "shapes";

// ─── Basic shapes (Kern radius language) ──────────────────────────

export const FEEDBACK_SHAPES = [
  "triangle",
  "circle",
  "square",
  "pill",
  "diamond",
  "arch",
] as const;

export type FeedbackShapeKind = (typeof FEEDBACK_SHAPES)[number];

/** Brand trio — the platform signature. Order is stable (never shuffle). */
export const BRAND_TRIO: ReadonlyArray<FeedbackShapeKind> = [
  "triangle",
  "circle",
  "square",
];

// ─── Sizes ────────────────────────────────────────────────────────

export const FEEDBACK_SIZES = ["sm", "md", "lg"] as const;

export type FeedbackSize = (typeof FEEDBACK_SIZES)[number];

/**
 * dp metrics per size: shape box, gap between shapes, and the M3
 * contained box (circular ring footprint).
 */
export const FEEDBACK_SIZE_DP = {
  sm: { shape: 16, gap: 8, container: 32 },
  md: { shape: 24, gap: 12, container: 38 },
  lg: { shape: 30, gap: 14, container: 48 },
} as const;

export type FeedbackSizeMetrics = (typeof FEEDBACK_SIZE_DP)[FeedbackSize];

// ─── Motion (M3 standard easing; opacity + translate only) ────────
// The loop is the indeterminate-loading exception to Kern's 200ms
// utility cap — state transitions elsewhere stay ≤200ms.

export const feedbackTiming = {
  /** Indeterminate loop duration. */
  cycleMs: 1200,
  /** Stagger between shapes in the trio. */
  staggerMs: 150,
  /** Hop lift for the shapes / conveyor / assembly styles. */
  hopDp: 12,
  /** Boot overlay fade-out. */
  fadeMs: 250,
  /** Minimum boot display so the handoff never flashes. */
  minDisplayMs: 1400,
  /** Standard easing control points — cubic-bezier(0.2, 0, 0, 1). */
  easing: [0.2, 0, 0, 1] as const,
} as const;

// ─── Tenant registry (enterprise extension point) ─────────────────
// Tenants (passenger, provider, whitelabel…) resolve here. A tenant
// registers `{ shapes, style, tone }` under its id; boot/loading
// indicators read `tenantId` and fall back to the platform default.

export type FeedbackTone = "inverse" | "surface";

export interface FeedbackTenantConfig {
  shapes?: ReadonlyArray<FeedbackShapeKind>;
  style?: LoadingIndicatorStyle;
  /** 'inverse' = boot black/white, 'surface' = theme surface. */
  tone?: FeedbackTone;
}

export type FeedbackVariant = {
  shapes: ReadonlyArray<FeedbackShapeKind>;
  style: LoadingIndicatorStyle;
  tone: FeedbackTone;
};

export const DEFAULT_FEEDBACK_VARIANT: FeedbackVariant = Object.freeze({
  shapes: BRAND_TRIO,
  style: DEFAULT_LOADING_STYLE,
  tone: "surface",
});

const tenantRegistry = new Map<string, FeedbackVariant>();

function assertLoaderStyle(style: LoadingIndicatorStyle): void {
  if (!(LOADING_INDICATOR_STYLES as readonly string[]).includes(style)) {
    throw new Error(`Unknown loading style: ${style}`);
  }
}

function assertShapes(shapes: ReadonlyArray<FeedbackShapeKind>): void {
  if (shapes.length === 0) {
    throw new Error("Feedback variant shapes must not be empty");
  }
  for (const shape of shapes) {
    if (!(FEEDBACK_SHAPES as readonly string[]).includes(shape)) {
      throw new Error(`Unknown feedback shape: ${shape}`);
    }
  }
}

/**
 * Register (or replace) a tenant's feedback variant. Invalid configs
 * throw — registration is a configuration boundary and fails loud.
 */
export function registerFeedbackVariant(
  tenantId: string,
  config: FeedbackTenantConfig,
): void {
  if (typeof tenantId !== "string" || tenantId.length === 0) {
    throw new Error(
      "registerFeedbackVariant: tenantId must be a non-empty string",
    );
  }
  if (config.style !== undefined) assertLoaderStyle(config.style);
  if (config.shapes !== undefined) assertShapes(config.shapes);
  if (
    config.tone !== undefined &&
    config.tone !== "inverse" &&
    config.tone !== "surface"
  ) {
    throw new Error(`Unknown feedback tone: ${String(config.tone)}`);
  }
  tenantRegistry.set(
    tenantId,
    Object.freeze({
      shapes: config.shapes
        ? Object.freeze([...config.shapes])
        : DEFAULT_FEEDBACK_VARIANT.shapes,
      style: config.style ?? DEFAULT_LOADING_STYLE,
      tone: config.tone ?? DEFAULT_FEEDBACK_VARIANT.tone,
    }),
  );
}

/**
 * Resolve the complete variant for a tenant. With no tenant id the
 * platform default is returned; an unknown tenant id throws (fail-loud —
 * boot must never silently render the wrong brand).
 */
export function resolveFeedbackVariant(tenantId?: string): FeedbackVariant {
  if (tenantId === undefined || tenantId === "") {
    return DEFAULT_FEEDBACK_VARIANT;
  }
  const variant = tenantRegistry.get(tenantId);
  if (!variant) {
    throw new Error(`Unknown feedback variant: ${tenantId}`);
  }
  return variant;
}
