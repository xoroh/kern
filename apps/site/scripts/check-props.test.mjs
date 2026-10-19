import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readContentApiRows } from "./lib/content-api-names.mjs";
import { computeCoverage } from "./lib/prop-coverage.mjs";

const site = dirname(dirname(fileURLToPath(import.meta.url)));
const gate = join(site, "scripts", "check-props.mjs");

function runGate() {
  return spawnSync("node", [gate], { cwd: site, encoding: "utf8" });
}

/**
 * The scoped-row contract: part-specific props must be documentable without
 * reading as stale on siblings. Pins, on fixtures — plus the gate-2 flip
 * tests at the bottom, which run the real gate on the real tree so a
 * regression in parsing or attribution cannot hide behind a mock.
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

/**
 * Gate-2 flip: the coverage count is no longer reported, it fails.
 * Pins both halves of the acceptance on the real tree (not fixtures, so a
 * regression in parsing or attribution cannot hide behind a mock):
 *
 * 1. zero debt → exit 0 with the zero line (fails BEFORE the burn-down,
 *    when 924 props were uncovered);
 * 2. one api row taken away → exit 1 naming the export and prop (fails if
 *    anyone reverts the flip back to report-only).
 */
describe("coverage gate flip", () => {
  test("zero undocumented props passes", () => {
    const run = runGate();
    expect(run.status).toBe(0);
    expect(run.stdout).toContain(
      "coverage debt: zero — every generated prop is documented.",
    );
  });

  test("one new undocumented prop fails the run, not just reports", () => {
    const page = join(site, "src", "content", "web", "toggle.ts");
    const aside = `${page}.gated-aside`;
    const src = readFileSync(page, "utf8");
    const row = `    {
      name: "nativeButton",
      type: "boolean | undefined",
      note: "Declares whether the \`render\` replacement is a native \`<button>\`, so semantics and keyboard behavior stay correct.",
    },
`;
    expect(src).toContain(row);
    renameSync(page, aside);
    try {
      writeFileSync(page, src.replace(row, ""));
      const run = runGate();
      expect(run.status).toBe(1);
      expect(run.stderr).toContain("Toggle: nativeButton");
    } finally {
      renameSync(aside, page);
    }
  });
});
