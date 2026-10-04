/**
 * /search — the deep-linkable search page (`/search?q=`).
 *
 * Same ranking as the ⌘K palette (both call `searchSite` over the same
 * build-time index), rendered server-side so a shared link works with no
 * JavaScript and crawlers see real destinations. The palette links here via
 * "See all results"; this page links back out to every hit.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { SiteLayout } from "../components/chrome/site-layout";
import { ResultText } from "../components/search/result-text";
import { buildSearchIndex, SEARCH_SUGGESTIONS, searchSite } from "../systems/search";
import { T_BODY_SM, T_PAGE, T_SECTION } from "../systems/type-scale";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  component: SearchPage,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";

function SearchPage() {
  const { q } = Route.useSearch();
  const index = useMemo(() => buildSearchIndex(), []);
  const groups = useMemo(() => searchSite(q, index), [q, index]);

  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Search</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
              {q.trim() === ""
                ? "Every component, token, guide, API entry, block and page — from one box. Press ⌘K anywhere to search without leaving the page."
                : `${groups.flatMap((g) => g.entries).length} result(s) for “${q.trim()}”.`}
            </p>
          </header>
          {q.trim() === "" || groups.length === 0 ? (
            <div className="flex flex-col gap-3">
              {q.trim() !== "" ? (
                <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                  Nothing matches. Try one of these instead:
                </p>
              ) : null}
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {SEARCH_SUGGESTIONS.map((s) => (
                  <li key={s.href}>
                    <Link
                      to={s.href}
                      className={`text-(--md-sys-color-on-surface) no-underline hover:underline`}
                    >
                      {s.title}
                    </Link>
                    <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                      {" "}
                      · {s.hint}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            groups.map((g) => (
              <section key={g.group} className="flex flex-col gap-2">
                <h2
                  id={`results-${g.group.toLowerCase()}`}
                  className={`m-0 ${T_SECTION} ${INK}`}
                >
                  {g.group}
                </h2>
                <ul className="m-0 flex list-none flex-col gap-1 p-0">
                  {g.entries.map((entry) => (
                    <li
                      key={`${entry.title}:${entry.href}`}
                      className="min-w-0"
                    >
                      <Link
                        to={entry.href}
                        className="group block min-w-0 text-(--md-sys-color-on-surface) no-underline"
                      >
                        <ResultText entry={entry} query={q} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
