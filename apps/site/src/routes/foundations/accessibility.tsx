/**
 * /foundations/accessibility — the accessibility statement for kern.
 *
 * Honest content only. What the repository can evidence today: a contrast
 * gate over the token pairs (`bun run check:contrast`), and the verified
 * limits of the suite (no e2e/browser layer, no visual regression — see
 * `docs/verification-limits.md`, quoted on /docs/contributing). What it
 * cannot evidence: a WCAG conformance level. That claim needs an audit
 * first, so this page makes none — it states the target, the check that
 * runs, the known gap, and where to report barriers.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Kicker } from "../../components/chrome/kicker";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import { T_BODY, T_CODE, T_PAGE, T_SECTION } from "../../domains/shared/systems/type-scale";

export const Route = createFileRoute("/foundations/accessibility")({
  head: () =>
    routeHead(
      "Accessibility",
      "Kern targets WCAG 2.2 AA — what is checked, what is not, and how to report a barrier.",
    ),
  component: Accessibility,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const LINK = "text-(--md-sys-color-primary) no-underline hover:underline";
const REPO = "https://github.com/xoroh/kern";
const CODE = `rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface-container-high) px-1.5 py-0.5 ${T_CODE}`;

function Accessibility() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-12 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <Kicker className={INK_SOFT}>Accessibility</Kicker>
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>
              Accessibility statement
            </h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Kern targets WCAG 2.2 AA for everything it ships. This page states
              what is checked today, what is not yet checked, and how to report
              a barrier. It claims no conformance level — that needs an audit
              first.
            </p>
          </header>

          <div className="flex flex-col gap-3">
            <h2 id="checked-today" className={`m-0 ${T_SECTION} ${INK}`}>
              Checked today
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Every token pair ships under a contrast gate:{" "}
              <code className={CODE}>bun run check:contrast</code> asserts the
              colour pairs in the theme meet their ratios, and it runs as a
              required per-PR gate (see{" "}
              <a href="/docs/contributing" className={LINK}>
                contributing
              </a>
              ). The M3 state-layer opacities — including the 38% disabled layer
              — are asserted by <code className={CODE}>check:kern</code>.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 id="known-gaps" className={`m-0 ${T_SECTION} ${INK}`}>
              Known gaps
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              The test suite has <strong>no e2e/browser layer</strong> and no
              visual regression coverage (
              <a
                href={`${REPO}/blob/main/docs/verification-limits.md`}
                className={LINK}
              >
                docs/verification-limits.md
              </a>
              ). Keyboard order, focus visibility, and screen-reader behaviour
              are therefore reviewed by hand, not proven by a gate. Until an
              independent audit happens, treat this statement as intent plus the
              contrast gate — not certification.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 id="report-a-barrier" className={`m-0 ${T_SECTION} ${INK}`}>
              Report a barrier
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Found an accessibility barrier in kern or this site?{" "}
              <a href={`${REPO}/issues`} className={LINK}>
                File it on the GitHub issue tracker
              </a>{" "}
              using the bug template — say what you used (keyboard, screen
              reader and version, browser) and what blocked you. For a
              security-sensitive report, see{" "}
              <a href={`${REPO}/blob/main/SECURITY.md`} className={LINK}>
                SECURITY.md
              </a>{" "}
              instead of a public issue.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
