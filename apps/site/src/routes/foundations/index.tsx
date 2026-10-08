/**
 * /foundations — the Foundations hub, and the landing for the Foundations
 * family. Reachable from the top nav.
 *
 * Every figure on this page is read from the token package via
 * content/foundations. Nothing is a literal. The hub gathers what used to
 * live at four separate top-level routes — /styles (+/$page), /theme,
 * /accessibility, /icons — which now redirect here.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import {
  COLOR_ROLES,
  ELEVATION_LEVELS,
  KERN_EXTRA_COUNT,
  M3_ROLE_COUNT,
  ROLE_COUNT,
  SHAPE,
  TYPE_STYLE_COUNT,
} from "../../content/foundations";
import { FOUNDATIONS } from "../../foundations/shell";
import { routeHead } from "../../domains/shared/systems/seo";
import {
  T_BODY_SM,
  T_LEAD,
  T_PAGE,
  T_SECTION,
  T_SMALL_TITLE,
} from "../../domains/shared/systems/type-scale";

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const CARD =
  "rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low)";

export const Route = createFileRoute("/foundations/")({
  head: () =>
    routeHead("Foundations", "Tokens, theme, accessibility, and icons — the layer beneath the components."),
  component: FoundationsHub,
});

const BEYOND_TOKENS: { title: string; body: string; to: string; cta: string }[] = [
  {
    title: "Theme",
    body: "One theme source, both platforms — color roles, shape, contrast levels, and authoring a preset.",
    to: "/foundations/theme",
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

function FoundationsHub() {
  // Generated, not typed — see ROLE-COUNT-CORRECTION-45-vs-58.md. kern ships
  // ROLE_COUNT roles; M3_ROLE_COUNT of them are Material 3's and the rest are
  // registered kern deviations. Both numbers are computed above.
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Foundations</h1>
            <p className={`m-0 max-w-[62ch] ${T_LEAD} ${INK_SOFT}`}>
              The values the whole system is built from, and the rules that
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
            and {KERN_EXTRA_COUNT} are registered kern deviations — status
            colours and a tonal surface role, each with an id in the deviations
            registry rather than being quietly non-standard.
          </p>

          <nav
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            aria-label="Foundations"
          >
            {FOUNDATIONS.map((page) => (
              <Link
                key={page.slug}
                to="/foundations/$page"
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
                  <span
                    className={`m-0 mt-1 ${T_BODY_SM} text-(--md-sys-color-primary)`}
                  >
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
            <Link
              to="/components"
              className={`m-0 ${T_BODY_SM} text-(--md-sys-color-primary) underline underline-offset-2`}
            >
              Browse components →
            </Link>
          </section>

          {/* A live swatch row, generated — the first colour roles, both schemes. */}
          <section className="flex flex-col gap-3">
            <h2 id="swatches" className={`m-0 ${T_SECTION} ${INK}`}>
              The roles, live
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
              These swatches are the actual role values from the theme, not a
              picture of them.
            </p>
            <div className="flex flex-wrap gap-2">
              {COLOR_ROLES.slice(0, 12).map((role) => (
                <div key={role.name} className="flex flex-col gap-1">
                  <div
                    className="h-10 w-20 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant)"
                    style={{ background: role.light }}
                    aria-hidden="true"
                  />
                  <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                    {role.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
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
