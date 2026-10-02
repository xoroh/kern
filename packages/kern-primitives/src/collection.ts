import { useMemo } from "react";
import {
  createRovingModel,
  type RovingModel,
  type RovingOrientation,
} from "./roving";
import { useControllableState } from "./useControllableState";

/**
 * The data-shaped collection model: keyboard behaviour over a LIST OF NODES,
 * not over a DOM tree.
 *
 * ## Why this is a primitive, and why it is separate from `useRovingModel`
 *
 * `useRovingModel` moves a single active index through `count` items. That is
 * right for a tab strip or a toolbar, and wrong for a list of a thousand rows
 * where only some are rendered, where items carry labels, and where the user
 * types to jump.
 *
 * The difference is the node model. Roving traversal assumes `index → position`.
 * A collection traversal needs `index → node`, because:
 *
 *   - **type-ahead** matches on a LABEL, which only the node has;
 *   - **selection is independent of focus**, and both address nodes;
 *   - a **virtualised** list renders a window, so `index → element` is not a
 *     constant-time lookup the DOM can give you.
 *
 * Keeping them separate rather than growing roving is deliberate: roving is
 * used by controls that have no node model at all (a toolbar of buttons), and
 * bolting a `nodes` requirement onto it would make the common case worse.
 *
 * ## The keyboard behaviour is SPECIFIED, not chosen
 *
 * Type-ahead, Home/End and selection-follows-focus come from the WAI-ARIA
 * Authoring Practices. This file implements specified behaviour, which is why it
 * is ported rather than invented — the same reason `useSelection` encodes M3's
 * exclusive/additive distinction rather than a taste decision.
 *
 * ## Renderer-agnostic by construction
 *
 * No DOM, no `react-native`, no token. The model returns a descriptor per
 * index and lets the consumer map `index → element`, so the same model drives
 * Base UI on web and a `FlatList` on native. This is the Layer 1 contract
 * `check:primitives` enforces over the transitive import closure.
 */

/** How many items a type-ahead buffer accumulates before it is abandoned. */
const TYPEAHEAD_BUFFER_MS = 1000;
/** A single keystroke longer than this is a search, not a type-ahead. */
const TYPEAHEAD_MAX_LENGTH = 32;

export type CollectionNode = {
  /** Stable identity. Selection is addressed by this, never by index. */
  key: string;
  /** The string type-ahead matches. Empty means "not searchable". */
  label?: string;
  /**
   * Disabled items are still FOCUSABLE — that is required, so a keyboard user
   * can perceive the option exists and learn why it cannot be chosen. Only
   * activation is refused.
   */
  disabled?: boolean;
};

export type CollectionOrientation = RovingOrientation;

export type CollectionOptions = {
  nodes: readonly CollectionNode[];
  /** Which arrow keys move. Default: vertical (a list). */
  orientation?: CollectionOrientation;
  /** Wrap from last to first. Default: no wrap. */
  loop?: boolean;

  /** The focused node's key. */
  focusedKey?: string | null;
  defaultFocusedKey?: string | null;
  onFocusedKeyChange?: (key: string | null) => void;

  /** Selected keys. Empty for a selection-free collection. */
  selectedKeys?: readonly string[];
  defaultSelectedKeys?: readonly string[];
  onSelectedKeysChange?: (keys: readonly string[]) => void;
  /**
   * Exclusive vs additive selection. `none` means the collection is
   * focus-only (a menu's roving list) and selection is inert.
   */
  selectionMode?: "none" | "single" | "multiple";
  /**
   * When true, moving focus moves selection with it — the behaviour a listbox
   * has and a listbox-with-checkboxes usually does not.
   */
  selectionFollowsFocus?: boolean;

  /** How many rows a PageUp/PageDown moves. Default: 10. */
  pageSize?: number;
};

export type CollectionItem = {
  index: number;
  node: CollectionNode;
  isFocused: boolean;
  /** True only for the focused item — the single tab stop. */
  isTabbable: boolean;
  isSelected: boolean;
  disabled: boolean;
};

