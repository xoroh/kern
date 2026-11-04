import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  filterListRows,
  List,
  type ListRow,
  paginateListRows,
  sectionListRows,
  virtualWindow,
} from "./list";

const inboxRow: ListRow = {
  id: "a",
  headline: "Inbox",
  supporting: "12 unread",
};
const sentRow: ListRow = {
  id: "b",
  headline: "Sent",
  supporting: "Last 7 days",
};
const draftsRow: ListRow = { id: "c", headline: "Drafts" };
const rows: ListRow[] = [inboxRow, sentRow, draftsRow];

describe("KernList variants", () => {
  it("renders a list landmark with rows", () => {
    render(<List rows={rows} label="Mailbox" />);
    expect(screen.getByRole("list", { name: "Mailbox" })).toHaveAttribute(
      "data-variant",
      "two-line",
    );
    expect(screen.getByText("Inbox")).toBeTruthy();
  });

  it("one-line hides supporting text", () => {
    render(<List rows={rows} variant="one-line" />);
    expect(screen.queryByText("12 unread")).toBeNull();
  });

  it("navigational rows render links with chevrons", () => {
    render(
      <List
        rows={[{ id: "a", headline: "Inbox", href: "/inbox" }]}
        variant="navigational"
      />,
    );
    expect(screen.getByRole("link", { name: "Inbox" })).toHaveAttribute(
      "href",
      "/inbox",
    );
  });

  it("selectable rows toggle through labelled checkboxes", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <List
        rows={rows}
        variant="selectable"
        selectionMode="multiple"
        onSelectedChange={onSelectedChange}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: /Inbox/ }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(["a"]);
  });

  it("single selection replaces instead of accumulating", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <List
        rows={rows}
        variant="selectable"
        selectionMode="single"
        selectedIds={["a"]}
        onSelectedChange={onSelectedChange}
      />,
    );
    expect(screen.getByRole("checkbox", { name: /Inbox/ })).toBeChecked();
    await user.click(screen.getByRole("checkbox", { name: /Sent/ }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(["b"]);
  });

  it("expandable rows disclose panels with aria-expanded", async () => {
    const user = userEvent.setup();
    render(
      <List
        rows={[{ id: "a", headline: "More", panel: "Hidden detail" }]}
        variant="expandable"
      />,
    );
    const trigger = screen.getByRole("button", { name: "Expand More" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Hidden detail")).toBeNull();
    await user.click(trigger);
    expect(
      screen.getByRole("button", { name: "Collapse More" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Hidden detail")).toBeTruthy();
  });

  it("grouped renders section headers with divided rows", () => {
    render(
      <List
        sections={[
          { id: "s1", title: "Today", rows: [inboxRow] },
          { id: "s2", title: "Older", rows: [sentRow] },
        ]}
        variant="grouped"
      />,
    );
    expect(screen.getByText("Today")).toBeTruthy();
    expect(screen.getByText("Older")).toBeTruthy();
  });

  it("loading renders skeletons with a status, empty renders the fallback", () => {
    const { unmount } = render(<List rows={rows} loading />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading list");
    unmount();
    render(<List rows={[]} />);
    expect(screen.getByText("No items")).toBeTruthy();
  });

  it("applies compact density to rows", () => {
    const { container } = render(<List rows={rows} density="compact" />);
    expect(container.querySelector(".min-h-12")).toBeTruthy();
  });
});

describe("list adapters", () => {
  it("filters rows by headline and supporting text", () => {
    expect(filterListRows(rows, "inbox")).toHaveLength(1);
    expect(filterListRows(rows, "last 7")).toHaveLength(1);
    expect(filterListRows(rows, "  ")).toHaveLength(3);
    expect(filterListRows(rows, "zzz")).toHaveLength(0);
  });

  it("paginates with clamping", () => {
    const first = paginateListRows(rows, 1, 2);
    expect(first.pageRows).toHaveLength(2);
    expect(first.pageCount).toBe(2);
    expect(paginateListRows(rows, 99, 2).page).toBe(2);
    expect(paginateListRows(rows, 0, 2).page).toBe(1);
  });

  it("sections rows preserving first-seen order", () => {
    const sections = sectionListRows(rows, (row) =>
      row.id === "c" ? "Older" : "Today",
    );
    expect(sections.map((s) => s.title)).toEqual(["Today", "Older"]);
    expect(sections[0]?.rows).toHaveLength(2);
  });

  it("windows long lists with overscan", () => {
    expect(virtualWindow(1000, 56, 600, 0)).toEqual({ start: 0, end: 14 });
    const mid = virtualWindow(1000, 56, 600, 5600);
    expect(mid.start).toBeGreaterThan(90);
    expect(mid.end - mid.start).toBeLessThan(25);
    expect(virtualWindow(5, 56, 600, 0).end).toBe(5);
  });
});
