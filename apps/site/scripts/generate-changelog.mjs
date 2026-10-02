/**
 * generate-changelog.mjs — recent changes, read from the changesets themselves.
 *
 * WHY GENERATED
 * The docs hub's "recent changes" band is a claim about what shipped. A
 * hand-typed list is stale the moment a changeset lands, which is exactly the
 * drift class the Foundations family was built to kill. The changesets are the
 * source: each PR writes one (`bun run changeset`), and the Version Packages PR
 * later folds them into `CHANGELOG.md`. Until something publishes there is no
 * CHANGELOG.md at all — measured: `ls packages/&#42;/CHANGELOG.md` returns
 * nothing, and `.changeset/` holds 59 pending entries. So the hub reads the
 * pending changesets, which is the live source.
 *
 * SHAPE PARSED (a real parse of a known format, not a regex over prose):
 *
 *   ---
 *   "@xoroh/kern": patch          <- one or more package: bump lines
 *   ---
 *
 *   First paragraph is the summary.    <- what the hub shows
 *
 * Frontmatter is a flat `key: value` map with optionally quoted keys. Parsing
 * line-by-line is a real parse for THIS shape; if the format ever grows
 * nesting, switch to a YAML library rather than growing a regex.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, "..");
const ROOT = join(SITE, "..", "..");
const CHANGESETS = join(ROOT, ".changeset");

const SKIP = new Set(["config.json", "README.md"]);

function parseFrontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return null;
  const entries = {};
  for (const line of m[1].split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf(":");
    if (i === -1) continue;
    const key = trimmed
      .slice(0, i)
      .trim()
      .replace(/^["']|["']$/g, "");
    const value = trimmed
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key && value) entries[key] = value;
  }
  return Object.keys(entries).length ? entries : null;
}

function summaryOf(text) {
  const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
  const firstPara = body.split(/\r?\n\s*\r?\n/).find((p) => p.trim());
  if (!firstPara) return "";
  return toPlain(firstPara);
}

/**
 * Markdown -> plain text for the hub's one-line summaries.
 *
 * The band renders these as text, not as markdown, so ANY syntax that survives
 * here is shown to the reader as literal punctuation. review-showcase caught
 * `**BREAKING**` painting as asterisks — the same class as the DTCG `$comment`
 * leak: source syntax in reader copy. Strip every construct the changesets
 * actually use rather than special-casing the one that was caught.
 */
function toPlain(md) {
  return md
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links
    .replace(/`([^`]*)`/g, "$1") // code spans
    .replace(/\*\*\*([^*]+)\*\*\*/g, "$1") // bold-italic
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italic
    .replace(/__([^_]+)__/g, "$1") // bold (underscore form)
    .replace(/(^|[\s(])_([^_]+)_(?=[\s).,;:!?]|$)/g, "$1$2") // italic
    .replace(/~~([^~]+)~~/g, "$1") // strikethrough
    .replace(/^#{1,6}\s+/gm, "") // heading marks
    .replace(/^\s*[-*+]\s+/gm, "") // bullet marks
    .replace(/^\s*>\s+/gm, "") // quote marks
    .replace(/\s+/g, " ")
    .trim();
}

/** The license the repo actually ships, read from the LICENSE file. */
function licenseOf() {
  try {
    const first = readFileSync(join(ROOT, "LICENSE"), "utf8")
      .split(/\r?\n/)
      .find((l) => l.trim());
    if (!first) return "unknown";
    // "MIT License" -> "MIT"; "Apache License 2.0" -> "Apache License 2.0"
    return first.replace(/\s+License\s*$/i, "").trim() || first.trim();
  } catch {
    return "unknown";
  }
}

const files = readdirSync(CHANGESETS)
  .filter((f) => f.endsWith(".md") && !SKIP.has(f))
  .sort();

const entries = [];
for (const file of files) {
  const text = readFileSync(join(CHANGESETS, file), "utf8");
  const bump = parseFrontmatter(text);
  if (!bump) continue; // not a changeset — config/README class
  const summary = summaryOf(text);
  if (!summary) continue;
  entries.push({
    id: file.replace(/\.md$/, ""),
    packages: Object.keys(bump),
    bump: Object.values(bump).sort()[0],
    summary,
  });
}

// largest bump first, then file order — a major outranks a patch regardless of
// when the file happened to be written
const RANK = { major: 0, minor: 1, patch: 2 };
entries.sort((a, b) => (RANK[a.bump] ?? 3) - (RANK[b.bump] ?? 3) || 0);

const out = join(SITE, "src", "generated", "changelog.ts");

// Format with the repo's biome BEFORE writing, as generate-maturity.mjs and
// generate-manifest.mjs both do.
//
// The bug this fixes is emitting `JSON.stringify(entries, null, 2)` into a `.ts`
// file: that is JSON syntax, so every object key comes out quoted and biome's
// formatter rewrites all of them. The generator and the formatter then fight
// over the same bytes — the generator's output is never what is committed, and
// a `check:generated` comparison against a fresh run reports a diff that is
// only whitespace. Measured: `biome check apps/site/src/generated/changelog.ts`
// was red on ~30 entries at the commit this landed.
const text = `// GENERATED by apps/site/scripts/generate-changelog.mjs — DO NOT EDIT.
// Source of truth: .changeset/*.md (the pending changesets).
// Regenerate: bun run generate

export type ChangeEntry = {
  /** Changeset filename without extension — a stable id, not a date. */
  id: string;
  /** Packages this entry bumps. */
  packages: string[];
  /** The largest bump in the frontmatter: major | minor | patch. */
  bump: "major" | "minor" | "patch";
  /** First paragraph of the changeset body. */
  summary: string;
};

export const RECENT_CHANGES: readonly ChangeEntry[] = ${JSON.stringify(entries, null, 2)};

/**
 * The license the repo ships, read from the LICENSE file at generate time.
 * The footer used to type this string and it drifted: the repo is MIT while
 * the chrome still claimed Apache License 2.0. A typed licence is a claim
 * about a file sitting three directories away — generate it or expect it to
 * lie.
 */
export const REPO_LICENSE = ${JSON.stringify(licenseOf())};
`;

const { execFileSync } = await import("node:child_process");
let formatted = text;
try {
  formatted = execFileSync(
    join(SITE, "..", "..", "node_modules", ".bin", "biome"),
    ["format", "--stdin-file-path=changelog.ts"],
    { input: text, encoding: "utf8", cwd: SITE },
  );
} catch {
  // biome absent (partial install, release runner): write unformatted rather
  // than fail, and let the freshness gate report the difference honestly.
  console.warn(
    "generate-changelog: could not run biome; wrote unformatted — run `bun run format` before lint",
  );
  formatted = text;
}
writeFileSync(out, formatted);

const byBump = entries.reduce((acc, e) => {
  acc[e.bump] = (acc[e.bump] ?? 0) + 1;
  return acc;
}, {});
console.log(
  `generate-changelog: wrote ${entries.length} entries from .changeset (${Object.entries(
    byBump,
  )
    .map(([k, v]) => `${k}=${v}`)
    .join(" ")})`,
);
