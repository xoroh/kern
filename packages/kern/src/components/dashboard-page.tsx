import type { StatusTone } from "@xoroh/kern-tokens";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../utils/cn";
import { Card } from "./card";
import type { DataTableProps } from "./data-table";
import { DataTable } from "./data-table";
import { EmptyState } from "./empty-state";
import { KernLoading } from "./kern-loading";
import { List, type ListRow } from "./list";

/**
 * DashboardPage — the generic operations-dashboard template (D951 WP4).
 *
 * Composes ONLY `Card` (stat grid) + `StatusPill` (delta chips) + `List`
 * (activity) + `DataTable` (queues) + `KernLoading`/`EmptyState` (D925):
 * the dispatch consoles, backoffice overviews and balance dashboards from
 * inventory collapse into one page pattern — stat-card grid + activity +
 * queues. Q3 split: a platform composition designed here as a
 * Kern-component composition, never Xoroh-specific logic — stats, activity
 * rows and queue columns arrive as data from the host.
 *
 * M3: cards (https://m3.material.io/components/cards) + lists (activity)
 * (https://m3.material.io/components/lists/overview); no M3 dashboard
 * component — page pattern on M3 type/shape/color roles.
 *
 * Port sources (OSI only): Paper Card/List content patterns (MIT,
 * https://github.com/callstack/react-native-paper/blob/main/LICENSE.md);
 * material-tailwind dashboard composition ONLY, never M2 visuals (MIT,
 * https://github.com/creativetimofficial/material-tailwind/blob/main/LICENSE.md).
 */

export type DashboardStat = {
  id: string;
  /** Short name ("Active trips"). */
  label: string;
  /** Headline figure. Node so the host owns formatting/locales. */
  value: ReactNode;
  /** Delta slot — the host composes `StatusPill` ("+12%"). */
  delta?: ReactNode;
  /** Accent for the stat's leading marker. Default `neutral`. */
  tone?: StatusTone;
  /** Leading slot: a KernIcon-registry icon. */
  icon?: ReactNode;
  /** Supporting line under the value. */
  description?: ReactNode;
  /** Navigation target. Stats navigate via links — no press callbacks, so
   * the template introduces no state channel (R2 lexicon-clean). */
  href?: string;
};

export type DashboardPageProps = Omit<
  ComponentPropsWithRef<"main">,
  "title" | "children"
> & {
  /** Page heading. */
  title: ReactNode;
  description?: ReactNode;
  /** Header-actions slot (date range, export, primary CTA from host). */
  actions?: ReactNode;
  /** Stat cards. Empty array renders no grid. */
  stats?: DashboardStat[];
  statsLabel?: string;
  /** Activity feed rows (`List`, two-line). */
  activityRows?: ListRow[];
  activityLabel?: string;
  /** Activity row activation — the `List` row-press channel (R2 lexicon: allowlisted DOMAIN action). */
  onRowPress?: (id: string) => void;
  /** Ops queue (`DataTable` — host owns columns/rows/sort/page/selection
   * through this passthrough; the template adds no table state). */
  queueTable?: DataTableProps;
  queueLabel?: string;
  /** Loading state: stat + queue skeletons with a polite status. */
  loading?: boolean;
  /** Zero-data state node. Defaults to an `EmptyState`. */
  emptyState?: ReactNode;
  /** Extra display sections slot (charts, secondary queues from host). */
  children?: ReactNode;
};

