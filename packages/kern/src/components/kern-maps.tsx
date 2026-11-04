import type { StatusTone } from "@xoroh/kern-tokens";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { useId } from "react";
import { cn } from "../utils/cn";
import { Card } from "./card";
import { statusToneClassNames, statusToneDotClassName } from "./status-pill";

/**
 * KernMaps visuals — marker + panel VISUALS and their data contracts ONLY
 * (CL-013; D951 WP4).
 *
 * D925 NO-DUPLICATION SEAM (binding): the map ENGINE stays the one platform
 * system (`libs/maps` + `libs/explore` — canvas/layers two-slot contract,
 * tile renderer, camera, clustering, gestures). This file owns NO engine, NO
 * map-SDK dependency, NO tile/camera/gesture code: `MapMarker` is a pure
 * visual glyph the host engine positions (host sets `style`/`className`),
 * `MapPanel` is a floating card the host anchors, and the `*Datum` types are
 * the visual-side data contracts. Anything that pans, zooms, clusters or
 * fetches tiles lives platform-side and must never be re-implemented here.
 *
 * M3: there is no M3 map component — markers follow badge/chip tone roles
 * and panels follow cards/dialogs
 * (https://m3.material.io/components/cards,
 * https://m3.material.io/components/chips/overview). Unifies the inventory
 * marker/panel visuals (CMP-2555/2556 DriverMarker designs, CMP-2589/2599
 * GeoMarker, CMP-0049/0050 dispatch panels, CMP-2502/2518 Track/RoutePreview
 * panels) as variants over one glyph + one panel — never an engine move.
 *
 * Port sources (OSI only): Paper Badge/Chip tone behavior (MIT,
 * https://github.com/callstack/react-native-paper/blob/main/LICENSE.md);
 * material-web elevation/token roles (Apache-2.0,
 * https://github.com/material-components/material-web/blob/main/LICENSE).
 */

/**
 * Marker kinds (generic visuals, never engine roles):
 * - `pin`: plain location pin (default disc + dot).
 * - `vehicle`: fleet/asset marker (host supplies the vehicle icon).
 * - `person`: human marker (host supplies the avatar or person icon).
 * - `guest`: live-guest marker (A-003 / MS-023): consent-ring treatment for
 *   the consented live position the host streams. The host owns consent
 *   state, expiry logic and streaming — this visual only PAINTS the state
 *   it is given (`live`, `consentLabel`, `consentExpired`).
 * - `stop`: waypoint/stop marker (numbered or plain).
 */
export type MapMarkerKind = "pin" | "vehicle" | "person" | "guest" | "stop";

/**
 * Visual-side marker datum: what the host engine hands one marker visual.
 * Engine-side fields (coordinates, clustering keys, tile payloads) stay in
 * `libs/maps` — they are not part of this contract.
 */
export type MapMarkerDatum = {
  id: string;
  kind?: MapMarkerKind;
  tone?: StatusTone;
  /** Short chip text beside the glyph (stop number, ETA, name). */
  label?: string;
  selected?: boolean;
  /** Live-position halo (driver/guest streaming). Static ring — the host
   * owns any motion; Kern ships utility motion only. */
  live?: boolean;
};

/** Datum → marker props (identity + visuals; the host adds position/icon). */
export function mapMarkerDatumToProps(
  datum: MapMarkerDatum,
): Pick<MapMarkerProps, "kind" | "tone" | "label" | "selected" | "live"> {
  return {
    kind: datum.kind,
    tone: datum.tone,
    label: datum.label,
    selected: datum.selected,
    live: datum.live,
  };
}

export type MapMarkerProps = Omit<
  ComponentPropsWithRef<"span">,
  "children" | "title"
