/**
 * P5C algorithm presets — dark, compact, and motion as override data.
 *
 * Dark and compact resolve through the existing theme path (`extends kern`,
 * never a second role table): dark is the mode axis of the kern base tables,
 * compact is `themes/compact.json` (shape-only overrides, color untouched).
 * Both appear as preset dimensions in the flattened matrix (`pipeline.ts`),
 * so "what does this preset change?" is a readable diff, not a code walk.
 *
 * Motion has no color/shape override to carry — the motion schemes already
 * live in `tokens.json` (`standard`, `expressive`). The motion algorithms
 * below are data selecting among those existing schemes, validated fail-loud
 * against the token source the same way `defineThemePreset` validates theme
 * overrides. No new motion token is introduced in P5C.
 */
import { tokens } from "./tokens";

/** One motion algorithm: which existing scheme it selects, plus the rule data. */
export type MotionAlgorithm = {
  id: string;
  description: string;
  /**
   * Key into `tokens.motion.schemes`. Must exist — `defineMotionAlgorithm`
   * throws otherwise, so a renamed scheme fails here instead of resolving
   * to nothing at runtime.
   */
  motionScheme: string;
  /**
   * When true, spatial springs are suppressed (opacity-only transitions).
   * A data rule for `prefers-reduced-motion` handling, not a token.
   */
  suppressSpatial: boolean;
};

/** The motion algorithms, as data. Dark/compact live on the theme path; see above. */
export const MOTION_ALGORITHMS = {
  standard: {
    id: "standard",
    description: "Default motion: the standard M3 scheme for state changes.",
    motionScheme: "standard",
    suppressSpatial: false,
  },
  expressive: {
    id: "expressive",
    description: "Opt-in expressive motion: the expressive M3 scheme.",
    motionScheme: "expressive",
    suppressSpatial: false,
  },
  reduced: {
    id: "reduced",
    description:
      "Reduced motion: standard easing with spatial springs suppressed. Selected under prefers-reduced-motion.",
    motionScheme: "standard",
    suppressSpatial: true,
  },
} as const satisfies Record<string, MotionAlgorithm>;

export type MotionAlgorithmId = keyof typeof MOTION_ALGORITHMS;

/** Validate a motion algorithm before anything consumes it. Fail loud, never unmapped. */
export function defineMotionAlgorithm(
  algorithm: MotionAlgorithm,
): MotionAlgorithm {
  if (!/^[a-z][a-z0-9-]{1,31}$/.test(algorithm.id)) {
    throw new Error(`Invalid motion algorithm id: ${algorithm.id}`);
  }
  const schemes = tokens.motion.schemes as Record<string, unknown>;
  if (
    typeof algorithm.motionScheme !== "string" ||
    schemes[algorithm.motionScheme] === undefined
  ) {
    throw new Error(
      `Motion algorithm ${algorithm.id} selects unknown scheme "${algorithm.motionScheme}". ` +
        `Available: ${Object.keys(schemes).join(", ")}.`,
    );
  }
  return algorithm;
}

// Built-ins are validated at module load: a renamed scheme breaks the import,
// not a transition six months later.
for (const algorithm of Object.values(MOTION_ALGORITHMS)) {
  defineMotionAlgorithm(algorithm);
}
