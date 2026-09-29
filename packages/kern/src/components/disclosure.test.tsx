import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { Accordion } from "./accordion";
import { Autocomplete } from "./autocomplete";
import { Collapsible } from "./collapsible";
import { ScrollArea } from "./scroll-area";
import { createSnackbarManager, Snackbar } from "./snackbar";

describe("Accordion", () => {
  it("expands one panel at a time", async () => {
    const user = userEvent.setup();
    render(
      <Accordion.Root>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>First</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>First body</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Header>
            <Accordion.Trigger>Second</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Second body</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );
    await user.click(screen.getByRole("button", { name: "First" }));
    expect(screen.getByText("First body")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Second" }));
    expect(screen.queryByText("First body")).not.toBeInTheDocument();
  });
});

describe("Collapsible", () => {
  it("toggles its panel", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Panel>Hidden content</Collapsible.Panel>
      </Collapsible.Root>,
    );
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Details" }));
    expect(screen.getByText("Hidden content")).toBeInTheDocument();
  });
});

describe("Snackbar", () => {
  it("shows a message through the manager", async () => {
    const manager = createSnackbarManager();
    render(
      <Snackbar.Provider toastManager={manager}>
        <Snackbar.Viewport>
          <Snackbar.List />
        </Snackbar.Viewport>
      </Snackbar.Provider>,
    );
    act(() => {
      manager.add({ title: "Saved" });
    });
    expect(await screen.findByText("Saved")).toBeInTheDocument();
  });

  it("dismisses a message through the manager", async () => {
    const manager = createSnackbarManager();
    render(
      <Snackbar.Provider toastManager={manager}>
        <Snackbar.Viewport>
          <Snackbar.List />
        </Snackbar.Viewport>
      </Snackbar.Provider>,
    );
    let id = "";
    act(() => {
      id = manager.add({ title: "Saved" });
    });
    expect(await screen.findByText("Saved")).toBeInTheDocument();
    act(() => {
      manager.close(id);
    });
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });
});

describe("ScrollArea", () => {
  it("renders scrollable content", () => {
    render(
      <ScrollArea.Root className="h-24">
        <ScrollArea.Viewport>
          <p>Long content</p>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>,
    );
    expect(screen.getByText("Long content")).toBeInTheDocument();
  });
});

describe("Autocomplete", () => {
  it("suggests matches while typing", async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete.Root
        items={[
          { value: "apple", label: "Apple" },
          { value: "banana", label: "Banana" },
        ]}
      >
        <Autocomplete.Label>Fruit</Autocomplete.Label>
        <Autocomplete.Input aria-label="Fruit" />
        <Autocomplete.Content>
          <Autocomplete.Item value="apple">Apple</Autocomplete.Item>
          <Autocomplete.Empty>No match</Autocomplete.Empty>
        </Autocomplete.Content>
      </Autocomplete.Root>,
    );
    const input = screen.getByRole("combobox", { name: "Fruit" });
    await user.click(input);
    await user.keyboard("zzz");
    expect(screen.getByText("No match")).toBeInTheDocument();
  });
});
