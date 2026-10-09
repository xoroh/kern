/**
 * /showcase — the Blocks domain index: real blocks, installable as a unit.
 *
 * A block is a composed section living in `apps/site/src/blocks/`, rendered
 * here live and vendored whole by `kern add <block>`. The catalog shows the
 * live block, its category, and its install command; each card links to the
 * per-block page with the Preview/Code tabs and the full dependency list.
 * Templates and example apps are still planned — stated as planned, never
 * previewed as if they existed.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Kicker } from "../components/chrome/kicker";
import { BLOCK_VIEWS, installCommand } from "../domains/blocks/registry";
import { SiteLayout } from "../domains/shared/chrome/site-layout";
import { routeHead } from "../domains/shared/systems/seo";
import {
  T_BODY,
  T_BODY_SM,
  T_PAGE,
  T_SECTION,
  T_SMALL_TITLE,
} from "../domains/shared/systems/type-scale";
import { CopyButton } from "../showcase/copy-button";

export const Route = createFileRoute("/showcase")({
  head: () =>
    routeHead(
      "Blocks",
      "Composed sections built from kern components — preview live, install as a unit.",
    ),
  component: Showcase,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const CARD =
  "rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low)";

const STILL_PLANNED = [
  {
    title: "Templates",
    body: "Full starter apps (web + native) showing the system wired end to end: theming, navigation, and forms. The `kern init` scaffold is the start of this; the templates are not shipped yet.",
  },
  {
    title: "Example apps",
    body: "Small complete apps demonstrating one concern well — e.g. a settings app for theming, a checkout flow for forms. Not built yet.",
  },
];

function Showcase() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[72rem] flex-col gap-12 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <Kicker className={INK_SOFT}>Blocks</Kicker>
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Blocks</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Composed sections built from shipped kern components on real
              tokens. Every block below is live here and installs as a unit with{" "}
              <code>kern add &lt;block&gt;</code> — the preview and the install
              are the same source file.
            </p>
          </header>

          <div className="flex flex-col gap-6">
            {BLOCK_VIEWS.map((view) => (
              <article
                key={view.entry.name}
                className={`flex flex-col gap-4 ${CARD} p-6`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className={`m-0 ${T_SMALL_TITLE} ${INK_SOFT} uppercase`}>
                      {view.entry.category}
                    </p>
                    <h2
                      id={`block-${view.entry.name}`}
                      className={`m-0 ${T_SECTION} ${INK}`}
                    >
                      <Link
                        to="/showcase/$block"
                        params={{ block: view.entry.name }}
                        className="no-underline hover:underline"
                      >
                        {view.entry.title}
                      </Link>
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <code
                      className={`inline-flex items-center rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface-container-high) px-3 py-1.5 ${T_BODY_SM} ${INK}`}
                    >
                      {installCommand(view.entry.name)}
                    </code>
                    <CopyButton
                      text={installCommand(view.entry.name)}
                      label="Copy"
                    />
                  </div>
                </div>
                <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
                  {view.entry.description}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 rounded-(--md-sys-shape-corner-medium) bg-(--md-sys-color-surface-container-low) p-8">
                  {view.render()}
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h2 id="still-planned" className={`m-0 ${T_SECTION} ${INK}`}>
              Still planned
            </h2>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {STILL_PLANNED.map((item) => (
                <li
                  key={item.title}
                  className="flex flex-col gap-1 rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline-variant) p-4"
                >
                  <p className={`m-0 ${T_BODY} ${INK}`}>
                    <strong>{item.title}</strong> — planned, not yet built.
                  </p>
                  <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>{item.body}</p>
                </li>
              ))}
            </ul>
            <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
              Patterns (recurring product shapes that point at component pages)
              live under{" "}
              <Link
                to="/patterns"
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                /patterns
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
