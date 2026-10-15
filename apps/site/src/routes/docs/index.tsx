/**
 * The Docs door — the whole reference's landing.
 *
 * v3: foundations material folded into this door, so the page stops
 * pretending they are separate destinations and stops apologising for it
 * in prose. The v2 page carried six sections; this one carries four,
 * because two of them were duplicates of the others: a "Start here" list
 * whose three steps all linked to one tutorial, and a "Next steps" list
 * that re-said the map. Cut both. What remains is the reader's order:
 * *where do I fit* -> *what is here* -> *what changed* -> *for agents*.
 *
 * Numbers on this page are GENERATED or omitted. There is no downloads band:
 * the map says to show weekly downloads "once real — do not fake numbers",
 * and no real figure exists yet. A missing band is honest; a fabricated one is
 * the failure class this whole rebuild is against.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Icon } from "@xoroh/kern-icons";
import { Kicker } from "../../components/chrome/kicker";
import { PageCard } from "../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import {
  T_BODY,
  T_BODY_SM,
  T_LABEL,
  T_LABEL_LG,
  T_PAGE,
  T_SMALL_TITLE,
} from "../../domains/shared/systems/type-scale";
import { CARD, LINK } from "../../domains/shared/systems/ui";
import { RECENT_CHANGES } from "../../generated/changelog";

export const Route = createFileRoute("/docs/")({
  head: () =>
    routeHead(
      "Docs",
      "The whole reference: design foundations, install, guides and API.",
    ),
  component: DocsIndex,
});

const SOFT = "text-(--sys-color-on-surface-variant)";
/** Hub card: the kit outlined card + link affordances + padding. */
const CARD_LINK = `${CARD} block p-5 no-underline text-(--sys-color-on-surface)`;

/** The three journeys, matching the home page's promise. */
const JOURNEYS = [
  {
    title: "Build an app",
    icon: "code" as const,
    what: "Install, set a theme, ship a screen. Web or native — one contract.",
    to: "/docs/getting-started" as const,
    cta: "Start building",
  },
  {
    title: "Understand the system",
    icon: "menu-book" as const,
    what: "Tokens, roles, shape, motion — the decisions beneath the components.",
    to: "/foundations" as const,
    cta: "Open foundations",
  },
  {
    title: "Migrate",
    icon: "arrow-forward" as const,
    what: "Coming from Material or another kit? The guides hold the honest delta.",
    to: "/docs/guides" as const,
    cta: "Read the guides",
  },
];

/** What the door contains — one card per area of the tree. */
const SECTIONS = [
  {
    title: "Guides & tooling",
    why: "Install to integration, in the order you need it.",
    links: [
      { label: "Getting started", to: "/docs/getting-started" },
      { label: "Guides", to: "/docs/guides" },
      { label: "Tooling", to: "/docs/use-cases" },
      { label: "API utilities", to: "/docs/api" },
      { label: "Primitives", to: "/primitives" },
      { label: "Contributing", to: "/docs/contributing" },
    ],
  },
  {
    title: "Foundations",
    why: "The design decisions: color, type, shape, elevation, motion, states.",
    links: [
      { label: "Foundations hub", to: "/foundations" },
      { label: "Color", to: "/foundations/m3/color" },
      { label: "Theme studio", to: "/playground" },
    ],
  },
  {
    title: "Components",
    why: "Every family on web and native — usage, props, tokens, a11y.",
    links: [{ label: "Open the gallery", to: "/components" }],
  },
  {
    title: "Blocks",
    why: "Composed work built from kern, ready to lift into a product.",
    links: [{ label: "Open blocks", to: "/showcase" }],
  },
];

