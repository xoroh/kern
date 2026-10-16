import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ts from "typescript";
import { collectTypeSymbols } from "./extract-prop-names.mjs";

/**
 * Regression: union member props must be visible to the extractor.
 *
 * `ChipProps = FilterChipProps | ActionChipProps` documents `value`,
 * `defaultValue`, and `onValueChange` (filter-only selection state).
 * Collecting `type.getProperties()` on the union itself sees only the
 * members' common properties, so those rows read as stale and
 * `check-props` failed on valid documentation (474 vs baseline 471).
 */
function symbolsOf(source, aliasName) {
  const dir = mkdtempSync(join(tmpdir(), "extract-props-"));
  try {
    const file = join(dir, "fixture.ts");
    writeFileSync(file, source);
    const program = ts.createProgram([file], {
      strict: true,
      target: ts.ScriptTarget.ESNext,
    });
    const checker = program.getTypeChecker();
    const src = program.getSourceFile(file);
    let alias;
    ts.forEachChild(src, (node) => {
      if (ts.isTypeAliasDeclaration(node) && node.name.text === aliasName) {
        alias = node;
      }
    });
    if (!alias) throw new Error(`alias ${aliasName} not found in fixture`);
    return checker.getTypeFromTypeNode(alias.type);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const names = (t) => collectTypeSymbols(t).map((s) => s.name);

describe("collectTypeSymbols", () => {
  test("union member-only props are collected (Chip shape)", () => {
    const t = symbolsOf(
      `interface FilterChipProps { variant: "filter"; value?: boolean; defaultValue?: boolean; onValueChange?: (selected: boolean) => void; }
       interface ActionChipProps { variant?: "assist" | "suggestion" | "input"; }
       type ChipProps = FilterChipProps | ActionChipProps;`,
      "ChipProps",
    );
    const found = names(t);
    expect(found).toContain("value");
    expect(found).toContain("defaultValue");
    expect(found).toContain("onValueChange");
    expect(found).toContain("variant");
  });

  test("intersection members are still collected", () => {
    const t = symbolsOf(
      `interface A { alpha?: string; }
       interface B { beta?: number; }
       type Both = A & B;`,
      "Both",
    );
    expect(names(t)).toEqual(expect.arrayContaining(["alpha", "beta"]));
  });

  test("a union nested in an intersection is walked", () => {
    const t = symbolsOf(
      `interface Filter { value?: boolean; }
       interface Action { label?: string; }
       interface Common { disabled?: boolean; }
       type Mixed = Common & (Filter | Action);`,
      "Mixed",
    );
    expect(names(t)).toEqual(
      expect.arrayContaining(["disabled", "value", "label"]),
    );
  });

  test("plain object types are unchanged", () => {
    const t = symbolsOf(
      `interface FlatShape { open?: boolean; onOpenChange?: (open: boolean) => void; }
       type Flat = FlatShape;`,
      "Flat",
    );
    expect(names(t).sort()).toEqual(["onOpenChange", "open"]);
  });

  test("shadowed names yield every occurrence (builder picks first usable)", () => {
    // ButtonProps shape: an intrinsic occurrence (unusable declaration)
    // precedes the component's own local one. Dropping the second hides
    // the row, so the collector must not deduplicate by name.
    const t = symbolsOf(
      `interface Intrinsic { color?: string; }
       interface Local { color?: number; }
       type Shadowed = Intrinsic & Local;`,
      "Shadowed",
    );
    expect(names(t).filter((n) => n === "color")).toHaveLength(2);
  });
});
