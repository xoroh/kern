/**
 * /changelog — what is changing in kern, rendered from the generated
 * changeset index (source of truth: .changeset/*.md).
 *
 * Honest content only: pending changeset summaries with their bump level.
 * No dates, no version numbers, no invented release history.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Kicker } from "../components/chrome/kicker";
import { PageCard } from "../domains/shared/chrome/page-card";
import { SiteLayout } from "../domains/shared/chrome/site-layout";
import { routeHead } from "../domains/shared/systems/seo";
import {
  T_BODY,
  T_LABEL,
  T_PAGE,
  T_SECTION,
} from "../domains/shared/systems/type-scale";
import { RECENT_CHANGES } from "../generated/changelog";

export const Route = createFileRoute("/changelog")({
  head: () => routeHead("Changelog", "What changed, newest first."),
  component: Changelog,
});

const INK = "text-(--sys-color-on-surface)";
const INK_SOFT = "text-(--sys-color-on-surface-variant)";

/**
 * The one bump badge — every bump level wears the same neutral
 * `secondary-container` treatment (no per-level color semantics; the level
 * word is the information).
 */
const BUMP_BADGE = `inline-flex h-8 items-center rounded-(--sys-shape-corner-full) bg-(--sys-color-secondary-container) px-3 ${T_LABEL} text-(--sys-color-on-secondary-container)`;

function Changelog() {
  return (
    <SiteLayout>
      <PageCard gap={12}>
        <header className="site-docs-welcome flex flex-col gap-3">
          <Kicker className={INK_SOFT}>Changelog</Kicker>
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
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {RECENT_CHANGES.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-col gap-2.5 rounded-(--sys-shape-corner-extra-large) border border-(--sys-color-outline-variant)/70 bg-(--sys-color-surface-container-low) p-5"
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={BUMP_BADGE}>{entry.bump}</span>
                  <h2 id={entry.id} className={`m-0 ${T_SECTION} ${INK}`}>
                    {entry.id}
                  </h2>
                </div>
                <p className={`m-0 ${T_BODY} ${INK_SOFT}`}>{entry.summary}</p>
                <p className={`m-0 font-mono ${T_LABEL} ${INK_SOFT}`}>
                  {entry.packages.join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </PageCard>
    </SiteLayout>
  );
}
