/** Foundation motion — easing curves, the duration ladder, spring physics. */
import { group, type Json, type Leaf, subgroups } from "./tokens";

export const MOTION: Leaf[] = group("motion");

/** The M3 easing curves kern ships (`motion.easing.*`). */
export const MOTION_EASING: Leaf[] = group("motion").filter((l) =>
  l.key.startsWith("easing."),
);

/** The duration ladder (`motion.duration.*`), short1 → extra-long4. */
export const MOTION_DURATION: Leaf[] = group("motion").filter((l) =>
  l.key.startsWith("duration."),
);

/** One spring's physics parameters, exactly as the token package declares. */
export type Spring = {
  name: string;
  stiffness: number;
  damping: number;
};

export const MOTION_SPRING: Spring[] = subgroups("motion")
  .filter(({ key }) => key === "spring")
  .flatMap(({ node }) =>
    Object.entries(node).map(([name, params]) => {
      const p = (params ?? {}) as Json;
      return {
        name,
        stiffness: Number(p.stiffness ?? 0),
        damping: Number(p.damping ?? 0),
      };
    }),
  );
