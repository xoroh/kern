/**
 * /legal/license — the licence, rendered from the repo's own LICENSE files.
 *
 * §19: "correctness is the design". The full text below is the root LICENSE
 * verbatim (generated, not pasted — a pasted licence is a copy that drifts).
 * The per-package table exists for the day packages ever differ; today it
 * reads seven MITs, which is itself the honest answer.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Kicker } from "../../components/chrome/kicker";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { LICENSE_TEXT, PACKAGE_LICENSES } from "../../generated/legal";
import { routeHead } from "../../domains/shared/systems/seo";
import {
  T_BODY,
  T_BODY_SM,
  T_LABEL,
  T_PAGE,
  T_SECTION,
} from "../../domains/shared/systems/type-scale";

export const Route = createFileRoute("/legal/license")({
  head: () =>
    routeHead("License", "The licence, rendered from the repo's own LICENSE files."),
  component: License,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";

function License() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-12 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <Kicker className={INK_SOFT}>Legal</Kicker>
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>License</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Kern is open source. The text below is the repository&apos;s
              license file rendered verbatim — not a summary, not a copy.
            </p>
          </header>

          <div className="flex flex-col gap-4">
            <h2 id="per-package" className={`m-0 ${T_SECTION} ${INK}`}>
              Which package, which license
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Every license-bearing unit in the repository, read from its own
              LICENSE file at build time. All seven agree today; if one ever
              differs, this table is where that shows.
            </p>
            <table className={`m-0 w-full border-collapse ${T_BODY_SM}`}>
              <thead>
                <tr>
                  <th
                    className={`border-b border-(--md-sys-color-outline-variant) py-2 pr-4 text-left ${T_LABEL} ${INK_SOFT} uppercase`}
                  >
                    Unit
                  </th>
                  <th
                    className={`border-b border-(--md-sys-color-outline-variant) py-2 text-left ${T_LABEL} ${INK_SOFT} uppercase`}
                  >
                    License
                  </th>
                </tr>
              </thead>
              <tbody>
                {PACKAGE_LICENSES.map((row) => (
                  <tr key={row.file}>
                    <td
                      className={`border-b border-(--md-sys-color-outline-variant) py-2 pr-4 font-mono ${INK}`}
                    >
                      {row.label}
                    </td>
                    <td
                      className={`border-b border-(--md-sys-color-outline-variant) py-2 ${INK_SOFT}`}
                    >
                      {row.license}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4">
            <h2 id="full-text" className={`m-0 ${T_SECTION} ${INK}`}>
              Full text
            </h2>
            <pre
              className={`m-0 overflow-x-auto rounded-(--md-sys-shape-corner-medium) bg-(--md-sys-color-surface-container-low) p-5 font-mono ${T_BODY_SM} ${INK_SOFT} whitespace-pre-wrap`}
            >
              {LICENSE_TEXT}
            </pre>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