> & {
  kind?: MapMarkerKind;
  /** Registry tone (default `primary`). Resolves via the ONE tone registry
   * (`statusToneClassNames`) — never a local palette, never raw hex. */
  tone?: StatusTone;
  /** Glyph slot: a KernIcon-registry icon or avatar. Default: tone dot. */
  icon?: ReactNode;
  /** Short chip text beside the glyph. */
  label?: ReactNode;
  /** Selected marker: primary ring. Single-select is host state. */
  selected?: boolean;
  /** Live-position halo. Static ring (see `MapMarkerDatum.live`). */
  live?: boolean;
  /**
   * A-003 / MS-023 guest consent line (only painted for `kind="guest"`):
   * e.g. "Sharing until 14:30". Presentational — the host computes it.
   */
  consentLabel?: ReactNode;
  /**
   * A-003 / MS-023 expired consent: guest marker falls back to the neutral
   * tone with the sharing-paused treatment. Presentational flag only.
   */
  consentExpired?: boolean;
};

/**
 * MapMarker — the ONE marker visual. A tone-registry glyph (+ optional label
 * chip) with selected/live/guest-consent treatments. Positioned by the host
 * engine via `style`/`className`; this component never measures a map.
 *
 * Usage: `<MapMarker kind="vehicle" tone="info" label="12" />`.
 * Props table: `kind` pin|vehicle|person|guest|stop · `tone` (7 registry
 * tones) · `icon` (KernIcon node, default dot) · `label` · `selected` ·
 * `live` · `consentLabel` + `consentExpired` (guest only).
 */
export function MapMarker({
  kind = "pin",
  tone = "primary",
  icon,
  label,
  selected = false,
  live = false,
  consentLabel,
  consentExpired = false,
  className,
  ...props
}: MapMarkerProps) {
  const guest = kind === "guest";
  // Expired guest consent always paints neutral: a paused share is not an
  // error, not a warning — it is the quiet container.
  const effectiveTone = guest && consentExpired ? "neutral" : tone;
  return (
    <span
      data-slot="map-marker"
      data-kind={kind}
      className={cn(
        "kern-map-marker inline-flex items-center gap-1",
        className,
      )}
      {...props}
    >
      <span
        data-slot="map-marker-glyph"
        aria-hidden="true"
        className={cn(
          "kern-map-marker-glyph relative grid size-8 shrink-0 place-items-center rounded-(--sys-shape-corner-full)",
          statusToneClassNames(effectiveTone, "solid"),
          // Live halo: static double ring (no decorative motion per Kern).
          live &&
            "outline-2 outline-(--sys-color-surface) ring-2 ring-(--sys-color-primary)",
          // A-003 guest consent ring: dashed primary outline while sharing.
          guest &&
            !consentExpired &&
            "outline-2 outline-dashed outline-(--sys-color-primary) outline-offset-2",
          selected && "ring-2 ring-(--sys-color-primary) ring-offset-1",
        )}
      >
        {icon ?? (
          <span
            data-slot="map-marker-dot"
            className={cn(
              "size-2.5 rounded-(--sys-shape-corner-full)",
              // Solid glyphs carry their on-tone ink: the dot inverts.
              "bg-(--sys-color-surface)",
            )}
          />
        )}
      </span>
      {label ? (
        <span
          data-slot="map-marker-label"
          className="kern-map-marker-label rounded-(--sys-shape-corner-full) bg-(--sys-color-inverse-surface) px-2 py-0.5 text-(length:--sys-typescale-label-medium-font-size) leading-(--sys-typescale-label-medium-line-height) font-(--sys-typescale-label-medium-font-weight) text-(--sys-color-inverse-on-surface) whitespace-nowrap"
        >
          {label}
        </span>
      ) : null}
      {guest && !consentExpired && consentLabel ? (
        <span
          data-slot="map-marker-consent"
          className="kern-map-marker-consent rounded-(--sys-shape-corner-full) border border-dashed border-(--sys-color-primary) bg-(--sys-color-surface) px-2 py-0.5 text-(length:--sys-typescale-label-medium-font-size) leading-(--sys-typescale-label-medium-line-height) text-(--sys-color-on-surface-variant) whitespace-nowrap"
        >
          {consentLabel}
        </span>
      ) : null}
      {guest && consentExpired ? (
        <span
          data-slot="map-marker-consent-paused"
          className={cn(
            "kern-map-marker-consent-paused size-2.5 rounded-(--sys-shape-corner-full)",
            statusToneDotClassName("neutral"),
          )}
        />
      ) : null}
    </span>
  );
}

