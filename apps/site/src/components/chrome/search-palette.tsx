/**
 * The ⌘K palette — modal search over the build-time index, on every page.
 *
 * Opened by ⌘K / Ctrl-K from anywhere, by the rail search button, or by the
 * mobile bar button (all three dispatch `kern:open-search`). Results are
 * grouped per blueprint §9 with state badges inline; the active result is
 * roving-focus navigable by keyboard alone (ArrowUp/Down/Home/End, Enter to
 * go, Escape to close). No-results renders suggestions, never a dead end.
 * Selecting a result navigates with the host router; a "See all results"
 * link deep-links to `/search?q=` for sharing.
 */
import { useNavigate } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  buildSearchIndex,
  SEARCH_SUGGESTIONS,
  type SearchEntry,
  searchSite,
} from "../../search";

export const OPEN_SEARCH_EVENT = "kern:open-search";

export function openSearch() {
  window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT));
}

function flatten(groups: ReturnType<typeof searchSite>): SearchEntry[] {
  return groups.flatMap((g) => g.entries);
}

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const listId = useId();

  const index = useMemo(() => buildSearchIndex(), []);
  const groups = useMemo(() => searchSite(query, index), [query, index]);
  const flat = useMemo(() => flatten(groups), [groups]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    (triggerRef.current as HTMLElement | null)?.focus?.();
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      navigate({ to: href });
    },
    [close, navigate],
  );

  useEffect(() => {
    const onOpen = () => {
      triggerRef.current = document.activeElement;
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else onOpen();
      }
    };
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(Math.max(flat.length - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = flat[active];
      if (hit) go(hit.href);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  // Active option id for aria-activedescendant — index-aligned with flat.
  const optionId = (idx: number) => `${listId}-option-${idx}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]"
    >
      {/* The scrim is a real button, not a clickable div: keyboard users get
          a Close control, mouse users get click-outside-to-dismiss. */}
      <button
        type="button"
        aria-label="Close search"
        onClick={close}
        className="absolute inset-0 cursor-default border-0 bg-black/40"
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-(--md-sys-shape-corner-large) bg-(--md-sys-color-surface) shadow-(--md-sys-elevation-level3)">
        <div className="flex items-center gap-2 border-b border-(--md-sys-color-outline-variant) p-3">
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded="true"
            aria-controls={groups.map((g) => `${listId}-${g.group}`).join(" ")}
            aria-activedescendant={
              flat.length > 0 ? `${listId}-option-${active}` : undefined
            }
            aria-label="Search components, tokens, guides, API, blocks and pages"
            placeholder="Search…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              // The hit list changes with the query; park the cursor back
              // at the top (an effect would re-run without reading query).
              setActive(0);
            }}
            onKeyDown={onInputKey}
            className="m-0 w-full bg-transparent text-(--md-sys-color-on-surface) outline-none placeholder:text-(--md-sys-color-on-surface-variant)"
          />
          <kbd className="shrink-0 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) px-1.5 font-mono text-(--md-sys-color-on-surface-variant)">
            esc
          </kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <PaletteSuggestions
              title="Try one of these"
              entries={SEARCH_SUGGESTIONS}
              onPick={go}
            />
          ) : groups.length === 0 ? (
            <div className="flex flex-col gap-3 p-3">
              <p className="m-0 text-(--md-sys-color-on-surface-variant)">
                No results for “{query.trim()}”.
              </p>
              <PaletteSuggestions
                title="Suggestions"
                entries={SEARCH_SUGGESTIONS}
                onPick={go}
              />
            </div>
          ) : (
            groups.map((g) => (
              <fieldset key={g.group} className="m-0 min-w-0 border-0 p-0">
                <legend className="m-0 px-3 pt-2 pb-1 text-(--md-sys-color-on-surface-variant)">
                  {g.group}
                </legend>
                <div
                  id={`${listId}-${g.group}`}
                  role="listbox"
                  aria-label={`${g.group} results`}
                  className="m-0 p-0"
                >
                  {g.entries.map((entry) => {
                    const idx = flat.indexOf(entry);
                    const isActive = idx === active;
                    return (
                      <a
                        key={`${entry.group}:${entry.title}:${entry.href}`}
                        href={entry.href}
                        id={optionId(idx)}
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActive(idx)}
                        onClick={(e) => {
                          // Router navigation (closes the palette first);
                          // keyboard Enter on the link fires click natively.
                          e.preventDefault();
                          go(entry.href);
                        }}
                        className={`flex cursor-pointer items-baseline gap-2 rounded-(--md-sys-shape-corner-small) px-3 py-2 no-underline ${
                          isActive
                            ? "bg-(--md-sys-color-secondary-container)"
                            : ""
                        }`}
                      >
                        <span className="text-(--md-sys-color-on-surface)">
                          {entry.title}
                        </span>
                        {entry.badge ? (
                          <span className="shrink-0 rounded-(--md-sys-shape-corner-full) border border-(--md-sys-color-outline) px-1.5 font-mono text-(--md-sys-color-on-surface-variant)">
                            {entry.badge}
                          </span>
                        ) : null}
                        <span className="ml-auto min-w-0 truncate text-(--md-sys-color-on-surface-variant)">
                          {entry.hint}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </fieldset>
            ))
          )}
          {query.trim() !== "" && groups.length > 0 ? (
            <button
              type="button"
              onClick={() =>
                go(`/search?q=${encodeURIComponent(query.trim())}`)
              }
              className="mt-1 w-full cursor-pointer border-0 bg-transparent px-3 py-2 text-left text-(--md-sys-color-primary)"
            >
              See all results →
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PaletteSuggestions({
  title,
  entries,
  onPick,
}: {
  title: string;
  entries: SearchEntry[];
  onPick: (href: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 p-1">
      <p className="m-0 px-2 pt-1 text-(--md-sys-color-on-surface-variant)">
        {title}
      </p>
      {entries.map((entry) => (
        <button
          key={entry.href}
          type="button"
          onClick={() => onPick(entry.href)}
          className="cursor-pointer border-0 bg-transparent px-2 py-1.5 text-left text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container)"
        >
          {entry.title}
          <span className="text-(--md-sys-color-on-surface-variant)">
            {" "}
            · {entry.hint}
          </span>
        </button>
      ))}
    </div>
  );
}
