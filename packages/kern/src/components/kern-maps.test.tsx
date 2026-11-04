import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MapMarker, MapPanel, mapMarkerDatumToProps } from "./kern-maps";
import { StatusPill } from "./status-pill";

describe("MapMarker", () => {
  it("renders the default pin glyph with a tone dot", () => {
    const { container } = render(<MapMarker />);
    expect(container.querySelector('[data-slot="map-marker"]')).toBeTruthy();
    expect(
      container.querySelector('[data-slot="map-marker-glyph"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[data-slot="map-marker-dot"]'),
    ).toBeTruthy();
  });

  it("paints all five kinds without an engine", () => {
    const { container } = render(
      <>
        <MapMarker kind="pin" />
        <MapMarker kind="vehicle" tone="info" />
        <MapMarker kind="person" tone="success" />
        <MapMarker kind="guest" tone="warning" live />
        <MapMarker kind="stop" label="3" />
      </>,
    );
    const markers = container.querySelectorAll('[data-slot="map-marker"]');
    expect(markers).toHaveLength(5);
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("paints the A-003 guest consent ring + consent line while sharing", () => {
    const { container } = render(
      <MapMarker kind="guest" live consentLabel="Sharing until 14:30" />,
    );
    expect(screen.getByText("Sharing until 14:30")).toBeTruthy();
    expect(
      container.querySelector('[data-slot="map-marker-consent"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[data-slot="map-marker-consent-paused"]'),
    ).toBeNull();
  });

  it("falls back to neutral + paused treatment on expired guest consent", () => {
    const { container } = render(
      <MapMarker
        kind="guest"
        consentExpired
        consentLabel="Sharing until 14:30"
      />,
    );
    // Expired consent never paints the sharing line.
    expect(screen.queryByText("Sharing until 14:30")).toBeNull();
    expect(
      container.querySelector('[data-slot="map-marker-consent-paused"]'),
    ).toBeTruthy();
  });

  it("maps datum contracts to props without engine fields", () => {
    expect(
      mapMarkerDatumToProps({
        id: "v-1",
        kind: "vehicle",
        tone: "info",
        label: "12",
        selected: true,
        live: true,
      }),
    ).toEqual({
      kind: "vehicle",
      tone: "info",
      label: "12",
      selected: true,
      live: true,
    });
  });
});

describe("MapPanel", () => {
  it("renders a named elevated panel with meta, actions and footer", () => {
    render(
      <MapPanel
        title="Trip 12"
        description="Airport pickup"
        meta={<StatusPill tone="info">En route</StatusPill>}
        actions={<button type="button">Message driver</button>}
        footer="ETA 14:32"
      />,
    );
    expect(screen.getByRole("heading", { name: "Trip 12" })).toBeTruthy();
    expect(screen.getByText("En route")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Message driver" })).toBeTruthy();
    expect(screen.getByText("ETA 14:32")).toBeTruthy();
  });

  it("closes through the × action and renders no × without onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(<MapPanel title="Trip 12" onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "Close panel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    rerender(<MapPanel title="Trip 12" />);
    expect(screen.queryByRole("button", { name: "Close panel" })).toBeNull();
  });
});
