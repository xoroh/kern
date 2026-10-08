/**
 * /components/web — the web platform view of the gallery.
 *
 * The same cards as /components, filtered to `@xoroh/kern`, plus the honest
 * coverage line: how many families actually carry a live demo. The number is
 * computed from the demo registry, never asserted (R4 — the coverage gap is
 * stated before anything implies parity of polish).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "../../../domains/shared/chrome/site-layout";
import {
  ComponentGallery,
  demoCoverage,
} from "../../../components/docs/component-gallery";
import { T_BODY_SM, T_LABEL_LG, T_PAGE } from "../../../domains/shared/systems/type-scale";
import { routeHead } from "../../../domains/shared/systems/seo";

export const Route = createFileRoute("/components/web/")({
  head: () =>
    routeHead("Web components", "Web components from @xoroh/kern, previewed live."),
  component: WebComponents,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const CHIP = `inline-flex items-center rounded-(--md-sys-shape-corner-full) border px-3 py-1 ${T_LABEL_LG}`;

function WebComponents() {
  const coverage = demoCoverage("web");
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[72rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Web components</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
              React on Base UI, exported from <code>@xoroh/kern</code>. Live
              demos for {coverage.withDemo} of {coverage.total} families — the
              rest say so on their card instead of showing an empty tile.
            </p>
            <nav
              className="flex flex-wrap items-center gap-2"
              aria-label="Platform"
            >
              <Link
                to="/components"
                className={`${CHIP} border-(--md-sys-color-outline) ${INK_SOFT} no-underline`}
              >
                All
              </Link>
              <span
                className={`${CHIP} border-(--md-sys-color-primary) bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container) no-underline`}
              >
                Web
              </span>
              <Link
                to="/components/mobile"
                className={`${CHIP} border-(--md-sys-color-outline) ${INK_SOFT} no-underline`}
              >
                Native
              </Link>
            </nav>
          </header>
          <ComponentGallery platform="web" />
        </div>
      </section>
    </SiteLayout>
  );
}
