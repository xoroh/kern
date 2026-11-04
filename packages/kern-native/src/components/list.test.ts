import { describe, expect, it } from "vitest";
import {
  filterListRows,
  type NativeListRow,
  paginateListRows,
  sectionListRows,
  virtualWindow,
} from "./list";

const rows: NativeListRow[] = [
  { id: "a", title: "Inbox", supporting: "12 unread" },
  { id: "b", title: "Sent", supporting: "Last 7 days" },
  { id: "c", title: "Drafts" },
];

describe("native list adapters (contract parity with web)", () => {
  it("filters rows by title and supporting text", () => {
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
