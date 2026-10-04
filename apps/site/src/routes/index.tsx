import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "../components/chrome/site-layout";
import { ComponentGallery } from "../components/docs/component-gallery";
import { Hero } from "../components/home/hero";
import { WEB_DOCS } from "../content";
import { COMPONENT_COUNT } from "../generated/manifest";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const documented = [...WEB_DOCS].reduce((n, doc) => n + doc.parts.length, 0);
  return (
    <SiteLayout>
      <Hero />
      <section
        className="px-4 py-4 sm:px-6 sm:py-6"
        aria-labelledby="gallery-heading"
      >
        <div className="rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <p className="m-0 text-sm font-medium tracking-[0.18em] text-(--md-sys-color-on-surface-variant) uppercase">
              Components
            </p>
            <h2
              id="gallery-heading"
              className="m-0 text-2xl font-semibold text-(--md-sys-color-on-surface)"
            >
              Documented family by family
            </h2>
            <p className="m-0 max-w-[62ch] text-(--md-sys-color-on-surface-variant)">
              Each page runs the same grammar — metadata, live preview,
              installation, anatomy, usage, examples, props, theming,
              accessibility, conformance — and every number on it is checked
              against the package rather than typed in. {documented} of{" "}
              {COMPONENT_COUNT} exports have a page behind them so far.
            </p>
          </header>
          <div className="mt-8">
            <ComponentGallery platform="web" />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
