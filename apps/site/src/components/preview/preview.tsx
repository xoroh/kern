import { cn } from "@xoroh/kern";
import type { ReactNode } from "react";

/** A labelled stage that a live component demo is rendered into. */
export function Preview({
  label,
  children,
  span = 1,
}: {
  label: string;
  children: ReactNode;
  /** Grid columns to occupy at the md breakpoint. */
  span?: 1 | 2 | 3;
}) {
  // Tailwind only emits classes it sees as literals, so the span map is
  // written out rather than interpolated.
  const SPAN = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
  } as const;
  return (
    <figure
      className={cn(
        "flex min-w-0 flex-col gap-2 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) p-4",
        SPAN[span],
      )}
    >
      <div className="flex min-h-24 flex-1 items-center justify-center py-2">
        {children}
      </div>
      <figcaption className="text-center font-mono text-xs text-(--md-sys-color-on-surface-variant)">
        {label}
      </figcaption>
    </figure>
  );
}

/** Vertical rhythm wrapper for a family of previews. */
export function PreviewGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{children}</div>
  );
}

/** A row of previews that need full width (sliders, tables, text blocks). */
export function PreviewStack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

/** Horizontal cluster used inside a single Preview for variant rows. */
export function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-3">
      {children}
    </div>
  );
}
