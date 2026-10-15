/**
 * /components/web — the web platform view of the gallery.
 *
 * The same cards as /components, filtered to `@xoroh/kern`, plus the honest
 * coverage line: how many families actually carry a live demo. The number is
 * computed from the demo registry, never asserted (R4 — the coverage gap is
 * stated before anything implies parity of polish).
 */
import { createFileRoute } from "@tanstack/react-router";
import {
  ComponentGallery,
  demoCoverage,
  PlatformSwitcher,
} from "../../../components/docs/component-gallery";
import { PageCard } from "../../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../../domains/shared/chrome/site-layout";
import { routeHead } from "../../../domains/shared/systems/seo";
import { T_BODY_SM, T_PAGE } from "../../../domains/shared/systems/type-scale";
import { INK, INK_SOFT } from "../../../domains/shared/systems/ui";

export const Route = createFileRoute("/components/web/")({
  head: () =>
    routeHead(
      "Web components",
      "Web components from @xoroh/kern, previewed live.",
    ),
  component: WebComponents,
});

function WebComponents() {
  const coverage = demoCoverage("web");
  return (
    <SiteLayout>
      <PageCard width="wide">
        <header className="flex flex-col gap-3">
          <h1 className={`m-0 ${T_PAGE} ${INK}`}>Web components</h1>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            React on Base UI, exported from <code>@xoroh/kern</code>. Live demos
            for {coverage.withDemo} of {coverage.total} families — the rest say
            so on their card instead of showing an empty tile.
          </p>
          <PlatformSwitcher platform="web" />
        </header>
        <ComponentGallery platform="web" />
      </PageCard>
    </SiteLayout>
  );
}
