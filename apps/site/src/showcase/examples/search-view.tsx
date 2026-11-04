import { Button, SearchView } from "@xoroh/kern";
import { useState } from "react";
import type { ExampleSpec } from "../example";

/**
 * SearchView examples — the cmd-K palette.
 *
 * A modal dialog over the docked Search bar and a results list: ⌘K opens
 * it anywhere, typing filters titles, descriptions and keywords, and an
 * empty result is the EmptySearch block — not a dead end. The native twin
 * is inline + sheet under the same suggestion contract.
 */
export const SEARCH_VIEW_EXAMPLES: ExampleSpec[] = [
  {
    id: "search-view-palette",
    title: "A command palette with recovery",
    description:
      "Open it with the button or ⌘K, type to filter, pick to jump. Nothing matching is an EmptySearch with a clear action — the palette never strands the user.",
    render: function SearchViewDemo() {
      const [open, setOpen] = useState(false);
      return (
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Button variant="outlined" onClick={() => setOpen(true)}>
            Search or jump to…
          </Button>
          <SearchView
            open={open}
            onOpenChange={setOpen}
            suggestions={[
              {
                id: "b",
                title: "Bookings",
                description: "Dispatch queue",
                keywords: ["queue"],
              },
              { id: "p", title: "Passengers", description: "Directory" },
            ]}
            onSelect={() => {}}
          />
        </div>
      );
    },
    code: `<Button variant="outlined" onClick={() => setOpen(true)}>
  Search or jump to…
</Button>
<SearchView
  open={open}
  onOpenChange={setOpen}
  suggestions={[{ id: "b", title: "Bookings", keywords: ["queue"] }]}
  onSelect={(suggestion) => {}}
/>`,
  },
];
