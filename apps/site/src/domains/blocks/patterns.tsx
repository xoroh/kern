/**
 * /patterns — the Patterns page (Blocks domain).
 *
 * kern ships components, not templates: no mock screens, no concept shots.
 * A pattern is therefore a pointer — a real composition of shipped
 * components that solves a recurring product shape — with the component
 * pages as the reference. Each card names what it composes and links to the
 * page that documents it. Blocks (installable composed sections) live under
 * /showcase; this page stays a pointer by design (D8: real-only).
 *
 * The route registration (`createFileRoute("/patterns/")`, head, component
 * wiring) lives in `routes/patterns/index.tsx` — TanStack file-based routing
 * only picks up route files under `routes/`, so the domain owns the page and
 * the route file owns the URL.
 */
import { Link } from "@tanstack/react-router";
import { PageCard } from "../shared/chrome/page-card";
import { SiteLayout } from "../shared/chrome/site-layout";
import {
  T_BODY_SM,
  T_CODE,
  T_LEAD,
  T_PAGE,
  T_SECTION,
  T_SMALL_TITLE,
} from "../shared/systems/type-scale";
import { CARD, INK, INK_SOFT, LINK } from "../shared/systems/ui";

const PATTERNS: {
  id: string;
  title: string;
  body: string;
  composes: string;
  to: string;
  cta: string;
}[] = [
  {
    id: "pattern-app-shell",
    title: "App shell",
    body: "Top bar, navigation, and a content slot.",
    composes: "AppShell with top-app-bar and navigation-drawer slots",
    to: "/components/web/app-shell",
    cta: "Read the app-shell reference",
  },
  {
    id: "pattern-form",
    title: "Form with validation",
    body: "Labels, inputs, and error text wired for screen readers.",
    composes: "Form, fieldset, field, and error text",
    to: "/components/web/form",
    cta: "Read the form reference",
  },
  {
    id: "pattern-dialog",
    title: "Decision dialog",
    body: "One question, two buttons, focus trapped until decided.",
    composes: "Dialog with focus trap and labelled actions",
    to: "/components/web/dialog",
    cta: "Read the dialog reference",
  },
  {
    id: "pattern-search",
    title: "Command palette and search",
    body: "⌘K search over every registry, ranked and grouped.",
    composes: "Search-bar over the static search index",
    to: "/components/web/search-bar",
    cta: "Read the search-bar reference",
  },
  {
    id: "pattern-settings",
    title: "Settings list",
    body: "Icon, label, control — rows that scan as decisions.",
    composes: "List-item rows with switch and checkbox controls",
    to: "/components/web/list-item",
    cta: "Read the list-item reference",
  },
  {
    id: "pattern-empty-state",
    title: "Empty states",
    body: "Name what is missing, show the one action that fills it.",
    composes: "Empty-state with a single primary action",
    to: "/components/web/empty-state",
    cta: "Read the empty-state reference",
  },
];

export function PatternsHub() {
  return (
    <SiteLayout>
      <PageCard>
        <header className="flex flex-col gap-3">
          <h1 className={`m-0 ${T_PAGE} ${INK}`}>Patterns</h1>
          <p className={`m-0 max-w-[62ch] ${T_LEAD} ${INK_SOFT}`}>
            Recurring product shapes composed from shipped components.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 id="start-from-a-pattern" className={`m-0 ${T_SECTION} ${INK}`}>
            Start from a pattern
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PATTERNS.map((pattern) => (
              <article
                key={pattern.id}
                className={`${CARD} flex flex-col gap-2 p-5`}
              >
                <h3 id={pattern.id} className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
                  {pattern.title}
                </h3>
                <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>{pattern.body}</p>
                <p className={`m-0 ${T_CODE} ${INK_SOFT}`}>
                  {pattern.composes}
                </p>
                <Link
                  to={pattern.to}
                  className={`m-0 mt-1 ${T_BODY_SM} ${LINK}`}
                >
                  {pattern.cta} →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
          Installable composed sections — blocks with live previews and a{" "}
          <code className={T_CODE}>kern add</code> install — live under{" "}
          <Link to="/showcase" className={LINK}>
            /showcase
          </Link>
          .
        </p>
      </PageCard>
    </SiteLayout>
  );
}
