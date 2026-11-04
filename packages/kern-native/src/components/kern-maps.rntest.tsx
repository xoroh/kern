import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text } from "react-native";
import { MapMarker, MapPanel, mapMarkerDatumToProps } from "./kern-maps";

describe("native MapMarker", () => {
  it("renders the default pin glyph with a tone dot", async () => {
    await render(<MapMarker />);
    expect(screen.getByTestId("kern-map-marker")).toBeTruthy();
    expect(screen.getByTestId("kern-map-marker-glyph")).toBeTruthy();
    expect(screen.getByTestId("kern-map-marker-dot")).toBeTruthy();
  });

  it("paints all five kinds with label chips, no engine", async () => {
    await render(
      <>
        <MapMarker kind="pin" />
        <MapMarker kind="vehicle" tone="info" />
        <MapMarker kind="person" tone="success" />
        <MapMarker kind="guest" tone="warning" live />
        <MapMarker kind="stop" label="3" />
      </>,
    );
    expect(screen.getAllByTestId("kern-map-marker")).toHaveLength(5);
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("paints the A-003 guest consent line while sharing", async () => {
    await render(
      <MapMarker kind="guest" live consentLabel="Sharing until 14:30" />,
    );
    expect(screen.getByText("Sharing until 14:30")).toBeTruthy();
    expect(screen.queryByTestId("kern-map-marker-consent-paused")).toBeNull();
  });

  it("falls back to paused treatment on expired guest consent", async () => {
    await render(<MapMarker kind="guest" consentExpired />);
    expect(screen.getByTestId("kern-map-marker-consent-paused")).toBeTruthy();
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

describe("native MapPanel", () => {
  it("renders a named panel with actions, footer and ×", async () => {
    const onClose = jest.fn();
    await render(
      <MapPanel
        title="Trip 12"
        description="Airport pickup"
        meta={<Text>En route</Text>}
        actions={<Text>Message driver</Text>}
        footer="ETA 14:32"
        onClose={onClose}
      />,
    );
    expect(screen.getByTestId("kern-map-panel")).toBeTruthy();
    expect(screen.getByText("Trip 12")).toBeTruthy();
    expect(screen.getByText("ETA 14:32")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-map-panel-close"));
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders no × without onClose", async () => {
    await render(<MapPanel title="Trip 12" />);
    expect(screen.queryByTestId("kern-map-panel-close")).toBeNull();
  });
});
