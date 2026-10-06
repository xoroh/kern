#!/usr/bin/env bun
/**
 * check-a11y.mjs — the Part 7 gate (wired into check:docs chain).
 *
 * What it proves, in order:
 * 1. SCHEMA — every *.a11y.json parses; page/measures/note/demos shape;
 *    every expectation carries rule, expect∈{pass,gap,fail},
 *    provenance∈{derived,authored}, non-empty basis. An entry without
 *    provenance is the blur the spec forbids — it fails here.
 * 2. NO STALE DERIVED — the gate re-derives every `derived` entry from the
 *    LIVE content docs via scripts/a11y-derive.mjs and diffs against the
 *    file. A content edit without regen, or a generator bug, fails here.
 *    (The generator and the gate share the rules module, so they cannot
 *    disagree about what the rules ARE — only about whether the files
 *    were regenerated.)
 * 3. LIVE REGISTRY — hasLiveDemo matches the real demo registries. A demo
 *    added or removed without regen fails here.
 * 4. COVERAGE — every doc part (export) has an entry; no orphan entries.
 * 5. RULE ARMS — synthetic unit checks over deriveExpectations prove the
 *    arms no content doc currently exercises (known-gap → fail; the live
 *    tree has zero accessibilityGaps, which is correct output, not a hole).
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deriveExpectations } from "./a11y-derive.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");
const OUT_DIR = join(APP, "src", "generated", "a11y");

const { WEB_DEMOS } = await import(
  join(APP, "src", "demos", "web", "registry.tsx")
);
const { MOBILE_DEMOS } = await import(
  join(APP, "src", "demos", "mobile", "registry.tsx")
);

const PLATFORMS = {
  web: { dir: join(APP, "src", "content", "web"), demos: WEB_DEMOS },
  mobile: { dir: join(APP, "src", "content", "mobile"), demos: MOBILE_DEMOS },
};

let failures = 0;
const bad = (msg) => {
  failures++;
  console.error(`x    ${msg}`);
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

let pages = 0;
for (const [platform, { dir, demos: registry }] of Object.entries(PLATFORMS)) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
  for (const file of files.sort()) {
    const mod = await import(join(dir, file));
    for (const doc of Object.values(mod)) {
      if (
        !doc ||
        typeof doc !== "object" ||
        !doc.slug ||
        !Array.isArray(doc.parts)
      )
        continue;
      pages++;
      const path = join(OUT_DIR, platform, `${doc.slug}.a11y.json`);
      let page;
      try {
        page = JSON.parse(readFileSync(path, "utf8"));
      } catch {
        bad(
          `${platform}/${doc.slug}: missing or unparsable ${path} — regen (bun run generate)`,
        );
        continue;
      }
      if (page.page !== `${platform}/${doc.slug}`)
        bad(`${path}: page field ${page.page}`);
      if (page.measured !== false)
        bad(
          `${path}: measured must be false — nothing here was observed in a browser`,
        );
      if (!page.note || typeof page.note !== "string")
        bad(`${path}: missing honesty note`);
      const seen = new Set(Object.keys(page.demos ?? {}));
      for (const part of doc.parts) {
        if (!seen.has(part)) {
          bad(`${path}: no entry for part ${part} — regen`);
          continue;
        }
        seen.delete(part);
        const entry = page.demos[part];
        const live = Boolean(registry[part]);
        if (entry.hasLiveDemo !== live) {
          bad(
            `${path}: ${part} hasLiveDemo=${entry.hasLiveDemo} but registry says ${live} — regen`,
          );
        }
        const wantDerived = deriveExpectations(doc, part, live);
        const gotDerived = (entry.expectations ?? []).filter(
          (e) => e.provenance === "derived",
        );
        if (!same(gotDerived, wantDerived)) {
          bad(
            `${path}: ${part} derived entries differ from live re-derivation — regen`,
          );
        }
        for (const e of entry.expectations ?? []) {
          if (!e.rule || !["pass", "gap", "fail"].includes(e.expect)) {
            bad(
              `${path}: ${part} carries malformed expectation ${JSON.stringify(e)}`,
            );
          }
          if (!["derived", "authored"].includes(e.provenance)) {
            bad(
              `${path}: ${part} expectation without legal provenance — generated-vs-authored must never blur`,
            );
          }
          // Design verdict on Part 7 (DialogTitle false "is interactive"):
          // derived bases must never assert interactivity — the rule keys off
          // the page-level flag, so per-export interactivity is unknowable.
          // (The nonInteractive arm's "is a non-interactive part" does not
          // contain this phrase; it asserts the page-level flag, which is real.)
          if (
            e.provenance === "derived" &&
            e.basis.includes("is interactive")
          ) {
            bad(
              `${path}: ${part} derived basis asserts interactivity — soften the template, do not guess per-export`,
            );
          }
          if (!e.basis || !e.basis.trim())
            bad(`${path}: ${part} expectation without basis`);
        }
      }
      for (const orphan of seen)
        bad(`${path}: orphan entry ${orphan} — no such part in ${doc.slug}.ts`);
    }
  }
}

// Rule arms no live doc exercises (zero accessibilityGaps in tree is correct
// output, not a hole): synthetic docs prove deriveExpectations emits them.
{
  const gappy = {
    slug: "synth",
    parts: ["Synth"],
    keyboard: [{ key: "Enter", action: "go" }],
    aria: ["role button"],
    accessibilityGaps: ["focus ring invisible on dark"],
  };
  const got = deriveExpectations(gappy, "Synth", true);
  const fail = got.find((e) => e.rule === "known-gap");
  if (
    !fail ||
    fail.expect !== "fail" ||
    fail.provenance !== "derived" ||
    !fail.basis.includes("focus ring")
  ) {
    bad(
      "derive arm: stated gap must emit known-gap/fail/derived carrying the gap text",
    );
  }
  const quiet = { slug: "synth", parts: ["SynthPart"], nonInteractive: true };
  const q = deriveExpectations(quiet, "SynthPart", true);
  if (!q.some((e) => e.rule === "focusable" && e.expect === "pass")) {
    bad("derive arm: nonInteractive must emit focusable/pass");
  }
  if (deriveExpectations(quiet, "SynthPart", false).length !== 0) {
    bad("derive arm: demo-less export must emit zero expectations");
  }
}

if (failures > 0) {
  console.error(`check-a11y: ${failures} failure(s) across ${pages} pages`);
  process.exit(1);
}
console.log(
  `check-a11y: ok — ${pages} pages, derived entries match live re-derivation`,
);
