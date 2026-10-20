#!/usr/bin/env node
/**
 * check-guidance — the guidance corpus gate (one standard, ADR-115).
 *
 * WHAT IT ASSERTS
 *
 * The teaching half of every component page lives in
 * `docs/m3-guidance/<family>.md`, one file per family, moved VERBATIM from
 * the pages on 2026-10-19. This gate is what makes "moved verbatim" a
 * checkable claim rather than a hope:
 *
 *   1. EXISTENCE: every component family has a guidance file, and
 *      `manifest.json` has an entry for it. The reverse too: a guidance file
 *      with no manifest entry is an orphan (a family that no longer exists),
 *      and a manifest entry with no file is a promise nobody kept.
 *   2. BYTE-IDENTITY: each guidance file equals a FRESH RENDER from the
 *      manifest (same renderer the migration used — `scripts/lib/guidance.mjs`).
 *      A hand-edit to a guidance file is caught here, because the file is
 *      generated, not authored.
 *   3. ZERO LOST LINES: every string the manifest holds for a family appears
 *      in the rendered file (whitespace normalised first). This is the
 *      independent half of (2): even a renderer that silently dropped a
 *      Don't or a token row would pass a byte-comparison against ITS OWN
 *      output, so the manifest's strings are checked against the FILE.
 *   4. NO MOVED FIELD ON A PAGE: no content file under
 *      `src/content/{web,mobile}/` still carries `features`, `usage`,
 *      `tokens`, `faq`, `deviations` or `anatomy`. The split is the point:
 *      a page that keeps them says the same thing twice, and the guidance
 *      file goes stale the moment the page is edited.
 *   5. STATES CARRIED OVER: a page whose manifest entry had a token table
 *      carries a `states` list naming every state the token rows registered.
 *      The token table moved; the "which states does this component have"
 *      answer stayed on the page, and this is the check that it really did.
 *
 * WHY A GATE AND NOT A REVIEW
 *
 * The move touched 122 families and ~4000 lines. A hand move is exactly
 * where content gets silently dropped, and a review does not scale to it.
 * The manifest is the receipt: the gate re-renders from it and compares, so
 * the tree says what was moved rather than what someone believes was moved.
 *
 * Run from apps/site (`bun run check:docs` runs it through
 * `scripts/check-docs.mjs`), or directly:
 *   node scripts/check-guidance.mjs
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  GUIDANCE_DIR,
  guidanceFor,
  loadManifest,
  MANIFEST_PATH,
  MOVED_FIELDS,
  manifestStrings,
  renderGuidanceFile,
} from "./lib/guidance.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");
const CONTENT = join(APP, "src", "content");

/**
 * Collapse every whitespace run to a single space. The comparison is about
 * TEXT, not layout: a table cell and a bullet line are the same string to a
 * reader, and a re-wrap must not read as a lost line.
 */
function normalise(text) {
  return String(text).replace(/\s+/g, " ").trim();
}

/**
 * The content pages, loaded the way the site loads them (the same discovery
 * `check-docs.mjs` walks, because readdirSync works in Node without Vite).
 *
 * `pages` may be handed in by a caller that already loaded them — the docs
 * gate does, and loading 209 TypeScript modules twice for one run is waste.
 */
async function loadPages() {
  const pages = [];
  for (const platform of ["web", "mobile"]) {
    const dir = join(CONTENT, platform);
    let files;
    try {
      files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
    } catch {
      continue;
    }
    for (const file of files.sort()) {
      const mod = await import(join(dir, file));
      for (const value of Object.values(mod)) {
        if (value && typeof value === "object" && "slug" in value) {
          pages.push({ platform, file: `${platform}/${file}`, doc: value });
        }
      }
    }
  }
  return pages;
}

/**
 * The gate itself. Returns its findings rather than exiting, so the docs
 * gate can fold them into its own report (one function, two callers — the
 * same arrangement the repo uses for the page `.md`).
 */
