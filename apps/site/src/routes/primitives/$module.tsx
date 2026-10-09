/**
 * /primitives/$module — one kernel module: anatomy, API, example.
 *
 * The page grammar is fixed and asserted by
 * `scripts/check-primitives-docs.mjs`: header → Anatomy → API → Example. A
 * section that renders empty fails that gate rather than shipping a page
 * that says "later work" — the barrel is the contract, and this page
 * documents it.
 *
 * Unknown slugs render a pointer back to the index rather than a fabricated
 * page.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Code } from "../../components/docs/code";
import {
  PRIMITIVE_MODULES,
  primitiveModule,
} from "../../domains/primitives/modules";
import {
  Breadcrumbs,
  type PageLink,
  Pagination,
} from "../../domains/shared/chrome/docs-shell-parts";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import {
  T_BODY,
  T_BODY_MD,
  T_BODY_SM,
  T_LABEL,
  T_PAGE,
  T_SECTION,
  T_SMALL_TITLE,
} from "../../domains/shared/systems/type-scale";

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

/** Prev/next over the catalogue order — same rule the component pages use. */
function siblingLinks(slug: string): { prev?: PageLink; next?: PageLink } {
  const index = PRIMITIVE_MODULES.findIndex((m) => m.slug === slug);
  const linkFor = (i: number): PageLink => ({
    href: `/primitives/${PRIMITIVE_MODULES[i].slug}`,
    title: PRIMITIVE_MODULES[i].title,
  });
  return {
    ...(index > 0 ? { prev: linkFor(index - 1) } : {}),
    ...(index >= 0 && index < PRIMITIVE_MODULES.length - 1
      ? { next: linkFor(index + 1) }
      : {}),
  };
}

function PrimitiveModulePage() {
  const { module } = Route.useParams();
  const mod = primitiveModule(module);
  const siblings = mod ? siblingLinks(mod.slug) : {};
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          {!mod ? (
            <header className="flex flex-col gap-3">
              <Breadcrumbs
                items={[
                  { label: "Primitives", href: "/primitives" },
                  { label: "Unknown module" },
                ]}
              />
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
                <Breadcrumbs
                  items={[
                    { label: "Primitives", href: "/primitives" },
                    { label: mod.title },
                  ]}
                />
                <p
                  className={`m-0 ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}
                >
                  Primitives
                </p>
                <h1 className={`m-0 ${T_PAGE}`}>{mod.title}</h1>
                <p
                  className={`m-0 max-w-[62ch] ${T_BODY} text-(--md-sys-color-on-surface-variant)`}
                >
                  {mod.blurb}.
                </p>
              </header>

              <section className="flex flex-col gap-3">
                <h2 id="anatomy" className={`m-0 ${T_SECTION}`}>
                  Anatomy
                </h2>
                <p
                  className={`m-0 max-w-[62ch] ${T_BODY} text-(--md-sys-color-on-surface-variant)`}
                >
                  The pieces you wire. The module decides behavior; your
                  renderer draws the markup.
                </p>
                <dl className="m-0 flex flex-col gap-3">
                  {mod.anatomy.map((row) => (
                    <div key={row.part} className="flex flex-col gap-1">
                      <dt className={`m-0 ${T_SMALL_TITLE} font-mono`}>
                        {row.part}
                      </dt>
                      <dd
                        className={`m-0 ${T_BODY} text-(--md-sys-color-on-surface-variant)`}
                      >
                        {row.role}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="flex flex-col gap-3">
                <h2 id="api" className={`m-0 ${T_SECTION}`}>
                  API
                </h2>
                <ul className="m-0 flex list-none flex-col gap-4 p-0">
                  {mod.api.map((row) => (
                    <li key={row.signature} className="flex flex-col gap-1">
                      <code
                        className={`m-0 ${T_BODY_SM} overflow-x-auto font-mono text-(--md-sys-color-on-surface)`}
                      >
                        {row.signature}
                      </code>
                      <p
                        className={`m-0 ${T_BODY} text-(--md-sys-color-on-surface-variant)`}
                      >
                        {row.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="flex flex-col gap-3">
                <h2 id="example" className={`m-0 ${T_SECTION}`}>
                  Example
                </h2>
                <p
                  className={`m-0 max-w-[62ch] ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}
                >
                  Compiled against the published surface — the same check the
                  getting-started snippets meet.
                </p>
                <Code>{mod.example}</Code>
              </section>

              <section className="flex flex-col gap-3">
                <h2 id="exports" className={`m-0 ${T_SECTION}`}>
                  Barrel exports
                </h2>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {mod.exports.map((name) => (
                    <li key={name} className={`m-0 ${T_BODY} font-mono`}>
                      {name}
                    </li>
                  ))}
                </ul>
                <p
                  className={`m-0 max-w-[62ch] ${T_BODY_SM} text-(--md-sys-color-on-surface-variant)`}
                >
                  Imported from <code>@xoroh/kern-primitives</code>. Subpath
                  exports are deferred to 1.0 — the barrel plus tree-shaking
                  covers every consumer today.
                </p>
              </section>

              <Pagination
                label="Kernel modules"
                prev={siblings.prev}
                next={siblings.next}
              />
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
