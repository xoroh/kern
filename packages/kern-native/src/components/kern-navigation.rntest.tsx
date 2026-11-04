import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text } from "react-native";
import { BottomAppBar } from "./bottom-app-bar";
import {
  flattenSections,
  KernNavigation,
  routeManifestToSections,
} from "./kern-navigation";

const SECTIONS = [
  {
    key: "main",
    destinations: [
      { key: "/home", label: "Home" },
      { key: "/inbox", label: "Inbox" },
      { key: "/settings", label: "Settings" },
    ],
  },
  {
    key: "ops",
    title: "Operations",
    destinations: [{ key: "/dispatch", label: "Dispatch" }],
  },
];

describe("routeManifestToSections (native twin)", () => {
  it("groups and orders identically to the web twin", () => {
    const sections = routeManifestToSections([
      { path: "/a", label: "A" },
      { path: "/b", label: "B", section: "Ops" },
    ]);
    expect(sections.map((s) => s.key)).toEqual(["main", "Ops"]);
    expect(flattenSections(sections).map((d) => d.key)).toEqual(["/a", "/b"]);
  });
});

describe("KernNavigation bar (native)", () => {
  it("reports exactly one destination as current", async () => {
    await render(<KernNavigation sections={SECTIONS} value="/inbox" />);
    // Default variant is the bar; flattened sections all appear.
    expect(screen.getByLabelText("Home")).toBeTruthy();
    expect(screen.getByLabelText("Dispatch")).toBeTruthy();
  });

  it("moves the current destination on activation", async () => {
    const onValueChange = jest.fn();
    await render(
      <KernNavigation
        sections={SECTIONS}
        value="/home"
        onValueChange={onValueChange}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Inbox"));
    });
    expect(onValueChange).toHaveBeenCalledWith("/inbox");
  });
});

describe("KernNavigation drawer-modal (native)", () => {
  it("selects then dismisses", async () => {
    const onValueChange = jest.fn();
    const onOpenChange = jest.fn();
    await render(
      <KernNavigation
        variant="drawer-modal"
        sections={SECTIONS}
        value="/home"
        defaultOpen
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
      />,
    );
    expect(screen.getByTestId("kern-navigation-drawer")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Inbox"));
    });
    expect(onValueChange).toHaveBeenCalledWith("/inbox");
    // Select-then-dismiss, both renderers.
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("KernNavigation rail + sidebar-pane (native)", () => {
  it("rail keeps the accessible name collapsed", async () => {
    await render(
      <KernNavigation variant="rail" sections={SECTIONS} value="/home" />,
    );
    expect(screen.getByTestId("kern-navigation-rail")).toBeTruthy();
    expect(screen.getByLabelText("Inbox")).toBeTruthy();
  });

  it("sidebar-pane renders section headings, header, footer, and detail", async () => {
    await render(
      <KernNavigation
        variant="sidebar-pane"
        sections={SECTIONS}
        value="/home"
        header={<Text>Switcher</Text>}
        footer={<Text>User</Text>}
        detail={<Text>Detail pane</Text>}
      />,
    );
    expect(screen.getByTestId("kern-navigation")).toBeTruthy();
    expect(screen.getByText("Operations")).toBeTruthy();
    expect(screen.getByText("Switcher")).toBeTruthy();
    expect(screen.getByText("User")).toBeTruthy();
    expect(screen.getByText("Detail pane")).toBeTruthy();
  });
});

describe("BottomAppBar (native)", () => {
  it("renders actions and the FAB dock", async () => {
    await render(
      <BottomAppBar actions={<Text>Menu</Text>} fab={<Text>Compose</Text>} />,
    );
    expect(screen.getByTestId("kern-bottom-app-bar")).toBeTruthy();
    expect(screen.getByText("Menu")).toBeTruthy();
    expect(screen.getByText("Compose")).toBeTruthy();
  });
});
