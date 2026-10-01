/**
 * Icon gallery — real code against `@xoroh/kern-icons`.
 *
 * The grid, the counts, and the semantic map all come from the icon package's
 * own registry (`ICON_NAMES`, `ICON_COUNT`, `SEMANTIC_ICONS`, `Icon`), so a
 * sync upstream changes this page with no site edit.
 */
import { Badge, Button, Input, Kbd } from "@xoroh/kern";
import {
  ICON_COUNT,
  ICON_NAMES,
  Icon,
  SEMANTIC_ICONS,
  type IconSemantic,
} from "@xoroh/kern-icons";
import { useState } from "react";

/** How many icons the grid paints before it stops — 1340 SVGs would stall SSR. */
const PAGE = 120;

export function IconGallery() {
  const [query, setQuery] = useState("");

  const matches = query.trim()
    ? ICON_NAMES.filter((name) => name.includes(query.trim().toLowerCase())).slice(
        0,
        PAGE,
      )
    : ICON_NAMES.slice(0, PAGE);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Filter icons"
            aria-label="Filter icons"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Badge>
          {query.trim() ? `${matches.length} of ` : ""}
          {ICON_COUNT}
        </Badge>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-lg font-semibold">Semantic map</h2>
        <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
          Kern maps a recurring meaning to one decided symbol, so every product
          picks the same glyph.
        </p>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {(Object.entries(SEMANTIC_ICONS) as [IconSemantic, string][]).map(
            ([semantic, name]) => (
            <li
              key={semantic}
              className="flex items-center gap-2 rounded-(--md-sys-shape-corner-full) border border-(--md-sys-color-outline-variant) px-3 py-1.5"
            >
              <Icon name={SEMANTIC_ICONS[semantic] as `${string}:${string}`} size={18} />
              <span className="text-sm">{semantic}</span>
              <Kbd>{name}</Kbd>
            </li>
            ),
          )}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-lg font-semibold">
          {query.trim() ? "Matches" : `First ${PAGE} of ${ICON_COUNT}`}
        </h2>
        {matches.length === 0 ? (
          <div className="flex flex-col items-start gap-3">
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
              No icon matches “{query}”.
            </p>
            <Button variant="tonal" onClick={() => setQuery("")}>
              Clear filter
            </Button>
          </div>
        ) : (
          <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-4 lg:grid-cols-6">
            {matches.map((name) => (
              <li
                key={name}
                className="flex flex-col items-center gap-1 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant) p-3"
              >
                <Icon name={name} size={24} />
                <span className="w-full truncate text-center font-mono text-[11px] text-(--md-sys-color-on-surface-variant)">
                  {name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/** A small strip of filled/unfilled icons for the site chrome. */
export function IconStrip() {
  return (
    <div className="flex items-center gap-3">
      {(["menu", "search", "settings"] as IconSemantic[]).map((semantic) => (
        <Icon key={semantic} name={semantic} size={20} />
      ))}
      <Icon name="favorite" filled size={20} />
    </div>
  );
}
