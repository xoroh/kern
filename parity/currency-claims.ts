/**
 * SPECS-1 F8 — the `currency` field, instantiated.
 *
 * `check:currency` deliberately exits 1 while no row carries a currency claim:
 * a gate with no input that passes looks green, blocks nothing, and gets
 * trusted. This file is the input it has been waiting for.
 *
 * ## The rule these rows encode
 *
 * A currency claim states "kern is current with the SPEC on this component". It
 * is admissible ONLY against a governing spec page. `@material/web` is a
 * reference implementation and is behind the spec on the thing currency asks
 * about — it defines `disabled` (0.38) while shipping no Expressive updates at
 * all — so it may back a VALUE claim and never a currency one. A currency gate
 * built on material-web would mark every Expressive component stale, which is a
 * false-positive generator rather than a check.
 *
 * ## What is deliberately absent
 *
 * `scroll-area`, `input-otp` and `number-field` carry NO `currency` field, and
 * their absence is the point. M3 defines no scroll container, no OTP/PIN
 * component, and no number-field — `parity/contract.ts` already says so on
 * each row. Giving them a currency citation would manufacture a spec basis that
 * does not exist, which is the same failure as citing material-web, only quieter.
 * A missing field here is a RECORDED fact, not an oversight.
 *
 * ## Why the ids are coarse
 *
 * The ledger in `scripts/check-currency.mjs` carries dedicated ids only for the
 * families research read directly (carousel, time-pickers, navigation-drawer,
 * the segmented-button deprecation pair). The remaining families are cited to
 * `S11`, the M3 components catalogue, which is the spec page that governs their
 * existence. Inventing `S-CHIPS` or `S-SWITCH` to look precise would put ids in
 * this file that resolve to nothing, and the gate would (correctly) fail them
 * as unresolvable. Coarse and true beats fine and fabricated.
 */

/**
 * Canonical registry counts (T2 P0-counts) — re-exported, not re-declared.
 *
 * The numbers live in `parity/contract.ts` (`PARITY_COUNTS`); this file
 * re-exports them so currency consumers have one import site for "how big
 * is the registry" without a second copy to drift. `check:currency` matches
 * `/currency\s*[:=]\s*["\x60]([A-Z0-9][A-Z0-9-]*)["\x60]/`, so this line is
 * invisible to it — same rule as the `currency: CATALOG` note above.
 */
export { PARITY_COUNTS } from "./contract.js";

/**
 * Per-row currency claims, keyed by the component each row governs.
 *
 * Only rows that claim an M3 source appear. A kern extension is absent by design.
 *
 * `currency` MUST be a string LITERAL, not a shared const: `check:currency`
 * matches `/currency\s*[:=]\s*["\x60]([A-Z0-9][A-Z0-9-]*)["\x60]/`, so
 * `currency: CATALOG` is invisible to it. That was measured, not assumed — an
 * indirection here reads as "3 claims" when 14 rows are declared, which is the
 * exact silent-annotation failure this gate was built to catch.
 */
export const CURRENCY_CLAIMS: Readonly<
  Record<string, { currency: string; url: string }>
> = Object.freeze({
  switch: {
    currency: "S11",
    url: "https://m3.material.io/components/switch/overview",
  },
  checkbox: {
    currency: "S11",
    url: "https://m3.material.io/components/checkbox/overview",
  },
  button: {
    currency: "S11",
    url: "https://m3.material.io/components/buttons/overview",
  },
  drawer: {
    // Dedicated ledger id — the navigation-drawer page was read directly, and
    // it is the row SPECS-1 named for `superseded-by` (see below).
    currency: "S-NAV-DRAWER",
    url: "https://m3.material.io/components/navigation-drawer/overview",
  },
  popover: {
    currency: "S11",
    url: "https://m3.material.io/components/menus/overview",
  },
  chip: {
    currency: "S11",
    url: "https://m3.material.io/components/chips/overview",
  },
  "list-item": {
    currency: "S11",
    url: "https://m3.material.io/components/lists/overview",
  },
  "time-picker": {
    currency: "S-TIME-PICKERS",
    url: "https://m3.material.io/components/time-pickers/overview",
  },
  carousel: {
    currency: "S-CAROUSEL",
    url: "https://m3.material.io/components/carousel/overview",
  },
  dialog: {
    currency: "S11",
    url: "https://m3.material.io/components/dialogs/overview",
  },
  "sheet-surface": {
    currency: "S11",
    url: "https://m3.material.io/components/bottom-sheets/overview",
  },
  input: {
    currency: "S11",
    url: "https://m3.material.io/components/text-fields/overview",
  },
  textarea: {
    currency: "S11",
    url: "https://m3.material.io/components/text-fields/overview",
  },
  tooltip: {
    currency: "S11",
    url: "https://m3.material.io/components/tooltips/overview",
  },
});

/**
 * Rows that claim NO M3 source. Listed rather than silently omitted, so the
 * absence reads as a decision someone made instead of a gap someone forgot.
 */
export const NON_M3_ROWS: readonly string[] = Object.freeze([
  "scroll-area", // a platform scroll container; M3 defines none
  "input-otp", // M3 defines no OTP/PIN component
  "number-field", // a text-field FAMILY row; the stepper is a kern extension
]);

/**
 * `superseded-by` — the source that REPLACED a retired citation.
 *
 * The row is KEPT, never deleted: that kern once implemented the retired concept
 * is the fact review-m3 needs, and deleting it would erase the drift the field
 * exists to record. A drawer is the worked example — M3 Expressive deprecated
 * the navigation drawer in favour of the expanded navigation rail, and kern ships
 * BOTH. The successor is a ledger id, never a free-text URL, so the chain always
 * terminates at something real.
 */
export const SUPERSEDED: readonly {
  component: string;
  supersededBy: string;
  note: string;
}[] = Object.freeze([
  {
    component: "drawer",
    supersededBy: "S-NAV-RAIL",
    note:
      "M3 Expressive deprecated the navigation drawer in favour of the expanded " +
      "navigation rail. kern ships both; the row is retained deliberately.",
  },
]);
