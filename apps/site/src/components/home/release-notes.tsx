/**
 * Release notes band — what the system is, and what just changed.
 *
 * Maturity counts come from the generated maturity table (the same source
 * the state chips resolve against), and the excerpts are the newest pending
 * changesets with their bump and packages. Both are read, never typed — a
 * release that moves an export from Preview to Stable updates this band with
 * no site edit.
 */
import { MATURITY_BY_STATE } from "../../systems/maturity";
import { RECENT_CHANGES } from "../../generated/changelog";
import { Kicker } from "../chrome/kicker";
import {
  T_BODY,
  T_BODY_SM,
  T_CODE,
  T_LABEL_LG,
  T_SECTION,
  T_SMALL_TITLE,
} from "../../systems/type-scale";

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";

const BUMP_LABEL = {
  major: "Breaking",
  minor: "Feature",
  patch: "Fix",
} as const;

export function ReleaseNotes() {
  const latest = RECENT_CHANGES.slice(0, 3);
  return (
    <section
      className="px-4 py-4 sm:px-6 sm:py-6"
      aria-labelledby="release-notes-heading"
    >
      <div className="rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
        <header className="flex flex-col gap-3">
          <Kicker>Now shipping</Kicker>
          <h2
            id="release-notes-heading"
            className={`m-0 ${T_SECTION} ${INK}`}
          >
            Preview, and moving
          </h2>
          <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
            {MATURITY_BY_STATE.Stable.length} stable,{" "}
            {MATURITY_BY_STATE.Experimental.length} experimental, and{" "}
            {MATURITY_BY_STATE.Preview.length} preview exports — counted from
            the maturity table, not asserted here. The newest pending changes:
          </p>
        </header>
        <ul className="m-0 mt-8 flex list-none flex-col gap-4 p-0">
          {latest.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-col gap-1 rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) p-5"
            >
              <p className={`m-0 ${T_SMALL_TITLE} ${INK}`}>
                {BUMP_LABEL[entry.bump]} — {entry.packages.join(", ")}
              </p>
              <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>{entry.summary}</p>
              <p className={`m-0 ${T_CODE} ${INK_SOFT}`}>{entry.id}</p>
            </li>
          ))}
        </ul>
        <p className={`m-0 mt-6 ${T_BODY} ${INK_SOFT}`}>
          <a
            href="/changelog"
            className={`${T_LABEL_LG} text-(--md-sys-color-primary) no-underline hover:underline`}
          >
            All {RECENT_CHANGES.length} unreleased changes →
          </a>
        </p>
      </div>
    </section>
  );
}
