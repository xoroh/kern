/**
 * R2 callback lexicon guard (re-homed): state callbacks obey the lexicon,
 * action callbacks stay on the allowlist.
 *
 * The lexicon:
 * - Selection/value state: `value` + `defaultValue?` + `onValueChange?`.
 *   Deprecated per-component aliases (`index`/`onIndexChange`,
 *   `page`/`onPageChange`, `selected`/`onSelectedChange`,
 *   `pressed`/`onPressedChange`, `collapsed`/`onCollapsedChange`,
 *   `expanded`/`onExpandedChange`, `visible`) are allowed ONLY beside the
 *   canonical names — an alias without its canonical partner fails here.
 * - Overlay visibility: `open` + `defaultOpen?` + `onOpenChange?`.
 * - Action callbacks (`onSelect`, `onSearch`, `onCountryChange`, `onClose`,
 *   `onDismiss`, platform `onPress`/`onClick`) are NOT state and are never
 *   renamed — they live on the allowlist below.
 * - Base UI passthroughs (`onValueChange` with `eventDetails`) are canonical
 *   by construction.
 *
 * Shape guard, not a behavior test: a new `on*Change` prop that is neither
 * canonical, a registered alias, nor an allowlisted action fails with the
 * file named. Comments are stripped first, so prose cannot satisfy it.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const HERE = dirname(fileURLToPath(import.meta.url));

/** Every state pair: canonical names that must be present. */
const CANONICAL_VALUE = ["value", "onValueChange"];
const CANONICAL_OPEN = ["open", "onOpenChange"];

/**
 * Deprecated aliases, each mapped to the file-relative scope they may appear
 * in plus the canonical partner that must accompany them. Format:
 * "relative/path.tsx:aliasProp" -> ["canonicalPartner", ...allOfThese].
 */
const REGISTERED_ALIASES: Record<string, string[]> = {
  "packages/kern/src/components/carousel.tsx:onIndexChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern/src/components/pagination.tsx:onPageChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern/src/components/chip.tsx:onSelectedChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern/src/components/icon-button.tsx:onPressedChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern/src/components/extended-fab.tsx:onCollapsedChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern/src/components/sheet-family.tsx:onIndexChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern/src/components/sheet-family.tsx:onClose": [
    "open",
    "onOpenChange",
  ],
  "packages/kern/src/components/country-select.tsx:onCountryChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern/src/components/list-item.tsx:onPress": ["onClick"],
  "packages/kern/src/start/panes.tsx:onTabChange": ["value", "onValueChange"],
  "packages/kern-native/src/components/carousel.tsx:onIndexChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern-native/src/components/autocomplete.tsx:onExpandedChange": [
    "open",
    "onOpenChange",
  ],
  "packages/kern-native/src/components/sheets.tsx:onIndexChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern-native/src/components/pagination.tsx:onPageChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern-native/src/components/chip.tsx:onSelectedChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern-native/src/components/icon-button.tsx:onPressedChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern-native/src/components/toggle.tsx:onPressedChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern-native/src/components/web-parity.tsx:onQueryChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern-native/src/components/web-parity.tsx:onValuesChange": [
    "values",
    "onValuesChange",
  ],
  "packages/kern-native/src/components/extended-fab.tsx:onCollapsedChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern-native/src/components/collapsible.tsx:onExpandedChange": [
    "open",
    "onOpenChange",
  ],
  "packages/kern-native/src/components/accordion.tsx:onExpandedChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern-native/src/components/dialog.tsx:visible": [
    "open",
    "onOpenChange",
  ],
  "packages/kern-native/src/components/sheet.tsx:visible": [
    "open",
    "onOpenChange",
  ],
  "packages/kern-native/src/components/alert-dialog.tsx:visible": [
    "open",
    "onOpenChange",
  ],
};

/** Action callbacks: state-free by definition, never renamed. */
const ACTION_ALLOWLIST = new Set([
  "onSelect",
  "onSearch",
  "onCountryChange",
  "onClose",
  "onDismiss",
  "onPress",
  "onClick",
  "onError",
  "onComplete",
  "onBack",
  "onConfirm",
  "onCancel",
  "onAction",
]);

async function tsxFiles(dir: string, out: string[] = []): Promise<string[]> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "parity") continue;
      await tsxFiles(full, out);
    } else if (
      /\.tsx$/.test(entry.name) &&
      !/\.test\.tsx$/.test(entry.name) &&
      !/\.rntest\.tsx$/.test(entry.name)
    ) {
      out.push(full);
    }
  }
  return out;
}

describe("callback lexicon", () => {
  it("every on*Change/on* state callback is canonical, registered, or action", async () => {
    const offenders: string[] = [];
    const repoRoot = join(HERE, "..", "..", "..");
    for (const pkg of ["packages/kern/src", "packages/kern-native/src"]) {
      for (const full of await tsxFiles(join(repoRoot, pkg))) {
        const rel = full.slice(repoRoot.length + 1);
        const raw = await readFile(full, "utf8");
        const source = raw
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/(^|[^:])\/\/.*$/gm, "$1");
        const props = new Set(
          [...source.matchAll(/(\bon[A-Z]\w*)\?:/g)].map((m) => m[1]),
        );
        // Plain `value`/`open` without `?` (e.g. destructured params) still
        // count as present for the partner check.
        const has = (name: string) =>
          props.has(name) || new RegExp(`\\b${name}\\b`).test(source);
        for (const prop of props) {
          if (ACTION_ALLOWLIST.has(prop)) continue;
          if (prop === "onValueChange") {
            if (!has("value")) offenders.push(`${rel}:${prop} without value`);
            continue;
          }
          if (prop === "onOpenChange") {
            if (!has("open")) offenders.push(`${rel}:${prop} without open`);
            continue;
          }
          const key = `${rel}:${prop}`;
          const partners = REGISTERED_ALIASES[key];
          if (!partners) {
            offenders.push(`${rel}:${prop} unregistered`);
            continue;
          }
          for (const p of partners) {
            if (!has(p)) offenders.push(`${rel}:${prop} missing ${p}`);
          }
        }
      }
    }
    expect(offenders.join("\n")).toBe("");
  });
});
