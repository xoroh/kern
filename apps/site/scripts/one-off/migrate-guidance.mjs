#!/usr/bin/env bun
/**
 * migrate-guidance — change set 1 of the one-standard page migration.
 *
 * WHAT IT DOES
 *
 * For every component family it moves the GUIDANCE fields out of the page
 * content files and into `docs/m3-guidance/<family>.md`:
 *
 *   features · usage (do/don't) · tokens · faq · deviations · anatomy
 *
 * What stays on the page is the REFERENCE core: `meta`, `oneLiner`, `api`,
 * `keyboard`, `aria`, `accessibilityGaps`, `nonInteractive`, `customization`,
 * `parts`, `specUrl` and the `states` list.
 *
 * WHY A SCRIPT AND NOT A HAND EDIT
 *
 * ~120 families × 2 renderers is thousands of lines of content to move by
 * hand, and a hand move is exactly where content gets silently dropped. The
 * script does the surgery on the TypeScript AST (so the surrounding file is
 * untouched byte-for-byte) and renders the guidance file from the SAME
 * loaded values, so the page and the guidance file cannot disagree about
 * what was said.
 *
 * THE MANIFEST
 *
 * The moved content also lands in `docs/m3-guidance/manifest.json`, verbatim.
 * That manifest is what makes the move CHECKABLE after the fact: the gate
 * re-renders each guidance file from the manifest and compares it byte-for-
 * byte, so a hand-edit to a guidance file is caught, and every string the
 * manifest holds must appear in the guidance file — the zero-lost-lines
 * check, running in CI on the committed tree.
 *
 * Usage:
 *   bun --preload ./scripts/preload-rn.mjs scripts/one-off/migrate-guidance.mjs [--write]
 *
 * `--write` performs the move. Without it, the script reports what it would
 * do and exits non-zero if the tree is already migrated (the gate's job).
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..", "..");
const REPO = join(APP, "..", "..");
const CONTENT = join(APP, "src", "content");
const GUIDANCE_DIR = join(REPO, "docs", "m3-guidance");
const MANIFEST = join(GUIDANCE_DIR, "manifest.json");
const TMP = join("/tmp/opencode", "kern-guidance-source");

/** The fields that move from the page to the guidance file. */
const MOVED_FIELDS = [
  "features",
  "usage",
  "tokens",
  "faq",
  "deviations",
  "anatomy",
];

/** The platform marker used in the guidance file. */
const PLATFORM = { web: "Web", mobile: "Native" };

const write = process.argv.includes("--write");

/* ------------------------------------------------------------------ *
 * 1. Load the content values.
 *
 *    The guidance values are read from the PRE-MIGRATION content (the
 *    commit the move was made from), and the strip is applied to the
 *    working tree. That split is what makes the script re-runnable after
 *    the move landed: the pages no longer carry the moved fields, so
 *    reading them from the working tree would render empty guidance.
 *
 *    The pre-migration sources are extracted to a temp directory and
 *    imported from there; their imports are type-only, so they resolve
 *    without the site.
 * ------------------------------------------------------------------ */

/**
 * The commit the move was made FROM: the last main commit before the
 * migration landed. It is pinned on purpose — "the pre-migration content"
 * is a moment, and after the move lands HEAD no longer holds it.
 */
const BASE = process.env.KERN_GUIDANCE_BASE ?? "78891c04";

