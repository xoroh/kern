/**
 * /changelog — what is changing in kern, rendered from the generated
 * changeset index (source of truth: .changeset/*.md).
 *
 * Honest content only: pending changeset summaries with their bump level.
 * No dates, no version numbers, no invented release history.
 */
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "../components/chrome/site-layout";
import { RECENT_CHANGES } from "../generated/changelog";
import { T_BODY, T_LABEL, T_PAGE, T_SECTION } from "../systems/type-scale";

export const Route = createFileRoute("/changelog")({
  component: Changelog,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";

const BUMP_STYLES: Record<string, string> = {
  major:
    "bg-(--md-sys-color-error-container) text-(--md-sys-color-on-error-container)",
  minor:
    "bg-(--md-sys-color-tertiary-container) text-(--md-sys-color-on-tertiary-container)",
  patch:
    "bg-(--md-sys-color-surface-container-high) text-(--md-sys-color-on-surface-variant)",
};

function Changelog() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-12 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <p className={`m-0 ${T_LABEL} ${INK_SOFT} uppercase`}>Changelog</p>
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Changelog</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Pending changes, straight from the changesets in the repository.
              Nothing here is a release until it ships.
            </p>
          </header>
          {RECENT_CHANGES.length === 0 ? (
            <p className={`m-0 ${T_BODY} ${INK_SOFT}`}>
              No pending changes. The tree is quiet.
            </p>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-6 p-0">
              {RECENT_CHANGES.map((entry) => (
                <li key={entry.id} className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex h-6 items-center rounded-(--md-sys-shape-corner-full) px-2 text-xs font-medium ${BUMP_STYLES[entry.bump] ?? BUMP_STYLES.patch}`}
                    >
                      {entry.bump}
                    </span>
                    <h2 id={entry.id} className={`m-0 ${T_SECTION} ${INK}`}>
                      {entry.id}
                    </h2>
                  </div>
                  <p className={`m-0 ${T_BODY} ${INK_SOFT}`}>{entry.summary}</p>
                  <p className={`m-0 ${T_LABEL} ${INK_SOFT}`}>
                    {entry.packages.join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
