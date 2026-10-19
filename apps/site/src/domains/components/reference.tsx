import { Link } from "@tanstack/react-router";
import { COMPONENTS } from "../../generated/manifest";
import { PageCard } from "../shared/chrome/page-card";
import { SiteLayout } from "../shared/chrome/site-layout";
import { T_BODY, T_LABEL, T_PAGE } from "../shared/systems/type-scale";

/**
 * /reference — the generated API index.
 *
 * Every export in the generated manifest, one row each: the symbol, its
 * family page anchor, platform availability, and stub status. Sorted by
 * symbol so it scans like an index, not a gallery. Rows link to the family
 * page (parts resolve to their family via the canonical-slug redirect).
 *
 * The route registration (`createFileRoute("/reference")`, head, component
 * wiring) lives in `routes/reference.tsx` — TanStack file-based routing only
 * picks up route files under `routes/`, so the domain owns the page and the
 * route file owns the URL.
 */
export function ApiIndex() {
  const rows = [...COMPONENTS].sort((a, b) => a.export.localeCompare(b.export));
  return (
    <SiteLayout>
      <PageCard>
        <header className="site-docs-welcome flex flex-col gap-3">
          <p
            className={`m-0 ${T_LABEL} text-(--sys-color-on-surface-variant) uppercase`}
          >
            Docs
          </p>
          <h1 className={`m-0 ${T_PAGE}`}>API index</h1>
          <p
            className={`m-0 max-w-[62ch] ${T_BODY} text-(--sys-color-on-surface-variant)`}
          >
            Every export in the generated manifest — {rows.length} rows,
            generated, not hand-maintained. Each row links to its family page.
            Non-component utilities (functions, hooks, factories) are documented
            on{" "}
            <Link
              to="/docs/api"
              className="text-(--sys-color-secondary) no-underline hover:underline"
            >
              API utilities
            </Link>
            .
          </p>
        </header>
        <div className="overflow-x-auto rounded-(--sys-shape-corner-extra-large) bg-(--sys-color-surface-container-low) p-4 sm:p-6">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-(--sys-color-outline-variant)">
                <th
                  className={`m-0 ${T_LABEL} pb-3 text-left uppercase text-(--sys-color-on-surface-variant)`}
                >
                  Export
                </th>
                <th
                  className={`m-0 ${T_LABEL} pb-3 text-left uppercase text-(--sys-color-on-surface-variant)`}
                >
                  Family
                </th>
                <th
                  className={`m-0 ${T_LABEL} pb-3 text-left uppercase text-(--sys-color-on-surface-variant)`}
                >
                  Platform
                </th>
                <th
                  className={`m-0 ${T_LABEL} pb-3 text-left uppercase text-(--sys-color-on-surface-variant)`}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={`${row.platform}/${row.export}`}
                  className="border-b border-(--sys-color-outline-variant)/60 last:border-b-0"
                >
                  <td className={`m-0 ${T_BODY} py-2.5 pr-4 font-mono`}>
                    <Link
                      to="/components/$system/$component"
                      params={{
                        system: "m3",
                        component: row.name,
                      }}
                      className="text-(--sys-color-secondary) no-underline hover:text-(--sys-color-primary) hover:underline"
                    >
                      {row.export}
                    </Link>
                  </td>
                  <td
                    className={`m-0 ${T_BODY} py-2.5 pr-4 text-(--sys-color-on-surface-variant)`}
                  >
                    {row.name}
                  </td>
                  <td className={`m-0 ${T_LABEL} py-2.5 pr-4`}>
                    <span className="rounded-full bg-(--sys-color-secondary-container) px-2.5 py-0.5 text-(--sys-color-on-secondary-container)">
                      {row.platform}
                    </span>
                  </td>
                  <td className={`m-0 ${T_LABEL} py-2.5`}>
                    <span className="rounded-full bg-(--sys-color-surface-container-high) px-2.5 py-0.5 text-(--sys-color-on-surface-variant)">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageCard>
    </SiteLayout>
  );
}
