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
  // ADR 002: `items` on the Root is the source of truth for emptiness, and
  // options must be rendered FROM the filtered list. The previous version of
  // this test hand-declared one `<Item value="apple">` and asserted that typing
  // a non-match surfaced "No match" — a contract nobody had defined, which
  // failed against correct behaviour.
  const FRUIT = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
  ];

  function FruitAutocomplete() {
    return (
      <Autocomplete.Root items={FRUIT}>
        <Autocomplete.Input aria-label="Fruit" />
        <Autocomplete.Content>
          {/* Options come from the root's items — see ADR 002 rule 2. */}
          {FRUIT.map((f) => (
            <Autocomplete.Item key={f.value} value={f.value}>
              {f.label}
            </Autocomplete.Item>
          ))}
          <Autocomplete.Empty>No match</Autocomplete.Empty>
        </Autocomplete.Content>
      </Autocomplete.Root>
    );
  }

  it("shows suggestions for the query", async () => {
    const user = userEvent.setup();
    render(<FruitAutocomplete />);
    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    await user.keyboard("app");
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
  });

  it("marks the popup empty and shows the empty node when nothing matches", async () => {
    const user = userEvent.setup();
    const { container } = render(<FruitAutocomplete />);
    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    await user.keyboard("zzz");
    // The PUBLIC signal: `data-empty` on the popup. Asserting this rather than
    // the element's presence matters — the empty node is ALWAYS mounted, only
    // its children are conditional (ADR 002 rule 3).
    const popup = document.querySelector("[data-slot='autocomplete-content']");
    expect(popup).toHaveAttribute("data-empty");
    expect(screen.getByText("No match")).toBeInTheDocument();
    void container;
  });

  it("does not show the empty state when the query matches", async () => {
    const user = userEvent.setup();
    render(<FruitAutocomplete />);
    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    await user.keyboard("app");
    const popup = document.querySelector("[data-slot='autocomplete-content']");
    expect(popup).not.toHaveAttribute("data-empty");
    expect(screen.queryByText("No match")).toBeNull();
  });

  // The clause that would have caught the original test: a hand-declared Item is
  // not part of the filtered list, so it must NOT suppress the empty state.
  it("a hand-declared item does not suppress the empty state", async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete.Root items={FRUIT}>
        <Autocomplete.Input aria-label="Fruit" />
        <Autocomplete.Content>
          <Autocomplete.Item value="apple">Apple</Autocomplete.Item>
          <Autocomplete.Empty>No match</Autocomplete.Empty>
        </Autocomplete.Content>
      </Autocomplete.Root>,
    );
    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    await user.keyboard("zzz");
    const popup = document.querySelector("[data-slot='autocomplete-content']");
    expect(popup).toHaveAttribute("data-empty");
  });

  // The empty node's root is always mounted — Base UI announces through it, so
  // removing it would break the announcement (ADR 002 rule 3).
  it("keeps the empty node mounted when there ARE matches", async () => {
    const user = userEvent.setup();
    render(<FruitAutocomplete />);
    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    await user.keyboard("app");
    expect(
      document.querySelector("[data-slot='autocomplete-empty']"),
    ).not.toBeNull();
  });
});
