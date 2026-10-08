/**
 * Per-page markdown emission (Phase 3 grammar).
 *
 * Shared by generate-page-md (the emitter: writes public/md/**) and
 * check-page-md (the gate: every docs page emits its .md). One function with
 * two callers, so the gate can never disagree with the emitter about what a
 * page's .md contains.
 *
 * Data-only: everything here comes from the content docs and the foundations
 * registry. Nothing is invented — a section with no content records is cut,
 * the same rule the template follows, and demo/install lines are derived from
 * the metadata strip exactly the way the page derives them.
 */

import {
  exemptionReason,
  expectedSections,
  hasFaq,
  hasLimitations,
  hasSemanticDom,
} from "../../src/systems/grammar.ts";

/**
 * The npm target you can actually install. `meta.package` is an IMPORT PATH
 * (`@xoroh/kern/start`), but npm installs PACKAGES, not subpaths — the same
 * derivation `component-page.tsx` renders, kept in step by check-page-md's
 * spot comparison, not by sharing (the template is TSX; this is Node-safe).
 */
export function installTarget(pkg) {
  const segments = pkg.split("/");
  return pkg.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0];
}

const H2 = {
  demo: "Demo",
  props: "Props",
  tokens: "Tokens",
  "semantic-dom": "Semantic DOM",
  accessibility: "Accessibility",
  limitations: "Limitations",
  faq: "FAQ",
  spec: "Spec",
};

/** The h2 titles a doc's .md must carry, in order (non-exempt pages). */
export function expectedHeadings(doc) {
  return expectedSections(doc).map((id) => H2[id]);
}

function stripBackticks(s) {
  return String(s).replace(/`([^`]*)`/g, "$1");
}

function elevationText(meta) {
  if (meta.elevation === "none") return "n/a (no visual form)";
  if (meta.elevation === "surface") return "Surface (no elevation token)";
  return `Level ${meta.elevation}`;
}

/**
 * One component family's .md, in grammar order. Conditional sections are cut
 * when empty — the same predicates the template applies, imported from the
 * shared grammar module rather than re-stated.
 */
export function pageMarkdown(doc, platform, { liveDemo = false } = {}) {
  const renderer = platform === "web" ? "Web" : "Native";
  const meta = doc.meta;
  const target = installTarget(meta.package);
  const out = [];

  // lede
  out.push(`# ${doc.name} (${renderer})`, "");
  out.push(doc.oneLiner, "");
  out.push(stripBackticks(doc.features), "");
  out.push(
    `Package: ${meta.package} · Status: ${meta.status} · Native peer: ${meta.nativePeer} · Elevation: ${elevationText(meta)}`,
    "",
  );

  // demo
  out.push("## Demo", "");
  out.push(
    liveDemo
      ? `Live demo on the site for \`${doc.parts[0]}\`.`
      : `No live demo is registered for \`${doc.parts[0]}\` — a gap in the site, not in the package.`,
  );
  out.push(`Install: \`npm i ${target}\``);
  out.push(
    `Import: \`import { ${doc.parts[0]} } from "${meta.package}";\``,
    "",
  );

  // props
  out.push("## Props", "");
  out.push("| Prop | Type | Default | Notes |");
  out.push("| --- | --- | --- | --- |");
  for (const row of doc.api) {
    out.push(
      `| \`${row.name}\` | \`${row.type}\` | ${row.default ? `\`${row.default}\`` : "—"} | ${stripBackticks(row.note ?? "")} |`,
    );
  }
  out.push("");

  // tokens
  out.push("## Tokens", "");
  if (doc.tokens && doc.tokens.length > 0) {
    out.push("| Element | State | Token | Value |");
    out.push("| --- | --- | --- | --- |");
    for (const row of doc.tokens) {
      out.push(
        `| ${row.element} | ${row.state} | \`${row.token}\` | \`${row.value}\` |`,
      );
    }
  } else {
    out.push(
      `No per-component token table is recorded yet. Resting elevation: ${elevationText(meta)}.`,
    );
  }
  if (doc.customization && doc.customization.supported.length > 0) {
    out.push("", "### Customization");
    for (const line of doc.customization.supported)
      out.push(`- ${stripBackticks(line)}`);
  }
  out.push("");

  // semantic DOM
  if (hasSemanticDom(doc)) {
    out.push("## Semantic DOM", "");
    if ((doc.anatomy?.length ?? 0) > 0) {
      out.push("### Anatomy", "");
      for (const part of doc.anatomy)
        out.push(`- \`${part.name}\` — ${stripBackticks(part.role)}`);
      out.push("");
    }
    if ((doc.aria?.length ?? 0) > 0) {
      out.push("### Roles", "");
      for (const line of doc.aria) out.push(`- ${stripBackticks(line)}`);
      out.push("");
    }
  }

  // accessibility
  out.push("## Accessibility", "");
  if ((doc.keyboard?.length ?? 0) > 0) {
    out.push("| Key | Action |");
    out.push("| --- | --- |");
    for (const row of doc.keyboard)
      out.push(`| \`${row.key}\` | ${stripBackticks(row.action)} |`);
  } else if (doc.nonInteractive) {
    out.push(
      "Not applicable — a non-interactive part with no keyboard interaction and no ARIA state of its own.",
    );
  } else {
    out.push(
      "Not yet documented — interactive, so the contract exists; it just has not been written up here yet.",
    );
  }
  out.push("");

  // limitations
  if (hasLimitations(doc)) {
    out.push("## Limitations", "");
    const exempt = exemptionReason(doc);
    if (exempt) out.push(`Grammar exemption: ${stripBackticks(exempt)}`, "");
    for (const line of doc.customization?.notSupported ?? []) {
      out.push(`- Not supported: ${stripBackticks(line)}`);
    }
    for (const line of doc.accessibilityGaps ?? []) {
      out.push(`- Known gap: ${stripBackticks(line)}`);
    }
    out.push("");
  }

  // faq
  if (hasFaq(doc)) {
    out.push("## FAQ", "");
    for (const row of doc.faq) {
      out.push(`**${stripBackticks(row.q)}**`, "", stripBackticks(row.a), "");
    }
  }

  // spec
  out.push("## Spec", "");
  if (typeof meta.specUrl === "string" && meta.specUrl !== "none") {
    out.push(`Material 3 spec: ${meta.specUrl}`);
  } else if (meta.specUrl === "none") {
    out.push("No Material 3 source — this is a kern extension.");
  } else {
    out.push("Material 3 source not recorded for this page yet.");
  }
  for (const d of doc.deviations ?? []) {
    out.push(
      "",
      `### ${d.id}`,
      "",
      `Spec: ${stripBackticks(d.spec)}`,
      "",
      `kern: ${stripBackticks(d.kern)}`,
      "",
      `Why: ${stripBackticks(d.why)}`,
    );
  }
  out.push("");

  return `${out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()}\n`;
}

