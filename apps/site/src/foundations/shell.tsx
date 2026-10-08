/**
 * The Foundations family shell.
 *
 * One shape for all seven pages plus the hub, so the family reads as a family:
 * a header, the generated content, and prev/next that NAME the page they go to
 * (the m4 standard — a bare "Previous"/"Next" is a link that refuses to say
 * where it leads).
 *
 * All numbers come from ./data, which reads the token package. Nothing here
 * is a literal that can drift from what kern ships.
 */

import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CopyMarkdownButton } from "../components/chrome/copy-markdown-button";
import { T_BODY_SM, T_LEAD, T_PAGE, T_SECTION } from "../domains/shared/systems/type-scale";

export type FoundationPage = {
  /** route segment, e.g. "color" */
  slug: string;
  /** Display name, sentence case. */
  title: string;
  /** One line under the title. */
  oneLiner: string;
  /**
   * The kern deviations this page carries, by registered id. The registry is
   * the K-series allow-list (K1–K10) that review-m3 gates against — a
   * deviation not on that list is a fail, so a chip here must name a real id.
   */
  deviations?: { id: string; note: string }[];
};

/** The family, in reading order. Prev/next walk this list. */
export const FOUNDATIONS: FoundationPage[] = [
  {
    slug: "tokens",
    title: "Tokens",
    oneLiner: "The named values everything else is built from.",
    deviations: [
      {
        id: "K6",
        note: "the tones engine — kern's own ramps and overlays behind the roles",
      },
    ],
  },
  {
    slug: "color",
    title: "Color",
    oneLiner:
      "Roles are decisions, not colours — and kern ships more of them than Material 3 does.",
    deviations: [
      { id: "K2", note: "twelve status roles M3 has no vocabulary for" },
      { id: "K3", note: "the surfaceTonal role" },
      {
        id: "K9",
        note: "fixed accent roles and shadow — contrast-gated, not waived",
      },
    ],
  },
  {
    slug: "type",
    title: "Type",
    oneLiner: "Thirty styles, each rendered by its own tokens.",
    deviations: [{ id: "K1", note: "Inter instead of Roboto" }],
  },
  {
    slug: "elevation",
    title: "Elevation",
    oneLiner: "Six levels, and which components rest at which.",
    deviations: [
      {
        id: "K4",
        note: "the per-level shadow — kern's platform rendering of the spec's dp axis",
      },
    ],
  },
  {
    slug: "shape",
    title: "Shape",
    oneLiner: "The corner scale, including Material 3's Expressive additions.",
    deviations: [
      {
        id: "K5",
        note: "pill-heavy defaults — kern's corner identity, distinct from the spec",
      },
    ],
  },
  {
    slug: "motion",
    title: "Motion",
    oneLiner: "Spring first, easing as the fallback.",
    deviations: [
      {
        id: "K7",
        note: "the complete motion grid — springs, easings, durations, both schemes",
      },
    ],
  },
  {
    slug: "states",
    title: "States",
    oneLiner:
      "What happens to a surface when it is hovered, pressed, dragged or disabled.",
  },
];

export function neighbours(slug: string): {
  prev?: FoundationPage;
  next?: FoundationPage;
} {
  const i = FOUNDATIONS.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? FOUNDATIONS[i - 1] : undefined,
    next: i >= 0 && i < FOUNDATIONS.length - 1 ? FOUNDATIONS[i + 1] : undefined,
  };
}

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const CARD =
  "rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low)";
const H2 = `m-0 ${T_SECTION} ${INK}`;
const H3 = `m-0 ${T_LEAD} ${INK}`;
const PROSE = `m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`;

/** A section on a foundation page — heading gets a stable id and a permalink. */
export function FSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 id={id} className={H2}>
        {title}
        <a
          href={`#${id}`}
          aria-label={`Permalink to ${id.replace(/-/g, " ")}`}
          className="ml-2 inline-flex items-center text-(--md-sys-color-on-surface-variant) no-underline opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          #
        </a>
      </h2>
      {children}
    </section>
  );
}

export function FProse({ children }: { children: ReactNode }) {
  return <p className={PROSE}>{children}</p>;
}

export function FH3({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3 id={id} className={H3}>
      {children}
    </h3>
  );
}

/**
 * The kern-deviation chips a foundation page carries. Every id is on the
 * K1–K10 allow-list in the deviations registry — the list review-m3 gates
 * against, where a deviation not on the list is a fail. A page with no chips
 * says so, because "silent" and "conformant" must not look the same.
 */
export function FDeviations({
  items,
}: {
  items: { id: string; note: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {items.map((d) => (
          <span
            key={d.id}
            className={`inline-flex items-center gap-1 rounded-(--md-sys-shape-corner-full) border border-(--md-sys-color-outline) px-2 py-0.5 ${T_BODY_SM} ${INK}`}
          >
            <strong className={INK}>{d.id}</strong>
            <span className={INK_SOFT}>{d.note}</span>
          </span>
        ))}
        {items.length === 0 ? (
          <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
            No kern deviations — this page is Material 3 exactly.
          </span>
        ) : null}
      </div>
      {items.length > 0 ? (
        <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
          Deviations are kern decisions, each on the K1–K10 registry allow-list
          — a deviation not on that list is a gate failure, not a footnote.
        </p>
      ) : null}
    </div>
  );
}

export const F_CARD = CARD;
export const F_INK = INK;
export const F_INK_SOFT = INK_SOFT;
export const F_H2 = H2;
export const F_H3 = H3;
export const F_PROSE = PROSE;

/**
 * The family page: title, one-liner, content, prev/next.
 *
 * The prev/next links carry the target page's TITLE alongside its href, so
 * the link says where it goes. This is the m4 rule and it is applied from the
 * start rather than retrofitted.
 */
export function FoundationLayout({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const page = FOUNDATIONS.find((p) => p.slug === slug);
  const { prev, next } = neighbours(slug);
  if (!page) return null;

  return (
    <article className="flex flex-col gap-10" data-copy-md-root>
      <header className="flex flex-col gap-3">
        <nav
          className={`flex flex-wrap items-center gap-2 ${T_BODY_SM} ${INK_SOFT}`}
          aria-label="Breadcrumb"
        >
          <Link to="/foundations">Foundations</Link>
          <span aria-hidden="true">/</span>
          <span className={INK}>{page.title}</span>
        </nav>
        <h1 className={`m-0 ${T_PAGE} ${INK}`}>{page.title}</h1>
        <p className={`m-0 max-w-[62ch] ${T_LEAD} ${INK_SOFT}`}>
          {page.oneLiner}
        </p>
        <FDeviations items={page.deviations ?? []} />
        <div>
          <CopyMarkdownButton />
        </div>
      </header>

      {children}

      <nav
        className="flex items-stretch justify-between gap-4 border-t border-(--md-sys-color-outline-variant) pt-6"
        aria-label="Foundations"
      >
        {prev ? (
          <Link
            className={`${CARD} flex-1 p-4 ${T_BODY_SM} ${INK} no-underline`}
            to="/foundations/$page"
            params={{ page: prev.slug }}
          >
            ← {prev.title}
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            className={`${CARD} flex-1 p-4 text-right ${T_BODY_SM} ${INK} no-underline`}
            to="/foundations/$page"
            params={{ page: next.slug }}
          >
            {next.title} →
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>
    </article>
  );
}