export type CollectionModel = {
  count: number;
  focusedKey: string | null;
  focusedIndex: number;
  selectedKeys: readonly string[];
  selectionMode: "none" | "single" | "multiple";
  orientation: CollectionOrientation;
  loop: boolean;
  /** Describe a node for a renderer. */
  describe: (index: number) => CollectionItem;
  isSelected: (key: string) => boolean;
  setFocus: (key: string) => void;
  /** Move focus by a step; `delta` may be negative. */
  move: (delta: number) => void;
  first: () => void;
  last: () => void;
  page: (direction: 1 | -1) => void;
  /**
   * Type-ahead. Returns the index it moved to, or `null` when the buffer
   * matched nothing — the caller decides whether to beep, announce, or ignore.
   */
  typeahead: (text: string) => number | null;
  /** Activate: toggles/selects per `selectionMode`, and moves focus there. */
  activate: (key: string) => void;
  /** Wipe the type-ahead buffer (Escape, or a long pause). */
  resetTypeahead: () => void;
};

/**
 * The plain model. NO React — it holds no state of its own; the caller passes
 * the current values and receives changes through `onFocusChange`/`onSelectChange`.
 *
 * This split is the house pattern (`createRovingModel` + `useRovingModel`) and it
 * is not cosmetic: a model that keeps state in a closure resets it on every
 * rebuild, which a model-only test cannot see because it has no render cycle.
 * Keeping the factory pure is what makes this testable without `renderHook`.
 */