/**
 * The theme reference page's .md (/foundations/theme).
 *
 * The page BODIES render resolved values from the token package (every
 * swatch drawn by its own role), which has no markdown form — so this emits
 * the facts the page owns (title, one-liner, the preset catalog, resolved
 * counts) and says where the values live, rather than transcribing numbers
 * that would go stale silently. Same rule foundationMarkdown follows.
 *
 * `theme` is the /foundations/theme nav leaf (the hand-edited source llms.txt
 * also reads — title/one-liner are never copied). `catalog` is the theme
 * catalog (`packages/kern-tokens/src/themes/index.json`); `counts` carries
 * the role/shape totals derived from the default theme file.
 */
export function themeMarkdown(theme, catalog, counts) {
  const out = [];
  out.push(`# ${theme.title} (Foundations)`, "");
  out.push(theme.oneLiner, "");
  out.push(
    "This page resolves; it does not configure. Every swatch on the site " +
      "page is read from `@xoroh/kern-tokens` directly — the values below " +
      "are pointers to that source, not copies of it.",
    "",
  );
  out.push("## Presets", "");
  for (const preset of catalog.themes) {
    out.push(`- **${preset.id}** (${preset.name}) — ${preset.description}`);
  }
  out.push("");
  out.push("## Resolved values", "");
  out.push(
    `${counts.roles} color roles per scheme and ${counts.shapes} shape ` +
      "roles, read from the token package. Fetch them with the `get_tokens` " +
      "MCP tool (a preset id for the overrides, `base` for the shared " +
      "source) — never copy values from this file into code.",
    "",
  );
  out.push("## Configure it", "");
  out.push(
    "Seed, presets, contrast levels, radius authoring and preset export " +
      "live in the theme configurator (/theme-configurator). What the roles " +
      "mean and where each one goes lives on /foundations/color. Every " +
      "token is also a CSS variable, so a project can read one without " +
      "importing anything, e.g. `--md-sys-color-primary`.",
    "",
  );
  return `${out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()}\n`;
}

/**
 * One foundations page's .md. The page BODIES render from the token package
 * (each value drawn by its own token), which has no markdown form — so this
 * emits the registry facts the page owns (title, one-liner, deviations,
 * neighbours) and says where the values live, rather than transcribing
 * numbers that would go stale silently.
 */
export function foundationMarkdown(page, neighbours) {
  const out = [];
  out.push(`# ${page.title} (Foundations)`, "");
  out.push(page.oneLiner, "");
  if ((page.deviations?.length ?? 0) > 0) {
    out.push("## kern deviations", "");
    for (const d of page.deviations) out.push(`- **${d.id}** — ${d.note}`);
    out.push("");
  } else {
    out.push("No kern deviations — this page is Material 3 exactly.", "");
  }
  out.push(
    "Values on the site page render from `@xoroh/kern-tokens` directly — " +
      "each figure drawn by its own token, so a wrong value shows as a wrong " +
      "figure rather than a wrong number beside a right one.",
    "",
  );
  const nav = [
    neighbours.prev ? `Previous: ${neighbours.prev.title}` : null,
    neighbours.next ? `Next: ${neighbours.next.title}` : null,
  ].filter(Boolean);
  if (nav.length > 0) out.push(nav.join(" · "), "");
  return `${out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()}\n`;
}
