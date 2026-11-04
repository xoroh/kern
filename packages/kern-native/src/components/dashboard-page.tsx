import type { StatusTone } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { Card } from "./card";
import { DataTable, type NativeDataTableProps } from "./data-table";
import { EmptyState } from "./empty-state";
import { KernLoading } from "./kern-loading";
import { List, type NativeListRow } from "./list";
import { Text } from "./text";

/**
 * DashboardPage — native twin of the web `DashboardPage` (D951 WP4).
 * Same contract (stats/activity/queue/loading/empty); 1-pane stacked
 * sections, metrics in dp, colors from `useKernScheme()`.
 *
 * Composes ONLY `Card` + `List` + `DataTable` (list-cards fallback UI under
 * the same adapters) + `KernLoading`/`EmptyState` (D925). Stats activate
 * through the allowlisted `onSelect` DOMAIN action (stat id) — no new
 * state channel. N has no link rows: stats are pressables, not anchors.
 */

export type DashboardStat = {
  id: string;
  label: string;
  /** Headline figure (pre-formatted by the host). */
  value: string;
  /** Delta slot — the host composes `StatusPill`. */
  delta?: ReactNode;
  tone?: StatusTone;
  icon?: ReactNode;
  description?: string;
};

export type NativeDashboardPageProps = Omit<ViewProps, "children" | "style"> & {
  title: string;
  description?: string;
  actions?: ReactNode;
  stats?: DashboardStat[];
  statsLabel?: string;
  activityRows?: NativeListRow[];
  activityLabel?: string;
  /** Activity row activation — the `List` row-press channel (allowlisted DOMAIN action). */
  onRowPress?: (id: string) => void;
  /** Stat activation (allowlisted DOMAIN action, stat id). */
  onSelect?: (id: string) => void;
  queueTable?: NativeDataTableProps;
  queueLabel?: string;
  loading?: boolean;
  emptyState?: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const dashboardStatic = StyleSheet.create({
  page: { flexDirection: "column", gap: 24, padding: 16 },
  stats: { flexDirection: "column", gap: 16 },
  statBody: { flexDirection: "column", padding: 16, gap: 8 },
  statHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
});

export function DashboardPage({
  title,
  description,
  actions,
  stats = [],
  statsLabel = "Key figures",
  activityRows = [],
  activityLabel = "Activity",
  onRowPress,
  onSelect,
  queueTable,
  queueLabel = "Queue",
  loading = false,
  emptyState,
  children,
  style,
  testID,
  ...props
}: NativeDashboardPageProps) {
  const scheme = useKernScheme();
  const empty =
    stats.length === 0 && activityRows.length === 0 && !queueTable && !children;
  return (
    <View
      {...props}
      testID={testID ?? "kern-dashboard-page"}
      accessibilityLabel={title}
      style={[dashboardStatic.page, style]}
    >
      <View>
        <Text variant="headline" accessibilityRole="header">
          {title}
        </Text>
        {description ? (
          <Text style={{ color: scheme.color.onSurfaceVariant }}>
            {description}
          </Text>
        ) : null}
        {actions ? (
          <View style={dashboardStatic.actions}>{actions}</View>
        ) : null}
      </View>

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
            <View accessibilityLabel={statsLabel}>
              <View style={dashboardStatic.stats}>
                {stats.map((stat) => {
                  const card = (
                    <Card
                      key={stat.id}
                      testID={`kern-dashboard-stat-${stat.id}`}
                    >
                      <View style={dashboardStatic.statBody}>
                        <View style={dashboardStatic.statHead}>
                          <Text variant="label">{stat.label}</Text>
                        </View>
                        <Text variant="headline">{stat.value}</Text>
                        {stat.delta}
                        {stat.description ? (
                          <Text
                            style={{ color: scheme.color.onSurfaceVariant }}
                          >
                            {stat.description}
                          </Text>
                        ) : null}
                      </View>
                    </Card>
                  );
                  return onSelect ? (
                    <Pressable
                      key={stat.id}
                      onPress={() => onSelect(stat.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`${stat.label}: ${stat.value}`}
                    >
                      {card}
                    </Pressable>
                  ) : (
                    card
                  );
                })}
              </View>
            </View>
          ) : null}
          {activityRows.length > 0 ? (
            <Card>
              <List
                variant="two-line"
                accessibilityLabel={activityLabel}
                rows={activityRows}
                onRowPress={onRowPress}
              />
            </Card>
          ) : null}
          {queueTable ? <DataTable {...queueTable} /> : null}
          {children}
        </>
      )}
    </View>
  );
}
