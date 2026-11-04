import { render } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import { DataTable } from "./data-table";
import { EmptySearch } from "./empty-search";
import { FilterBar } from "./filter-bar";
import { List } from "./list";
import { ListWithSearchAndFilters } from "./list-with-search-and-filters";
import { SearchView } from "./search-view";

const axeOnly = {
  runOnly: {
    type: "tag",
    values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
  },
} as Parameters<typeof axe.run>[1];

async function expectClean(element: HTMLElement) {
  const result = await axe.run(element, axeOnly);
  expect(result.violations).toEqual([]);
}

describe("list/table/search accessibility", () => {
  it("KernList variants have no axe violations", async () => {
    const { container, unmount } = render(
      <main>
        <List
          label="Mailbox"
          variant="selectable"
          rows={[
            { id: "a", headline: "Inbox", supporting: "12 unread" },
            { id: "b", headline: "Sent", href: "/sent" },
          ]}
        />
      </main>,
    );
    await expectClean(container);
    unmount();
    const expandable = render(
      <main>
        <List
          label="More"
          variant="expandable"
          rows={[{ id: "a", headline: "Details", panel: "Panel text" }]}
        />
      </main>,
    );
    await expectClean(expandable.container);
    expandable.unmount();
  });

  it("DataTable with selection and actions has no axe violations", async () => {
    const { container } = render(
      <main>
        <DataTable
          caption="Queue"
          columns={[
            { key: "booking", title: "Booking", sortable: true },
            { key: "status", title: "Status", kind: "status" },
            { key: "more", title: "More", kind: "actions" },
          ]}
          rows={[{ id: "BK-1", booking: "BK-1", status: "Live" }]}
          rowActions={[{ label: "Refund", onSelect: () => {} }]}
        />
      </main>,
    );
    await expectClean(container);
  });

  it("FilterBar has no axe violations", async () => {
    const { container } = render(
      <main>
        <FilterBar
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { value: "live", label: "Live" },
                { value: "done", label: "Done" },
              ],
            },
          ]}
          savedViews={[{ id: "v", label: "Mine", filters: {} }]}
        />
      </main>,
    );
    await expectClean(container);
  });

  it("SearchView dialog has no axe violations", async () => {
    const { container } = render(
      <main>
        <SearchView
          defaultOpen
          hotkey={false}
          suggestions={[{ id: "b", title: "Bookings" }]}
        />
      </main>,
    );
    await expectClean(container);
  });

  it("EmptySearch and the discovery block have no axe violations", async () => {
    const { container } = render(
      <main>
        <EmptySearch query="zzz" onClear={() => {}} />
      </main>,
    );
    await expectClean(container);
    const block = render(
      <main>
        <ListWithSearchAndFilters
          label="Trips"
          rows={[{ id: "a", headline: "Airport pickup" }]}
          filterDefs={[
            {
              key: "status",
              label: "Status",
              options: [{ value: "live", label: "Live" }],
            },
          ]}
        />
      </main>,
    );
    await expectClean(block.container);
    block.unmount();
  });
});
