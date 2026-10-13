/**
 * /components — the component gallery.
 *
 * Registry-driven (Q5.7/Q7.5): the cards come from the content registry and
 * the generated manifest, grouped by the M3 purpose each family serves. This
 * replaces the hand-written two-card platform chooser, which told a reader
 * about the packages instead of showing them the components.
 */
import { createFileRoute } from "@tanstack/react-router";
import {
  ComponentGallery,
  GalleryLede,
  PlatformSwitcher,
} from "../../components/docs/component-gallery";
import { PageCard } from "../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import { T_PAGE } from "../../domains/shared/systems/type-scale";
import { INK } from "../../domains/shared/systems/ui";

export const Route = createFileRoute("/components/")({
  head: () =>
    routeHead(
      "Components",
      "One page per component family — metadata, preview, usage, props, theming.",
    ),
  component: ComponentsGallery,
});

function ComponentsGallery() {
  return (
    <SiteLayout>
      <PageCard width="wide">
        <header className="flex flex-col gap-3">
          <h1 className={`m-0 ${T_PAGE} ${INK}`}>Components</h1>
          <GalleryLede />
          <PlatformSwitcher />
        </header>
        <ComponentGallery />
      </PageCard>
    </SiteLayout>
  );
}
