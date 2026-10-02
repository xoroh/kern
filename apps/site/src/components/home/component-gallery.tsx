/**
 * The component gallery — the showcase surface under the hero.
 *
 * It is generated from the content registry, not from a hand-kept list: a
 * component appears here the moment it has a documentation page, and the
 * counts on the cards and in the heading are derived from the same source the
 * coverage gate reads. That is the point of the "add a data folder" contract —
 * the gallery cannot drift from the docs, because it is the docs.
 *
 * Undocumented inventory rows are counted and shown as the work remaining
 * rather than hidden. A showcase that only shows what is finished is a
 * screenshot of the past.
 */
import { Link } from "@tanstack/react-router";
import { WEB_DOCS } from "../../content";
import { COMPONENT_COUNT } from "../../generated/manifest";

/** One card per documented family, sorted by name for a stable grid. */
function documentedFamilies() {
  return [...WEB_DOCS].sort((a, b) => a.name.localeCompare(b.name));
}

export function ComponentGallery() {
  const families = documentedFamilies();
  const documented = families.reduce((n, doc) => n + doc.parts.length, 0);

  return (
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
            Each page runs the same grammar — metadata strip, showcase,
            features, customization, deviations, API — and every number on it is
            checked against the package rather than typed in. {documented} of{" "}
            {COMPONENT_COUNT} exports have a page behind them so far.
          </p>
        </header>

        <ul className="mt-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {families.map((doc) => (
            <li key={doc.slug}>
              <Link
                to="/components/$platform/$component"
                params={{ platform: "web", component: doc.slug }}
                className="flex h-full flex-col gap-2 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) p-5 no-underline transition-colors hover:bg-(--md-sys-color-surface-container-high)"
              >
                <span className="font-semibold text-(--md-sys-color-on-surface)">
                  {doc.name}
                </span>
                <span className="text-sm text-(--md-sys-color-on-surface-variant)">
                  {doc.oneLiner}
                </span>
                <span className="mt-auto pt-2 font-mono text-xs text-(--md-sys-color-secondary)">
                  {doc.parts.length === 1
                    ? "1 export"
                    : `${doc.parts.length} exports`}
                  {doc.deviations && doc.deviations.length > 0
                    ? ` · ${doc.deviations.length} deviation${doc.deviations.length === 1 ? "" : "s"}`
                    : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
