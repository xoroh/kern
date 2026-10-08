/**
 * /primitives — install-first landing for the headless behavior kernel.
 *
 * `@xoroh/kern-primitives` carries no visual decision (the boundary
 * `check:primitives` enforces over the transitive import closure), so this
 * page installs it standalone and links every kernel module. Per-module
 * anatomy + API + examples are later work; the module pages say so plainly.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import { T_BODY, T_LABEL, T_PAGE } from "../../domains/shared/systems/type-scale";
import { PRIMITIVE_MODULES } from "../../domains/primitives/modules";

export const Route = createFileRoute("/primitives/")({
  head: () =>
    routeHead(
      "Primitives",
      "The un-styled behavior kernel shared by the kern web and native renderers.",
    ),
  component: Primitives,
});

const INSTALL = "bun add @xoroh/kern-primitives";

function Primitives() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <p
              className={`m-0 ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}
            >
              Primitives
            </p>
            <h1 className={`m-0 ${T_PAGE}`}>Behavior kernel, no visuals</h1>
            <p
              className={`m-0 max-w-[62ch] ${T_BODY} text-(--md-sys-color-on-surface-variant)`}
            >
              Controllable state, overlay modality, roving focus, dismiss
              policy and the collection/selection model — the logic both
              renderers implement identically. React 18+ is the only peer.
            </p>
          </header>
          <h2 id="install" className={`m-0 ${T_LABEL}`}>
            Install
          </h2>
          <pre className={`m-0 ${T_BODY} overflow-x-auto`}>{INSTALL}</pre>
          <h2 id="modules" className={`m-0 ${T_LABEL}`}>
            Modules
          </h2>
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {PRIMITIVE_MODULES.map((m) => (
              <li key={m.slug} className="flex flex-col gap-1">
                <Link
                  to="/primitives/$module"
                  params={{ module: m.slug }}
                  className="text-(--md-sys-color-primary) no-underline hover:underline"
                >
                  {m.title}
                </Link>
                <p
                  className={`m-0 ${T_BODY} text-(--md-sys-color-on-surface-variant)`}
                >
                  {m.blurb}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
