/**
 * /foundations/m3 — the Material 3 hub, and the landing for the M3
 * Foundations family.
 *
 * Every figure on this page is read from the token package via the M3
 * system barrel (content/systems/m3). Nothing is a literal. The parent
 * /foundations hub lists the systems; this page is the current one.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  COLOR_ROLES,
  ELEVATION_LEVELS,
  KERN_EXTRA_COUNT,
  M3_ROLE_COUNT,
  ROLE_COUNT,
  SHAPE,
  TYPE_STYLE_COUNT,
} from "../../../content/systems/m3/foundations";
import { PageCard } from "../../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../../domains/shared/chrome/site-layout";
import { routeHead } from "../../../domains/shared/systems/seo";
import {
  T_BODY_SM,
  T_LEAD,
  T_PAGE,
  T_SECTION,
  T_SMALL_TITLE,
} from "../../../domains/shared/systems/type-scale";
import { CARD, INK, INK_SOFT, LINK } from "../../../domains/shared/systems/ui";
import { FOUNDATIONS, roleVar } from "../../../foundations/shell";

export const Route = createFileRoute("/foundations/m3/")({
  head: () =>
    routeHead(
      "Material 3",
      "The current system's tokens, theme, accessibility, and icons — the layer beneath the components.",
    ),
  component: M3Hub,
});

const BEYOND_TOKENS: {
  title: string;
  body: string;
  to: string;
  cta: string;
}[] = [
  {
    title: "Theme",
    body: "One theme source, both platforms — color roles, shape, contrast levels, and authoring a preset.",
    to: "/foundations/m3/theme",
    cta: "Open the theme",
  },
  {
    title: "Accessibility",
    body: "What is checked today, what is not yet checked, and how to report a barrier. No conformance claim without an audit.",
    to: "/foundations/accessibility",
    cta: "Read the statement",
  },
  {
    title: "Icons",
    body: "Every icon in the set, searchable — names and counts read from the icon package at build time.",
    to: "/foundations/icons",
    cta: "Browse the gallery",
  },
];

function M3Hub() {
  // Generated, not typed — see ROLE-COUNT-CORRECTION-45-vs-58.md. kern ships
  // ROLE_COUNT roles; M3_ROLE_COUNT of them are Material 3's and the rest are
  // registered kern deviations. Both numbers are computed above.
  return (
    <SiteLayout>
      <PageCard>
        <header className="flex flex-col gap-3">
          <nav
            className={`flex flex-wrap items-center gap-2 ${T_BODY_SM} ${INK_SOFT}`}
            aria-label="Breadcrumb"
          >
            <Link to="/foundations">Design systems</Link>
            <span aria-hidden="true">/</span>
            <span className={INK}>Material 3</span>
          </nav>
          <h1 className={`m-0 ${T_PAGE} ${INK}`}>Material 3</h1>
          <p className={`m-0 max-w-[62ch] ${T_LEAD} ${INK_SOFT}`}>
            The values the current system is built from, and the rules that
            govern them. Everything on these pages is read from the token
            package — the numbers are generated, so they cannot disagree with
            what kern ships.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Colour roles" value={String(ROLE_COUNT)} />
          <Stat label="Type styles" value={String(TYPE_STYLE_COUNT)} />
          <Stat label="Corner roles" value={String(SHAPE.length)} />
          <Stat
            label="Elevation levels"
            value={String(ELEVATION_LEVELS.length)}
          />
        </div>

        <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
          {ROLE_COUNT} colour roles in kern: {M3_ROLE_COUNT} are Material 3's
          and {KERN_EXTRA_COUNT} are registered kern deviations — status colours
          and a tonal surface role, each with an id in the deviations registry
          rather than being quietly non-standard.
        </p>

        <nav
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          aria-label="Material 3 foundations"
        >
          {FOUNDATIONS.map((page) => (
            <Link
              key={page.slug}
              to="/foundations/m3/$page"
              params={{ page: page.slug }}
              className={`${CARD} flex flex-col gap-1 p-5 no-underline`}
            >
              <span className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
                {page.title}
              </span>
              <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                {page.oneLiner}
              </span>
            </Link>
          ))}
        </nav>

        <section className="flex flex-col gap-3">
          <h2 id="beyond-tokens" className={`m-0 ${T_SECTION} ${INK}`}>
            Beyond tokens
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {BEYOND_TOKENS.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className={`${CARD} flex flex-col gap-1 p-5 no-underline`}
              >
                <span className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
                  {card.title}
                </span>
                <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                  {card.body}
                </span>
                <span className={`m-0 mt-1 ${T_BODY_SM} ${LINK}`}>
                  {card.cta} →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 id="where-used" className={`m-0 ${T_SECTION} ${INK}`}>
            Where the tokens are used
          </h2>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            Every component page carries a "Theming and tokens" section naming
            the tokens that component reads. Start there to see a token doing
            work.
          </p>
          <Link to="/components" className={`m-0 ${T_BODY_SM} ${LINK}`}>
            Browse components →
          </Link>
        </section>

        {/* A live swatch row, generated — the first colour roles, painted
            through their own CSS variables so they follow the scheme this
            site is running in rather than being frozen to one of them. */}
        <section className="flex flex-col gap-3">
          <h2 id="swatches" className={`m-0 ${T_SECTION} ${INK}`}>
            The roles, live
          </h2>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            These swatches are the actual role values from the theme, painted
            through the roles&apos; own CSS variables — so they follow whichever
            scheme the page is in. The Color page can repaint every swatch in
            either scheme on demand.
          </p>
          <div className="flex flex-wrap gap-2">
            {COLOR_ROLES.slice(0, 12).map((role) => (
              <div key={role.name} className="flex flex-col gap-1">
                <div
                  className="h-10 w-20 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant)"
                  style={{ background: roleVar(role.name) }}
                  aria-hidden="true"
                />
                <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                  {role.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      </PageCard>
    </SiteLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${CARD} flex flex-col gap-1 p-4`}>
      <span className={`m-0 ${T_SECTION} ${INK}`}>{value}</span>
      <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>{label}</span>
    </div>
  );
}
