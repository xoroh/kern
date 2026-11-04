import { Link, useSearch } from "@tanstack/react-router";
import { COMPONENTS } from "../../generated/manifest";
import { PageCard } from "../shared/chrome/page-card";
import { SiteLayout } from "../shared/chrome/site-layout";
import { T_BODY, T_LABEL, T_PAGE } from "../shared/systems/type-scale";

/**
 * /reference — the generated API index.
 *
 * Every export in the generated manifest, one row each: the symbol, its
 * family page anchor, platform availability, tier (D1003/D1004), and stub
 * status. Sorted by symbol so it scans like an index, not a gallery. Rows
 * link to the family page (parts resolve to their family via the
 * canonical-slug redirect). `?tier=core|component` scopes the table to one
 * IA tier — the family pages' tier badges link here.
 *
 * The route registration (`createFileRoute("/reference")`, head, component
 * wiring) lives in `routes/reference.tsx` — TanStack file-based routing only
 * picks up route files under `routes/`, so the domain owns the page and the
 * route file owns the URL.
 */
export function ApiIndex() {
  const { tier } = useSearch({ strict: false }) as {
    tier?: "core" | "component";
  };
  const scoped = tier === "core" || tier === "component" ? tier : undefined;
  const rows = [...COMPONENTS]
    .filter((r) => !scoped || r.tier === scoped)
    .sort((a, b) => a.export.localeCompare(b.export));
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
            Every export in the generated manifest — {rows.length} rows
            {scoped ? ` (tier: ${scoped})` : ""}, generated, not
            hand-maintained. Each row links to its family page. Non-component
            utilities (functions, hooks, factories) are documented on{" "}
            <Link
              to="/docs/api"
              className="text-(--sys-color-secondary) no-underline hover:underline"
            >
              API utilities
            </Link>
            .
          </p>
          <p className={`m-0 flex flex-wrap items-center gap-2 ${T_BODY}`}>
            <span className={T_LABEL}>Tier:</span>
            {(
              [
                { label: "All", to: "/reference", search: {} },
                {
                  label: "Core",
                  to: "/reference",
                  search: { tier: "core" as const },
                },
                {
                  label: "Components",
                  to: "/reference",
                  search: { tier: "component" as const },
                },
              ] as const
            ).map((f) => {
              const isActive =
                (f.search as { tier?: string }).tier === scoped ||
                (Object.keys(f.search).length === 0 && !scoped);
              return (
                <Link
                  key={f.label}
                  to={f.to}
                  search={f.search}
                  className={`rounded-full px-3 py-1 no-underline ${isActive ? "bg-(--sys-color-tertiary-container) font-mono text-(--sys-color-on-tertiary-container)" : "bg-(--sys-color-surface-container-high) text-(--sys-color-on-surface-variant)"}`}
                >
                  {f.label}
                </Link>
              );
            })}
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
                  Tier
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
                  <td className={`m-0 ${T_LABEL} py-2.5 pr-4`}>
                    <Link
                      to="/reference"
                      search={{ tier: row.tier }}
                      className="rounded-full bg-(--sys-color-tertiary-container) px-2.5 py-0.5 text-(--sys-color-on-tertiary-container) no-underline hover:underline"
                    >
                      {row.tier}
                    </Link>
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
