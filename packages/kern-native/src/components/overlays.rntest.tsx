import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Accordion } from "./accordion";
import { AlertDialog } from "./alert-dialog";
import { Collapsible } from "./collapsible";
import { ContextMenu } from "./context-menu";
import { Dialog } from "./dialog";
import { Menu } from "./menu";
import { Select } from "./select";
import { Sheet } from "./sheet";
import { Snackbar } from "./snackbar";
import { Text } from "./text";

describe("native Accordion render", () => {
  it("expands and collapses sections", async () => {
    await render(
      <Accordion
        sections={[
          { title: "One", content: "First body" },
          { title: "Two", content: "Second body" },
        ]}
      />,
    );
    expect(screen.queryByText("First body")).toBeNull();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("One"));
    });
    expect(screen.getByText("First body")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("One"));
    });
    expect(screen.queryByText("First body")).toBeNull();
  });
});

describe("native Collapsible render", () => {
  it("toggles content", async () => {
    await render(
      <Collapsible title="Details">
        <Text>More info</Text>
      </Collapsible>,
    );
    expect(screen.queryByText("More info")).toBeNull();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Details"));
    });
    expect(screen.getByText("More info")).toBeTruthy();
  });
});

describe("native Dialog render", () => {
  it("confirms through the primary action", async () => {
    let confirmed = 0;
    await render(
      <Dialog
        visible
        title="Order 42"
        actions={[{ label: "OK", primary: true, onPress: () => confirmed++ }]}
      />,
    );
    expect(screen.getByText("Order 42")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("OK"));
    });
    expect(confirmed).toBe(1);
  });
});

describe("native AlertDialog render", () => {
  it("cancels through the cancel action", async () => {
    let cancelled = 0;
    await render(
      <AlertDialog
        visible
        title="Delete?"
        message="Irreversible."
        onCancel={() => cancelled++}
      />,
    );
    expect(screen.getByText("Delete?")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Cancel"));
    });
    expect(cancelled).toBe(1);
  });
});

describe("native Sheet render", () => {
  it("shows the title and closes", async () => {
    let dismissed = 0;
    await render(
      <Sheet visible title="Filters" onDismiss={() => dismissed++} />,
    );
    expect(screen.getByText("Filters")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Close sheet"));
    });
    expect(dismissed).toBe(1);
  });
});

describe("native Snackbar render", () => {
  it("shows the message and fires the action", async () => {
    let acted = 0;
    await render(
      <Snackbar
        visible
        message="Saved"
        actionLabel="Undo"
        onAction={() => acted++}
      />,
    );
    expect(screen.getByText("Saved")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Undo"));
    });
    expect(acted).toBe(1);
  });
});

describe("native Menu render", () => {
  it("opens on trigger and selects an item", async () => {
    let chosen = "";
    await render(
      <Menu
        triggerLabel="File"
        trigger={<Text>Open menu</Text>}
        items={[{ label: "New", onSelect: () => (chosen = "new") }]}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("File"));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("New"));
    });
    expect(chosen).toBe("new");
  });
});

describe("native ContextMenu render", () => {
  it("opens on long press", async () => {
    let chosen = "";
    await render(
      <ContextMenu
        triggerLabel="Area"
        items={[{ label: "Copy", onSelect: () => (chosen = "copy") }]}
      >
        <Text>Press area</Text>
      </ContextMenu>,
    );
    await act(async () => {
      fireEvent(screen.getByLabelText("Area"), "onLongPress");
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Copy"));
    });
    expect(chosen).toBe("copy");
  });
});

describe("native Select render", () => {
  it("chooses an option", async () => {
    let chosen = "";
    await render(
      <Select
        accessibilityLabel="Plan"
        options={[
          { value: "free", label: "Free" },
          { value: "pro", label: "Pro" },
        ]}
        onValueChange={(v) => (chosen = v)}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Plan"));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Pro"));
    });
    expect(chosen).toBe("pro");
    expect(screen.getByLabelText("Plan")).toBeTruthy();
  });
});