export async function checkGuidance(pages) {
  const errors = [];
  const fail = (m) => errors.push(m);

  const manifest = loadManifest();
  if (!manifest) {
    fail(
      `no guidance manifest at ${MANIFEST_PATH} — the guidance corpus is missing, ` +
        `so "the moved content is still there" cannot be checked at all`,
    );
    return { errors, families: 0, pages: 0, files: 0 };
  }

  const own = pages ?? (await loadPages());
  const families = new Map();
  for (const page of own) {
    if (!families.has(page.doc.slug)) families.set(page.doc.slug, []);
    families.get(page.doc.slug).push(page);
  }

  // --- 1 + 2 + 3: per family ------------------------------------------------
  for (const [slug, entry] of Object.entries(manifest)) {
    const file = join(GUIDANCE_DIR, `${slug}.md`);
    const at = (msg) => `${slug}: ${msg}`;

    if (!existsSync(file)) {
      fail(
        at(
          `the manifest has an entry but docs/m3-guidance/${slug}.md does not exist — ` +
            `the guidance for this family was promised and never written`,
        ),
      );
      continue;
    }

    const onDisk = readFileSync(file, "utf8");
    const rendered = renderGuidanceFile(entry.name, entry.platforms ?? {});
    if (onDisk !== rendered) {
      // Name the FIRST differing line: "the file differs" is a chore to act
      // on, "line 42 differs" is a chore that gets fixed.
      const a = onDisk.split("\n");
      const b = rendered.split("\n");
      let at_line = 0;
      while (
        at_line < a.length &&
        at_line < b.length &&
        a[at_line] === b[at_line]
      )
        at_line += 1;
      fail(
        at(
          `docs/m3-guidance/${slug}.md is not what the manifest renders — the file ` +
            `is generated, and hand-edits are caught here. First difference at line ` +
            `${at_line + 1}:\n      file: ${JSON.stringify(a[at_line] ?? "<end of file>")}` +
            `\n      manifest: ${JSON.stringify(b[at_line] ?? "<end of file>")}`,
        ),
      );
      continue;
    }

    // Zero lost lines: the manifest's strings must be IN the file. The byte
    // comparison above already implies it for this renderer, but the two
    // checks fail DIFFERENTLY — a renderer that drops a field fails this
    // one even when it is compared against its own output.
    const flat = normalise(onDisk);
    for (const platform of Object.keys(entry.platforms ?? {})) {
      const moved = entry.platforms[platform];
      for (const text of manifestStrings(moved)) {
        const needle = normalise(text);
        if (needle.length === 0) continue;
        if (!flat.includes(needle)) {
          fail(
            at(
              `the ${platform} guidance does not contain a string the manifest holds — ` +
                `a moved line was lost: ${JSON.stringify(needle.slice(0, 120))}`,
            ),
          );
        }
      }
    }
  }

  // The reverse direction: a family with pages but no manifest entry, and a
  // guidance file on disk that no family claims (an orphan from a family
  // that was deleted or renamed).
  for (const slug of families.keys()) {
    if (!manifest[slug]) {
      fail(
        `${slug}: the family has content pages but no guidance entry in ` +
          `docs/m3-guidance/manifest.json — its teaching half was never moved`,
      );
    }
  }
  let orphanFiles = 0;
  for (const name of existsSync(GUIDANCE_DIR)
    ? readdirSync(GUIDANCE_DIR).filter(
        (f) => f.endsWith(".md") && f !== "README.md",
      )
    : []) {
    const slug = name.replace(/\.md$/, "");
    if (!manifest[slug]) {
      orphanFiles += 1;
      fail(
        `docs/m3-guidance/${name} has no manifest entry and no family claims it — ` +
          `an orphan from a family that no longer exists`,
      );
    }
  }

  // --- 4 + 5: per page -----------------------------------------------------
  for (const { platform, file, doc } of own) {
    const at = (msg) => `${file}: ${msg}`;

    // 4 — a moved field still on the page.
    for (const field of MOVED_FIELDS) {
      if (doc[field] !== undefined) {
        fail(
          at(
            `still carries \`${field}\` — it moved to docs/m3-guidance/${doc.slug}.md, ` +
              `and a page that keeps it says the same thing twice while the guidance file goes stale`,
          ),
        );
      }
    }

    // 5 — the states list, carried over from the token rows.
    const moved = guidanceFor(doc.slug, platform);
    const tokenStates = [...new Set((moved?.tokens ?? []).map((t) => t.state))];
    const states = doc.states;
    if (tokenStates.length > 0) {
      if (!Array.isArray(states) || states.length === 0) {
        fail(
          at(
            `the ${platform} guidance has a token table (${tokenStates.length} state(s)) ` +
              `but the page carries no \`states\` list — the states the token rows ` +
              `registered were lost with the table`,
          ),
        );
      } else {
        const missing = tokenStates.filter((s) => !states.includes(s));
        if (missing.length > 0) {
          fail(
            at(
              `the \`states\` list does not cover the states the ${platform} token ` +
                `table registered: missing ${missing.map((s) => `"${s}"`).join(", ")}`,
            ),
          );
        }
      }
    } else if (Array.isArray(states) && states.length > 0) {
      fail(
        at(
          `carries a \`states\` list but the ${platform} guidance has no token table — ` +
            `a states list with nothing behind it is a claim no gate can check`,
        ),
      );
    }
  }

  return {
    errors,
    families: Object.keys(manifest).length,
    pages: own.length,
    files: Object.keys(manifest).length - orphanFiles,
  };
}

/**
 * The standalone run: print the report and exit non-zero on any violation.
 * Guarded so the docs gate can import this file and call `checkGuidance()`
 * without running the whole thing twice.
 */
const invokedDirectly =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  const result = await checkGuidance();
  console.log(
    `check-guidance: ${result.families} guidance file(s) · ${result.pages} content page(s)`,
  );
  if (result.errors.length > 0) {
    console.error(`\ncheck-guidance: ${result.errors.length} error(s):`);
    for (const e of result.errors) console.error(`  x    ${e}`);
    process.exit(1);
  }
  console.log(
    "check-guidance: ok — every family's guidance is present, verbatim, and the pages carry none of it",
  );
}
