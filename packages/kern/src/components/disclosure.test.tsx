import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { Accordion } from "./accordion";
import { Autocomplete, useAutocompleteFilteredItems } from "./autocomplete";
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

  it("keeps both panels open when multiple", async () => {
    // Edge composition, carried from the move-5 Group lesson: `multiple`
    // changes the contract from one-open to many-open. Sensitivity-proven:
    // the same assertions in single mode fail (scratch probe, RED confirmed,
    // deleted).
    const user = userEvent.setup();
    render(
      <Accordion.Root multiple>
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
    await user.click(screen.getByRole("button", { name: "Second" }));
    expect(screen.getByText("First body")).toBeInTheDocument();
    expect(screen.getByText("Second body")).toBeInTheDocument();
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

  it("renders the action and fires it", async () => {
    // Edge composition, carried from the move-5 Group lesson: the action is
    // a live control inside the transient surface, not decoration.
    // Sensitivity-proven: the same assertions against an action-less push
    // fail (scratch probe, RED confirmed, deleted).
    const user = userEvent.setup();
    const onAction = vi.fn();
    const manager = createSnackbarManager();
    render(
      <Snackbar.Provider toastManager={manager}>
        <Snackbar.Viewport>
          <Snackbar.List />
        </Snackbar.Viewport>
      </Snackbar.Provider>,
    );
    act(() => {
      manager.add({
        title: "Saved",
        actionProps: { children: "Undo", onClick: onAction },
      });
    });
    await user.click(await screen.findByRole("button", { name: "Undo" }));
    expect(onAction).toHaveBeenCalledTimes(1);
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

  function FruitOptions() {
    // move16-FAIL: options MUST come from the root's filtered list. A
    // hand-declared Item never hides — Base UI only computes `filteredItems`
    // data — so static rendering shows non-matches alongside the Empty node.
    const items = useAutocompleteFilteredItems<(typeof FRUIT)[number]>();
    return (
      <>
        {items.map((f) => (
          <Autocomplete.Item key={f.value} value={f.value}>
            {f.label}
          </Autocomplete.Item>
        ))}
      </>
    );
  }

  function FruitAutocomplete() {
    return (
      <Autocomplete.Root items={FRUIT}>
        <Autocomplete.Input aria-label="Fruit" />
        <Autocomplete.Content>
          <FruitOptions />
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
    // REGEX, not a string. Base UI's live-region helper appends U+2060 WORD
    // JOINER so a screen reader re-announces identical text; the node's
    // textContent is "No match\u2060", so an exact string match fails against a
    // component that is behaving correctly. This is the real cause of the red
    // test — not the fixture, and not the contract.
    expect(screen.getByText(/No match/)).toBeInTheDocument();
    void container;
  });

  it("does not show the empty state when the query matches", async () => {
    const user = userEvent.setup();
    render(<FruitAutocomplete />);
    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    await user.keyboard("app");
    const popup = document.querySelector("[data-slot='autocomplete-content']");
    expect(popup).not.toHaveAttribute("data-empty");
    expect(screen.queryByText(/No match/)).toBeNull();
  });

  it("removes non-matching options from the list", async () => {
    // move16-FAIL guard: typing "app" must leave Apple and remove Banana —
    // from AT and sight. A hand-declared Item never hides (Base UI only
    // filters the `filteredItems` data), so this fails until the anatomy
    // renders from the hook.
    const user = userEvent.setup();
    render(<FruitAutocomplete />);
    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    await user.keyboard("app");
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Banana" })).toBeNull();
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

  it("leaves the list unfiltered in mode none", async () => {
    // Edge composition, carried from the move-5 Group lesson: mode "none"
    // disables filtering (and announces aria-autocomplete="none") while the
    // list shell still renders — measured first-hand, not assumed. The
    // default mode filters Banana out on the same query.
    // Sensitivity-proven: the same assertions in the default mode fail
    // (scratch probe, RED confirmed, deleted).
    const user = userEvent.setup();
    render(
      <Autocomplete.Root items={FRUIT} mode="none">
        <Autocomplete.Input aria-label="Fruit" />
        <Autocomplete.Content>
          {FRUIT.map((f) => (
            <Autocomplete.Item key={f.value} value={f.value}>
              {f.label}
            </Autocomplete.Item>
          ))}
          <Autocomplete.Empty>No match</Autocomplete.Empty>
        </Autocomplete.Content>
      </Autocomplete.Root>,
    );
    const input = screen.getByRole("combobox", { name: "Fruit" });
    await user.click(input);
    await user.keyboard("app");
    expect(input).toHaveAttribute("aria-autocomplete", "none");
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });
});
