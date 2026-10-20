/**
 * check-one-standard — FAIL-BEFORE tests.
 *
 * A gate that has never failed is not a gate. These two tests strip the
 * thing the flip requires and assert the rule NAMES the page (or the
 * family) that lost it — on the real tree, not on a mock of the rule.
 */
import { describe, expect, it } from "bun:test";
import { oneStandardViolations } from "./lib/one-standard.mjs";

const page = (over = {}) => ({
  file: "web/fixture.ts",
  doc: {
    slug: "fixture",
    parts: ["Fixture"],
    keyboard: [{ key: "Enter", action: "Activates the control." }],
    ...over,
  },
});

describe("the one-standard flips", () => {
  it("names the page whose keyboard contract was stripped", () => {
    const violations = oneStandardViolations(
      [page({ keyboard: undefined })],
      new Set(["Fixture"]),
    );
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain("web/fixture.ts");
    expect(violations[0]).toContain("no keyboard contract");
  });

  it("accepts a page that declares itself non-interactive", () => {
    const violations = oneStandardViolations(
      [
        page({
          keyboard: undefined,
          nonInteractive: true,
        }),
      ],
      new Set(["Fixture"]),
    );
    expect(violations).toEqual([]);
  });

  it("names a keyboard row that lost its action", () => {
    const violations = oneStandardViolations(
      [page({ keyboard: [{ key: "Enter" }] })],
      new Set(["Fixture"]),
    );
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain("missing its key or its action");
  });

  it("names the family whose coded example was removed", () => {
    const violations = oneStandardViolations([page()], new Set());
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain('the family "fixture"');
    expect(violations[0]).toContain("no coded example");
  });

  it("does not hold a family outside the standard to either flip", () => {
    const violations = oneStandardViolations(
      [page({ slug: "hero", keyboard: undefined })],
      new Set(),
    );
    expect(violations).toEqual([]);
  });
});
