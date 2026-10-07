/**
 * /playground — the Playground hub.
 *
 * Two live tools, promoted from wherever they were buried: the theme
 * configurator (repaint the system and take the tokens) and the search page
 * (every registry from one box). The hub is a door, not a destination — it
 * says what each tool is for and sends the reader through.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "../../components/chrome/site-layout";
import { componentsOn } from "../../generated/manifest";
import {
  THEME_CONFIGURATOR_HREF,
  componentDemoHref,
} from "../../systems/playground-links";
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

export const Route = createFileRoute("/playground/")({
  head: () =>
    routeHead(
      "Playground",
      "Try the system live — repaint it in the theme configurator, or search every registry from one box.",
    ),
  component: PlaygroundHub,
});

const TOOLS: {
  title: string;
  body: string;
  to: string;
  cta: string;
}[] = [
  {
    title: "Theme configurator",
    body: "Repaint the system: pick a seed, watch every role recompute, and take the tokens. Presets are validated before anything renders, so a theme cannot silently break contrast.",
    to: "/theme-configurator",
    cta: "Open the configurator",
  },
  {
    title: "Search",
    body: "Every registry from one box — components on both platforms, token roles, guides, and API entries — ranked and grouped, with suggestions when the box is empty.",
    to: "/search",
    cta: "Open search",
  },
];

function PlaygroundHub() {
  const web = componentsOn("web").length;
  const mobile = componentsOn("mobile").length;
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Playground</h1>
            <p className={`m-0 max-w-[62ch] ${T_LEAD} ${INK_SOFT}`}>
              Try the system live. Two tools: repaint it, or find anything in
              it.
            </p>
          </header>

          <section className="flex flex-col gap-3">
            <h2 id="the-tools" className={`m-0 ${T_SECTION} ${INK}`}>
              The tools
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className={`${CARD} flex flex-col gap-1 p-5 no-underline`}
                >
                  <span className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
                    {tool.title}
                  </span>
                  <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                    {tool.body}
                  </span>
                  <span
                    className={`m-0 mt-1 ${T_BODY_SM} text-(--md-sys-color-primary)`}
                  >
                    {tool.cta} →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/*
            Registry → playground: every registry entry opens here. The CLI
            registry and the search share the export name as key, so a search
            for any of the {web} web or {mobile} native exports lands on its
            component demo; web demos repaint in the configurator. Button is
            the worked example — its demo anchor is the pattern every entry
            follows.
          */}
          <section className="flex flex-col gap-3">
            <h2 id="registry" className={`m-0 ${T_SECTION} ${INK}`}>
              Registry → playground
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
              {web} web exports and {mobile} native exports, each openable by
              name. Search any export to land on its live demo — for example{" "}
              <a
                className="text-(--md-sys-color-primary) underline underline-offset-2"
                href={componentDemoHref("web", "button")}
              >
                the Button demo
              </a>
              — then repaint it in the{" "}
              <a
                className="text-(--md-sys-color-primary) underline underline-offset-2"
                href={THEME_CONFIGURATOR_HREF}
              >
                theme configurator
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
