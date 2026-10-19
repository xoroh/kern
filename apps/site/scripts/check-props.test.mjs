import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readContentApiRows } from "./lib/content-api-names.mjs";
import { computeCoverage } from "./lib/prop-coverage.mjs";

/**
 * The scoped-row contract: part-specific props must be documentable without
 * reading as stale on siblings. Pins, on fixtures (never the real tree, so
 * the burn-down PRs do not churn this file):
 *
 * 1. an unscoped row on a prop one sibling does not carry counts stale for
 *    that sibling (the legacy ratchet, unchanged);
 * 2. the same row with `for` counts nowhere stale and clears the covered
 *    part's debt while leaving the uncovered sibling reported;
 * 3. `for` naming a non-part, a part with no generated export, or a name
 *    none of the scoped parts carries is a scope error;
 * 4. the row parser finds `for` before `note:` and never inside prose, and
 *    survives `{...}` snippets and `code` spans in notes.
 */

const GEN = {
  Root: [{ name: "open" }, { name: "shared" }],
  Trigger: [{ name: "shared" }],
};
const ALL = {
  Root: ["open", "shared"],
  Trigger: ["shared"],
};

function fixture(files) {
  const dir = mkdtempSync(join(tmpdir(), "prop-coverage-"));
  for (const [name, src] of Object.entries(files)) {
    writeFileSync(join(dir, name), src);
  }
  return dir;
}

const FAMILY = (api) => `import type { ComponentDoc } from "../types";
export const x: ComponentDoc = {
  slug: "x", name: "X", oneLiner: "x", features: "x",
  meta: { status: "real", package: "@xoroh/kern", nativePeer: "none", variants: [], elevation: "surface" },
  parts: ["Root", "Trigger", "Ns"],
  api: [
${api}
  ],
} as ComponentDoc;
`;

describe("prop-coverage scoping", () => {
  test("unscoped part-specific row counts stale on the sibling (legacy ratchet)", () => {
    const dir = fixture({
      "x.ts": FAMILY(`{ name: "open", type: "boolean", note: "Root only." },`),
    });
    try {
      const files = readContentApiRows(dir);
      const c = computeCoverage({ gen: GEN, all: ALL, files });
      expect(c.scopeErrors).toEqual([]);
      expect(c.stale).toEqual([
        'Trigger: content api names "open", which nothing in the component\'s type carries.',
      ]);
      expect(c.uncoveredByExport).toEqual(["Root: shared", "Trigger: shared"]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("scoped row clears the covered part without stale anywhere", () => {
    const dir = fixture({
      "x.ts": FAMILY(
        `{ name: "open", for: ["Root"], type: "boolean", note: "Root only." },
         { name: "shared", type: "string", note: "Both." },`,
      ),
    });
    try {
      const files = readContentApiRows(dir);
      const c = computeCoverage({ gen: GEN, all: ALL, files });
      expect(c.scopeErrors).toEqual([]);
      expect(c.stale).toEqual([]);
      // Trigger still owes nothing (it never had `open`); Root is covered.
      expect(c.uncovered).toBe(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("scoped row leaves genuinely missing props reported", () => {
    const gen = { ...GEN, Trigger: [...GEN.Trigger, { name: "late" }] };
    const all = { ...ALL, Trigger: [...ALL.Trigger, "late"] };
    const dir = fixture({
      "x.ts": FAMILY(
        `{ name: "open", for: ["Root"], type: "boolean", note: "Root only." },
         { name: "shared", type: "string", note: "Both." },`,
      ),
    });
    try {
      const files = readContentApiRows(dir);
      const c = computeCoverage({ gen, all, files });
      expect(c.stale).toEqual([]);
      expect(c.uncoveredByExport).toEqual(["Trigger: late"]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("scope errors: non-part, part with no export, name nobody carries", () => {
    const dir = fixture({
      "x.ts": FAMILY(
        [
          `{ name: "open", for: ["Nope"], type: "b", note: "n." },`,
          `{ name: "shared", for: ["Ns"], type: "b", note: "n." },`,
          `{ name: "bogus", for: ["Root", "Trigger"], type: "b", note: "n." },`,
        ].join("\n"),
      ),
    });
    try {
      const files = readContentApiRows(dir);
      const c = computeCoverage({ gen: GEN, all: ALL, files });
      expect(c.scopeErrors.length).toBe(3);
      expect(c.scopeErrors[0]).toContain('scopes to "Nope"');
      expect(c.scopeErrors[1]).toContain("no generated props export");
      expect(c.scopeErrors[2]).toContain('"bogus" is carried by none');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("parser: for before note, prose mentions of for ignored, braces survive", () => {
    const dir = fixture({
      "x.ts": FAMILY(
        `{ name: "shared", for: ["Root"], type: "string", note: "What it is for: a region fetching its content, shaped like \`{ value }\`." },
         {
           name: "open",
           for: [
             "Root",
             "Ns",
           ],
           type: "boolean",
           note: "A multi-line scope list closes on its own bracket line.",
         },`,
      ),
    });
    try {
      const files = readContentApiRows(dir);
      expect(files).toHaveLength(1);
      expect(files[0].rows).toEqual([
        { name: "shared", for: ["Root"] },
        { name: "open", for: ["Root", "Ns"] },
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
