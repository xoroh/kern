import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Content api names, per part. Web content only (`src/content/web`).
 *
 * Shared by check-props (the gate: what content documents) and
 * generate-props (curated lists: documented-but-not-extracted names) so the
 * two can never disagree on what content documents. A regex pair with two
 * owners drifts; a function with two callers does not.
 *
 * Attribution: every `api` row in a family file is attributed to every part
 * in that file — EXCEPT rows carrying `for: [...]`, which attribute only to
 * the listed parts. Compound families (Root/Trigger/Content/...) carry
 * part-specific props (`nativeButton` on triggers, `initialFocus` on
 * content): without scoping, documenting them would read as stale on the
 * sibling parts whose types do not carry the name. The page already renders
 * per-part tables merged by name (`partRows` in component-page.tsx), so a
 * scoped row lands exactly where the type carries it and nowhere else.
 *
 * Returns Map<part export name, Set<prop names>>. Every `api` row in a family
 * file is attributed to every part in that file — the same attribution
 * check-props has always used, narrowed only where `for` says so.
 */
export function readContentApiNames(contentWebDir) {
  const out = new Map();
  for (const { parts, rows } of readContentApiRows(contentWebDir)) {
    for (const row of rows) {
      const targets = row.for ?? parts;
      for (const part of targets) {
        if (!parts.includes(part)) continue;
        if (!out.has(part)) out.set(part, new Set());
        out.get(part).add(row.name);
      }
    }
  }
  return out;
}

/**
 * Per-file api rows with their scope. Returns
 * [{ file, parts: string[], rows: [{ name: string, for: string[] | null }] }].
 *
 * A `for` naming a non-part is returned as-is — never silently dropped here;
 * the gate (lib/prop-coverage.mjs) fails it, because a scope that documents
 * nothing is the rot class this pipeline exists to prevent.
 *
 * Row splitting is string-aware: note prose carries `{...}` snippets and
 * `code` spans, so a naive brace match would split mid-row. Tracks ', ", `
 * strings with backslash escapes plus // and block comments. No `${}` lives
 * in any api block (verified), so template substitution needs no nesting.
 * `for` is read from the row head only (before `note:`) — notes are prose
 * and prose says "for" constantly.
 */
export function readContentApiRows(contentWebDir) {
  const out = [];
  function walk(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        walk(full);
        continue;
      }
      if (!e.name.endsWith(".ts")) continue;
      const src = readFileSync(full, "utf8");
      const partsMatch = src.match(/parts:\s*\[([^\]]*)\]/);
      if (!partsMatch) continue;
      const partNames = [...partsMatch[1].matchAll(/"([^"]+)"/g)].map(
        (m) => m[1],
      );
      // The api array is located by balanced scanning, not regex: row `for:`
      // arrays close on their own `],` line, which a lazy `...,]` pattern
      // would mistake for the end of the block.
      const apiBlock = extractApiBlock(src, partsMatch.index ?? 0);
      const rows = [];
      if (apiBlock) {
        for (const rowText of splitRowObjects(apiBlock)) {
          const row = parseRow(rowText);
          if (row) rows.push(row);
        }
      }
      out.push({ file: full, parts: partNames, rows });
    }
  }
  walk(contentWebDir);
  return out;
}

function extractApiBlock(src, fromIndex) {
  const key = /\bapi:\s*\[/g;
  key.lastIndex = fromIndex;
  const found = key.exec(src);
  if (!found) return null;
  const open = found.index + found[0].length - 1;
  let depth = 0;
  let i = open;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      i += 1;
      while (i < n && src[i] !== q) {
        if (src[i] === "\\") i += 1;
        i += 1;
      }
      i += 1;
      continue;
    }
    if (c === "/" && (src[i + 1] === "/" || src[i + 1] === "*")) {
      if (src[i + 1] === "/") {
        while (i < n && src[i] !== "\n") i += 1;
      } else {
        i += 2;
        while (i < n && !(src[i] === "*" && src[i + 1] === "/")) i += 1;
        i += 2;
      }
      continue;
    }
    if (c === "[") depth += 1;
    else if (c === "]") {
      depth -= 1;
      if (depth === 0) return src.slice(open + 1, i);
    }
    i += 1;
  }
  return null;
}

function splitRowObjects(block) {
  const rows = [];
  let depth = 0;
  let start = -1;
  let i = 0;
  const n = block.length;
  while (i < n) {
    const c = block[i];
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      i += 1;
      while (i < n && block[i] !== q) {
        if (block[i] === "\\") i += 1;
        i += 1;
      }
      i += 1;
      continue;
    }
    if (c === "/" && (block[i + 1] === "/" || block[i + 1] === "*")) {
      if (block[i + 1] === "/") {
        while (i < n && block[i] !== "\n") i += 1;
      } else {
        i += 2;
        while (i < n && !(block[i] === "*" && block[i + 1] === "/")) i += 1;
        i += 2;
      }
      continue;
    }
    if (c === "{") {
      if (depth === 0) start = i;
      depth += 1;
    } else if (c === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        rows.push(block.slice(start, i + 1));
        start = -1;
      }
    }
    i += 1;
  }
  return rows;
}

function parseRow(rowText) {
  const name = /name:\s*"([^"]+)"/.exec(rowText)?.[1];
  if (!name) return null;
  const head = rowText.split("note:")[0];
  const forMatch = /\bfor:\s*\[([^\]]*)\]/.exec(head);
  const scope = forMatch
    ? [...forMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
    : null;
  return { name, for: scope };
}
