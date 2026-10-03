/**
 * Shared search-result row text — one pattern in both search surfaces (the
 * /search page and the ⌘K palette).
 *
 * The row is a two-line stack, not a justified single line: the title sits
 * with its markers on line 1, the description wraps full-width below on
 * line 2. Line 1 is guarded so it can never orphan a marker — the title
 * truncates (`min-w-0` + `truncate`) while the pills are `whitespace-nowrap`.
 * Query-substring matches are marked so the match cause is visible.
 */
import type { ReactNode } from "react";
import type { SearchEntry } from "../../search";
import { T_BODY_SM } from "../../type-scale";

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const CHIP =
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-(--md-sys-shape-corner-full) border border-(--md-sys-color-outline) px-1.5 font-mono text-(--md-sys-color-on-surface-variant)";

/** Wraps query-substring matches in `<mark>` so the match cause is visible. */
function highlighted(text: string, query: string): ReactNode {
  const needle = query.trim().toLowerCase();
  if (needle === "") return text;
  const lower = text.toLowerCase();
  const out: ReactNode[] = [];
  let from = 0;
  let key = 0;
  for (;;) {
    const at = lower.indexOf(needle, from);
    if (at < 0) break;
    if (at > from) out.push(text.slice(from, at));
    out.push(
      <mark key={key++} className="bg-transparent font-semibold text-inherit">
        {text.slice(at, at + needle.length)}
      </mark>,
    );
    from = at + needle.length;
  }
  out.push(text.slice(from));
  return out;
}

export function ResultText({
  entry,
  query,
}: {
  entry: SearchEntry;
  query: string;
}) {
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="flex min-w-0 items-baseline gap-2">
        <span
          className={`min-w-0 flex-1 truncate group-hover:underline ${INK}`}
        >
          {highlighted(entry.title, query)}
        </span>
        {/* The renderer marker: two families share a name ("Button" web vs
            mobile) and the href alone never disambiguated them. */}
        {entry.platform ? (
          <span className={CHIP}>
            {entry.platform === "web" ? "Web" : "Native"}
          </span>
        ) : null}
        {entry.badge ? <span className={CHIP}>{entry.badge}</span> : null}
      </span>
      <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
        {highlighted(entry.hint, query)}
      </span>
    </span>
  );
}
