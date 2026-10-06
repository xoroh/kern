// Shared CODEOWNERS matcher - GitHub semantics.
//
// Used by check-stale-refs and check-commit-intent so local ownership reports
// agree with GitHub review routing.
//
// Rules:
//   1. Last match wins.
//   2. A leading slash anchors the pattern at the repo root.
//   3. A pattern with no slash (except an optional trailing slash) matches at
//      any depth.
//   4. A trailing slash means this directory and everything under it.
//   5. A bare asterisk is the catch-all (handled by callers via catchAll).
//
// Supports *, **, recursive-dir globs, and ?.

/** Metacharacters that must be escaped in a RegExp source. */
const REGEX_ESCAPE = /[.+^$()|[\]\\{}]/g;

// Parse CODEOWNERS text into ordered rule objects
// (pattern, owners, line, catchAll). Comments and blank lines are skipped.
export function parseCodeowners(text) {
  const rules = [];
  String(text)
    .split("\n")
    .forEach((raw, idx) => {
      const line = raw.trim();
      if (!line || line.startsWith("#")) return;
      const parts = line.split(/\s+/);
      const pattern = parts[0];
      rules.push({
        pattern,
        owners: parts.slice(1),
        line: idx + 1,
        catchAll: pattern === "*",
      });
    });
  return rules;
}

// Translate a CODEOWNERS pattern to a RegExp matching a repo-relative path.
// The catch-all asterisk is not a path pattern - callers should skip it.
export function globToRegExp(pattern) {
  if (pattern === "*") {
    return /^.+$/;
  }

  const anchored = pattern.startsWith("/");
  let body = anchored ? pattern.slice(1) : pattern;
  const isDir = body.endsWith("/");
  if (isDir) body = body.slice(0, -1);

  let re = "";
  for (let i = 0; i < body.length; i += 1) {
    const c = body[i];
    if (c === "*") {
      if (body[i + 1] === "*") {
        if (body[i + 2] === "/") {
          re += "(?:[^/]+/)*";
          i += 2;
        } else {
          re += ".*";
          i += 1;
        }
      } else {
        re += "[^/]*";
      }
      continue;
    }
    if (c === "?") {
      re += "[^/]";
      continue;
    }
    re += c.replace(REGEX_ESCAPE, "\\$&");
  }

  // Root-anchored, OR pattern contains an inner slash -> match from root.
  // Otherwise (bare name / bare dir) -> any depth.
  const hasInnerSlash = body.includes("/");
  const prefix = anchored || hasInnerSlash ? "^" : "^(?:.*/)?";
  const suffix = isDir ? "/.*$" : "$";
  return new RegExp(prefix + re + suffix);
}

/** Does this pattern match this repo-relative path? */
export function matchesPath(pattern, path) {
  if (pattern === "*") return true;
  return globToRegExp(pattern).test(path);
}

// Effective owners of a path under last-match-wins. Returns the owner array
// of the last matching rule, or null if nothing matched (including no catch-all).
export function ownerOf(path, rules) {
  let owners = null;
  for (const rule of rules) {
    if (rule.catchAll) {
      owners = rule.owners;
      continue;
    }
    if (matchesPath(rule.pattern, path)) owners = rule.owners;
  }
  return owners;
}
