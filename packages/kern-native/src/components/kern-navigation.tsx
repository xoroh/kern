import { type ReactNode, useState } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";
import { NavigationBar, type NavigationDestination } from "./navigation-bar";
import { NavigationDrawer } from "./navigation-drawer";
import { NavigationRail, type NavigationRailMode } from "./navigation-rail";
import { Text } from "./text";

/**
 * KernNavigation — ONE navigation, native renderer (CL-002+CL-003; D925).
 *
 * Same variant contract as web `KernNavigation`: `drawer-modal` / `rail` /
 * `bar` / `sidebar-pane`. Platform splits (recorded, not drifted):
 * - `sidebar-pane` renders the persistent expanded rail + detail column.
 *   The detail column is a W-first pattern: on 1-pane screens leave
 *   `detail` unset and show it in a `KernOverlay` sheet instead.
 * - `header` lands on `rail` + `sidebar-pane` (switcher slot). The modal
 *   drawer takes `title`/`subtitle` strings (its API has no header slot);
 *   W renders the header node as the drawer headline.
 * - Selection is controlled-first like every native navigation (`value` +
 *   `onValueChange` required by the underlying bar/rail/drawer); the
 *   wrapper supplies the first destination when `value` is unset so the
 *   bar never renders with nothing current.
 */

export type { NavigationDestination, NavigationRailMode };

export type KernNavSection = {
  key: string;
  title?: ReactNode;
  destinations: NavigationDestination[];
};

export type RouteManifestEntry = {
  path: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  section?: string;
  disabled?: boolean;
};

/**
 * Route-manifest → sections adapter. Identical contract to the web twin
 * (pure, renderer-free): sections first-seen order, unsectioned routes
 * under `"main"`.
 */
export function routeManifestToSections(
  routes: readonly RouteManifestEntry[],
): KernNavSection[] {
  const sections: KernNavSection[] = [];
  const byTitle = new Map<string, KernNavSection>();
  for (const route of routes) {
    const key = route.section ?? "main";
    let section = byTitle.get(key);
    if (!section) {
      section = { key, title: route.section, destinations: [] };
      byTitle.set(key, section);
      sections.push(section);
    }
    section.destinations.push({
      key: route.path,
      label: route.label,
      icon: route.icon,
      badge: route.badge,
      disabled: route.disabled,
    });
  }
  return sections;
}

/** Sections → one destination list (for `bar` and `drawer-modal`). */
export function flattenSections(
  sections: readonly KernNavSection[],
): NavigationDestination[] {
  return sections.flatMap((section) => section.destinations);
}

export type KernNavigationVariant =
  | "drawer-modal"
  | "rail"
  | "bar"
  | "sidebar-pane";

export type NativeKernNavigationProps = {
  variant?: KernNavigationVariant;
  sections: readonly KernNavSection[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (key: string) => void;
  /** Header slot: switcher (rail + sidebar-pane). */
  header?: ReactNode;
  /** Footer slot: user row (rail + sidebar-pane + drawer). */
  footer?: ReactNode;
  accessibilityLabel?: string;
  /** `drawer-modal` visibility. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Drawer headline (drawer-modal only; the drawer has no header slot). */
  title?: string;
  subtitle?: string;
  railMode?: NavigationRailMode;
  /** `bar` FAB dock under the bar (M3). */
  floating?: ReactNode;
  /** `sidebar-pane` detail column (W-first; N prefers a sheet). */
  detail?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** ONE navigation (native): drawer-modal / rail / bar / sidebar-pane. */
export function KernNavigation({
  variant = "bar",
  sections,
  value,
  defaultValue,
  onValueChange,
  header,
  footer,
  accessibilityLabel = "Primary",
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  subtitle,
  railMode = "collapsed",
  floating,
  detail,
  style,
  testID,
}: NativeKernNavigationProps) {
  const scheme = useKernScheme();
  const flat = flattenSections(sections);
  const fallback =
    defaultValue ?? flat.find((d) => !d.disabled)?.key ?? flat[0]?.key ?? "";
  const [uncontrolled, setUncontrolled] = useState(fallback);
  const active = value ?? uncontrolled;
  const select = (key: string) => {
    if (value === undefined) setUncontrolled(key);
    onValueChange?.(key);
  };
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const openValue = open ?? uncontrolledOpen;
  const reportOpen = (next: boolean) => {
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  if (variant === "bar") {
    return (
      <NavigationBar
        destinations={flat}
        value={active}
        onValueChange={select}
        floating={floating}
        testID={testID ?? "kern-navigation-bar"}
        style={style}
      />
    );
  }

  if (variant === "drawer-modal") {
    return (
      <NavigationDrawer
        open={openValue}
        onOpenChange={reportOpen}
        destinations={flat}
        value={active}
        onValueChange={(key) => {
          select(key);
          // Select-then-dismiss, both renderers.
          reportOpen(false);
        }}
        title={title ?? accessibilityLabel}
        subtitle={subtitle}
        footer={footer}
        testID={testID ?? "kern-navigation-drawer"}
        style={style}
      />
    );
  }

  if (variant === "rail") {
    // The rail sizes itself (80/240dp by mode); a host `style` would fight
    // the measured width, so it is intentionally not forwarded here.
    return (
      <NavigationRail
        destinations={flat}
        value={active}
        onValueChange={select}
        mode={railMode}
        header={header}
        accessibilityLabel={accessibilityLabel}
        testID={testID ?? "kern-navigation-rail"}
      />
    );
  }

  // `sidebar-pane`: the persistent desk surface — expanded rail presentation
  // (a sidebar IS the expanded rail) beside the optional detail column.
  return (
    <View
      testID={testID ?? "kern-navigation"}
      style={[{ flex: 1, flexDirection: "row" }, style]}
    >
      <View
        accessibilityLabel={accessibilityLabel}
        style={{
          width: 240,
          flexDirection: "column",
          backgroundColor: scheme.color.surface,
          borderRightWidth: 1,
          borderRightColor: scheme.color.outlineVariant,
        }}
      >
        {header}
        {sections.map((section) => (
          <View key={section.key} style={{ paddingVertical: 4 }}>
            {typeof section.title === "string" ? (
              <Text
                variant="label"
                style={{
                  color: scheme.color.onSurfaceVariant,
                  paddingHorizontal: 16,
                  paddingBottom: 4,
                }}
              >
                {section.title}
              </Text>
            ) : (
              section.title
            )}
            <NavigationRail
              destinations={section.destinations}
              value={active}
              onValueChange={select}
              mode="expanded"
              accessibilityLabel={
                typeof section.title === "string" ? section.title : section.key
              }
              testID={`kern-navigation-rail-${section.key}`}
            />
          </View>
        ))}
        {footer}
      </View>
      {detail ? <View style={{ flex: 1 }}>{detail}</View> : null}
    </View>
  );
}
