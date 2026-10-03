/**
 * /showcase — honest placeholder for the showcase step.
 *
 * What this page WILL hold: live blocks, templates, and example apps built
 * from kern components. None of that exists yet, so this page says so
 * plainly and routes readers back to what does exist. No fake previews, no
 * invented components, no placeholder imagery.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "../components/chrome/site-layout";
import { T_BODY, T_LABEL, T_PAGE, T_SECTION } from "../type-scale";

export const Route = createFileRoute("/showcase")({
  component: Showcase,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";

const PLANNED = [
  {
    title: "Blocks",
    body: "Composed, copy-paste-ready sections — auth forms, settings screens, empty states — built from kern components on real tokens.",
  },
  {
    title: "Templates",
    body: "Full starter apps (web + native) showing the system wired end to end: theming, navigation, and forms.",
  },
  {
    title: "Example apps",
    body: "Small complete apps demonstrating one concern well — e.g. a settings app for theming, a checkout flow for forms.",
  },
];

function Showcase() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-12 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <p className={`m-0 ${T_LABEL} ${INK_SOFT} uppercase`}>Showcase</p>
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Showcase</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Real things built with kern — blocks, templates, and example
              apps. This section is not built yet, so there is nothing to show
              here instead of the thing itself.
            </p>
          </header>
          <div className="flex flex-col gap-4">
            <h2 id="what-will-live-here" className={`m-0 ${T_SECTION} ${INK}`}>What will live here</h2>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {PLANNED.map((item) => (
                <li
                  key={item.title}
                  className="flex flex-col gap-1 rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline-variant) p-4"
                >
                  <p className={`m-0 ${T_BODY} ${INK}`}>
                    <strong>{item.title}</strong> — planned, not yet built.
                  </p>
                  <p className={`m-0 ${T_BODY} ${INK_SOFT}`}>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <nav
            aria-label="Where to go meanwhile"
            className="flex flex-col gap-3"
          >
            <h2 id="where-to-go-meanwhile" className={`m-0 ${T_SECTION} ${INK}`}>
              Where to go meanwhile
            </h2>
            <p className={`m-0 ${T_BODY} ${INK_SOFT}`}>
              <Link
                to="/components"
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                Browse the component gallery
              </Link>{" "}
              for live demos of what ships today, or{" "}
              <Link
                to="/docs"
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                start the docs
              </Link>{" "}
              to learn the system.
            </p>
          </nav>
        </div>
      </section>
    </SiteLayout>
  );
}
