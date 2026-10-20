/**
 * The docs page grammar — THE ONE STANDARD (ADR-115), in reading order:
 *
 *   lede → demo → example → props → accessibility → limitations → spec →
 *   customization
 *
 * Proof before prose (the live demo answers "does it work", the code example
 * answers "how do I write it"), then reference (props), then the contract
 * (accessibility), then the honest edges (limitations), then the source
 * (spec), and last the escape hatch (customization).
 *
 * WHAT MOVED OUT OF THE PAGE
 *
 * The teaching half of a component page — features prose, the Do/Don't pair,
 * the token table, the FAQ, the deviations and the anatomy — lives in
 * `docs/m3-guidance/<family>.md`, one file per family, moved verbatim. The
 * page keeps the REFERENCE core. That is why this grammar has no `usage`,
 * `tokens`, `faq` or `semantic-dom` slot: those sections do not render on the
 * page any more, and a grammar slot that renders nothing is a lie the reader
 * pays for.
 *
 * WHY A SHARED MODULE
 *
 * The grammar lives in two places that must agree: the template
 * (`components/docs/component-page.tsx`, which renders the sections) and the
 * gate (`scripts/check-grammar.mjs`, which asserts their order). A comment in
 * each saying "keep in step" is how they drift — so the order and the
 * conditional-section predicates live HERE, imported by both. The predicates
 * decide whether a conditional section renders for a given doc; the template
 * and the gate apply the SAME functions, so they cannot disagree about what a
 * page should show.
 *
 * NODE-SAFE ON PURPOSE (the component-nav.ts precedent): this module is pure
 * data + predicates over plain doc objects — no React, no registries, only
 * erasable TypeScript — so the Node gate can import it directly. Keep it that
 * way: importing anything with side effects here breaks the gate.
 */

import type { ComponentDoc } from "../content/types";

/**
 * The grammar's h2 sections in reading order, by heading id. `lede` is the
 * page header (h1 + one-liner + metadata strip) rather than a section, so it
 * has no id and is not listed — the gate asserts it separately.
 */
export const GRAMMAR_ORDER = [
  "demo",
  "example",
  "props",
  "accessibility",
  "limitations",
  "spec",
  "customization",
];

/** Sections that render on every non-exempt page (with honest fallbacks). */
export const GRAMMAR_REQUIRED = [
  "demo",
  "example",
  "props",
  "accessibility",
  "spec",
];

/**
 * Sections that render only when the content carries them. Both are the
 * "honest state" pair: a boundary the component really has, and an escape
 * hatch it really offers.
 */
export const GRAMMAR_CONDITIONAL = ["limitations", "customization"];

/**
 * Limitations renders when the page states any boundary: a known
 * accessibility gap, or the exemption notice. The `customization` half is NOT
 * part of it any more — "what this component does not let you change" is the
 * customization section's own subject, and merging the two is what made the
 * old page say the same thing twice. Same rule as before: no boundary on
 * record, no section.
 */
export function hasLimitations(doc: ComponentDoc): boolean {
  if ((doc.accessibilityGaps?.length ?? 0) > 0) return true;
  return (
    typeof doc.grammarExempt === "string" && doc.grammarExempt.trim().length > 0
  );
}

/**
 * Customization renders when the component really offers an extension
 * surface: at least one supported line, or at least one line naming what is
 * NOT supported. Both halves count — a component that only says "you cannot
 * change the radius" has a customization section, and cutting it would hide
 * the trap it names.
 */
export function hasCustomization(doc: ComponentDoc): boolean {
  if (!doc.customization) return false;
  if ((doc.customization.supported?.length ?? 0) > 0) return true;
  return (doc.customization.notSupported?.length ?? 0) > 0;
}

/**
 * The h2 sequence a non-exempt page with this doc must render, in order.
 * Exempt pages (`grammarExempt` set) are listed by the gate, not ordered by it.
 */
export function expectedSections(doc: ComponentDoc): string[] {
  const out = ["demo", "example", "props", "accessibility"];
  if (hasLimitations(doc)) out.push("limitations");
  out.push("spec");
  if (hasCustomization(doc)) out.push("customization");
  return out;
}

/**
 * Whether the doc is exempt from the order/presence checks, and why. A
 * present-but-blank exemption is not an exemption — it is an unfinished
 * thought, and the gate fails it rather than honouring it.
 */
export function exemptionReason(doc: ComponentDoc): string | null {
  if (doc.grammarExempt === undefined) return null;
  const reason = doc.grammarExempt.trim();
  return reason.length > 0 ? reason : null;
}
