import { MOTION_ALGORITHMS, type MotionAlgorithmId } from "./presets";
import { tokens } from "./tokens";

export type { MotionAlgorithmId };

/** One spatial/effects spring pair, as consumed by `Animated.spring`. */
export type SpringConfig = { stiffness: number; damping: number };

export type SpringKind =
  | "spatial-fast"
  | "spatial-default"
  | "spatial-slow"
  | "effects-fast"
  | "effects-default"
  | "effects-slow";

const SPRING_KINDS: readonly SpringKind[] = [
  "spatial-fast",
  "spatial-default",
  "spatial-slow",
  "effects-fast",
  "effects-default",
  "effects-slow",
];

/**
 * Canonical M3 Expressive button interaction spring tokens (D1024 C4).
 * Lives once in `@xoroh/kern-tokens` so neither `@xoroh/kern` nor
 * `@xoroh/kern-native` ever hardcodes stiffness/damping or transition vars.
 */
export const BUTTON_SPRING_TOKENS = {
  /** Fast spatial spring for press-in scale and corner-radius morph. */
  pressIn: "spatial-fast",
  /** Default spatial spring for release rebound back to resting silhouette. */
  pressOut: "spatial-default",
  /** Default effects spring for radial state-layer bloom and opacity decay. */
  bloom: "effects-default",
  /** Fast effects spring for colour/state-layer swaps on hover/toggle. */
  state: "effects-fast",
} as const satisfies Record<string, SpringKind>;

export type ButtonSpringStage = keyof typeof BUTTON_SPRING_TOKENS;

/**
 * Canonical CSS custom-property references for M3 Expressive button motion.
 * Consumed by the shared Web button style module (`button-shared.ts`) and
 * `PulseButton`.
 */
export const BUTTON_MOTION_CSS = {
  pressInEasing: "var(--sys-motion-spring-spatial-fast)",
  pressOutEasing: "var(--sys-motion-spring-spatial-default)",
  bloomEasing: "var(--sys-motion-spring-effects-default)",
  stateEasing: "var(--sys-motion-spring-effects-fast)",
  pressDuration: "var(--sys-motion-duration-short3)",
  releaseDuration: "var(--sys-motion-duration-medium2)",
  bloomDuration: "var(--sys-motion-duration-medium1)",
} as const;

export type ResolvedMotionScheme = {
  /** Algorithm id (`standard` | `expressive` | `reduced`). */
  id: MotionAlgorithmId;
  /** Scheme key into `tokens.motion.schemes` the algorithm selects. */
  scheme: string;
  easing: string;
  easingAccelerate: string;
  easingDecelerate: string;
  durations: Record<string, string>;
  springs: Record<SpringKind, SpringConfig>;
  /** True under `reduced`: opacity-only transitions, no spatial springs. */
  suppressSpatial: boolean;
};

/**
 * Resolve a motion algorithm to its scheme values. Fail loud on unknown ids
 * — a renamed scheme breaks here, not in a transition six months later.
 */
export function resolveMotionScheme(
  id: MotionAlgorithmId = "standard",
): ResolvedMotionScheme {
  const algorithm = MOTION_ALGORITHMS[id];
  if (!algorithm) {
    throw new Error(
      `Unknown motion algorithm: ${id}. Available: ${Object.keys(MOTION_ALGORITHMS).join(", ")}.`,
    );
  }
  const schemes = tokens.motion.schemes as Record<
    string,
    Record<string, string>
  >;
  const scheme = schemes[algorithm.motionScheme];
  if (!scheme) {
    throw new Error(
      `Motion algorithm ${id} selects unknown scheme "${algorithm.motionScheme}".`,
    );
  }
  const easing = tokens.motion.easing as Record<string, string>;
  const springs = tokens.motion.spring as Record<string, SpringConfig>;
  const durations = tokens.motion.duration as Record<string, string>;
  return {
    id,
    scheme: algorithm.motionScheme,
    easing: easing[scheme.easing],
    easingAccelerate: easing[scheme["easing-accelerate"]],
    easingDecelerate: easing[scheme["easing-decelerate"]],
    durations: { ...durations },
    springs: Object.fromEntries(
      SPRING_KINDS.map((kind) => [kind, { ...springs[kind] }]),
    ) as Record<SpringKind, SpringConfig>,
    suppressSpatial: algorithm.suppressSpatial,
  };
}

/** One spring pair for `Animated.spring` (native) or WAAPI stiffness/damping. */
export function springConfig(kind: SpringKind): SpringConfig {
  const springs = tokens.motion.spring as Record<string, SpringConfig>;
  const found = springs[kind];
  if (!found) {
    throw new Error(
      `Unknown spring: ${kind}. Available: ${SPRING_KINDS.join(", ")}.`,
    );
  }
  return { ...found };
}

/**
 * Resolve a button interaction stage (`pressIn` | `pressOut` | `bloom` | `state`)
 * directly to its canonical M3 Expressive `{ stiffness, damping }` spring pair.
 */
export function buttonSpringConfig(stage: ButtonSpringStage): SpringConfig {
  return springConfig(BUTTON_SPRING_TOKENS[stage]);
}

/**
 * Inline CSS-var overrides selecting the expressive scheme on one element.
 * The schemes differ only in easing (`tokens.json` motion.schemes), so the
 * standard scheme needs no overrides — the stylesheet default already is
 * standard, and this returns an empty record for it. Consumed by
 * `applyKernTheme(..., motion)`; components migrate to scheme vars
 * incrementally, so selecting expressive today changes the easing anchor
 * without rewriting every hardcoded `duration-200` in the same change.
 */
export function motionCssVars(id: MotionAlgorithmId): Record<string, string> {
  const resolved = resolveMotionScheme(id);
  if (resolved.scheme === "standard" && !resolved.suppressSpatial) return {};
  const vars: Record<string, string> = {
    "--sys-motion-easing-standard": resolved.easing,
    "--sys-motion-easing-standard-accelerate": resolved.easingAccelerate,
    "--sys-motion-easing-standard-decelerate": resolved.easingDecelerate,
  };
  if (resolved.suppressSpatial) {
    vars["--sys-motion-suppress-spatial"] = "1";
  }
  return vars;
}

/** `prefers-reduced-motion` on web; false on server/native (no media query). */
export function prefersReducedMotion(): boolean {
  const scope = globalThis as unknown as {
    window?: { matchMedia?: (query: string) => { matches: boolean } };
  };
  if (typeof scope.window?.matchMedia !== "function") return false;
  return scope.window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
