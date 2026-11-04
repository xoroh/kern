import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react-native";
import { act } from "react";
import { CsvExportButton } from "./csv-export-button";
import { EmptySearch } from "./empty-search";
import { ListWithSearchAndFilters } from "./list-with-search-and-filters";
import { SearchView } from "./search-view";

const suggestions = [
  { id: "b", title: "Bookings", description: "Dispatch queue" },
  { id: "p", title: "Passengers" },
];

describe("native SearchView", () => {
  it("filters inline suggestions as the query types", async () => {
    await render(<SearchView suggestions={suggestions} />);
    expect(screen.getByText("Passengers")).toBeTruthy();
    await act(async () => {
      fireEvent.changeText(screen.getByLabelText("Search"), "book");
    });
    expect(screen.queryByText("Passengers")).toBeNull();
    expect(screen.getByText("Bookings")).toBeTruthy();
  });

  it("selects a suggestion inline", async () => {
    const seen: string[] = [];
    await render(
      <SearchView
        suggestions={suggestions}
        onSelect={(suggestion) => seen.push(suggestion.id)}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-search-view-result-b"));
    });
    expect(seen).toEqual(["b"]);
  });

  it("shows EmptySearch when nothing matches", async () => {
    await render(<SearchView suggestions={suggestions} />);
    await act(async () => {
      fireEvent.changeText(screen.getByLabelText("Search"), "zzz");
    });
    expect(screen.getByTestId("kern-empty-search")).toBeTruthy();
  });

  it("sheet presentation opens and closes", async () => {
    const states: boolean[] = [];
    await render(
      <SearchView
        suggestions={suggestions}
        presentation="sheet"
        defaultOpen
        onOpenChange={(open) => states.push(open)}
      />,
    );
    expect(screen.getByTestId("kern-search-view")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-search-view-result-b"));
    });
    expect(states).toEqual([false]);
  });
});

describe("native EmptySearch", () => {
  it("echoes the query with a clear action", async () => {
    let cleared = 0;
    await render(
      <EmptySearch
        query="xyz"
        onClear={() => {
          cleared += 1;
        }}
      />,
    );
    expect(screen.getByText(/No results for.*xyz/)).toBeTruthy();
    const state = within(screen.getByTestId("kern-empty-search"));
    await act(async () => {
      fireEvent.press(state.getByText("Clear search"));
    });
    expect(cleared).toBe(1);
  });
});

describe("native CsvExportButton", () => {
  it("hands the CSV to onExport (no silent download on native)", async () => {
    const seen: Array<[string, string]> = [];
    await render(
      <CsvExportButton
        columns={[{ key: "name", title: "Name" }]}
        rows={[{ name: "Ada" }]}
        filename="crew.csv"
        onExport={(csv, filename) => seen.push([csv, filename])}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-csv-export-button"));
    });
    expect(seen).toEqual([["Name\r\nAda", "crew.csv"]]);
  });
});

describe("native ListWithSearchAndFilters", () => {
  const rows = [
    { id: "a", title: "Airport pickup", status: "live" },
    { id: "b", title: "City tour", status: "done" },
  ];
  const defs = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "live", label: "Live" },
        { value: "done", label: "Done" },
      ],
    },
  ];

  it("wires search to the list and recovers through EmptySearch", async () => {
    await render(
      <ListWithSearchAndFilters rows={rows} searchLabel="Search trips" />,
    );
    await act(async () => {
      fireEvent.changeText(screen.getByLabelText("Search trips"), "zzz");
    });
    expect(screen.queryByText("Airport pickup")).toBeNull();
    const empty = within(screen.getByTestId("kern-empty-search"));
    await act(async () => {
      fireEvent.press(empty.getByText("Clear search"));
    });
    expect(screen.getByText("Airport pickup")).toBeTruthy();
  });

  it("facets rows through the filter bar", async () => {
    await render(<ListWithSearchAndFilters rows={rows} filterDefs={defs} />);
    await act(async () => {
      fireEvent.press(screen.getByText("Live"));
    });
    expect(screen.getByText("Airport pickup")).toBeTruthy();
    expect(screen.queryByText("City tour")).toBeNull();
    await act(async () => {
      fireEvent.press(screen.getByText("Clear all"));
    });
    expect(screen.getByText("City tour")).toBeTruthy();
  });

  it("shows the idle empty state without query or filters", async () => {
    await render(<ListWithSearchAndFilters rows={[]} />);
    // No filtering and no rows: the default idle EmptyState.
    expect(screen.getByText("No items")).toBeTruthy();
  });
});
