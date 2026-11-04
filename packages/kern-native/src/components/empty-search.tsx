import type { ReactNode } from "react";
import { View } from "react-native";
import { Button } from "./button";
import { EmptyState } from "./empty-state";

/**
 * Native EmptySearch — the web `EmptySearch` twin (CL-011/CL-012; D925).
 *
 * Same contract: query echo + clear recovery + suggestions slot, composed
 * ONLY from `EmptyState` + `Button`. The suggestions slot is a sibling
 * below the state (native `EmptyState` owns no trailing slot) — same
 * visual order as web.
 */

export type NativeEmptySearchProps = {
  query: string;
  onClear: () => void;
  title?: string;
  description?: string;
  clearLabel?: string;
  suggestions?: ReactNode;
  testID?: string;
};

export function EmptySearch({
  query,
  onClear,
  title,
  description,
  clearLabel = "Clear search",
  suggestions,
  testID,
}: NativeEmptySearchProps) {
  return (
    <View testID={testID ?? "kern-empty-search"}>
      <EmptyState
        title={title ?? `No results for \u201C${query}\u201D`}
        description={
          description ??
          "Try a different spelling, or clear the search to browse everything."
        }
        action={
          <Button variant="tonal" onPress={onClear}>
            {clearLabel}
          </Button>
        }
      />
      {suggestions}
    </View>
  );
}
