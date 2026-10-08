/**
 * /foundations/icons — the icon gallery as its own page.
 *
 * The grid itself is `IconGallery`: counts, names, and glyphs all come from
 * `@xoroh/kern-icons`' own registry at build time, so this route is chrome
 * plus context only. The same gallery also renders inside the icons guide;
 * this page is the deep-linkable home for it.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Kicker } from "../../components/chrome/kicker";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { IconGallery } from "../../components/icons/icon-gallery";
import { routeHead } from "../../domains/shared/systems/seo";
import { T_BODY, T_PAGE } from "../../domains/shared/systems/type-scale";

export const Route = createFileRoute("/foundations/icons")({
  head: () =>
    routeHead("Icons", "The icon gallery — counts, names, and glyphs from the registry."),
  component: Icons,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";

function Icons() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <Kicker className={INK_SOFT}>Icons</Kicker>
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Icon gallery</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Every icon in the set, searchable. Names and counts are read from
              the icon package at build time — the grid paints the first 120 for
              server-render cost and the filter reaches the rest.
            </p>
          </header>
          <IconGallery />
        </div>
      </section>
    </SiteLayout>
  );
}
