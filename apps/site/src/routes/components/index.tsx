/**
 * /components — the component gallery.
 *
 * Registry-driven (Q5.7/Q7.5): the cards come from the content registry and
 * the generated manifest, grouped by the M3 purpose each family serves. This
 * replaces the hand-written two-card platform chooser, which told a reader
 * about the packages instead of showing them the components.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "../../components/chrome/site-layout";
import {
  ComponentGallery,
  GalleryLede,
} from "../../components/docs/component-gallery";
import { T_LABEL_LG, T_PAGE } from "../../type-scale";

export const Route = createFileRoute("/components/")({
  component: ComponentsGallery,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const CHIP = `inline-flex items-center rounded-(--md-sys-shape-corner-full) border px-3 py-1 ${T_LABEL_LG}`;

function ComponentsGallery() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[72rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Components</h1>
            <GalleryLede />
            <nav
              className="flex flex-wrap items-center gap-2"
              aria-label="Platform"
            >
              <span
                className={`${CHIP} border-(--md-sys-color-primary) bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container) no-underline`}
              >
                All
              </span>
              <Link
                to="/components/web"
                className={`${CHIP} border-(--md-sys-color-outline) ${INK_SOFT} no-underline`}
              >
                Web
              </Link>
              <Link
                to="/components/mobile"
                className={`${CHIP} border-(--md-sys-color-outline) ${INK_SOFT} no-underline`}
              >
                Native
              </Link>
            </nav>
          </header>
          <ComponentGallery />
        </div>
      </section>
    </SiteLayout>
  );
}
