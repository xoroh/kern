/**
 * Search scoring — pure, dependency-free ranking over search entries.
 *
 * WHY A SEPARATE MODULE
 *
 * The index builder (`search/index.ts`) pulls content docs and token roles —
 * heavy imports that need the workspace. Ranking itself is a pure function
 * over {title, hint} pairs, and purity is what makes it contract-testable:
 * `scripts/check-search.mjs` executes this module directly with fixture
 * entries, no bundle, no aliases. (The site has no test runner wired; the
 * repo's gate culture — executable contracts in scripts/ — is the honest
 * vehicle, not an smuggled test framework.)
 *
 * TIERS (highest wins; first match in this order)
 *
 * exact 100 · prefix 75 · word-boundary 50 · substring 25 · title-fuzzy 15 ·
 * hint-substring 10. Title-fuzzy is case-insensitive subsequence matching —
 * the match-sorter MATCHES-tier semantics (Chakra pattern): abbreviations
 * ("dlg" → Dialog) and dropped letters ("buton" → Button) rank, below every
 * contiguous match but above a hint-text mention. Hint text stays
 * substring-only: fuzzy over long prose is noise, not recall. Single-char
 * queries can never reach the fuzzy tier (any single char present is already
 * a substring hit), so the noise floor does not move for the shortest input.
 */
export type ScoredEntry = {
  title: string;
  hint: string;
};

export function scoreEntry(query: string, entry: ScoredEntry): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const title = entry.title.toLowerCase();
  const hint = entry.hint.toLowerCase();
  if (title === q) return 100;
  if (title.startsWith(q)) return 75;
  // Word-boundary start beats a mid-word match ("bar" ranks "App bar"
  // above "SearchBar": the boundary hit scores 50, the substring 25).
  const boundary = new RegExp(`(^|[^a-z])${escapeRegExp(q)}`);
  if (boundary.test(title)) return 50;
  if (title.includes(q)) return 25;
  if (isSubsequence(q, title)) return 15;
  if (hint.includes(q)) return 10;
  return 0;
}

function isSubsequence(q: string, title: string): boolean {
  let i = 0;
  for (const ch of title) {
    if (ch === q[i]) i++;
    if (i === q.length) return true;
  }
  return false;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Entries that match, best first. Stable — ties keep index order. */
export function rankEntries<T extends ScoredEntry>(
  query: string,
  entries: T[],
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return entries
    .map((entry, i) => ({ entry, s: scoreEntry(q, entry), i }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((r) => r.entry);
}
