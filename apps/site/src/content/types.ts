/**
 * The per-component documentation contract.
 *
 * This is the schema `docs/conventions/component-docs.md` specifies, expressed
 * as types. It is the interface between three owners: kern-lead (what the
 * component is), docs-lead (how it is worded) and the site (how it renders).
 * Adding a component to the site is adding a folder of this data — the route,
 * the nav and the index already come from the generated manifest.
 *
 * It is deliberately pure data: no React, no imports beyond types. The same
 * module is loaded by the site's renderer *and* by `scripts/check-docs.mjs`,
 * so anything that cannot be read by a validator in Node does not belong here.
 *
 * Section order is not a preference — it is the order a reader needs the
 * information, and it is what lets a page be checked by a gate instead of by
 * eye. See the convention for the rationale.
 */

/**
 * Resting elevation, per `packages/kern-tokens/src/m3-elevation.ts`.
 *
 * Not free text. A number is an M3 level (0-5); `"surface"` is for components
 * that carry no elevation token at all. The validator asserts this against the
 * token module, so a page cannot claim a level the system does not ship.
 *
 * `"none"` is for exports with NO visual form — pure functions and hooks. It is
 * not "conformant without a token" and not a gap: elevation is simply not
 * applicable to something that renders nothing. Kept distinct so a reader is
 * never told a function has a resting level.
 */
export type RestingElevation = number | "surface" | "none";

/** Where the component is exported from. Mirrors the parity contract's table. */
export type PackageName =
  | "@xoroh/kern"
  | "@xoroh/kern-native"
  | "@xoroh/kern/start";

/**
 * Section 1 — the metadata strip: a single row of facts above the fold.
 *
 * Every field is cross-checked by the validator against a generated or
 * machine-audited source. A field that no gate can check is not metadata, it
 * is prose, and prose does not go in the strip.
 */
export type MetadataStrip = {
  /** `real` or `stub` — must match the generated inventory exactly. */
  status: "real" | "stub";
  package: PackageName;
  /**
   * The counterpart export on the other renderer, or `"none"` where the
   * component is deliberately single-renderer. `"none"` is a claim: it must be
   * backed by `docs/parity-contract.md`, which the validator checks.
   */
  nativePeer: string;
  /**
   * One entry per variant axis, rendered as its own chip:
   * `"variant: elevated · primary · tonal · outlined · ghost"`. An empty array
   * is the convention's `"none"` — the component exposes no variant axis. An
   * axis listed here that the component does not actually accept is a defect,
   * and the props table is where a reader would catch it.
   */
  variants: string[];
  elevation: RestingElevation;

  /**
   * Whether the elevation claim is BACKED by the elevation table.
   *
   * `check:docs` keeps three elevation situations apart and this flag is what
   * lets the page do the same: a level the table backs, a component with no
   * token at all, and a page that CLAIMS a level nothing asserts. Without it
   * the strip renders an unbacked claim as if it were measured, which is the
   * exact failure the gate exists to catch — and the comment above ("a page
   * cannot claim a level the system does not ship") would be contradicted by
   * the page itself.
   *
   * Default is `true`. Set `false` on a page whose claim is currently
   * unasserted, and the strip renders it as a warning rather than a fact.
   */
  elevationBacked?: boolean;

  /**
   * Release state — Preview / Stable / Maintained / Sunsetting / Archived.
   * Distinct from `status`, which is REGISTRY status (is this a real export
   * or a stub), not release maturity. Optional until the release model ships
   * a `/stability` surface to link to.
   */
  state?: string;
  /** Package version, e.g. `"0.4.0"`. */
  version?: string;
  /** Which renderers this export exists on, e.g. `["Web", "Native"]`. */
  platforms?: string[];

  /**
   * The four external references in the strip. OPTIONAL on purpose: a chip
   * with no URL renders as plain text, so a page is never a dead link and the
   * strip is never half-empty. They are the "reference" signal — the M3 spec
   * link in particular is the M3-nativeness proof.
   */
  /**
   * Canonical Material 3 spec page — TRI-STATE, and the distinction matters:
   *
   *   a URL      the page IS M3-mapped and the link is recorded
   *   "none"     RECORDED as having no Material 3 source — a kern extension
   *   undefined  NOT RECORDED either way
   *
   * Collapsing the last two is an inverse fabrication: it makes a Button page
   * claim "no M3 source — this is a kern extension", which is false in the
   * opposite direction from a dead link and just as damaging to the "M3
   * reference" claim. An empty state must never assert "none".
   *
   * A URL is only meaningful once the gate has identity-matched it (the
   * landed page's title must name the claimed component) — see
   * scripts/check-spec-urls.mjs --live.
   */
  specUrl?: string | "none";
  /** WAI-ARIA Authoring Practices pattern. */
  apgUrl?: string;
  /** Source on GitHub. */
  sourceUrl?: string;
  /** Bundle-size report. */
  bundleUrl?: string;
};

/**
 * Section 6 — one row of the token table: which token this element reads at
 * this state. Generated from `packages/kern-tokens` where it can be, and
 * transcribed where it cannot. This is where "strict M3" becomes visible per
 * component.
 */
