/**
 * /primitives/$module — stub page for one kernel module.
 *
 * Names the module, lists its barrel exports, and states that full docs
 * (anatomy + API + example) are later work. An unknown slug renders a
 * pointer back to the index rather than a fabricated page.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import { T_BODY, T_LABEL, T_PAGE } from "../../domains/shared/systems/type-scale";
import { primitiveModule } from "../../domains/primitives/modules";

export const Route = createFileRoute("/primitives/$module")({
  head: ({ params }) => {
    const mod = primitiveModule(params.module);
    return routeHead(
      mod ? `Primitives — ${mod.title}` : "Primitives — unknown module",
      mod?.blurb ??
        "No kernel module by that name. Start from the module index.",
    );
  },
  component: PrimitiveModulePage,
});

function PrimitiveModulePage() {
  const { module } = Route.useParams();
  const mod = primitiveModule(module);
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          {!mod ? (
            <header className="flex flex-col gap-3">
              <p
                className={`m-0 ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}
              >
                Primitives
              </p>
              <h1 className={`m-0 ${T_PAGE}`}>No module named “{module}”</h1>
              <p
                className={`m-0 max-w-[62ch] ${T_BODY} text-(--md-sys-color-on-surface-variant)`}
              >
                <Link
                  to="/primitives"
                  className="text-(--md-sys-color-primary) no-underline hover:underline"
                >
                  Back to the module index
                </Link>
                .
              </p>
            </header>
          ) : (
            <>
              <header className="flex flex-col gap-3">
                <p
                  className={`m-0 ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}
                >
                  Primitives
                </p>
                <h1 className={`m-0 ${T_PAGE}`}>{mod.title}</h1>
                <p
                  className={`m-0 max-w-[62ch] ${T_BODY} text-(--md-sys-color-on-surface-variant)`}
                >
                  {mod.blurb}. Full docs — anatomy, API, example — are later
                  work; the barrel is the contract today.
                </p>
              </header>
              <h2 id="exports" className={`m-0 ${T_LABEL}`}>
                Barrel exports
              </h2>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {mod.exports.map((name) => (
                  <li key={name} className={`m-0 ${T_BODY} font-mono`}>
                    {name}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
