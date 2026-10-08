import { Link } from "@tanstack/react-router";
import { SiteLayout } from "../shared/chrome/site-layout";
import { COMPONENTS } from "../../generated/manifest";
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
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <p
              className={`m-0 ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}
            >
              Docs
            </p>
            <h1 className={`m-0 ${T_PAGE}`}>API index</h1>
            <p
              className={`m-0 max-w-[62ch] ${T_BODY} text-(--md-sys-color-on-surface-variant)`}
            >
              Every export in the generated manifest — {rows.length} rows,
              generated, not hand-maintained. Each row links to its family page.
            </p>
          </header>
          {/*
            Phase 3 grammar — mobile tables: the index table scrolls
            horizontally inside its container below the breakpoint where it
            fits, instead of blowing out the page. Same `overflow-x-auto`
            treatment the component-page tables already carry.
          */}
          <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-(--md-sys-color-outline-variant)">
                <th className={`m-0 ${T_LABEL} pb-2 text-left`}>Export</th>
                <th className={`m-0 ${T_LABEL} pb-2 text-left`}>Family</th>
                <th className={`m-0 ${T_LABEL} pb-2 text-left`}>Platform</th>
                <th className={`m-0 ${T_LABEL} pb-2 text-left`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={`${row.platform}/${row.export}`}
                  className="border-b border-(--md-sys-color-outline-variant)"
                >
                  <td className={`m-0 ${T_BODY} py-2 pr-4 font-mono`}>
                    <Link
                      to="/components/$platform/$component"
                      params={{
                        platform: row.platform,
                        component: row.name,
                      }}
                      className="text-(--md-sys-color-primary) no-underline hover:underline"
                    >
                      {row.export}
                    </Link>
                  </td>
                  <td className={`m-0 ${T_BODY} py-2 pr-4`}>{row.name}</td>
                  <td className={`m-0 ${T_BODY} py-2 pr-4`}>{row.platform}</td>
                  <td className={`m-0 ${T_BODY} py-2`}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
