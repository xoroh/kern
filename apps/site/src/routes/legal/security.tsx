/**
 * /legal/security — the security policy, summarised from SECURITY.md.
 *
 * §19: "correctness is the design". The established pattern (community page)
 * is to summarise what is stable enough to state and link the repo file
 * rather than duplicate it — a duplicated policy is a copy that drifts. What
 * is stable: private disclosure via GitHub Security Advisories, 72-hour
 * acknowledgement, pre-1.0 no-backport rule, and never a public issue for an
 * unpatched vulnerability.
 */
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "../../components/chrome/site-layout";
import { T_BODY, T_LABEL, T_PAGE, T_SECTION } from "../../systems/type-scale";

export const Route = createFileRoute("/legal/security")({
  component: Security,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const REPO = "https://github.com/xoroh/kern";
const POLICY = `${REPO}/blob/main/SECURITY.md`;

function Security() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-12 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <p className={`m-0 ${T_LABEL} ${INK_SOFT} uppercase`}>Legal</p>
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Security</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              How to report a vulnerability, and what support to expect. The
              full policy lives in{" "}
              <a
                href={POLICY}
                className="text-(--md-sys-color-primary) no-underline hover:underline"
                rel="noreferrer"
                target="_blank"
              >
                SECURITY.md
              </a>{" "}
              — this page states what is stable, and links the rest.
            </p>
          </header>

          <div className="flex flex-col gap-3">
            <h2 id="report" className={`m-0 ${T_SECTION} ${INK}`}>
              Report privately
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Report vulnerabilities through{" "}
              <a
                href={`${REPO}/security/advisories/new`}
                className="text-(--md-sys-color-primary) no-underline hover:underline"
                rel="noreferrer"
                target="_blank"
              >
                GitHub Security Advisories
              </a>
              , never a public issue. Include the affected package and version,
              the platform and runtime, steps to reproduce with an impact
              assessment, and whether untrusted input can reach it. Expect
              acknowledgement within 72 hours.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 id="supported" className={`m-0 ${T_SECTION} ${INK}`}>
              What is supported
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Kern is pre-1.0. Security fixes target the latest published
              release — there are no backport guarantees for older versions.
              Upgrade every <code>@xoroh/*</code> package you depend on to the
              latest <code>0.x</code> before reporting.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