function DocsIndex() {
  return (
    <SiteLayout>
      <PageCard gap={12}>
        <header className="site-docs-welcome flex flex-col gap-4">
          <Kicker>Your guide to Kern</Kicker>
          <h1 className={`m-0 ${T_PAGE}`}>Good things start here.</h1>
          <p className={`m-0 max-w-[62ch] ${T_BODY} ${SOFT}`}>
            From your first component to your own design language. Everything
            you need to build with Kern, all in one place.
          </p>
        </header>

        {/* 1 — where do I fit */}
        <nav aria-labelledby="journeys" className="flex flex-col gap-4">
          <h2 id="journeys" className={`m-0 ${T_SMALL_TITLE}`}>
            Where do I fit
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {JOURNEYS.map((j) => (
              <Link key={j.title} to={j.to} className={CARD_LINK}>
                <span className="site-journey-icon">
                  <Icon name={j.icon} size={24} />
                </span>
                <p className={`m-0 ${T_SMALL_TITLE}`}>{j.title}</p>
                <p className={`m-0 mt-2 ${T_BODY_SM} ${SOFT}`}>{j.what}</p>
                <p
                  className={`m-0 mt-4 ${T_LABEL_LG} text-(--sys-color-secondary)`}
                >
                  {j.cta} →
                </p>
              </Link>
            ))}
          </div>
        </nav>

        {/* 2 — what is here */}
        <nav aria-labelledby="section-map" className="flex flex-col gap-4">
          <h2 id="section-map" className={`m-0 ${T_SMALL_TITLE}`}>
            What is here
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SECTIONS.map((s) => (
              <div key={s.title} className={CARD_LINK}>
                <p className={`m-0 ${T_SMALL_TITLE}`}>{s.title}</p>
                <p className={`m-0 mt-2 ${T_BODY_SM} ${SOFT}`}>{s.why}</p>
                <ul className="m-0 mt-3 flex list-none flex-col gap-1 p-0">
                  {s.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className={`${LINK} ${T_BODY_SM}`}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* 3 — what changed */}
        <section
          aria-labelledby="unreleased-changes"
          className="flex flex-col gap-4"
        >
          <h2 id="unreleased-changes" className={`m-0 ${T_SMALL_TITLE}`}>
            Unreleased changes
          </h2>
          <p className={`m-0 ${T_BODY_SM} ${SOFT}`}>
            {RECENT_CHANGES.length} change
            {RECENT_CHANGES.length === 1 ? "" : "s"} read from the repository's
            changesets, ordered by bump size. <em>Unreleased</em>, not{" "}
            <em>recent</em>: nothing has published yet, so there are no dates.
          </p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {RECENT_CHANGES.slice(0, 6).map((c) => (
              <li key={c.id} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 ${T_LABEL} ${
                    c.bump === "major"
                      ? "bg-(--sys-color-error-container) text-(--sys-color-on-error-container)"
                      : c.bump === "minor"
                        ? "bg-(--sys-color-tertiary-container) text-(--sys-color-on-tertiary-container)"
                        : "bg-(--sys-color-surface-container-high) text-(--sys-color-on-surface-variant)"
                  }`}
                >
                  {c.bump}
                </span>
                <span className={`m-0 ${T_BODY_SM}`}>{c.summary}</span>
              </li>
            ))}
          </ul>
          <p className={`m-0 ${T_BODY_SM}`}>
            <a
              className="text-(--sys-color-secondary)"
              href="https://github.com/xoroh/kern/tree/main/.changeset"
              rel="noreferrer"
              target="_blank"
            >
              Read every changeset on GitHub →
            </a>
          </p>
        </section>

        {/* For AI agents — the machine surfaces, in one place. llms.txt is
              generated from the nav file; the skills live in the repo; every
              component and foundations page carries a Copy-as-Markdown
              button. An agent that starts here never needs to scrape HTML. */}
        <section
          aria-labelledby="for-ai-agents"
          className="flex flex-col gap-3 border-t border-(--sys-color-outline-variant) pt-6"
        >
          <h2 id="for-ai-agents" className={`m-0 ${T_SMALL_TITLE}`}>
            For AI agents
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            <li>
              <a href="/llms.txt" className={`${LINK} ${T_BODY_SM}`}>
                <span className="font-mono">llms.txt</span> →
              </a>{" "}
              <span className={`m-0 ${T_BODY_SM} ${SOFT}`}>
                the page map, generated from the nav — never hand-maintained.
              </span>
            </li>
            <li>
              <span className={`m-0 ${T_BODY_SM} ${SOFT}`}>
                Copy as Markdown on every component and foundations page —
                prose, code and links, live demos excluded.
              </span>
            </li>
            <li>
              <a
                href="https://github.com/xoroh/kern/tree/main/.agents/skills"
                rel="noreferrer"
                target="_blank"
                className={`${LINK} ${T_BODY_SM}`}
              >
                Agent skills →
              </a>{" "}
              <span className={`m-0 ${T_BODY_SM} ${SOFT}`}>
                kern (design system) and docs skills in the repo.
              </span>
            </li>
          </ul>
        </section>
      </PageCard>
    </SiteLayout>
  );
}
