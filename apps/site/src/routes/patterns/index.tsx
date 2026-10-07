/**
 * /patterns — the Patterns hub (new section).
 *
 * kern ships components, not templates: no mock screens, no concept shots.
 * A pattern is therefore a pointer — a real composition of shipped
 * components that solves a recurring product shape — with the component
 * pages as the reference. Each card names what it composes and links to the
 * page that documents it. When blocks, templates, and example apps exist,
 * they join this hub; until then it points at what the system can evidence
 * today.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "../../components/chrome/site-layout";
import { routeHead } from "../../systems/seo";
import {
  T_BODY_SM,
  T_LEAD,
  T_PAGE,
  T_SECTION,
  T_SMALL_TITLE,
} from "../../systems/type-scale";

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const CARD =
  "rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low)";

export const Route = createFileRoute("/patterns/")({
  head: () =>
    routeHead(
      "Patterns",
      "Recurring product shapes composed from shipped components — app shell, forms, dialogs, search, settings, empty states.",
    ),
  component: PatternsHub,
});

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
    body: "The frame every screen hangs in: a top bar, a navigation surface, and a content slot that takes whatever the route renders.",
    composes: "AppShell with top-app-bar and navigation-drawer slots",
    to: "/components/web/app-shell",
    cta: "Read the app-shell reference",
  },
  {
    id: "pattern-form",
    title: "Form with validation",
    body: "Labels, inputs, and error text wired so a screen reader meets the error before the submit button — grouped in fieldsets, validated as a unit.",
    composes: "Form, fieldset, field, and error text",
    to: "/components/web/form",
    cta: "Read the form reference",
  },
  {
    id: "pattern-dialog",
    title: "Decision dialog",
    body: "One question, two honest buttons, no third way out — focus trapped inside until the reader decides, then returned to the trigger.",
    composes: "Dialog with focus trap and labelled actions",
    to: "/components/web/dialog",
    cta: "Read the dialog reference",
  },
  {
    id: "pattern-search",
    title: "Command palette and search",
    body: "The ⌘K on this site is itself the pattern: one box over every registry, ranked and grouped, with an empty state that suggests instead of shrugging.",
    composes: "Search-bar over the static search index",
    to: "/components/web/search-bar",
    cta: "Read the search-bar reference",
  },
  {
    id: "pattern-settings",
    title: "Settings list",
    body: "Rows that read as sentences — icon, label, control — so ten toggles scan as ten decisions instead of ten widgets.",
    composes: "List-item rows with switch and checkbox controls",
    to: "/components/web/list-item",
    cta: "Read the list-item reference",
  },
  {
    id: "pattern-empty-state",
    title: "Empty states",
    body: "Nothing here yet is a message, not a gap: name what is missing, say the one action that fills it, and put that action on the page.",
    composes: "Empty-state with a single primary action",
    to: "/components/web/empty-state",
    cta: "Read the empty-state reference",
  },
];

function PatternsHub() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Patterns</h1>
            <p className={`m-0 max-w-[62ch] ${T_LEAD} ${INK_SOFT}`}>
              Recurring product shapes, composed from shipped components. A
              pattern names the composition and points at the reference — the
              component pages stay the single source for API and behaviour.
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
                  <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                    {pattern.body}
                  </p>
                  <p className={`m-0 font-mono ${T_BODY_SM} ${INK_SOFT}`}>
                    {pattern.composes}
                  </p>
                  <Link
                    to={pattern.to}
                    className={`m-0 mt-1 ${T_BODY_SM} text-(--md-sys-color-primary) no-underline hover:underline`}
                  >
                    {pattern.cta} →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
