import { type StatusTone, statusToneSolid } from "@xoroh/kern-tokens";
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
import { Text } from "./text";

/**
 * KernMaps visuals — native twin of the web `kern-maps` (D951 WP4, CL-013).
 * Same contract (kinds/tones/label/selected/live + A-003 guest consent);
 * metrics in dp, colors from `useKernScheme()` (no raw hex — the tone
 * helpers resolve container roles per scheme).
 *
 * D925 NO-DUPLICATION SEAM (binding): engine stays the platform
 * `libs/maps` + `libs/explore` system. This file owns NO engine, NO map-SDK
 * dependency — marker glyphs positioned by the host, panel anchored by the
 * host, `*Datum` types as the visual-side contracts only.
 *
 * M3: no M3 map component — badge/chip tone roles + card panels
 * (https://m3.material.io/components/cards).
 */

export type MapMarkerKind = "pin" | "vehicle" | "person" | "guest" | "stop";

export type MapMarkerDatum = {
  id: string;
  kind?: MapMarkerKind;
  tone?: StatusTone;
  label?: string;
  selected?: boolean;
  live?: boolean;
};

export function mapMarkerDatumToProps(
  datum: MapMarkerDatum,
): Pick<NativeMapMarkerProps, "kind" | "tone" | "label" | "selected" | "live"> {
  return {
    kind: datum.kind,
    tone: datum.tone,
    label: datum.label,
    selected: datum.selected,
    live: datum.live,
  };
}

export type NativeMapMarkerProps = Omit<ViewProps, "children" | "style"> & {
  kind?: MapMarkerKind;
  tone?: StatusTone;
  /** Glyph slot: a KernIcon-registry icon or avatar. Default: tone dot. */
  icon?: ReactNode;
  label?: string;
  selected?: boolean;
  /** Live-position halo (static ring — Kern ships utility motion only). */
  live?: boolean;
  /** A-003 / MS-023 guest consent line (only painted for `kind="guest"`). */
  consentLabel?: string;
  /** A-003 expired consent: neutral tone + paused treatment. */
  consentExpired?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const markerStatic = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  glyph: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  chip: { borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 },
  consent: {
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  paused: { width: 10, height: 10, borderRadius: 5 },
});

export function MapMarker({
  kind = "pin",
  tone = "primary",
  icon,
  label,
  selected = false,
  live = false,
  consentLabel,
  consentExpired = false,
  style,
  testID,
  ...props
}: NativeMapMarkerProps) {
  const scheme = useKernScheme();
  const guest = kind === "guest";
  const effectiveTone = guest && consentExpired ? "neutral" : tone;
  const fill = statusToneSolid(scheme.color, effectiveTone);
  return (
    <View
      {...props}
      testID={testID ?? "kern-map-marker"}
      style={[markerStatic.row, style]}
    >
      <View
        testID="kern-map-marker-glyph"
        style={[
          markerStatic.glyph,
          { backgroundColor: fill.bg },
          (live || selected) && {
            borderWidth: 2,
            borderColor: scheme.color.primary,
          },
          guest &&
            !consentExpired && {
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: scheme.color.primary,
            },
        ]}
      >
        {icon ?? (
          <View
            testID="kern-map-marker-dot"
            style={[
              markerStatic.dot,
              { backgroundColor: scheme.color.surface },
            ]}
          />
        )}
      </View>
      {label ? (
        <View
          testID="kern-map-marker-label"
          style={[
            markerStatic.chip,
            { backgroundColor: scheme.color.inverseSurface },
          ]}
        >
          <Text
            variant="label"
            style={{ color: scheme.color.inverseOnSurface }}
          >
            {label}
          </Text>
        </View>
      ) : null}
      {guest && !consentExpired && consentLabel ? (
        <View
          testID="kern-map-marker-consent"
          style={[
            markerStatic.consent,
            {
              borderColor: scheme.color.primary,
              backgroundColor: scheme.color.surface,
            },
          ]}
        >
          <Text
            variant="label"
            style={{ color: scheme.color.onSurfaceVariant }}
          >
            {consentLabel}
          </Text>
        </View>
      ) : null}
      {guest && consentExpired ? (
        <View
          testID="kern-map-marker-consent-paused"
          style={[
            markerStatic.paused,
            { backgroundColor: scheme.color.outline },
          ]}
        />
      ) : null}
    </View>
  );
}

export type MapPanelPosition = "floating" | "docked-top" | "docked-bottom";

export type NativeMapPanelProps = Omit<ViewProps, "children" | "style"> & {
  /** Panel heading AND the accessible name. Required, string on N. */
  title: string;
  description?: string;
  /** Media slot: route preview / photo from the host. */
  media?: ReactNode;
  /** Meta slot: status/tone row (host composes `StatusPill`). */
  meta?: ReactNode;
  /** Primary actions slot (host Buttons). */
  actions?: ReactNode;
  /** Footer slot: secondary lines, ETAs, disclaimers. */
  footer?: ReactNode;
  /**
   * Close action (R2 lexicon: a DOMAIN action, not state — allowlisted).
   * Renders the × control; omit it and no × renders.
   */
  onClose?: () => void;
  position?: MapPanelPosition;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const panelStatic = StyleSheet.create({
  panel: { width: "100%", maxWidth: 352, overflow: "hidden" },
  body: { padding: 16 },
  meta: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  },
  close: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export function MapPanel({
  title,
  description,
  media,
  meta,
  actions,
  footer,
  onClose,
  position = "floating",
  style,
  testID,
  ...props
}: NativeMapPanelProps) {
  const scheme = useKernScheme();
  return (
    <Card
      variant="elevated"
      testID={testID ?? "kern-map-panel"}
      style={[panelStatic.panel, style]}
      {...props}
    >
      {media ? <View testID="kern-map-panel-media">{media}</View> : null}
      <View style={panelStatic.body}>
        {meta ? <View style={panelStatic.meta}>{meta}</View> : null}
        <Text variant="title" accessibilityRole="header">
          {title}
        </Text>
        {description ? (
          <Text style={{ color: scheme.color.onSurfaceVariant }}>
            {description}
          </Text>
        ) : null}
        {actions ? <View style={panelStatic.actions}>{actions}</View> : null}
        {footer ? (
          <View
            style={{
              marginTop: 12,
              borderTopWidth: 1,
              borderTopColor: scheme.color.outlineVariant,
              paddingTop: 12,
            }}
          >
            {typeof footer === "string" ? (
              <Text style={{ color: scheme.color.onSurfaceVariant }}>
                {footer}
              </Text>
            ) : (
              footer
            )}
          </View>
        ) : null}
      </View>
      {onClose ? (
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close panel"
          testID="kern-map-panel-close"
          style={panelStatic.close}
        >
          <Text style={{ color: scheme.color.onSurfaceVariant, fontSize: 20 }}>
            ×
          </Text>
        </Pressable>
      ) : null}
    </Card>
  );
}
