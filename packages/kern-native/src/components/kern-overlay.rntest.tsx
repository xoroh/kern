import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text } from "react-native";
import { KernOverlay } from "./kern-overlay";

/**
 * Native KernOverlay — one overlay system.
 *
 * N-side proofs (mirroring the W keyboard/focus proofs): scrim/back
 * dismissal paths report `onOpenChange(false)`; snap detents cycle through
 * the adjustable handle; the tabbed scaffold switches panels; dock never
 * claims modality.
 */

describe("KernOverlay modal (native)", () => {
  it("opens on trigger and reports dismissal", async () => {
    let openState = false;
    const onOpenChange = jest.fn((next: boolean) => {
      openState = next;
    });
    await render(
      <KernOverlay
        title="Settings"
        trigger={<Text>Open</Text>}
        open={openState}
        onOpenChange={onOpenChange}
      >
        <Text>Body</Text>
      </KernOverlay>,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Settings"));
    });
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("renders the centered dialog with title and body when open", async () => {
    await render(
      <KernOverlay title="Settings" defaultOpen>
        <Text>Body</Text>
      </KernOverlay>,
    );
    expect(screen.getByTestId("kern-overlay")).toBeTruthy();
    expect(screen.getByText("Settings")).toBeTruthy();
    expect(screen.getByText("Body")).toBeTruthy();
  });

  it("closes on the explicit close control and reports the action", async () => {
    const onClose = jest.fn();
    const onOpenChange = jest.fn();
    await render(
      <KernOverlay
        title="Settings"
        defaultOpen
        onClose={onClose}
        onOpenChange={onOpenChange}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Close"));
    });
    expect(onClose).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("KernOverlay alert (native)", () => {
  it("renders the alert surface with decision labels", async () => {
    await render(
      <KernOverlay
        variant="alert"
        title="Delete?"
        description="Irreversible."
        defaultOpen
        confirmLabel="Delete"
        cancelLabel="Keep"
      />,
    );
    expect(screen.getByTestId("kern-overlay-alert")).toBeTruthy();
    expect(screen.getByText("Delete?")).toBeTruthy();
  });
});

describe("KernOverlay sheet + snap + dock (native)", () => {
  it("opens the bottom sheet surface", async () => {
    await render(
      <KernOverlay variant="sheet" title="Filters" defaultOpen>
        <Text>Sheet body</Text>
      </KernOverlay>,
    );
    expect(screen.getByTestId("kern-overlay-sheet")).toBeTruthy();
    expect(screen.getByText("Sheet body")).toBeTruthy();
  });

  it("exposes the snap detents through the adjustable handle", async () => {
    await render(
      <KernOverlay
        variant="sheet"
        title="Snap"
        defaultOpen
        snapPoints={[0.5, 0.9]}
      >
        <Text>Sheet body</Text>
      </KernOverlay>,
    );
    // First detent announced; pressing cycles to the next.
    expect(screen.getByLabelText("Snap, snap point 1 of 2")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Snap, snap point 1 of 2"));
    });
  });

  it("renders the persistent dock without a modal surface", async () => {
    await render(
      <KernOverlay variant="dock" title="Quick actions">
        <Text>Dock body</Text>
      </KernOverlay>,
    );
    expect(screen.getByTestId("kern-overlay-dock")).toBeTruthy();
    expect(screen.getByText("Dock body")).toBeTruthy();
  });
});

describe("KernOverlay tabbed-dialog (native)", () => {
  const tabs = [
    { key: "general", label: "General", panel: <Text>General panel</Text> },
    { key: "members", label: "Members", panel: <Text>Members panel</Text> },
  ];

  it("switches panels on tab activation and reports the change", async () => {
    const onActiveTabChange = jest.fn();
    await render(
      <KernOverlay
        variant="tabbed-dialog"
        title="Workspace"
        defaultOpen
        tabs={tabs}
        onActiveTabChange={onActiveTabChange}
      />,
    );
    expect(screen.getByText("General panel")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Members"));
    });
    expect(onActiveTabChange).toHaveBeenCalledWith("members");
    expect(screen.getByText("Members panel")).toBeTruthy();
  });
});