export function createCollectionModel(
  options: CollectionOptions & {
    /** Resolved focused key. Required — the model never stores it. */
    focusedKey: string | null;
    /** Resolved selection. Required — the model never stores it. */
    selectedKeys: readonly string[];
    onFocusChange?: (key: string | null) => void;
    onSelectChange?: (keys: readonly string[]) => void;
    /**
     * Injected clock, so type-ahead timing is testable without fake timers and
     * the model stays free of `Date.now()`. Defaults to the real clock.
     */
    now?: () => number;
  },
): CollectionModel {
  const {
    nodes,
    orientation = "vertical",
    loop = false,
    selectionMode = "none",
    selectionFollowsFocus = false,
    pageSize = 10,
  } = options;

  const { focusedKey, selectedKeys } = options;
  const setFocusedValue = options.onFocusChange ?? (() => {});
  const setSelectedValue = options.onSelectChange ?? (() => {});

  const indexOf = (key: string) => nodes.findIndex((n) => n.key === key);
  const keyAt = (index: number) => nodes[index]?.key ?? null;

  // The model is a SNAPSHOT: `options.selectedKeys` is frozen at construction.
  // Reporting a change through the callback is not enough on its own — a second
  // mutation within the same model instance (activate "b", then activate "c")
  // would compute against the value the CALLER passed in rather than the one
  // this model just reported, so the second call would silently drop the first.
  // `currentSelection` is the live value; `options.selectedKeys` seeds it. The
  // React binding rebuilds the model whenever the resolved selection changes,
  // which is what makes this correct across a render cycle.
  let currentSelection: readonly string[] = selectedKeys;
  const setSelection = (keys: readonly string[]) => {
    currentSelection = keys;
    setSelectedValue(keys);
  };
  const isSelected = (key: string) => currentSelection.includes(key);

  // Roving owns traversal so the arrow-key rules live in exactly one place;
  // this model supplies the node-aware edges (focus, type-ahead, activation).
  // Built per call, not memoised: the factory is pure and hook-free, matching
  // `createRovingModel`.
  //
  // `defaultActiveIndex`, NOT `activeIndex`. `createRovingModel` treats a
  // supplied `activeIndex` as CONTROLLED: `commit` then reports the change and
  // returns WITHOUT advancing its own `current`. Every traversal helper here
  // reads roving's return value and `activeIndex`, so a controlled roving hands
  // back the index it was constructed with — forever. `move(1)` would resolve
  // to the node the collection was already focused on, which is exactly the bug
  // this line previously had.
  const roving: RovingModel = createRovingModel({
    count: nodes.length,
    orientation,
    loop,
    isDisabled: () => false,
    defaultActiveIndex: Math.max(0, focusedKey ? indexOf(focusedKey) : 0),
    onActiveIndexChange: (index) => {
      const key = keyAt(index);
      if (key !== null) setFocusedValue(key);
    },
  });

  const describe = (index: number): CollectionItem => {
    const node = nodes[index] ?? { key: "" };
    return {
      index,
      node,
      isFocused: node.key === focusedKey,
      isTabbable: node.key === focusedKey,
      isSelected: isSelected(node.key),
      disabled: node.disabled === true,
    };
  };

  const setFocus = (key: string) => {
    // Not a node — ignore, rather than moving focus nowhere.
    const index = indexOf(key);
    if (index < 0) return;
    roving.setActive(index);
    setFocusedValue(key);
    if (selectionFollowsFocus && selectionMode !== "none") {
      setSelection(
        selectionMode === "single" ? [key] : [...currentSelection, key],
      );
    }
  };

  const move = (delta: number) => {
    const next = delta >= 0 ? roving.next() : roving.previous();
    const key = keyAt(next);
    if (key === null) return;
    setFocusedValue(key);
    if (selectionFollowsFocus && selectionMode !== "none") {
      setSelection(
        selectionMode === "single" ? [key] : [...currentSelection, key],
      );
    }
  };

  // `first`/`last` delegate to roving for the clamping, then write focus
  // themselves. Roving's `first()`/`last()` return the resolved index but do NOT
  // move the collection's focus — they only report through the model, and the
  // model's report is `setFocusedValue`. Delegating the focus write to roving's
  // callback would be correct only for a caller that wired one.
  const first = () => {
    const key = keyAt(roving.first());
    if (key !== null) setFocusedValue(key);
  };
  const last = () => {
    const key = keyAt(roving.last());
    if (key !== null) setFocusedValue(key);
  };
  const page = (direction: 1 | -1) => {
    const target = roving.activeIndex + direction * pageSize;
    const clamped = loop
      ? ((target % nodes.length) + nodes.length) % nodes.length
      : Math.min(Math.max(target, 0), Math.max(nodes.length - 1, 0));
    const key = keyAt(clamped);
    if (key === null) return;
    // Advance roving too, or a second PageDown would page from the index this
    // one started at and land on the same row.
    roving.setActive(clamped);
    setFocusedValue(key);
  };

  // Type-ahead buffer: a closure local, because the model is rebuilt per render
  // in the React binding. A `useRef` would be the natural React choice but this
  // file must stay hook-free for `createRovingModel`-style purity.
  let buffer = { text: "", at: 0 };

  const resetTypeahead = () => {
    buffer = { text: "", at: 0 };
  };

  const typeahead = (text: string): number | null => {
    if (text.length === 0) return null;
    // A single long keystroke is a search box, not a type-ahead — a name field
    // would otherwise swallow every letter into a buffer that can never match.
    if (text.length > TYPEAHEAD_MAX_LENGTH) return null;
    const now = (options.now ?? Date.now)();

    // A REPEATED character starts a fresh search rather than accumulating.
    // Pressing "d" twice must search for "d", not "dd" — which would match
    // nothing and leave focus stranded on the previous row. This is APG's
    // "repeated character cycles" behaviour, and the buffer is the whole reason
    // a cycle needs this branch: without it the second press builds "dd".
    const repeated = buffer.text === text;
    const expired = now - buffer.at > TYPEAHEAD_BUFFER_MS;
    const next = repeated || expired ? text : buffer.text + text;
    buffer = { text: next, at: now };

    const needle = next.toLowerCase();
    const from = roving.activeIndex;
    // Where the scan BEGINS. A fresh search includes the currently focused
    // item — a listbox focused on "Apple" must not jump to "Apricot" when the
    // user types "a", because the item they are on already matches. A REPEATED
    // character starts AFTER it, which is what makes the second press cycle
    // to the next match instead of sticking on the current one (APG).
    const offset = repeated ? 1 : 0;
    for (let step = offset; step < offset + nodes.length; step += 1) {
      const index = (from + step) % nodes.length;
      const label = nodes[index]?.label?.toLowerCase();
      if (label?.startsWith(needle)) {
        const key = nodes[index].key;
        // Keep roving's index on the node focus moved to. `typeahead` reads
        // `roving.activeIndex` as its search origin, so a focus that did not
        // update it would make the next type-ahead start from a stale place.
        roving.setActive(index);
        setFocusedValue(key);
        return index;
      }
    }
    return null;
  };

  const activate = (key: string) => {
    const index = indexOf(key);
    if (index < 0) return;
    roving.setActive(index);
    setFocusedValue(key);
    // `none` means the collection is focus-only, so activation moves focus and
    // selects nothing at all. Returning BEFORE the toggle below is what keeps a
    // menu's roving list from acquiring a selection axis it was not given.
    if (selectionMode === "none") return;
    if (selectionMode === "single") {
      // Exclusive: activating the selected item does NOT deselect. A radio
      // group with nothing selected is not a state M3 describes.
      setSelection([key]);
      return;
    }
    setSelection(
      currentSelection.includes(key)
        ? currentSelection.filter((k) => k !== key)
        : [...currentSelection, key],
    );
  };

  return {
    count: nodes.length,
    focusedKey,
    focusedIndex: focusedKey ? Math.max(0, indexOf(focusedKey)) : 0,
    // A GETTER, not a plain property. A plain `selectedKeys: currentSelection`
    // reads the variable once, at construction — so it captures the same stale
    // snapshot it was meant to replace. The getter defers the read to the
    // moment a caller asks, which is the whole point.
    get selectedKeys() {
      return currentSelection;
    },
    selectionMode,
    orientation,
    loop,
    describe,
    isSelected,
    setFocus,
    move,
    first,
    last,
    page,
    typeahead,
    activate,
    resetTypeahead,
  };
}

