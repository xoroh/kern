import type { ComponentPropsWithRef, ReactNode } from "react";
import { useState } from "react";
import { cn } from "../utils/cn";

export type PaginationProps = Omit<
  ComponentPropsWithRef<"nav">,
  "children" | "onChange"
> & {
  /** Total page count (>= 1). */
  count: number;
  /** Controlled current page (1-based). */
  page?: number;
  /** Uncontrolled initial page. */
  defaultPage?: number;
  /** Called with the new 1-based page. */
  onPageChange?: (page: number) => void;
  /** Extra content rendered after the page buttons. */
  children?: ReactNode;
};

const buttonClass =
  "kern-pagination-button flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-(--md-sys-shape-corner-full) px-2 text-sm text-(--md-sys-color-on-surface) outline-none select-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:pointer-events-none disabled:opacity-50 data-current:bg-(--md-sys-color-primary) data-current:text-(--md-sys-color-on-primary)";

function pageWindow(
  current: number,
  count: number,
): ({ kind: "page"; page: number } | { kind: "gap"; key: string })[] {
  if (count <= 7)
    return Array.from({ length: count }, (_, index) => ({
      kind: "page" as const,
      page: index + 1,
    }));
  const pages = new Set([
    1,
    2,
    current - 1,
    current,
    current + 1,
    count - 1,
    count,
  ]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= count)
    .sort((a, b) => a - b);
  const out: ({ kind: "page"; page: number } | { kind: "gap"; key: string })[] =
    [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push({ kind: "gap", key: `gap-${prev}-${p}` });
    out.push({ kind: "page", page: p });
    prev = p;
  }
  return out;
}

/** Page navigation with a sliding window, ellipsis gaps, and prev/next. */
export function Pagination({
  count,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  children,
  className,
  "aria-label": ariaLabel = "Pagination",
  ...props
}: PaginationProps) {
  const [internal, setInternal] = useState(defaultPage);
  const page = Math.min(Math.max(pageProp ?? internal, 1), Math.max(count, 1));
  function go(next: number) {
    const clamped = Math.min(Math.max(next, 1), Math.max(count, 1));
    if (pageProp === undefined) setInternal(clamped);
    onPageChange?.(clamped);
  }
  return (
    <nav
      data-slot="pagination"
      aria-label={ariaLabel}
      className={cn("kern-pagination flex items-center gap-1", className)}
      {...props}
    >
      <button
        data-slot="pagination-prev"
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
        className={buttonClass}
      >
        ‹
      </button>
      {pageWindow(page, count).map((entry) =>
        entry.kind === "gap" ? (
          <span
            key={entry.key}
            aria-hidden="true"
            className="px-1 text-sm text-(--md-sys-color-on-surface-variant)"
          >
            …
          </span>
        ) : (
          <button
            key={entry.page}
            data-slot="pagination-page"
            type="button"
            aria-label={`Page ${entry.page}`}
            aria-current={entry.page === page ? "page" : undefined}
            data-current={entry.page === page ? "" : undefined}
            onClick={() => go(entry.page)}
            className={buttonClass}
          >
            {entry.page}
          </button>
        ),
      )}
      <button
        data-slot="pagination-next"
        type="button"
        aria-label="Next page"
        disabled={page >= count}
        onClick={() => go(page + 1)}
        className={buttonClass}
      >
        ›
      </button>
      {children}
    </nav>
  );
}