function StatCard({ stat }: { stat: DashboardStat }) {
  const body = (
    <>
      <span className="flex items-center gap-2">
        {stat.icon ? (
          <span
            data-slot="dashboard-stat-icon"
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-(--sys-shape-corner-full) bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container)"
          >
            {stat.icon}
          </span>
        ) : (
          <span
            data-slot="dashboard-stat-marker"
            aria-hidden="true"
            className={cn(
              "size-2.5 shrink-0 rounded-(--sys-shape-corner-full)",
              stat.tone === "success" && "bg-(--sys-color-success)",
              stat.tone === "warning" && "bg-(--sys-color-warning)",
              stat.tone === "error" && "bg-(--sys-color-error)",
              stat.tone === "info" && "bg-(--sys-color-info)",
              stat.tone === "primary" && "bg-(--sys-color-primary)",
              stat.tone === "secondary" && "bg-(--sys-color-secondary)",
              (!stat.tone || stat.tone === "neutral") &&
                "bg-(--sys-color-outline)",
            )}
          />
        )}
        <span className="text-(length:--sys-typescale-label-large-font-size) leading-(--sys-typescale-label-large-line-height) font-(--sys-typescale-label-large-font-weight) text-(--sys-color-on-surface-variant)">
          {stat.label}
        </span>
      </span>
      <span className="mt-2 text-(length:--sys-typescale-headline-medium-font-size) leading-(--sys-typescale-headline-medium-line-height) font-(--sys-typescale-headline-medium-font-weight) text-(--sys-color-on-surface)">
        {stat.value}
      </span>
      {stat.delta ? (
        <span data-slot="dashboard-stat-delta" className="mt-2 inline-flex">
          {stat.delta}
        </span>
      ) : null}
      {stat.description ? (
        <span className="mt-1 text-(length:--sys-typescale-body-small-font-size) leading-(--sys-typescale-body-small-line-height) text-(--sys-color-on-surface-variant)">
          {stat.description}
        </span>
      ) : null}
    </>
  );
  const classes =
    "kern-dashboard-stat flex flex-col p-4 text-start hover:shadow-(--sys-elevation-level1)";
  return stat.href ? (
    <Card
      as="a"
      href={stat.href}
      data-slot="dashboard-stat"
      className={cn(classes, "no-underline")}
    >
      {body}
    </Card>
  ) : (
    <Card data-slot="dashboard-stat" className={classes}>
      {body}
    </Card>
  );
}

/**
 * DashboardPage — stat-card grid + activity feed + ops queue. Hosts pass
 * data; the template owns layout, landmarks and loading/empty states.
 *
 * Usage: `<DashboardPage title="Overview" stats={…}
 * activityRows={…} queueTable={{ columns, rows }} />`.
 */
export function DashboardPage({
  title,
  description,
  actions,
  stats = [],
  statsLabel = "Key figures",
  activityRows = [],
  activityLabel = "Activity",
  onRowPress,
  queueTable,
  queueLabel = "Queue",
  loading = false,
  emptyState,
  children,
  className,
  ...props
}: DashboardPageProps) {
  const empty =
    stats.length === 0 && activityRows.length === 0 && !queueTable && !children;
  return (
    <main
      data-slot="dashboard-page"
      aria-label={typeof title === "string" ? title : "Dashboard"}
      className={cn(
        "kern-dashboard-page mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6",
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-(length:--sys-typescale-headline-small-font-size) leading-(--sys-typescale-headline-small-line-height) font-(--sys-typescale-headline-small-font-weight) text-(--sys-color-on-surface)">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-prose text-(length:--sys-typescale-body-medium-font-size) leading-(--sys-typescale-body-medium-line-height) text-(--sys-color-on-surface-variant)">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div
            data-slot="dashboard-actions"
            className="flex flex-wrap items-center gap-2"
          >
            {actions}
          </div>
        ) : null}
      </div>

      {loading ? (
        <KernLoading kind="skeleton-list" count={5} label="Loading dashboard" />
      ) : empty && !children ? (
        (emptyState ?? (
          <EmptyState
            variant="page"
            title="Nothing here yet"
            description="Figures, activity and queues appear once there is data."
          />
        ))
      ) : (
        <>
          {stats.length > 0 ? (
            <section aria-label={statsLabel}>
              <div
                data-slot="dashboard-stats"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {stats.map((stat) => (
                  <StatCard key={stat.id} stat={stat} />
                ))}
              </div>
            </section>
          ) : null}
          {activityRows.length > 0 ? (
            <section aria-label={activityLabel}>
              <Card className="p-2">
                <List
                  variant="two-line"
                  label={activityLabel}
                  rows={activityRows}
                  onRowPress={onRowPress}
                />
              </Card>
            </section>
          ) : null}
          {queueTable ? (
            <section aria-label={queueLabel}>
              <DataTable {...queueTable} />
            </section>
          ) : null}
          {children}
        </>
      )}
    </main>
  );
}
