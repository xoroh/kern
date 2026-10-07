/**
 * The Phase 3 docs page grammar — lede → demo → props → auto-tokens →
 * semantic DOM → a11y → limitations → FAQ → spec.
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
  "props",
  "tokens",
  "semantic-dom",
  "accessibility",
  "limitations",
  "faq",
  "spec",
];

/** Sections that render on every non-exempt page (with honest fallbacks). */
export const GRAMMAR_REQUIRED = [
  "demo",
  "props",
  "tokens",
  "accessibility",
  "spec",
];

/** Sections that render only when the content carries them. */
export const GRAMMAR_CONDITIONAL = ["semantic-dom", "limitations", "faq"];

/**
 * Semantic DOM renders when the page states either half of it: the part
 * anatomy or the ARIA contract. A page with neither has no DOM semantics to
 * document, and a heading over nothing is noise — cut, per convention.
 */
export function hasSemanticDom(doc: ComponentDoc): boolean {
  return (doc.anatomy?.length ?? 0) > 0 || (doc.aria?.length ?? 0) > 0;
}

/**
 * Limitations renders when the page states any boundary: unsupported
 * customization, known accessibility gaps, or the exemption notice. Same
 * rule — no boundary on record, no section.
 */
export function hasLimitations(doc: ComponentDoc): boolean {
  if ((doc.customization?.notSupported.length ?? 0) > 0) return true;
  if ((doc.accessibilityGaps?.length ?? 0) > 0) return true;
  return (
    typeof doc.grammarExempt === "string" && doc.grammarExempt.trim().length > 0
  );
}

/** FAQ renders only when the page carries at least one entry. */
export function hasFaq(doc: ComponentDoc): boolean {
  return (doc.faq?.length ?? 0) > 0;
}

/**
 * The h2 sequence a non-exempt page with this doc must render, in order.
 * Exempt pages (`grammarExempt` set) are listed by the gate, not ordered by it.
 */
export function expectedSections(doc: ComponentDoc): string[] {
  const out = ["demo", "props", "tokens"];
  if (hasSemanticDom(doc)) out.push("semantic-dom");
  out.push("accessibility");
  if (hasLimitations(doc)) out.push("limitations");
  if (hasFaq(doc)) out.push("faq");
  out.push("spec");
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
