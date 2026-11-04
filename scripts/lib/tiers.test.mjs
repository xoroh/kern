// Pins the tier derivation contract (`tiers.mjs` + `tier-overrides.mjs`,
// D1003/D1004): core = no composition edge, component = >= 1 edge to a
// component-exporting non-foundation sibling module; blocks are declared,
// never derived.
import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import {
  FOUNDATION_MODULES,
  PARITY_DIVERGED,
  PARITY_TIERS,
  TIER_OVERRIDES,
} from "./tier-overrides.mjs";
import {
  applyOverrides,
  effectiveExportTier,
  fileComponentExports,
  fileRelativeImports,
  isFoundation,
  loadTierData,
} from "./tiers.mjs";

const ROOT = join(import.meta.dir, "..", "..");
const get = (data, key) => {
  const entry = data.get(key);
  if (!entry) throw new Error(`tier data missing ${key}`);
  return entry;
};

describe("tier derivation", () => {
  const data = loadTierData(ROOT);

  test("leaf primitives derive core", () => {
    expect(get(data, "web:src/components/empty-state.tsx").tier).toBe("core");
    expect(get(data, "web:src/components/checkbox.tsx").tier).toBe("core");
    expect(get(data, "web:src/components/banner.tsx").tier).toBe("core");
  });

  test("loading-state composition counts (Button is component)", () => {
    // Web AND native Button render CircularProgress for the loading state —
    // composition, on both renderers. Parity holds, no exemption needed.
    expect(get(data, "web:src/components/button.tsx").tier).toBe("component");
    expect(get(data, "native:src/components/button.tsx").tier).toBe(
      "component",
    );
  });

  test("composites derive component with builtFrom evidence", () => {
    const table = get(data, "web:src/components/data-table.tsx");
    expect(table.tier).toBe("component");
    expect(table.builtFrom).toContain("Checkbox");
    const composer = get(data, "web:src/components/kern-composer.tsx");
    expect(composer.tier).toBe("component");
    expect(composer.builtFrom).toContain("KernPicker");
  });

  test("block-shaped pages derive component (never block)", () => {
    // D1004: within components/ derive only core vs component. BillingPage
    // and DashboardPage are Tier 3 by DECLARATION (manifest promotion, step 9),
    // but their files derive `component` — the derivation must never invent a
    // third tier.
    expect(get(data, "web:src/components/billing-page.tsx").tier).toBe(
      "component",
    );
    expect(get(data, "web:src/components/dashboard-page.tsx").tier).toBe(
      "component",
    );
  });

  test("foundation modules never promote their importers", () => {
    expect(isFoundation("native:src/components/text.tsx")).toBe(true);
    expect(get(data, "native:src/components/text.tsx").tier).toBe("core");
    // Native accordion renders Text — still a primitive.
    expect(get(data, "native:src/components/accordion.tsx").tier).toBe("core");
    // Web badge/snackbar import only a constant from focus-ring — no edge.
    expect(get(data, "web:src/components/badge.tsx").tier).toBe("core");
    expect(get(data, "web:src/components/snackbar.tsx").tier).toBe("core");
  });
});

describe("import parsing", () => {
  test("import type edges are ignored", () => {
    const src = `import type { X } from "./other";
import { Button } from "./button";`;
    expect(fileRelativeImports(src)).toEqual([
      { spec: "./button", names: ["Button"] },
    ]);
  });

  test("inline type specifiers are dropped", () => {
    const src = `import { type Foo, Bar } from "./baz";`;
    expect(fileRelativeImports(src)).toEqual([
      { spec: "./baz", names: ["Bar"] },
    ]);
  });
});

describe("curated maps", () => {
  const data = loadTierData(ROOT);
  const { tiers: fileTiers } = applyOverrides(data, TIER_OVERRIDES);

  test("foundation modules are edge-free core files", () => {
    for (const key of FOUNDATION_MODULES) {
      const entry = get(data, key);
      expect(entry.tier).toBe("core");
    }
  });

  test("every file override cites evidence and names a valid tier", () => {
    for (const [key, entry] of Object.entries(TIER_OVERRIDES)) {
      expect(["core", "component"]).toContain(entry.tier);
      expect(entry.why.length).toBeGreaterThan(0);
      expect(key).toMatch(/^(web|native):src\/(components|start)\//);
      expect(data.has(key)).toBe(true);
    }
  });

  test("parity pins cite evidence and actually diverge", () => {
    for (const [key, entry] of Object.entries(PARITY_TIERS)) {
      expect(["core", "component"]).toContain(entry.tier);
      expect(entry.why.length).toBeGreaterThan(0);
      const [platform, exportName] = key.split(":");
      const row = [...data.values()].find(
        (e) =>
          e.platform === platform && e.componentExports.includes(exportName),
      );
      expect(row).toBeDefined();
    }
  });

  test("parity divergences are real and documented", () => {
    for (const [exportName, why] of Object.entries(PARITY_DIVERGED)) {
      expect(why.length).toBeGreaterThan(0);
      const rows = [...data.values()].filter((e) =>
        e.componentExports.includes(exportName),
      );
      expect(rows.length).toBeGreaterThan(1);
    }
  });

  test("effective export tier prefers the parity pin", () => {
    expect(
      effectiveExportTier(
        fileTiers,
        PARITY_TIERS,
        "native",
        "Banner",
        "src/components/web-parity.tsx",
      ),
    ).toBe("core");
    expect(
      effectiveExportTier(
        fileTiers,
        PARITY_TIERS,
        "native",
        "Command",
        "src/components/web-parity.tsx",
      ),
    ).toBe("component");
  });
});
