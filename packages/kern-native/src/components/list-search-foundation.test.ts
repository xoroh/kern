import { describe, expect, it } from "vitest";
import { buildCsv } from "./csv-export-button";
import {
  applyFilterDefs,
  fromFilterQuery,
  type NativeFilterDef,
  toFilterQuery,
} from "./filter-bar";
import { filterSuggestions } from "./search-view";

const statusDef: NativeFilterDef = {
  key: "status",
  label: "Status",
  options: [
    { value: "live", label: "Live" },
    { value: "done", label: "Done" },
  ],
};
const defs = [statusDef];

describe("native filter query adapter (contract parity with web)", () => {
  it("round-trips the active model through a query string", () => {
    const active = { status: ["live", "done"], plan: ["pro"] };
    const query = toFilterQuery(active);
    expect(query).toBe("?status=live%2Cdone&plan=pro");
    expect(fromFilterQuery(query)).toEqual(active);
    expect(toFilterQuery({})).toBe("");
    expect(fromFilterQuery("")).toEqual({});
  });

  it("facets rows by the active defs", () => {
    const rows = [
      { status: "live", plan: "pro" },
      { status: "done", plan: "free" },
      { status: "live", plan: "free" },
    ];
    const get = (row: (typeof rows)[number], key: string) =>
      key === "status" ? row.status : row.plan;
    expect(
      applyFilterDefs(rows, [{ ...statusDef, value: ["live"] }], get),
    ).toHaveLength(2);
    expect(applyFilterDefs(rows, defs, get)).toHaveLength(3);
  });
});

describe("native search suggestions (contract parity with web)", () => {
  const suggestions = [
    { id: "b", title: "Bookings", keywords: ["queue"] },
    { id: "p", title: "Passengers" },
  ];
  it("matches titles and keywords case-insensitively", () => {
    expect(filterSuggestions(suggestions, "book").map((s) => s.id)).toEqual([
      "b",
    ]);
    expect(filterSuggestions(suggestions, "QUEUE").map((s) => s.id)).toEqual([
      "b",
    ]);
    expect(filterSuggestions(suggestions, "")).toHaveLength(2);
    expect(filterSuggestions(suggestions, "zzz")).toHaveLength(0);
  });
});

describe("native CSV builder (contract parity with web)", () => {
  it("builds RFC-4180 CSV with quoting", () => {
    const columns = [
      { key: "name", title: "Name" },
      { key: "note", title: "Note" },
    ];
    expect(
      buildCsv(columns, [
        { name: "Ada", note: "plain" },
        { name: 'O"Brien, Jr.', note: "line\nbreak" },
        { name: null, note: undefined },
      ]),
    ).toBe('Name,Note\r\nAda,plain\r\n"O""Brien, Jr.","line\nbreak"\r\n,');
  });
});
