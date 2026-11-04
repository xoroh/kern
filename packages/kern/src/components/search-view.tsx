import { type ReactNode, useEffect, useState } from "react";
import { Dialog } from "./dialog";
import { EmptySearch } from "./empty-search";
import { ListItem } from "./list-item";
import { Search } from "./search";

/**
 * SearchView — the search half of CL-012, web split (D925).
 *
 * M3: https://m3.material.io/components/search — docked bar + results list
 * below it; full-screen on compact. The web split is the cmd-K dialog
 * (CMP-3198): a modal Dialog composing the docked `Search` bar and a
 * `ListItem` results list. The native twin (`search-view` in kern-native)
 * is inline + sheet under the same contract.
 *
 * Contract S (shared): `query/value`, `suggestions`, `onSelect`,
 * `filterSuggestions`. Platform W (this file): Dialog surface + ⌘K/Ctrl-K
 * hotkey. Only the surface differs — never the model.
 */

export type SearchSuggestion = {
  id: string;
  title: string;
  description?: string;
  /** Extra match terms (aliases, codes, …). */
  keywords?: string[];
  leading?: ReactNode;
};

/** Case-insensitive match on title + description + keywords. */
export function filterSuggestions(
  suggestions: SearchSuggestion[],
  query: string,
): SearchSuggestion[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return suggestions;
  return suggestions.filter((suggestion) =>
    [
      suggestion.title,
      suggestion.description ?? "",
      ...(suggestion.keywords ?? []),
    ].some((term) => term.toLowerCase().includes(needle)),
  );
}

export type SearchViewProps = {
  suggestions: SearchSuggestion[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  onSelect?: (suggestion: SearchSuggestion) => void;
  onSearch?: (query: string) => void;
  /** ⌘K / Ctrl-K opens the palette. Defaults to true. */
  hotkey?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
};

/** Command-palette search: cmd-K dialog over Search + results list. */
export function SearchView({
  suggestions,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  query: queryProp,
  defaultQuery = "",
  onQueryChange,
  onSelect,
  onSearch,
  hotkey = true,
  label = "Search",
  placeholder = "Search or jump to…",
  className,
}: SearchViewProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const open = openProp ?? internalOpen;
  const query = queryProp ?? internalQuery;

  function setOpen(next: boolean) {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  }

  function setQuery(next: string) {
    if (queryProp === undefined) setInternalQuery(next);
    onQueryChange?.(next);
  }

  useEffect(() => {
    if (!hotkey) return;
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (openProp === undefined) setInternalOpen(true);
        onOpenChange?.(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hotkey, openProp, onOpenChange]);

  const results = filterSuggestions(suggestions, query);

  function choose(suggestion: SearchSuggestion) {
    onSelect?.(suggestion);
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content aria-label={label} className={className}>
        <div data-slot="search-view">
          <Dialog.Title className="sr-only">{label}</Dialog.Title>
          <Search
            label={label}
            placeholder={placeholder}
            value={query}
            onValueChange={setQuery}
            onSearch={(value) => {
              onSearch?.(value);
            }}
          />
          <div data-slot="search-view-results" className="pt-2">
            {results.length > 0 ? (
              <ul
                aria-label="Suggestions"
                className="kern-search-view-list max-h-80 divide-y divide-(--sys-color-outline-variant) overflow-y-auto"
              >
                {results.map((suggestion) => (
                  <ListItem
                    key={suggestion.id}
                    headline={suggestion.title}
                    supporting={suggestion.description}
                    leading={suggestion.leading}
                    onPress={() => choose(suggestion)}
                  />
                ))}
              </ul>
            ) : (
              <EmptySearch query={query} onClear={() => setQuery("")} />
            )}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
