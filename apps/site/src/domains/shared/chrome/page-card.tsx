/**
 * PageBody — the canonical page-content wrapper (formerly PageCard).
 *
 * v3 — THE OUTLINED CARD IS GONE. v2 wrapped every page in a bordered,
 * padded card floating on the canvas: a border around content that is
 * already bounded by the page is a second, redundant expression of
 * containment — clutter, not structure. Kern's line design separates by
 * RHYTHM: generous vertical air, hairlines between sections, tonal bands
 * where a section needs weight. So the wrapper is now a pure layout
 * container — width preset, rhythm, nothing else. Content sits straight
 * on the `surface` canvas.
 *
 * The component keeps its name so 30+ routes don't churn: `PageCard` is
 * the page body now, not a card. Width and gap remain the only knobs.
 */

import { cn } from "@xoroh/kern";
import type { ReactNode } from "react";

/** Page width presets. `default` is the reading width; `wide` for galleries. */
export type PageCardWidth = "narrow" | "default" | "wide";

const WIDTH_CLASS: Record<PageCardWidth, string> = {
  narrow: "max-w-[44rem]",
  default: "max-w-[76rem]",
  wide: "max-w-[88rem]",
};

const GAP_CLASS: Record<8 | 10 | 12, string> = {
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
};

export function PageCard({
  width = "default",
  gap = 10,
  copyMd,
  className,
  children,
}: {
  /** Content width preset — `default` unless the page needs more/less. */
  width?: PageCardWidth;
  /** Vertical rhythm between top-level children: 8, 10 (default), or 12. */
  gap?: 8 | 10 | 12;
  /** Marks this container as the root for the copy-markdown feature. */
  copyMd?: boolean;
  /** Extra classes on the inner container (rarely needed). */
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className="site-page w-full px-6 py-8 sm:px-10 sm:py-12 lg:px-12">
      <div
        data-copy-md-root={copyMd ? "" : undefined}
        className={cn(
          "mx-auto flex w-full flex-col",
          WIDTH_CLASS[width],
          GAP_CLASS[gap],
          className,
        )}
      >
        {children}
      </div>
    </section>
  );
}