/**
 * React binding. State lives HERE, not in the plain model — the same split
 * `useRovingModel` uses, and for the same reason: uncontrolled state must
 * survive a rebuild, and a closure inside the model would not.
 */
export function useCollection(options: CollectionOptions): CollectionModel {
  const [focusedValue, setFocusedValue] = useControllableState<string | null>(
    options.focusedKey,
    options.defaultFocusedKey ?? null,
    options.onFocusedKeyChange,
  );
  const [selectedValue, setSelectedValue] = useControllableState<
    readonly string[]
  >(
    options.selectedKeys,
    options.defaultSelectedKeys ?? [],
    options.onSelectedKeysChange,
  );

  // Pass the options through EXPLICITLY rather than spreading `...options`.
  // The spread also forwarded `focusedKey`/`selectedKeys`/the `on*Change`
  // callbacks — the very fields the two hooks above resolved — and the hook's
  // dependency list cannot express "any of these". Naming them means the memo
  // reads exactly what it depends on: a caller swapping the `on*Change` callback
  // identity rebuilds the model instead of silently keeping the old closure.
  // `now` is deliberately NOT destructured here: it belongs to the FACTORY's
  // options (`createCollectionModel`'s injected clock), not to the public
  // `CollectionOptions` a caller passes to this hook. Threading it would widen
  // the public type for a test seam the plain model already exposes.
  const {
    nodes,
    orientation,
    loop,
    selectionMode,
    selectionFollowsFocus,
    pageSize,
  } = options;

  return useMemo(
    () =>
      createCollectionModel({
        nodes,
        orientation,
        loop,
        selectionMode,
        selectionFollowsFocus,
        pageSize,
        focusedKey: focusedValue ?? null,
        selectedKeys: selectedValue ?? [],
        onFocusChange: setFocusedValue,
        onSelectChange: setSelectedValue,
      }),
    [
      nodes,
      orientation,
      loop,
      selectionMode,
      selectionFollowsFocus,
      pageSize,
      focusedValue,
      selectedValue,
      setFocusedValue,
      setSelectedValue,
    ],
  );
}
