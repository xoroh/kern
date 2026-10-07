#!/usr/bin/env node
/**
 * check-focus-trap — the ⌘K palette traps Tab by keyboard alone.
 *
 * WHY
 *
 * The palette is a modal dialog: while open, Tab must cycle first↔last
 * inside it and never leak focus to the inert page behind. That decision
 * lives in the pure `trapTarget` helper (src/systems/focus-trap.ts), which
 * the dialog's key handler calls — so this gate pins the whole decision
 * table without needing a DOM: wrap forward, wrap back, pull-in from
 * outside, natural in-dialog moves, and the empty-dialog edge.
 */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, "..");

const { trapTarget } = await import(join(SITE, "src", "systems", "focus-trap.ts"));

const failures = [];
const check = (name, got, want) => {
  if (got !== want) {
    failures.push(`${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}.`);
  }
};

// Three-item dialog: input, a result, the scrim-close button.
check("Tab from middle moves naturally", trapTarget(3, 1, false), null);
check("Shift+Tab from middle moves naturally", trapTarget(3, 1, true), null);
check("Tab from first moves naturally", trapTarget(3, 0, false), null);
check("Shift+Tab from last moves naturally", trapTarget(3, 2, true), null);

// The wrap: Tab from last → first, Shift+Tab from first → last.
check("Tab from last wraps to first", trapTarget(3, 2, false), 0);
check("Shift+Tab from first wraps to last", trapTarget(3, 0, true), 2);

// The pull-in: focus outside the dialog is pulled back in, never left out.
check("Tab from outside pulls to first", trapTarget(3, -1, false), 0);
check("Shift+Tab from outside pulls to last", trapTarget(3, -1, true), 2);

// Single-item dialog wraps to itself in both directions.
check("Tab in single-item dialog stays", trapTarget(1, 0, false), 0);
check("Shift+Tab in single-item dialog stays", trapTarget(1, 0, true), 0);

// Empty dialog: nothing to move to — the handler prevents default instead.
check("empty dialog Tab", trapTarget(0, -1, false), null);
check("empty dialog Shift+Tab", trapTarget(0, -1, true), null);

if (failures.length) {
  console.error("check-focus-trap FAILED:\n");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("check-focus-trap passes: Tab wrap, pull-in, and empty-dialog decisions pinned (13 cases).");
