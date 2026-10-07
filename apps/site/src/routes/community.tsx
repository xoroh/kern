/**
 * /community — where the project lives and how to take part.
 *
 * Links the real contribution guide (CONTRIBUTING.md in the repo, mirrored on
 * GitHub) instead of duplicating it. Summarises only what is stable enough to
 * state on a page: issues live on GitHub, PRs need a changeset + docs + green
 * gates. No stats, no testimonials, nothing invented.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Kicker } from "../components/chrome/kicker";
import { SiteLayout } from "../components/chrome/site-layout";
import { routeHead } from "../systems/seo";
import { T_BODY, T_PAGE, T_SECTION } from "../systems/type-scale";

export const Route = createFileRoute("/community")({
  head: () =>
    routeHead("Community", "Where the project lives and how to take part."),
  component: Community,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const REPO = "https://github.com/xoroh/kern";

function Community() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-12 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <Kicker className={INK_SOFT}>Community</Kicker>
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Community</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Kern is built in the open. Issues, discussions, and contributions
              all happen on GitHub — this page points at the real places.
            </p>
          </header>
          <div className="flex flex-col gap-3">
            <h2 id="report-an-issue" className={`m-0 ${T_SECTION} ${INK}`}>
              Report an issue
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Found a bug or a gap against the Material 3 spec?{" "}
              <a
                href={`${REPO}/issues`}
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                File it on the GitHub issue tracker
              </a>
              . Check the component&apos;s page first — documented departures
              from M3 carry their deviation id, so a deliberate choice reads as
              one, not as a bug.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 id="contribute" className={`m-0 ${T_SECTION} ${INK}`}>
              Contribute
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              The full guide is{" "}
              <a
                href={`${REPO}/blob/main/CONTRIBUTING.md`}
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                CONTRIBUTING.md
              </a>{" "}
              in the repository. The short version: every PR touching a
              published package adds a changeset, updates the matching docs in
              the same change, and keeps lint, types, tests, and the design-law
              gates green.
            </p>
          </div>
          <nav aria-label="Keep exploring" className="flex flex-col gap-3">
            <h2 id="keep-exploring" className={`m-0 ${T_SECTION} ${INK}`}>
              Keep exploring
            </h2>
            <p className={`m-0 ${T_BODY} ${INK_SOFT}`}>
              <Link
                to="/about"
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                About kern
              </Link>{" "}
              for the story and license, or{" "}
              <Link
                to="/docs"
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                start the docs
              </Link>{" "}
              to learn the system.
            </p>
          </nav>
        </div>
      </section>
    </SiteLayout>
  );
}
