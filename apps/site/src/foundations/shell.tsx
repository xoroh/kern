/**
 * The Material 3 Foundations family shell.
 *
 * One shape for all seven M3 pages plus the M3 hub, so the family reads as a
 * family: a header, the generated content, and prev/next that NAME the page
 * they go to (the m4 standard — a bare "Previous"/"Next" is a link that
 * refuses to say where it leads).
 *
 * All numbers come from ./data, which reads the token package. Nothing here
 * is a literal that can drift from what kern ships.
 */

import { Link } from "@tanstack/react-router";
import { cn, SegmentedButton } from "@xoroh/kern";
import { resolveThemeDetails, varName } from "@xoroh/kern-tokens";
import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import { CopyMarkdownButton } from "../components/chrome/copy-markdown-button";
import {
  T_BODY_SM,
  T_LABEL_MD,
  T_LEAD,
  T_PAGE,
  T_SECTION,
} from "../domains/shared/systems/type-scale";
import { CARD, INK, INK_SOFT, TRANSITION } from "../domains/shared/systems/ui";

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
    title: "Typography",
    oneLiner: "Thirty styles, each rendered by its own tokens.",
    deviations: [{ id: "K1", note: "Inter instead of Roboto" }],
  },
  // M3's own reading order: color → type → shape → elevation → motion →
  // state. Shape sits BEFORE elevation because elevation is judged against
  // the corners it shadows — the spec's order, not an alphabetical one.
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

/**
 * Ink and card come from the site kit (ui.ts) — the family shell composes the
 * same CARD every other page composes rather than carrying a second card
 * treatment. F_INK / F_CARD below re-export them under the family's names so
 * routes read consistently.
 */
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
          className={`ml-2 inline-flex items-center text-(--sys-color-on-surface-variant) no-underline opacity-0 ${TRANSITION} group-hover:opacity-100 focus-visible:opacity-100`}
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
            className={`inline-flex items-center gap-1.5 rounded-(--sys-shape-corner-full) bg-(--sys-color-surface-container-high) px-3 py-1 ${T_BODY_SM} ${INK}`}
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

/* ------------------------------------------------ specimen controls ------ */

/**
 * A role as a live CSS reference: `var(--sys-color-primary)`. Swatches
 * paint this rather than a hex so they follow whatever `SchemeScope` they sit
 * in — the value is resolved by the scope, never baked into the markup.
 */
export function roleVar(role: string): string {
  return `var(${varName(role)})`;
}

type SchemeRegion = {
  mode: "light" | "dark";
  contrast: "standard" | "medium" | "high";
  /** The resolved role table for this region — for printing values beside a swatch. */
  colors: Record<string, string>;
};

const SchemeContext = createContext<SchemeRegion | null>(null);

/**
 * The resolved scheme of the region this component renders in. Throws when
 * used outside a `SchemeScope`: a swatch that silently fell back to the
 * ambient scheme would be the exact defect this replaced.
 */
export function useScheme(): SchemeRegion {
  const region = useContext(SchemeContext);
  if (!region) {
    throw new Error("useScheme must be rendered inside a SchemeScope");
  }
  return region;
}

/**
 * SchemeScope — paint a region in a resolved scheme (and contrast level).
 *
 * The Color and Theme pages used to paint `role.light` everywhere while the
 * copy claimed both schemes. The fix is live rather than cosmetic: the scope
 * resolves mode + contrast through `resolveThemeDetails` and writes the role
 * table onto the region as CSS custom properties, so every `--sys-color-*`
 * inside — card fills, hairlines, inks, status chips — repaints. Nothing
 * inside needs to know which scheme it is showing; the kit classes it already
 * carries do the work.
 *
 * The default (light / standard) equals the stylesheet, so the server render
 * and the first paint agree — the switcher only repaints when a reader moves
 * it. Scheme chrome OUTSIDE the scope (headings, prose, controls) stays on the
 * site's own theme: the specimens change, the page does not.
 */
