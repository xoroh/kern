import { useState } from "react";
import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { EmptySearch } from "./empty-search";
import { ListItem } from "./list-item";
import { Search } from "./search";
import { Sheet } from "./sheet";

/**
 * Native SearchView — the web `SearchView` twin (CL-012; D925).
 *
 * Contract S (shared): `query/value`, `suggestions`, `onSelect`,
 * `filterSuggestions`. Platform N: inline Search + results list, or the
 * same inside a bottom `Sheet` (`presentation="sheet"`); there is no cmd-K
 * on touch — the sheet IS the focus. Voice input stays future work (the
 * native `Search` owns no voice affordance yet).
 */

export type NativeSearchSuggestion = {
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
};

export function filterSuggestions(
  suggestions: NativeSearchSuggestion[],
  query: string,
): NativeSearchSuggestion[] {
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

export type NativeSearchViewProps = Omit<ViewProps, "children" | "style"> & {
  suggestions: NativeSearchSuggestion[];
  /** Inline (default) or bottom-sheet presentation. */
  presentation?: "inline" | "sheet";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  onSelect?: (suggestion: NativeSearchSuggestion) => void;
  onSearch?: (query: string) => void;
  label?: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function SearchView({
  suggestions,
  presentation = "inline",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  query: queryProp,
  defaultQuery = "",
  onQueryChange,
  onSelect,
  onSearch,
  label = "Search",
  placeholder = "Search or jump to…",
  style,
  testID,
  ...props
}: NativeSearchViewProps) {
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

  const results = filterSuggestions(suggestions, query);

  function choose(suggestion: NativeSearchSuggestion) {
    onSelect?.(suggestion);
    if (presentation === "sheet") setOpen(false);
  }

  const body = (
    <View testID={testID ?? "kern-search-view"}>
      <Search
        label={label}
        placeholder={placeholder}
        value={query}
        onValueChange={setQuery}
        onSearch={onSearch}
      />
      {results.length > 0 ? (
        <View accessibilityLabel="Suggestions">
          {results.map((suggestion) => (
            <ListItem
              key={suggestion.id}
              title={suggestion.title}
              supporting={suggestion.description}
              onPress={() => choose(suggestion)}
              testID={`kern-search-view-result-${suggestion.id}`}
            />
          ))}
        </View>
      ) : (
        <EmptySearch query={query} onClear={() => setQuery("")} />
      )}
    </View>
  );

  if (presentation === "sheet") {
    return (
      <Sheet
        open={open}
        title={label}
        onDismiss={() => setOpen(false)}
        onOpenChange={setOpen}
      >
        <View {...props} style={style}>
          {body}
        </View>
      </Sheet>
    );
  }

  return (
    <View {...props} style={style}>
      {body}
    </View>
  );
}
