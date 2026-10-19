/**
 * /components — the component gallery.
 *
 * Registry-driven (Q5.7/Q7.5): the cards come from the content registry and
 * the generated manifest, grouped by the M3 purpose each family serves. This
 * replaces the hand-written two-card platform chooser, which told a reader
 * about the packages instead of showing them the components.
 *
 * Platform filtering is view state on this one route (`?platform=web|mobile`,
 * 018): there is exactly one gallery URL, and the switcher links keep every
 * filter position a destination. The former platform index routes were
 * deleted outright (D-051 — no redirects before 1.0).
 */
import { createFileRoute } from "@tanstack/react-router";
import {
  ComponentGallery,
  GalleryLede,
  type GalleryPlatform,
  PlatformSwitcher,
} from "../../components/docs/component-gallery";
import { PageCard } from "../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import { T_PAGE } from "../../domains/shared/systems/type-scale";
import { INK } from "../../domains/shared/systems/ui";

export const Route = createFileRoute("/components/")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { platform?: GalleryPlatform } => ({
    platform:
      search.platform === "web" || search.platform === "mobile"
        ? search.platform
        : undefined,
  }),
  head: () =>
    routeHead(
      "Components",
      "One page per component family — metadata, preview, usage, props, theming.",
    ),
  component: ComponentsGallery,
});

function ComponentsGallery() {
  const { platform } = Route.useSearch();
  return (
    <SiteLayout>
      <PageCard width="wide">
        <header className="flex flex-col gap-3">
          <h1 className={`m-0 ${T_PAGE} ${INK}`}>Components</h1>
          <GalleryLede />
          <PlatformSwitcher platform={platform} />
        </header>
        <ComponentGallery platform={platform} />
      </PageCard>
    </SiteLayout>
  );
}
