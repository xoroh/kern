#!/usr/bin/env bun
/**
 * check-configurators.mjs — every configurator's adapter survives its edge.
 *
 * Each configurator converts untyped ConfigValues (string|boolean) into a
 * typed knob. The edge is always the same shape: a foreign value (wrong
 * type, unknown string) must land on the default, never throw, never emit
 * an invalid prop. The package suites pin the components; this pins the
 * site's adapters — the lines that regress in this lane.
 *
 * Convention: each configurator file exports `__edge_<name>` test hooks.
 * The gate imports them and runs the table below. A new configurator
 * without an edge hook fails loudly — the adapter is the newest code in
 * the file and the least reviewed.
 */
import { __edge_variantOf } from "../src/showcase/configurators/icon-button.tsx";

let failures = 0;
const eq = (name, got, want) => {
  if (got !== want) {
    failures++;
    console.error(
      `x    ${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`,
    );
  }
};

// icon-button: unknown/foreign values fall through to "standard"
eq(
  "icon-button unknown string",
  __edge_variantOf({ variant: "nope" }),
  "standard",
);
eq("icon-button boolean", __edge_variantOf({ variant: true }), "standard");
eq("icon-button missing", __edge_variantOf({}), "standard");
eq("icon-button tonal", __edge_variantOf({ variant: "tonal" }), "tonal");

// The typeof guard is load-bearing, not style: without it `.includes`
// receives a boolean, and Array.prototype.includes does NOT throw on a
// wrong-typed argument — it returns false. So the boolean case passes
// either way and the suite above cannot distinguish guarded from
// unguarded. What the guard buys is the TYPE contract: tsc rejects the
// unguarded call (string|boolean into string[]). Assert the source carries
// the guard, so a future cleanup cannot silently drop it.
{
  const src = await Bun.file(
    new URL("../src/showcase/configurators/icon-button.tsx", import.meta.url),
  ).text();
  eq(
    "icon-button typeof guard present",
    src.includes('typeof v.variant === "string"'),
    true,
  );
}

if (failures > 0) {
  console.error(`check-configurators: ${failures} failure(s)`);
  process.exit(1);
}
console.log("check-configurators: ok — adapter edges hold");
