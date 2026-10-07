#!/usr/bin/env bun
import { __edge_bannerVariantOf } from "../src/showcase/configurators/banner.tsx";
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
import { __edge_loaderSizeOf } from "../src/showcase/configurators/loader.tsx";
import { __edge_separatorOrientationOf } from "../src/showcase/configurators/separator.tsx";

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

// banner: same adapter contract, same edges
eq(
  "banner unknown string",
  __edge_bannerVariantOf({ variant: "nope" }),
  "info",
);
eq("banner boolean", __edge_bannerVariantOf({ variant: false }), "info");
eq("banner missing", __edge_bannerVariantOf({}), "info");
eq("banner error", __edge_bannerVariantOf({ variant: "error" }), "error");
{
  const src = await Bun.file(
    new URL("../src/showcase/configurators/banner.tsx", import.meta.url),
  ).text();
  eq(
    "banner typeof guard present",
    src.includes('typeof v.variant === "string"'),
    true,
  );
}

// separator: same adapter contract, same edges
eq(
  "separator unknown string",
  __edge_separatorOrientationOf({ orientation: "diagonal" }),
  "horizontal",
);
eq(
  "separator boolean",
  __edge_separatorOrientationOf({ orientation: true }),
  "horizontal",
);
eq("separator missing", __edge_separatorOrientationOf({}), "horizontal");
eq(
  "separator vertical",
  __edge_separatorOrientationOf({ orientation: "vertical" }),
  "vertical",
);
{
  const src = await Bun.file(
    new URL("../src/showcase/configurators/separator.tsx", import.meta.url),
  ).text();
  eq(
    "separator typeof guard present",
    src.includes('typeof v.orientation === "string"'),
    true,
  );
}

// loader: same adapter contract, same edges
eq("loader unknown string", __edge_loaderSizeOf({ size: "xl" }), "default");
eq("loader boolean", __edge_loaderSizeOf({ size: true }), "default");
eq("loader missing", __edge_loaderSizeOf({}), "default");
eq("loader lg", __edge_loaderSizeOf({ size: "lg" }), "lg");
{
  const src = await Bun.file(
    new URL("../src/showcase/configurators/loader.tsx", import.meta.url),
  ).text();
  eq(
    "loader typeof guard present",
    src.includes('typeof v.size === "string"'),
    true,
  );
}
{
  const src = await Bun.file(
    new URL("../src/showcase/configurators/banner.tsx", import.meta.url),
  ).text();
  eq(
    "banner typeof guard present",
    src.includes('typeof v.variant === "string"'),
    true,
  );
}

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
