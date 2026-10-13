/**
 * /components/mobile — the native platform view of the gallery.
 *
 * The same cards as /components, filtered to `@xoroh/kern-native`, keeping the
 * export-level honesty audit this page started with: every export is either
 * previewed live or carries a stated reason, and anything unaccounted for is
 * named in the open, not absorbed into a tile. Previews render the real
 * components through react-native-web, so they cannot drift from the shipped
 * code the way a committed screenshot can (Q4.1).
 */
import { createFileRoute } from "@tanstack/react-router";
import {
  ComponentGallery,
  demoCoverage,
  PlatformSwitcher,
} from "../../../components/docs/component-gallery";
import { MOBILE_DEMOS, PREVIEW_REASONS } from "../../../demos/mobile/registry";
import { PageCard } from "../../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../../domains/shared/chrome/site-layout";
import { routeHead } from "../../../domains/shared/systems/seo";
import {
  T_BODY_SM,
  T_LABEL,
  T_PAGE,
  T_SECTION,
} from "../../../domains/shared/systems/type-scale";
import { INK, INK_SOFT } from "../../../domains/shared/systems/ui";
import { componentsOn } from "../../../generated/manifest";

export const Route = createFileRoute("/components/mobile/")({
  head: () =>
    routeHead(
      "React Native components",
      "Native components from @xoroh/kern-native, previewed live.",
    ),
  component: MobileComponents,
});

const STAT = `inline-flex items-center rounded-(--md-sys-shape-corner-full) border border-(--md-sys-color-outline) px-3 py-1 ${T_LABEL} ${INK_SOFT}`;

function MobileComponents() {
  const rows = componentsOn("mobile");
  const previewed = rows.filter((c) => MOBILE_DEMOS[c.export]);
  const reasoned = rows.filter(
    (c) => !MOBILE_DEMOS[c.export] && PREVIEW_REASONS[c.export],
  );
  const unaccounted = rows.filter(
    (c) => !MOBILE_DEMOS[c.export] && !PREVIEW_REASONS[c.export],
  );
  const coverage = demoCoverage("mobile");

  return (
    <SiteLayout>
      <PageCard width="wide">
        <header className="flex flex-col gap-3">
          <h1 className={`m-0 ${T_PAGE} ${INK}`}>React Native components</h1>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            React Native on StyleSheet, exported from{" "}
            <code>@xoroh/kern-native</code>. Live previews for{" "}
            {coverage.withDemo} of {coverage.total} families; every preview
            renders the real component through react-native-web.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className={STAT}>{rows.length} exports</span>
            <span className={STAT}>{previewed.length} live previews</span>
            <span className={STAT}>{reasoned.length} with a stated reason</span>
            {unaccounted.length > 0 ? (
              <span className={STAT}>{unaccounted.length} unaccounted</span>
            ) : null}
          </div>
          <PlatformSwitcher platform="mobile" />
        </header>

        {unaccounted.length > 0 ? (
          <div className="flex flex-col gap-2 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-error) bg-(--md-sys-color-error-container) p-4 text-(--md-sys-color-on-error-container)">
            <h2
              id="neither-previewed-nor-explained"
              className={`m-0 ${T_SECTION}`}
            >
              Neither previewed nor explained
            </h2>
            <p className={`m-0 ${T_BODY_SM}`}>
              {unaccounted.map((c) => c.export).join(", ")}
            </p>
          </div>
        ) : null}

        <ComponentGallery platform="mobile" />
      </PageCard>
    </SiteLayout>
  );
}
