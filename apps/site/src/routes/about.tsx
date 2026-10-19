/**
 * /about — what kern is, who makes it, and how to reach the project.
 *
 * Honest content only: the one-paragraph story, the MIT licence fact (same
 * source the footer uses), and the two real project links. No community
 * stats, no testimonials, nothing invented.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Kicker } from "../components/chrome/kicker";
import { PageCard } from "../domains/shared/chrome/page-card";
import { SiteLayout } from "../domains/shared/chrome/site-layout";
import { routeHead } from "../domains/shared/systems/seo";
import {
  T_BODY,
  T_PAGE,
  T_SECTION,
} from "../domains/shared/systems/type-scale";
import { LINK } from "../domains/shared/systems/ui";
import { REPO_LICENSE } from "../generated/changelog";

export const Route = createFileRoute("/about")({
  head: () =>
    routeHead(
      "About",
      "What kern is, who makes it, and how to reach the project.",
    ),
  component: About,
});

const INK = "text-(--sys-color-on-surface)";
const INK_SOFT = "text-(--sys-color-on-surface-variant)";

function About() {
  return (
    <SiteLayout>
      <PageCard gap={12}>
        <header className="site-docs-welcome flex flex-col gap-3">
          <Kicker className={INK_SOFT}>About</Kicker>
          <h1 className={`m-0 ${T_PAGE} ${INK}`}>About kern</h1>
          <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
            Kern is the reference Material 3 design system by Xoroh — one
            contract, web and native. It follows the Material 3 spec and
            documents every deliberate departure in the open.
          </p>
        </header>
        <div className="flex flex-col gap-3 rounded-(--sys-shape-corner-extra-large) bg-(--sys-color-surface-container-low) p-6">
          <h2 id="license" className={`m-0 ${T_SECTION} ${INK}`}>
            License
          </h2>
          <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
            Kern is open source under the {REPO_LICENSE} license. The full
            license text ships with the repository.
          </p>
        </div>
        <nav
          aria-label="Project links"
          className="flex flex-col gap-3 rounded-(--sys-shape-corner-extra-large) bg-(--sys-color-surface-container-low) p-6"
        >
          <h2 id="project-links" className={`m-0 ${T_SECTION} ${INK}`}>
            Project links
          </h2>
          <p className={`m-0 ${T_BODY} ${INK_SOFT}`}>
            <a href="https://github.com/xoroh/kern" className={LINK}>
              GitHub — source, issues, and contributions
            </a>
          </p>
          <p className={`m-0 ${T_BODY} ${INK_SOFT}`}>
            <a href="https://xoroh.org" className={LINK}>
              xoroh.org — the organisation behind kern
            </a>
          </p>
          <p className={`m-0 ${T_BODY} ${INK_SOFT}`}>
            <Link to="/components" className={LINK}>
              Browse the components
            </Link>{" "}
            to see what the system ships today.
          </p>
        </nav>
      </PageCard>
    </SiteLayout>
  );
}
