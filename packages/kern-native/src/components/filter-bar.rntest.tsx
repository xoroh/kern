import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { FilterBar } from "./filter-bar";

const filters = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "live", label: "Live" },
      { value: "done", label: "Done" },
    ],
  },
];

describe("native FilterBar", () => {
  it("renders the toolbar with facet chips", async () => {
    await render(<FilterBar filters={filters} />);
    expect(screen.getByTestId("kern-filter-bar")).toBeTruthy();
    expect(screen.getByText("Live")).toBeTruthy();
    expect(screen.getByText("Done")).toBeTruthy();
  });

  it("toggles options and reports the merged model", async () => {
    const seen: unknown[] = [];
    await render(
      <FilterBar
        filters={filters}
        onFiltersChange={(active) => seen.push(active)}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByText("Live"));
    });
    expect(seen).toEqual([{ status: ["live"] }]);
    await act(async () => {
      fireEvent.press(screen.getByText("Done"));
    });
    expect(seen[seen.length - 1]).toEqual({ status: ["live", "done"] });
  });

  it("clears everything through Clear all", async () => {
    const seen: unknown[] = [];
    await render(
      <FilterBar
        filters={filters}
        onFiltersChange={(active) => seen.push(active)}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByText("Live"));
    });
    await act(async () => {
      fireEvent.press(screen.getByText("Clear all"));
    });
    expect(seen[seen.length - 1]).toEqual({});
  });

  it("applies saved views", async () => {
    const seen: unknown[] = [];
    await render(
      <FilterBar
        filters={filters}
        savedViews={[
          { id: "live", label: "Live now", filters: { status: ["live"] } },
        ]}
        onFiltersChange={(active) => seen.push(active)}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByText("Live now"));
    });
    expect(seen[seen.length - 1]).toEqual({ status: ["live"] });
  });

  it("opens the host-owned filter sheet with an active count", async () => {
    let opened = 0;
    await render(
      <FilterBar
        filters={filters}
        onOpenFilters={() => {
          opened += 1;
        }}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByText("Live"));
    });
    await act(async () => {
      fireEvent.press(screen.getByText("All filters (1)"));
    });
    expect(opened).toBe(1);
  });
});
