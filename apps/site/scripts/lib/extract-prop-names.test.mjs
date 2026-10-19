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
const FIXTURE = `
interface FilterChipProps { variant: "filter"; value?: boolean; defaultValue?: boolean; onValueChange?: (selected: boolean) => void; }
interface ActionChipProps { variant?: "assist" | "suggestion" | "input"; }
type ChipProps = FilterChipProps | ActionChipProps;

interface A { alpha?: string; }
interface B { beta?: number; }
type Both = A & B;

interface Filter { value?: boolean; }
interface Action { label?: string; }
interface Common { disabled?: boolean; }
type Mixed = Common & (Filter | Action);

interface FlatShape { open?: boolean; onOpenChange?: (open: boolean) => void; }
type Flat = FlatShape;

interface Intrinsic { color?: string; }
interface Local { color?: number; }
type Shadowed = Intrinsic & Local;
`;

let checker;
const aliases = new Map();

const dir = mkdtempSync(join(tmpdir(), "extract-props-"));
try {
  const file = join(dir, "fixture.ts");
  writeFileSync(file, FIXTURE);
  const program = ts.createProgram([file], {
    strict: true,
    target: ts.ScriptTarget.ESNext,
  });
  checker = program.getTypeChecker();
  const src = program.getSourceFile(file);
  ts.forEachChild(src, (node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      aliases.set(node.name.text, node);
    }
  });
} finally {
  rmSync(dir, { recursive: true, force: true });
}

function symbolsOf(aliasName) {
  const alias = aliases.get(aliasName);
  if (!alias) throw new Error(`alias ${aliasName} not found in fixture`);
  return checker.getTypeFromTypeNode(alias.type);
}

const names = (t) => collectTypeSymbols(t).map((s) => s.name);

describe("collectTypeSymbols", () => {
  test("union member-only props are collected (Chip shape)", () => {
    const t = symbolsOf("ChipProps");
    const found = names(t);
    expect(found).toContain("value");
    expect(found).toContain("defaultValue");
    expect(found).toContain("onValueChange");
    expect(found).toContain("variant");
  }, 30000);

  test("intersection members are still collected", () => {
    const t = symbolsOf("Both");
    expect(names(t)).toEqual(expect.arrayContaining(["alpha", "beta"]));
  }, 30000);

  test("a union nested in an intersection is walked", () => {
    const t = symbolsOf("Mixed");
    expect(names(t)).toEqual(
      expect.arrayContaining(["disabled", "value", "label"]),
    );
  }, 30000);

  test("plain object types are unchanged", () => {
    const t = symbolsOf("Flat");
    expect(names(t).sort()).toEqual(["onOpenChange", "open"]);
  }, 30000);

  test("shadowed names yield every occurrence (builder picks first usable)", () => {
    // ButtonProps shape: an intrinsic occurrence (unusable declaration)
    // precedes the component's own local one. Dropping the second hides
    // the row, so the collector must not deduplicate by name.
    const t = symbolsOf("Shadowed");
    expect(names(t).filter((n) => n === "color")).toHaveLength(2);
  }, 30000);
});
