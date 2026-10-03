/**
 * The docs hub — journey cards, "Start here", the section map, recent changes.
 *
 * Spec: `.team/reports/SITE-REDESIGN-full-site-map.md` §2(b). The order is the
 * reader's order: *where do I fit* -> *what do I do first* -> *what is there*
 * -> *what changed*. FLOW says "never dead-ends: every band has exactly one
 * primary CTA" — each band below carries one, and the page ends on "Next
 * steps" by Diátaxis form, same as the tutorials do.
 *
 * Numbers on this page are GENERATED or omitted. There is no downloads band:
 * the map says to show weekly downloads "once real — do not fake numbers",
 * and no real figure exists yet. A missing band is honest; a fabricated one is
 * the failure class this whole rebuild is against.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "../../components/chrome/site-layout";
import { RECENT_CHANGES } from "../../generated/changelog";
import {
  T_BODY,
  T_BODY_SM,
  T_LABEL,
  T_LABEL_LG,
  T_PAGE,
  T_SMALL_TITLE,
} from "../../type-scale";

export const Route = createFileRoute("/docs/")({ component: DocsIndex });

const CARD =
  "rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) p-5 no-underline text-(--md-sys-color-on-surface)";
const SOFT = "text-(--md-sys-color-on-surface-variant)";

/**
 * The three journeys, matching the home page's journey cards. One source of
 * truth for "which path am I on", so the hub and home cannot drift apart on
 * the promise they make.
 */
const JOURNEYS = [
  {
    title: "Build an app",
    what: "Install kern, set a theme, ship a screen. Web or native — the contract is one.",
    to: "/getting-started" as const,
    cta: "Start building",
  },
  {
    title: "Build a design system",
    what: "Tokens, roles, theming and the shape scale — the layer beneath the components.",
    to: "/styles" as const,
    cta: "Open the tokens",
  },
  {
    title: "Migrate",
    what: "Coming from Material or another kit? The deviations registry is the honest delta.",
    to: "/docs/guides" as const,
    cta: "Read the guides",
  },
];

/**
 * The section map — the docs tree as it actually is. `why` is one line of
 * guidance, because a route list is a table of contents and this is meant to
 * tell a reader which door is theirs.
 */
const SECTIONS = [
  {
    title: "Get started",
    why: "Install, theme, first component. Everything else assumes this.",
    links: [{ label: "Getting started", to: "/getting-started" }],
  },
  {
    title: "Foundations",
    why: "The values everything is built from, and the rules that govern them.",
    // /theme is deliberately NOT linked here yet: it still carries 26 ad-hoc
    // type hits and check-typescale watches routes. Promoting it from the map
    // would send readers to a page the gate flags. It rejoins this list when
    // its type lands on the scale — tracked with the rest of the route pass.
    links: [{ label: "Styles and tokens", to: "/styles" }],
  },
  {
    title: "Components",
    why: "Per-component reference: live showcase, anatomy, accessibility, API.",
    links: [{ label: "Component gallery", to: "/components" }],
  },
  {
    title: "Reference",
    why: "Look things up. The non-component API, and the guidance library.",
    links: [
      { label: "Public API", to: "/docs/api" },
      { label: "API index", to: "/docs/reference" },
      { label: "Guides", to: "/docs/guides" },
    ],
  },
];