export function SchemeScope({
  mode,
  contrast = "standard",
  className,
  children,
}: {
  mode: "light" | "dark";
  contrast?: "standard" | "medium" | "high";
  className?: string;
  children: ReactNode;
}) {
  const region = useMemo<SchemeRegion>(() => {
    const colors = resolveThemeDetails(mode, contrast).color as Record<
      string,
      string
    >;
    return { mode, contrast, colors };
  }, [mode, contrast]);

  // React writes `--custom` keys from a style object directly; the cast is
  // the documented way past CSSProperties' lack of an index signature.
  const vars = useMemo(() => {
    const out: Record<string, string> = {};
    for (const [role, value] of Object.entries(region.colors)) {
      out[varName(role)] = value;
    }
    return out as CSSProperties;
  }, [region]);

  return (
    <SchemeContext.Provider value={region}>
      {/* The tray paints the scheme's OWN surface: without it the region would
          take the scheme's ink on the page's background, which is exactly the
          illegible pairing a light-on-dark swatch used to fall into. Tonal
          fill, no stroke — the CARD_FILLED expression, on the plain band. */}
      <div
        style={vars}
        className={cn(
          "rounded-(--sys-shape-corner-medium) bg-(--sys-color-surface) p-3",
          className,
        )}
      >
        {children}
      </div>
    </SchemeContext.Provider>
  );
}

/**
 * The scheme/contrast switcher — M3's segmented button at the site's 48dp
 * target floor, used as a specimen control (it repaints the swatches in the
 * nearest `SchemeScope`, never the site's own theme).
 */
export function FSegmented<V extends string>({
  label,
  value,
  options,
  onChange,
}: {
  /** Accessible name for the control group. */
  label: string;
  value: V;
  options: readonly { value: V; label: string }[];
  onChange: (next: V) => void;
}) {
  return (
    <SegmentedButton.Root
      value={[value]}
      onValueChange={(next) => {
        const picked = next[0];
        if (picked !== undefined) onChange(picked);
      }}
      aria-label={label}
    >
      {options.map((option) => (
        <SegmentedButton.Item
          key={option.value}
          value={option.value}
          className="h-12 px-4"
        >
          {option.label}
        </SegmentedButton.Item>
      ))}
    </SegmentedButton.Root>
  );
}

/** Label + control row for a specimen switcher. */
export function FControlRow({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className={`${T_LABEL_MD} ${INK_SOFT}`}>{label}</span>
      {children}
      {note ? (
        <span className={`max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>{note}</span>
      ) : null}
    </div>
  );
}

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
      <header className={`${CARD} flex flex-col gap-4 p-6 sm:p-8`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <nav
            className={`flex flex-wrap items-center gap-2 ${T_BODY_SM} ${INK_SOFT}`}
            aria-label="Breadcrumb"
          >
            <Link
              to="/foundations"
              className="text-(--sys-color-on-surface-variant) no-underline hover:underline"
            >
              Design systems
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              to="/foundations/m3"
              className="text-(--sys-color-on-surface-variant) no-underline hover:underline"
            >
              Material 3
            </Link>
            <span aria-hidden="true">/</span>
            <span className={INK}>{page.title}</span>
          </nav>
          <CopyMarkdownButton />
        </div>
        <h1 className={`m-0 ${T_PAGE} ${INK}`}>{page.title}</h1>
        <p className={`m-0 max-w-[65ch] ${T_LEAD} ${INK_SOFT}`}>
          {page.oneLiner}
        </p>
        <div className="pt-1">
          <FDeviations items={page.deviations ?? []} />
        </div>
      </header>

      {children}

      <nav
        className="flex items-stretch justify-between gap-4 pt-6"
        aria-label="Foundations"
      >
        {prev ? (
          <Link
            className={`${CARD} flex-1 p-4 ${T_BODY_SM} ${INK} no-underline`}
            to="/foundations/m3/$page"
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
            to="/foundations/m3/$page"
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
