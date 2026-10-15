/**
 * /primitives — install-first landing for the headless behavior kernel.
 *
 * `@xoroh/kern-primitives` carries no visual decision (the boundary
 * `check:primitives` enforces over the transitive import closure), so this
 * page installs it standalone and links every kernel module. Each module
 * page then carries its anatomy, API and one compiled example.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Kicker } from "../../components/chrome/kicker";
import { PRIMITIVE_MODULES } from "../../domains/primitives/modules";
import { PageCard } from "../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import {
  T_BODY,
  T_CODE,
  T_PAGE,
  T_SECTION,
} from "../../domains/shared/systems/type-scale";
import { LINK } from "../../domains/shared/systems/ui";

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
      <PageCard>
        <header className="flex flex-col gap-3">
          <Kicker>Primitives</Kicker>
          <h1 className={`m-0 ${T_PAGE}`}>Behavior kernel, no visuals</h1>
          <p
            className={`m-0 max-w-[62ch] ${T_BODY} text-(--sys-color-on-surface-variant)`}
          >
            Controllable state, overlay modality, roving focus, dismiss policy
            and the collection/selection model — the logic both renderers
            implement identically. React 18+ is the only peer.
          </p>
        </header>
        <h2 id="install" className={`m-0 ${T_SECTION}`}>
          Install
        </h2>
        <pre className={`m-0 ${T_CODE} overflow-x-auto`}>{INSTALL}</pre>
        <h2 id="modules" className={`m-0 ${T_SECTION}`}>
          Modules
        </h2>
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {PRIMITIVE_MODULES.map((m) => (
            <li key={m.slug} className="flex flex-col gap-1">
              <Link
                to="/primitives/$module"
                params={{ module: m.slug }}
                className={LINK}
              >
                {m.title}
              </Link>
              <p
                className={`m-0 ${T_BODY} text-(--sys-color-on-surface-variant)`}
              >
                {m.blurb}
              </p>
            </li>
          ))}
        </ul>
      </PageCard>
    </SiteLayout>
  );
}
