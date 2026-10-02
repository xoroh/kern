import { describe, expect, it } from "vitest";
import { resolveTheme, varName } from "./resolve";
import { themes } from "./tokens";

const kern = themes.kern as unknown as {
  color: { light: Record<string, string>; dark: Record<string, string> };
};
const light = kern.color.light;
const dark = kern.color.dark;

/**
 * T-034 (a) — pin the token VALUES that were reviewed and approved.
 *
 * `tokens-css.test.ts` already asserts the SHAPE of the generated CSS (no
 * DTCG metadata leaking into variable names). This file asserts the VALUES, so
 * a silent drift in the token source fails a test instead of shipping.
 *
 * ## The `#0b57d0` claim is NOT asserted here, deliberately
 *
 * A review note asked this file to assert "primary `#0b57d0`, not `#000000`".
 * Asserting that would have been a trap, and the trap is worth recording.
 *
 * Measured against the source: `grep -rl 0b57d0` across the whole repo returns
 * exactly ONE hit — `packages/kern-icons/src/core/resolve.test.ts`, an unrelated
 * icon test. The value appears in no theme, no token, and no generator.
 *
 * What kern actually ships in `themes/kern.json` (light):
 *
 *     primary    #000000     <- black, i.e. the neutral ramp's 950
 *     secondary  #2563eb     <- the blue
 *     surface    #ffffff
 *     error      #dc2626
 *
 * So the approved value in this repo is `#000000`, and `#0b57d0` is a stale
 * doc claim (it is M3's BASELINE primary, which kern's default theme does not
 * adopt — kern puts the blue in `secondary`). Writing `expect(primary).toBe
 * ("#0b57d0")` would fail forever, and the tempting "fix" — changing the token
 * so the test passes — would be an unreviewed brand change made to satisfy a
 * test.
 *
 * The reconciliation this file therefore enforces is the one the tree supports:
 * **the token source is authoritative, and the doc is stale.** Whether kern
 * SHOULD ship a black primary is a genuine open question (a deviation from M3
 * baseline, and it is not in the deviations registry). That is a ruling for the
 * CTO, not a fact this test can settle — so this file pins what ships and the
 * report raises the question. If the ruling flips the value, THIS test is
 * updated in the same commit as the token, which is the only correct order.
 */
describe("kern default theme — approved values", () => {

  it("ships a black primary and a blue secondary, not M3's baseline primary", () => {
    expect(light.primary).toBe("#000000");
    expect(light.secondary).toBe("#2563eb");
  });

  it("keeps on-primary readable against a black primary", () => {
    expect(light.onPrimary).toBe("#ffffff");
    expect(dark.onPrimary).toBe("#000000");
  });

  it("pins the light surface and error roles", () => {
    expect(light.surface).toBe("#ffffff");
    expect(light.error).toBe("#dc2626");
  });

  it("inverts primary and surface in dark", () => {
    // A dark scheme that kept a black primary would render a black button on a
    // black page — invisible, and no contrast check catches it.
    expect(dark.primary).toBe("#ffffff");
    expect(dark.surface).toBe("#000000");
  });

  it("defines the same role names in both schemes", () => {
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
  });
});

describe("resolved tokens match the theme source", () => {
  // The generator resolves the theme; these assert the resolved scheme agrees
  // with the declared source, so a change to one without the other is caught
  // here rather than in a rendered page.
  it("resolves the same primary and secondary the theme declares", () => {
    const scheme = resolveTheme("light");
    expect(scheme.primary).toBe(light.primary);
    expect(scheme.secondary).toBe(light.secondary);
  });

  it("resolves every declared role", () => {
    const scheme = resolveTheme("light") as unknown as Record<string, string>;
    for (const role of Object.keys(light)) {
      expect(Object.keys(scheme)).toContain(role);
    }
  });

  it("names the primary through the M3 CSS variable", () => {
    expect(varName("primary")).toBe("--md-sys-color-primary");
  });
});