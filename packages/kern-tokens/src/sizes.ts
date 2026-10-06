/**
 * R2 size foundation, re-homed (T1): the shared three-step scale every
 * component size maps onto. Ported from the platform fork's R2 series —
 * the fork consumes this, nothing is rebuilt there.
 *
 * Component props keep their own names (M3 TopAppBar `small|medium|large`
 * stays as-is); each component exports its alias map onto this type, so a
 * new size that is not mapped here breaks typecheck at the map, not in a
 * rendered page.
 */
export const KERN_SIZES = ["sm", "md", "lg"] as const;

/** The shared three-step size scale. See `KERN_SIZES`. */
export type KernSize = (typeof KERN_SIZES)[number];
