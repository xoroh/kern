/**
 * /core — the Core tier index (D1003/D1004).
 *
 * Pure M3 primitives only: each card links to its family page at
 * `/core/<slug>`. Composite families live at `/components`; blocks at
 * `/blocks` (behind `/showcase` until step 5). The tier switcher above the
 * grid is the same `TierTabs` the other indexes render — one switcher,
 * three destinations, no duplicate galleries.
 *
 * Platform filtering is view state on this one route (`?platform=`, 018),
 * same as the components gallery: one index URL, not one route per filter.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ComponentGallery,
  type GalleryPlatform,
  PlatformSwitcher,
  TierTabs,
} from "../../components/docs/component-gallery";
import { PageCard } from "../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import {
  T_BODY,
  T_BODY_SM,
  T_KICKER,
  T_LABEL_LG,
  T_PAGE,
} from "../../domains/shared/systems/type-scale";
import {
  CARD,
  FOCUS_RING,
  INK,
  INK_SOFT,
  TRANSITION,
} from "../../domains/shared/systems/ui";

export const Route = createFileRoute("/core/")({
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
      "Core",
      "The M3 primitives — buttons, fields, dialogs, navigation and the rest. Composites live under Components, complete pages under Blocks.",
    ),
  component: CoreIndex,
});

function CoreIndex() {
  const { platform } = Route.useSearch();
  return (
    <SiteLayout>
      <PageCard width="wide" gap={12}>
        <header className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Core</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              The M3 primitives — everything here is built directly from tokens
              and foundations, composing nothing. Composites built from these
              primitives live under Components; complete, copy-ready pages live
              under Blocks.
            </p>
          </div>
          <TierTabs active="core" />
          <PlatformSwitcher platform={platform} base="/core" />
        </header>
        <Link
          to="/core/buttons"
          className={`${CARD} flex flex-col justify-between gap-3 p-6 no-underline hover:bg-(--sys-color-surface-container) sm:flex-row sm:items-center ${TRANSITION} ${FOCUS_RING}`}
        >
          <div className="flex flex-col gap-1">
            <span
              className={`uppercase text-(--sys-color-primary) ${T_KICKER}`}
            >
              Flagship Category Showcase · M3 Expressive
            </span>
            <span className={`${T_LABEL_LG} ${INK}`}>
              Buttons &amp; PulseButton Interactive Showcase →
            </span>
            <span className={`${T_BODY_SM} ${INK_SOFT}`}>
              Explore the 5-step M3 Expressive size ladder (32px–136px),
              corner-morphing Button vs shape-locked PulseButton, 5×5
              variant/color state matrix, SplitButton, ButtonGroup, and FAB
              family in one interactive workbench.
            </span>
          </div>
        </Link>
        <ComponentGallery platform={platform} tier="core" />
      </PageCard>
    </SiteLayout>
  );
}
