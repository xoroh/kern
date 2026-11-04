import type { ReactNode } from "react";
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { Card } from "./card";
import {
  DataTable,
  type NativeDataTableColumn,
  type NativeDataTableRow,
} from "./data-table";
import { EmptyState } from "./empty-state";
import { KernLoading } from "./kern-loading";
import { Text } from "./text";

/**
 * BillingPage — native twin of the web `BillingPage` (D951 WP4; MS-012
 * gated, binding). SKELETON ONLY: plan/invoice DISPLAY SLOTS ONLY — NO pay
 * action, NO top-up action, NO payment logic. The gate lives in code
 * (`data` marker below + this comment) and in
 * `docs/templates-reference.md`: adding an action here without the owning
 * lane's Stage 2/5 verification violates MS-012.
 *
 * Composes ONLY `Card` + `DataTable` (`ledger` preset) +
 * `KernLoading`/`EmptyState`. Deliberately no action prop exists.
 */

export type NativeBillingPageProps = Omit<ViewProps, "children" | "style"> & {
  title?: string;
  description?: string;
  /** Plan display SLOT (host composition, display nodes only). */
  plan?: ReactNode;
  planLabel?: string;
  invoiceColumns?: NativeDataTableColumn[];
  invoiceRows?: NativeDataTableRow[];
  invoicesLabel?: string;
  invoicesEmpty?: ReactNode;
  loading?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const billingStatic = StyleSheet.create({
  page: { flexDirection: "column", gap: 24, padding: 16 },
  plan: { padding: 16 },
});

export function BillingPage({
  title = "Billing",
  description,
  plan,
  planLabel = "Current plan",
  invoiceColumns = [],
  invoiceRows = [],
  invoicesLabel = "Invoices",
  invoicesEmpty,
  loading = false,
  children,
  style,
  testID,
  ...props
}: NativeBillingPageProps) {
  const scheme = useKernScheme();
  return (
    <View
      {...props}
      testID={testID ?? "kern-billing-page"}
      accessibilityLabel={title}
      style={[billingStatic.page, style]}
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
      </View>

      {loading ? (
        <KernLoading kind="skeleton-list" count={4} label="Loading billing" />
      ) : (
        <>
          {plan ? (
            <View accessibilityLabel={planLabel}>
              <Card testID="kern-billing-plan" style={billingStatic.plan}>
                {typeof plan === "string" ? <Text>{plan}</Text> : plan}
              </Card>
            </View>
          ) : null}
          <View accessibilityLabel={invoicesLabel}>
            {invoiceRows.length > 0 ? (
              <DataTable
                variant="ledger"
                columns={invoiceColumns}
                rows={invoiceRows}
              />
            ) : (
              (invoicesEmpty ?? (
                <EmptyState
                  variant="section"
                  title="No invoices yet"
                  description="Invoices appear here once billing runs."
                />
              ))
            )}
          </View>
          {children}
        </>
      )}
    </View>
  );
}
