/**
 * /foundations — the design-systems hub.
 *
 * Kern documents one system today (Material 3) and is shaped for more: each
 * system owns its directory (`/foundations/<id>/`), its content barrel
 * (`content/systems/<id>/`), and its registry entry (`systems/design-systems`).
 * This page lists the systems; the old token-hub body lives at
 * /foundations/m3. System cards render from the registry, so a second system
 * lands as data — no hub rewrite.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { PageCard } from "../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import {
  T_BODY_SM,
  T_LEAD,
  T_PAGE,
  T_SECTION,
  T_SMALL_TITLE,
} from "../../domains/shared/systems/type-scale";
import { CARD, INK, INK_SOFT, LINK } from "../../domains/shared/systems/ui";
import { DESIGN_SYSTEMS } from "../../systems/design-systems";

export const Route = createFileRoute("/foundations/")({
  head: () =>
    routeHead(
      "Design systems",
      "The systems kern documents — Material 3 today, shaped for more.",
    ),
  component: SystemsHub,
});

/**
 * kern-level resources shared across systems — the icon set and the
 * accessibility statement belong to kern, not to Material 3, so they stay
 * outside every system directory by decision, not by accident.
 */
const SHARED = [
  {
    title: "Icons",
    body: "Every icon in the set, searchable — names and counts read from the icon package at build time.",
    to: "/foundations/icons",
    cta: "Browse the gallery",
  },
  {
    title: "Accessibility",
    body: "What is checked today, what is not yet checked, and how to report a barrier. No conformance claim without an audit.",
    to: "/foundations/accessibility",
    cta: "Read the statement",
  },
];

function SystemsHub() {
  return (
    <SiteLayout>
      <PageCard>
        <header className="site-docs-welcome flex flex-col gap-3">
          <h1 className={`m-0 ${T_PAGE} ${INK}`}>Design systems</h1>
          <p className={`m-0 max-w-[62ch] ${T_LEAD} ${INK_SOFT}`}>
            Kern documents one design system today — Material 3 — and the tree
            is shaped so the next one slots in beside it: one directory, one
            content barrel, one registry entry each.
          </p>
        </header>

        <nav
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          aria-label="Design systems"
        >
          {DESIGN_SYSTEMS.map((system) => (
            <div key={system.id} className={`${CARD} flex flex-col gap-2 p-6`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
                  {system.label}
                </span>
                <span
                  className={`rounded-full bg-(--sys-color-secondary-container) px-2.5 py-0.5 ${T_BODY_SM} text-(--sys-color-on-secondary-container)`}
                >
                  {system.status === "current" ? "Active" : system.status}
                </span>
              </div>
              <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                {system.status === "current" ? "Current system — " : ""}
                {system.blurb}
              </span>
              <span className="m-0 mt-3 flex flex-wrap gap-3 border-t border-(--sys-color-outline-variant)/60 pt-3">
                <Link
                  to={system.foundationsHref}
                  className={`m-0 ${T_BODY_SM} ${LINK}`}
                >
                  Foundations →
                </Link>
                <Link
                  to={system.componentsHref}
                  className={`m-0 ${T_BODY_SM} ${LINK}`}
                >
                  Components →
                </Link>
              </span>
            </div>
          ))}
        </nav>

        <section className="flex flex-col gap-3">
          <h2 id="shared-resources" className={`m-0 ${T_SECTION} ${INK}`}>
            Shared across systems
          </h2>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            These belong to kern itself, not to any one system — so they stay
            outside the system directories no matter how many systems land.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SHARED.map((card) => (
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
          <h2 id="next-steps" className={`m-0 ${T_SECTION} ${INK}`}>
            Next steps
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            <li>
              <Link
                to="/docs/getting-started"
                className={`text-(--sys-color-primary) ${T_BODY_SM}`}
              >
                Getting started →
              </Link>{" "}
              <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                install to first component, in order.
              </span>
            </li>
            <li>
              <Link
                to="/components"
                className={`text-(--sys-color-primary) ${T_BODY_SM}`}
              >
                Component gallery →
              </Link>{" "}
              <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                what ships, and what each part does.
              </span>
            </li>
          </ul>
        </section>
      </PageCard>
    </SiteLayout>
  );
}
