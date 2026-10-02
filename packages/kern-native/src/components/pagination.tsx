import { useControllableState } from "@xoroh/kern-primitives";
import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import { useMemo } from "react";
import {
  Pressable,
  Text as RNText,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";

/**
 * Page navigation with a sliding window, ellipsis gaps, and prev/next.
 *
 * ## The behaviour this owns
 *
 * - **Which page is current**, controlled or uncontrolled, 1-based. Every
 *   render derives the window from it, so there is exactly one source of truth
 *   for "where am I".
 * - **The current page is announced as current.** Web marks it with
 *   `aria-current="page"`; React Native has no `aria-current`, so the nearest
 *   axis is `accessibilityState.selected` on the page button. That is a genuine
 *   platform limitation and is recorded as one rather than papered over — a
 *   screen reader on native gets "selected" where the web gets "current page".
 * - **Prev/next clamp at the ends** and are disabled there rather than wrapping.
 *   A pager that wraps from the last page to the first is a different component
 *   from the one M3 describes.
 * - **The window**: a short list shows every page; a long one shows a sliding
 *   window with inert gaps. `pageWindow` is exported and tested directly because
 *   it is the only part of this component with real logic in it.
 *
 * ## Why `role="navigation"` and not `accessibilityRole`
 *
 * RN's platform-trait `AccessibilityRole` union does not carry `navigation`; the
 * ARIA-aligned `Role` union does. Same reasoning as `meter`, `fieldset` and
 * `drawer` — and the same class of silent failure if you reach for the other
 * prop: a value not in the union is a type error, not a fallback.
 */

export type PaginationEntry =
  | { kind: "page"; page: number }
  | { kind: "gap"; key: string };

/**
 * The page window, with gaps where pages are elided.
 *
 * Exported for testing: this is pure logic, and testing it directly is both
 * cheaper and clearer than asserting it through rendered output. Short lists
 * show every page; longer ones keep the first two, a window around the current
 * page, and the last two.
 */
export function pageWindow(current: number, count: number): PaginationEntry[] {
  if (count <= 7) {
    return Array.from({ length: count }, (_, index) => ({
      kind: "page" as const,
      page: index + 1,
    }));
  }
  const pages = new Set([
    1,
    2,
    current - 1,
    current,
    current + 1,
    count - 1,
    count,
  ]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= count)
    .sort((a, b) => a - b);
  const out: PaginationEntry[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push({ kind: "gap", key: `gap-${prev}-${p}` });
    out.push({ kind: "page", page: p });
    prev = p;
  }
  return out;
}

export function paginationStyles(
  current: number,
  disabled: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
): {
  pager: ViewStyle;
  page: ViewStyle;
  currentPage: ViewStyle;
  gap: ViewStyle;
} {
  const size = Number.parseFloat(tokens.spacing["space-400"]);
  return {
    pager: {
      flexDirection: "row",
      alignItems: "center",
      gap: Number.parseFloat(tokens.spacing["space-50"]),
    },
    page: {
      minWidth: size,
      height: size,
      minHeight: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Number.parseFloat(scheme.shape.full),
      opacity: disabled ? 0.5 : 1,
    },
    currentPage: {
      backgroundColor: scheme.color.primary,
    },
    gap: {
      minWidth: size,
      alignItems: "center",
      justifyContent: "center",
    },
  };
}

export type NativePaginationProps = Omit<
  ViewProps,
  "children" | "style" | "accessibilityRole"
> & {
  /** Total number of pages. */
  count: number;
  /** Controlled current page, 1-based. */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Name for the navigation landmark. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Pagination({
  count,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  accessibilityLabel = "Pagination",
  style,
  testID,
  ...props
}: NativePaginationProps) {
  const scheme = useKernScheme();
  const [pageRaw, setPage] = useControllableState<number>(
    pageProp,
    defaultPage,
    onPageChange,
  );
  // Clamp defensively: a controlled host can hand back 0 or count+1, and every
  // derivation below assumes a real page.
  const page = Math.min(Math.max(pageRaw ?? 1, 1), Math.max(count, 1));
  const styles = paginationStyles(page, false, scheme);
  const entries = useMemo(() => pageWindow(page, count), [page, count]);

  const atStart = page <= 1;
  const atEnd = page >= count;

  const go = (next: number) => {
    const clamped = Math.min(Math.max(next, 1), Math.max(count, 1));
    if (clamped !== page) setPage(clamped);
  };

  return (
    <View
      {...props}
      testID={testID ?? "kern-pagination"}
      // `role`, not `accessibilityRole` — see the header.
      role="navigation"
      accessibilityLabel={accessibilityLabel}
      style={[styles.pager, style]}
    >
      <PageButton
        label="Previous page"
        disabled={atStart}
        onPress={() => go(page - 1)}
        styles={styles}
        scheme={scheme}
      />
      {entries.map((entry) =>
        entry.kind === "gap" ? (
          <RNText
            key={entry.key}
            testID={`kern-pagination-${entry.key}`}
            // A gap is decoration: it carries no information, so it must not be
            // announced as an element either.
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[styles.gap, { color: scheme.color.onSurfaceVariant }]}
          >
            …
          </RNText>
        ) : (
          <PageButton
            key={entry.page}
            label={`Page ${entry.page}`}
            current={entry.page === page}
            onPress={() => go(entry.page)}
            styles={styles}
            scheme={scheme}
          />
        ),
      )}
      <PageButton
        label="Next page"
        disabled={atEnd}
        onPress={() => go(page + 1)}
        styles={styles}
        scheme={scheme}
      />
    </View>
  );
}

function PageButton({
  label,
  current = false,
  disabled,
  onPress,
  styles,
  scheme,
}: {
  label: string;
  current?: boolean;
  disabled?: boolean;
  onPress: () => void;
  styles: ReturnType<typeof paginationStyles>;
  scheme: ResolvedTheme;
}) {
  const disabledNow = Boolean(disabled);
  return (
    <Pressable
      testID={`kern-pagination-${label.replace(/\s+/g, "-").toLowerCase()}`}
      accessibilityRole="button"
      accessibilityLabel={label}
      // RN has no `aria-current`, so "selected" is the axis that carries "this
      // is the page you are on". A deliberate platform substitution, recorded.
      accessibilityState={{ selected: current, disabled: disabledNow }}
      disabled={disabledNow}
      onPress={disabledNow ? undefined : onPress}
      style={[
        styles.page,
        current ? styles.currentPage : null,
        { opacity: disabledNow ? 0.5 : 1 },
      ]}
    >
      <RNText
        style={{
          fontSize: 14,
          color: current ? scheme.color.onPrimary : scheme.color.onSurface,
        }}
      >
        {label.replace(/^Page /, "")}
      </RNText>
    </Pressable>
  );
}