function DocsIndex() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-12 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <p className={`m-0 ${T_LABEL} ${SOFT} uppercase`}>Docs</p>
            <h1 className={`m-0 ${T_PAGE}`}>Documentation</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${SOFT}`}>
              Three ways in, one system underneath. Pick the path that matches
              what you are building — or start at the install and let the order
              do the work.
            </p>
          </header>

          {/* 1 — where do I fit */}
          <nav aria-labelledby="journeys" className="flex flex-col gap-4">
            <h2 id="journeys" className={`m-0 ${T_SMALL_TITLE}`}>
              Where do I fit
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {JOURNEYS.map((j) => (
                <Link key={j.title} to={j.to} className={CARD}>
                  <p className={`m-0 ${T_SMALL_TITLE}`}>{j.title}</p>
                  <p className={`m-0 mt-2 ${T_BODY_SM} ${SOFT}`}>{j.what}</p>
                  <p
                    className={`m-0 mt-4 ${T_LABEL_LG} text-(--md-sys-color-primary)`}
                  >
                    {j.cta} →
                  </p>
                </Link>
              ))}
            </div>
          </nav>

          {/* 2 — what do I do first */}
          <nav aria-labelledby="start-here" className="flex flex-col gap-4">
            <h2 id="start-here" className={`m-0 ${T_SMALL_TITLE}`}>
              Start here
            </h2>
            <ol className="m-0 flex list-none flex-col gap-3 p-0 sm:flex-row">
              {[
                {
                  n: "1",
                  label: "Install",
                  to: "/getting-started" as const,
                  hash: "step-1",
                  why: "Install the packages",
                },
                {
                  n: "2",
                  label: "Quickstart",
                  to: "/getting-started" as const,
                  hash: "step-5",
                  why: "Web quickstart — the app shell",
                },
                {
                  n: "3",
                  label: "First component",
                  to: "/getting-started" as const,
                  hash: "step-3",
                  why: "Render your first component",
                },
              ].map((s) => (
                <li key={s.n} className="flex-1">
                  <Link to={s.to} hash={s.hash} className={CARD}>
                    <span className={`m-0 block ${T_LABEL} ${SOFT} uppercase`}>
                      Step {s.n}
                    </span>
                    <span className={`m-0 mt-1 block ${T_SMALL_TITLE}`}>
                      {s.label}
                    </span>
                    <span className={`m-0 mt-1 block ${T_BODY_SM} ${SOFT}`}>
                      {s.why}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          {/* 3 — what is there */}
          <nav aria-labelledby="section-map" className="flex flex-col gap-4">
            <h2 id="section-map" className={`m-0 ${T_SMALL_TITLE}`}>
              The map
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SECTIONS.map((s) => (
                <div key={s.title} className={CARD}>
                  <p className={`m-0 ${T_SMALL_TITLE}`}>{s.title}</p>
                  <p className={`m-0 mt-2 ${T_BODY_SM} ${SOFT}`}>{s.why}</p>
                  <ul className="m-0 mt-3 flex list-none flex-col gap-1 p-0">
                    {s.links.map((l) => (
                      <li key={l.to}>
                        <Link
                          to={l.to}
                          className={`text-(--md-sys-color-primary) ${T_BODY_SM}`}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          {/* 4 — what changed */}
          <section
            aria-labelledby="unreleased-changes"
            className="flex flex-col gap-4"
          >
            <h2 id="unreleased-changes" className={`m-0 ${T_SMALL_TITLE}`}>
              Unreleased changes
            </h2>
            <p className={`m-0 ${T_BODY_SM} ${SOFT}`}>
              {RECENT_CHANGES.length} change
              {RECENT_CHANGES.length === 1 ? "" : "s"} waiting to release, read
              from the repository's changesets rather than a list someone
              maintains. Called <em>unreleased</em> and not <em>recent</em>,
              because nothing has published yet and these carry no dates —
              ordering is by bump size, largest first. The first release will
              move these into a dated changelog.
            </p>
            <p className={`m-0 ${T_LABEL} ${SOFT}`}>
              Showing the {Math.min(6, RECENT_CHANGES.length)} largest of{" "}
              {RECENT_CHANGES.length}.
            </p>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {RECENT_CHANGES.slice(0, 6).map((c) => (
                <li key={c.id} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 ${T_LABEL} ${
                      c.bump === "major"
                        ? "bg-(--md-sys-color-error-container) text-(--md-sys-color-on-error-container)"
                        : c.bump === "minor"
                          ? "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)"
                          : "bg-(--md-sys-color-surface-container-highest) text-(--md-sys-color-on-surface-variant)"
                    }`}
                  >
                    {c.bump}
                  </span>
                  <span className={`m-0 ${T_BODY_SM}`}>{c.summary}</span>
                </li>
              ))}
            </ul>
            {/* The band's one primary CTA — the FLOW rule is "every band has
                exactly one", so a band without one is a page that states a rule
                and breaks it on the same screen. */}
            <p className={`m-0 ${T_BODY_SM}`}>
              <a
                className="text-(--md-sys-color-primary)"
                href="https://github.com/xoroh/kern/tree/main/.changeset"
                rel="noreferrer"
                target="_blank"
              >
                Read every changeset on GitHub →
              </a>
            </p>
          </section>

          {/* Next steps — every tutorial ends here, by Diátaxis form */}
          <section
            aria-labelledby="next-steps"
            className="flex flex-col gap-3 border-t border-(--md-sys-color-outline-variant) pt-6"
          >
            <h2 id="next-steps" className={`m-0 ${T_SMALL_TITLE}`}>
              Next steps
            </h2>
            <p className={`m-0 ${T_BODY_SM} ${SOFT}`}>
              This page is a map, so its next steps split by what you came for
              rather than by reading order.
            </p>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              <li>
                <Link
                  to="/getting-started"
                  className={`text-(--md-sys-color-primary) ${T_BODY_SM}`}
                >
                  Getting started →
                </Link>{" "}
                <span className={`m-0 ${T_BODY_SM} ${SOFT}`}>
                  a tutorial: install to first component, in order.
                </span>
              </li>
              <li>
                <Link
                  to="/components"
                  className={`text-(--md-sys-color-primary) ${T_BODY_SM}`}
                >
                  Component gallery →
                </Link>{" "}
                <span className={`m-0 ${T_BODY_SM} ${SOFT}`}>
                  reference: what ships, and what each part does.
                </span>
              </li>
              <li>
                <Link
                  to="/styles"
                  className={`text-(--md-sys-color-primary) ${T_BODY_SM}`}
                >
                  Styles and tokens →
                </Link>{" "}
                <span className={`m-0 ${T_BODY_SM} ${SOFT}`}>
                  explanation: why the system is shaped the way it is.
                </span>
              </li>
            </ul>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