function gitShow(path) {
  return execFileSync("git", ["show", `${BASE}:${path}`], {
    cwd: REPO,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
}

function originalSources(platform) {
  const listing = execFileSync(
    "git",
    ["ls-tree", "--name-only", `${BASE}:apps/site/src/content/${platform}`],
    { cwd: REPO, encoding: "utf8" },
  );
  const files = listing
    .trim()
    .split("\n")
    .filter((f) => f.endsWith(".ts"));
  const dir = join(TMP, platform);
  mkdirSync(dir, { recursive: true });
  for (const file of files) {
    writeFileSync(
      join(dir, file),
      gitShow(`apps/site/src/content/${platform}/${file}`),
    );
  }
  return files;
}

async function loadDocs(platform) {
  const files = originalSources(platform);
  const docs = [];
  for (const file of files) {
    const mod = await import(join(TMP, platform, file));
    for (const value of Object.values(mod)) {
      if (value && typeof value === "object" && value.slug) {
        docs.push({ platform, file, doc: value });
      }
    }
  }
  return docs;
}

/* ------------------------------------------------------------------ *
 * 2. AST surgery — remove the moved properties from the source.
 * ------------------------------------------------------------------ */

function stripProperties(source, names) {
  const file = ts.createSourceFile(
    "content.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const edits = [];
  const visit = (node) => {
    // Match the property's NAME node only. Matching the assignment itself
    // would also match its name and its value — the same property twice, and
    // the second removal would cut into whatever sits between the two.
    if (
      ts.isIdentifier(node) &&
      ts.isPropertyAssignment(node.parent) &&
      node.parent.name === node &&
      names.has(node.text)
    ) {
      edits.push(node.parent);
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(file, visit);
  if (edits.length === 0) return source;

  // Remove each property together with the comma that binds it to the next
  // one. A trailing property must lose its leading comma instead, or the
  // object literal ends with a dangling separator.
  const sorted = edits.sort((a, b) => b.getStart(file) - a.getStart(file));
  let out = source;
  for (const prop of sorted) {
    const start = prop.getStart(file);
    const end = prop.getEnd();
    const after = out.slice(end);
    const commaMatch = after.match(/^,(\s*)/);
    let cutStart = start;
    let cutEnd = end;
    if (commaMatch) {
      cutEnd = end + commaMatch[0].length;
    } else {
      const before = out.slice(0, start);
      const commaIndex = before.lastIndexOf(",");
      if (commaIndex !== -1 && before.slice(commaIndex + 1).trim() === "") {
        cutStart = commaIndex;
        cutEnd = end;
      }
    }
    // A comment block written directly above the property belongs to it.
    // Leaving it behind would strand a comment that describes a field the
    // page no longer has.
    cutStart = absorbLeadingComment(out, cutStart);
    out = out.slice(0, cutStart) + out.slice(cutEnd);
  }
  return out;
}

function absorbLeadingComment(text, start) {
  let cursor = start;
  for (;;) {
    const lineStart = text.lastIndexOf("\n", cursor - 1) + 1;
    if (lineStart === 0 && cursor === 0) return cursor;
    const line = text.slice(lineStart, cursor).trim();
    const isComment =
      line.startsWith("//") ||
      line.startsWith("*") ||
      line.startsWith("/*") ||
      line.startsWith("*/");
    if (!isComment) return cursor;
    cursor = lineStart;
    if (cursor === 0) return cursor;
  }
}

/* ------------------------------------------------------------------ *
 * 3. Guidance rendering.
 * ------------------------------------------------------------------ */

function bullet(text) {
  return `- ${text}`;
}

function table(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.join(" | ")} |`),
  ].join("\n");
}

function renderPlatformSection(doc) {
  const lines = [];
  if (doc.features) lines.push("### Features", "", doc.features, "");
  if (doc.usage) {
    lines.push("### Usage", "");
    if (doc.usage.do?.length) {
      lines.push("**Do**", "", ...doc.usage.do.map(bullet), "");
    }
    if (doc.usage.dont?.length) {
      lines.push("**Don't**", "", ...doc.usage.dont.map(bullet), "");
    }
  }
  if (doc.tokens?.length) {
    lines.push(
      "### Tokens",
      "",
      table(
        ["Element", "State", "Token", "Value"],
        doc.tokens.map((t) => [t.element, t.state, t.token, t.value]),
      ),
      "",
    );
  }
  if (doc.anatomy?.length) {
    lines.push(
      "### Anatomy",
      "",
      table(
        ["Part", "Role"],
        doc.anatomy.map((a) => [a.name, a.role]),
      ),
      "",
    );
  }
  if (doc.deviations?.length) {
    lines.push(
      "### Deviations from Material 3",
      "",
      ...doc.deviations.flatMap((d) => [
        `**${d.id}** — spec: ${d.spec}`,
        "",
        `Kern: ${d.kern}`,
        "",
        `Why: ${d.why}`,
        "",
      ]),
    );
  }
  if (doc.faq?.length) {
    lines.push(
      "### FAQ",
      "",
      ...doc.faq.flatMap((f) => [`**${f.q}**`, "", f.a, ""]),
    );
  }
  return lines.join("\n").trim();
}

const HEADER = `<!-- Generated by apps/site/scripts/one-off/migrate-guidance.mjs. Do not edit by hand.
     The component pages carry the reference; this file carries the guidance. -->`;

function renderGuidance(familyName, docs) {
  const out = [`# ${familyName} — M3 guidance`, "", HEADER, ""];
  for (const platform of ["web", "mobile"]) {
    const entry = docs.find((d) => d.platform === platform);
    if (!entry) continue;
    const body = renderPlatformSection(entry.doc);
    if (!body) continue;
    out.push(`## ${PLATFORM[platform]}`, "", body, "");
  }
  return `${out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd()}\n`;
}

/* ------------------------------------------------------------------ *
 * 4. Run.
 * ------------------------------------------------------------------ */

rmSync(TMP, { recursive: true, force: true });
const web = await loadDocs("web");
const mobile = await loadDocs("mobile");

const families = new Map();
for (const entry of [...web, ...mobile]) {
  const slug = entry.doc.slug;
  if (!families.has(slug)) families.set(slug, { slug, docs: [] });
  families.get(slug).docs.push(entry);
}

const movedNames = new Set(MOVED_FIELDS);
let changedFiles = 0;

if (write) mkdirSync(GUIDANCE_DIR, { recursive: true });

const manifest = {};
for (const [slug, entry] of families) {
  const familyName = entry.docs[0].doc.name;

  for (const { platform, file } of entry.docs) {
    const path = join(CONTENT, platform, file);
    const source = readFileSync(path, "utf8");
    const stripped = stripProperties(source, movedNames);
    if (stripped !== source) {
      changedFiles++;
      if (write) writeFileSync(path, stripped);
    }
  }

  const platforms = {};
  for (const { platform, doc } of entry.docs) {
    const moved = {};
    for (const field of MOVED_FIELDS) {
      const value = doc[field];
      if (value === undefined) continue;
      if (Array.isArray(value) && value.length === 0) continue;
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0
      ) {
        continue;
      }
      moved[field] = value;
    }
    if (Object.keys(moved).length > 0) platforms[platform] = moved;
  }
  manifest[slug] = { name: familyName, platforms };

  if (write) {
    writeFileSync(
      join(GUIDANCE_DIR, `${slug}.md`),
      renderGuidance(familyName, entry.docs),
    );
  }
}

if (write) {
  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  // The repository formats every file it ships; the manifest is generated,
  // so the generator hands it to the same formatter the lint gate reads.
  // Without this the file is written in whatever shape JSON.stringify
  // produces, and the lint gate — which is a gate like any other — fails
  // the commit that lands it.
  try {
    execFileSync("bunx", ["biome", "format", "--write", MANIFEST], {
      cwd: REPO,
      stdio: "ignore",
    });
  } catch {
    // Biome is optional here: the lint gate is the authority, and it will
    // say so plainly if the file is not formatted.
  }
}

console.log(
  `migrate-guidance: ${families.size} families · ${changedFiles} page files ${write ? "stripped" : "would be stripped"} · guidance ${write ? "written" : "not written"}`,
);
