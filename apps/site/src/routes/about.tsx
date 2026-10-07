/**
 * /about — what kern is, who makes it, and how to reach the project.
 *
 * Honest content only: the one-paragraph story, the MIT licence fact (same
 * source the footer uses), and the two real project links. No community
 * stats, no testimonials, nothing invented.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "../components/chrome/site-layout";
import { REPO_LICENSE } from "../generated/changelog";
import { T_BODY, T_LABEL, T_PAGE, T_SECTION } from "../systems/type-scale";

export const Route = createFileRoute("/about")({
  component: About,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";

function About() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-12 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <p className={`m-0 ${T_LABEL} ${INK_SOFT} uppercase`}>About</p>
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>About kern</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Kern is the reference Material 3 design system by Xoroh — one
              contract, web and native. It follows the Material 3 spec and
              documents every deliberate departure in the open.
            </p>
          </header>
          <div className="flex flex-col gap-3">
            <h2 id="license" className={`m-0 ${T_SECTION} ${INK}`}>
              License
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Kern is open source under the {REPO_LICENSE} license. The full
              license text ships with the repository.
            </p>
          </div>
          <nav aria-label="Project links" className="flex flex-col gap-3">
            <h2 id="project-links" className={`m-0 ${T_SECTION} ${INK}`}>
              Project links
            </h2>
            <p className={`m-0 ${T_BODY} ${INK_SOFT}`}>
              <a
                href="https://github.com/xoroh/kern"
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                GitHub — source, issues, and contributions
              </a>
            </p>
            <p className={`m-0 ${T_BODY} ${INK_SOFT}`}>
              <a
                href="https://xoroh.org"
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                xoroh.org — the organisation behind kern
              </a>
            </p>
            <p className={`m-0 ${T_BODY} ${INK_SOFT}`}>
              <Link
                to="/components"
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                Browse the components
              </Link>{" "}
              to see what the system ships today.
            </p>
          </nav>
        </div>
      </section>
    </SiteLayout>
  );
}