export type TokenRow = {
  element: string;
  /** `resting`, `hover`, `pressed`, `disabled`, `focus` … */
  state: string;
  /** e.g. `md.comp.filled-button.container.color`. */
  token: string;
  /**
   * The RESOLVED value, e.g. `#6750A4`. Half the reference: it is where a
   * reader sees what the token actually resolves to, and where value-checks
   * against the spec happen. Where web and native resolve differently, record
   * the canonical one and say which in the note.
   */
  value: string;
};

/**
 * Section 7 — one keyboard interaction. Radix's Key → Action shape: the table
 * is only useful if it says what each key DOES, not merely that a key exists.
 */
export type KeyRow = {
  /** `Enter`, `Space`, `ArrowDown`, `Escape` … */
  key: string;
  action: string;
};

/**
 * Section 5 — the Do/Don't pair. The M3 Guidelines pattern: two cards side by
 * side so the contrast is the argument. Both halves are required to render —
 * a Do without a Don't states no rule.
 */
export type Usage = {
  do: string[];
  dont: string[];
};

/** Section 6 — one row of the props table. Transcribed, never paraphrased. */
export type PropRow = {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  /**
   * The load-bearing half of the row: what the prop *implies*. A prop that sets
   * an ARIA attribute, controls focus or implies another prop says so here.
   */
  note?: string;
};

/**
 * Section 5 — one deviation from the Material 3 spec.
 *
 * `id` is mandatory and must resolve to a registered id in
 * `packages/kern-tokens/src/m3-roles.ts` (`KERN_EXTRA_ROLES`) or
 * `m3-elevation.ts` (`KERN_UNASSIGNED_ELEVATION`). A deviation with no id is
 * not a deviation, it is an undocumented fork — so the validator rejects it.
 */
export type Deviation = {
  /** e.g. `"K6"`. Registered with the roles/elevation it justifies. */
  id: string;
  /** What the spec specifies. */
  spec: string;
  /** What kern does instead. */
  kern: string;
  /** Why. One or two sentences — this is a decision record, not an apology. */
  why: string;
};

/** Section 4 — customization. The `notSupported` half is the load-bearing one. */
export type Customization = {
  /** What is supported: `className` passthrough, tokens, variant props. */
  supported: string[];
  /** What is NOT available. Name the trap so a reader does not fall into it. */
  notSupported: string[];
};

/**
 * Section 6 — one part of a compound component's anatomy. Parts are documented
 * on the parent's page (consistency rule 1), so this is where a reader learns
 * what `DialogContent` is for relative to `DialogRoot`.
 */
export type PartRow = {
  name: string;
  /** What it is and what it wires up. One line. */
  role: string;
};

/**
 * One component page. The unit is the **component family**, not the export:
 * compound parts (`DialogTrigger`, `DialogTitle`, …) are documented on their
 * parent's page via `parts`, never given pages of their own.
 */
export type ComponentDoc = {
  /** Route slug, e.g. `"button"`. Unique per platform. */
  slug: string;
  /** Display name in sentence case, per the Google style guide. */
  name: string;
  /** One sentence, no more. What it is. */
  oneLiner: string;
  /**
   * Section 3 — Features. Two to five sentences, second person, present
   * tense. The only section allowed to persuade. If the honest answer is "this
   * wraps a Base UI primitive", say so and link it.
   */
  features: string;
  meta: MetadataStrip;
  /**
   * Every export that belongs to this family, including the root. The first
   * entry is the one the showcase is keyed by. The validator asserts every
   * entry exists in the generated inventory and that none is claimed by two
   * families.
   */
  parts: string[];
  /** Section 4. Omit when the component is fully closed. */
  customization?: Customization;
  /** Section 5. Omit when the component is conformant with no caveats. */
  deviations?: Deviation[];
  /**
   * Section 6. `anatomy` and `aria` are parts of the same section, not extra
   * ones — the convention puts the props table, the events and the ARIA
   * contract together as the reference tail.
   */
  anatomy?: PartRow[];
  /** Section 6 — the props table for the whole family. */
  api: PropRow[];
  /**
   * Section 6 — the ARIA contract: roles set, keys handled, what is handed to
   * assistive tech. Sourced from the parity contract's assertions; a page that
   * contradicts them is a defect in the page.
   */
  aria?: string[];

  /**
   * Section 5 — the Do/Don't pair. Optional; renders only when both halves
   * are present. Tasks before reference (Diátaxis), and the clearest way to
   * state a usage rule.
   */
  usage?: Usage;

  /**
   * Section 6 — the token table. Optional today: generated where the token
   * module can supply it, transcribed where it cannot. Absent, the section
   * falls back to stating the resting elevation, which is always true.
   */
  tokens?: TokenRow[];

  /**
   * Section 7 — the keyboard contract. Optional: a component with no keyboard
   * behaviour (a `Skeleton`, a `Separator`) has none to document, and an empty
   * table is noise.
   */
  keyboard?: KeyRow[];

  /**
   * Section 7 — known accessibility gaps, stated plainly. The MUI
   * "Limitations" spirit: a gap we know about is a fact, a gap we hide is a
   * defect. Omit when there are none — do not write an empty reassurance.
   */
  accessibilityGaps?: string[];
};
