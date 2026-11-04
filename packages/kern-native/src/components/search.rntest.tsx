/**
 * Part A P1 — native Search PRIMITIVE behaviour (tests only).
 *
 * Boundary: the SearchView block is G1 — these rows cover the `Search`
 * primitive only (value contract, submit-vs-type lexicon, clear affordance,
 * docked-bar role) and never touch SearchView.
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Search } from "./search";

describe("Search primitive (native P1)", () => {
  it("is a search field with the default name", async () => {
    await render(<Search />);
    const field = screen.getByLabelText("Search");
    expect(field.props.accessibilityRole).toBe("search");
    expect(field.props.returnKeyType).toBe("search");
  });

  it("types through onValueChange without submitting", async () => {
    const seen: string[] = [];
    const submitted: string[] = [];
    await render(
      <Search
        label="Docs"
        onValueChange={(v: string) => seen.push(v)}
        onSearch={(v: string) => submitted.push(v)}
      />,
    );
    await act(async () => {
      fireEvent.changeText(screen.getByLabelText("Docs"), "tokens");
    });
    // R2 lexicon: query text lives in value/onValueChange; onSearch fires
    // only on submit. Typing must never submit.
    expect(seen).toContain("tokens");
    expect(submitted).toEqual([]);
  });

  it("submits the current query", async () => {
    const submitted: string[] = [];
    await render(
      <Search label="Docs" onSearch={(v: string) => submitted.push(v)} />,
    );
    await act(async () => {
      fireEvent.changeText(screen.getByLabelText("Docs"), "tokens");
    });
    await act(async () => {
      fireEvent(screen.getByLabelText("Docs"), "onSubmitEditing");
    });
    expect(submitted).toEqual(["tokens"]);
  });

  it("shows the clear action only while a query is present", async () => {
    await render(<Search label="Docs" />);
    expect(screen.queryByLabelText("Clear search")).toBeNull();
    await act(async () => {
      fireEvent.changeText(screen.getByLabelText("Docs"), "tokens");
    });
    expect(screen.getByLabelText("Clear search")).toBeTruthy();
  });

  it("clears the query through the clear action", async () => {
    const seen: string[] = [];
    await render(
      <Search label="Docs" onValueChange={(v: string) => seen.push(v)} />,
    );
    await act(async () => {
      fireEvent.changeText(screen.getByLabelText("Docs"), "tokens");
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Clear search"));
    });
    expect(seen[seen.length - 1]).toBe("");
    expect(screen.queryByLabelText("Clear search")).toBeNull();
  });

  it("honours an uncontrolled default", async () => {
    await render(<Search label="Docs" defaultValue="button" />);
    expect(screen.getByDisplayValue("button")).toBeTruthy();
  });

  it("does not move a controlled value on its own", async () => {
    const seen: string[] = [];
    await render(
      <Search
        label="Docs"
        value="pinned"
        onValueChange={(v: string) => seen.push(v)}
      />,
    );
    await act(async () => {
      fireEvent.changeText(screen.getByLabelText("Docs"), "tokens");
    });
    // Reported, but the host owns the text.
    expect(seen).toContain("tokens");
    expect(screen.getByDisplayValue("pinned")).toBeTruthy();
  });
});