export type MapPanelPosition = "floating" | "docked-top" | "docked-bottom";

export type MapPanelProps = Omit<ComponentPropsWithRef<"section">, "title"> & {
  /** Panel heading. Required: every floating surface must be nameable. */
  title: ReactNode;
  description?: ReactNode;
  /** Media slot: route preview, photo, mini-map snapshot from the host. */
  media?: ReactNode;
  /** Meta slot: status/tone row — the host composes `StatusPill` here. */
  meta?: ReactNode;
  /** Primary actions slot (usually Buttons from the host). */
  actions?: ReactNode;
  /** Footer slot: secondary lines, ETAs, disclaimers. */
  footer?: ReactNode;
  /**
   * Close action (R2 lexicon: a DOMAIN action, not state — allowlisted).
   * Renders the × control; omit it and no × renders.
   */
  onClose?: () => void;
  /**
   * Placement preset. The host engine anchors the panel; this only picks
   * the resting treatment (floating card vs docked edge sheet shape).
   */
  position?: MapPanelPosition;
};

/**
 * MapPanel — the ONE map overlay panel. A `Card` (elevated) with media,
 * title, meta, actions and footer slots + optional ×. Unifies the dispatch
 * map panels, Track/RoutePreview panels and backoffice console map card
 * (CMP-0049/0050/0921/2502/2518 visuals) — layout only, never engine.
 *
 * Usage: `<MapPanel title="Trip 12" meta={<StatusPill tone="info">En
 * route</StatusPill>} actions={…} onClose={…} />`.
 */
export function MapPanel({
  title,
  description,
  media,
  meta,
  actions,
  footer,
  onClose,
  position = "floating",
  className,
  ...props
}: MapPanelProps) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  return (
    <Card
      as="section"
      variant="elevated"
      data-slot="map-panel"
      data-position={position}
      aria-labelledby={titleId}
      className={cn(
        "kern-map-panel relative w-[min(22rem,calc(100vw-2rem))] overflow-hidden",
        position === "docked-top" && "rounded-t-none",
        position === "docked-bottom" && "rounded-b-none",
        className,
      )}
      {...props}
    >
      {media ? (
        <div data-slot="map-panel-media" className="max-h-40 overflow-hidden">
          {media}
        </div>
      ) : null}
      <div className="p-4">
        {meta ? (
          <div
            data-slot="map-panel-meta"
            className="mb-2 flex items-center gap-2"
          >
            {meta}
          </div>
        ) : null}
        <h2
          id={titleId}
          className="pr-8 text-(length:--sys-typescale-title-medium-font-size) leading-(--sys-typescale-title-medium-line-height) font-(--sys-typescale-title-medium-font-weight) text-(--sys-color-on-surface)"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-(length:--sys-typescale-body-medium-font-size) leading-(--sys-typescale-body-medium-line-height) text-(--sys-color-on-surface-variant)">
            {description}
          </p>
        ) : null}
        {actions ? (
          <div
            data-slot="map-panel-actions"
            className="mt-3 flex flex-wrap items-center gap-2"
          >
            {actions}
          </div>
        ) : null}
        {footer ? (
          <div
            data-slot="map-panel-footer"
            className="mt-3 border-t border-(--sys-color-outline-variant) pt-3 text-(length:--sys-typescale-body-small-font-size) leading-(--sys-typescale-body-small-line-height) text-(--sys-color-on-surface-variant)"
          >
            {footer}
          </div>
        ) : null}
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="kern-map-panel-close absolute end-2 top-2 grid size-10 place-items-center rounded-(--sys-shape-corner-full) text-(--sys-color-on-surface-variant) before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 before:bg-(--sys-color-on-surface-variant) hover:before:opacity-[var(--sys-state-hover)] focus-visible:before:opacity-[var(--sys-state-focus)]"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ×
          </span>
        </button>
      ) : null}
    </Card>
  );
}
