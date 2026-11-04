import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { filterSuggestions, SearchView } from "./search-view";

const suggestions = [
  {
    id: "b",
    title: "Bookings",
    description: "Dispatch queue",
    keywords: ["queue"],
  },
  { id: "p", title: "Passengers", description: "Directory" },
];

describe("SearchView", () => {
  it("filters suggestions as the query types", async () => {
    const user = userEvent.setup();
    render(<SearchView suggestions={suggestions} defaultOpen />);
    expect(screen.getByText("Passengers")).toBeTruthy();
    await user.type(screen.getByRole("searchbox", { name: "Search" }), "book");
    expect(screen.queryByText("Passengers")).toBeNull();
    expect(screen.getByText("Bookings")).toBeTruthy();
  });

  it("matches keywords, not just titles", () => {
    expect(filterSuggestions(suggestions, "queue").map((s) => s.id)).toEqual([
      "b",
    ]);
    expect(filterSuggestions(suggestions, "")).toHaveLength(2);
  });

  it("selects a suggestion and closes", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <SearchView
        suggestions={suggestions}
        defaultOpen
        onSelect={onSelect}
        onOpenChange={onOpenChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Bookings/ }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "b" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("shows EmptySearch with a clear action when nothing matches", async () => {
    const user = userEvent.setup();
    // Dialog content portals to document.body, outside the render container.
    render(<SearchView suggestions={suggestions} defaultOpen />);
    await user.type(screen.getByRole("searchbox", { name: "Search" }), "zzz");
    const empty = document.querySelector('[data-slot="empty-search"]');
    expect(empty).toBeTruthy();
    expect(empty?.textContent).toMatch(/No results for/);
    await user.click(
      within(empty as HTMLElement).getByRole("button", {
        name: "Clear search",
      }),
    );
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("");
  });

  it("opens on cmd-K", async () => {
    const user = userEvent.setup();
    render(<SearchView suggestions={suggestions} />);
    expect(screen.queryByRole("searchbox", { name: "Search" })).toBeNull();
    await user.keyboard("{Meta>}k{/Meta}");
    expect(screen.getByRole("searchbox", { name: "Search" })).toBeTruthy();
  });
});
