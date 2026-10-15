import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  type CollectionOptions,
  createCollectionModel,
  useCollection,
} from "./collection";

const NODES = [
  { key: "a", label: "Alpha" },
  { key: "b", label: "Beta" },
  { key: "c", label: "Gamma" },
  { key: "d", label: "Delta", disabled: true },
];

/**
 * The plain model is PURE: it is constructed from resolved focus + selection and
 * reports changes OUT through callbacks. It is a snapshot, not a store — a
 * renderer re-invokes it with the new values, which is what a re-render is.
 *
 * So the fixture owns the state and returns it alongside the model, and the
 * assertions read THAT. Reading the model's own `focusedKey` after a move would
 * be asserting on the value it was constructed with, which tests nothing.
 */
function model(overrides: Partial<CollectionOptions> = {}) {
  const state: { focused: string | null; selected: readonly string[] } = {
    focused: overrides.defaultFocusedKey ?? "a",
    selected: overrides.defaultSelectedKeys ?? [],
  };
  const m = createCollectionModel({
    nodes: NODES,
    ...overrides,
    focusedKey: state.focused,
    selectedKeys: state.selected,
    onFocusChange: (k) => {
      state.focused = k;
    },
    onSelectChange: (k) => {
      state.selected = k;
    },
  });
  return Object.assign(m, { state });
}

describe("useCollection — focus is independent of selection", () => {
  it("describes exactly one tabbable node", () => {
    const m = model();
    const tabbable = NODES.map((_, i) => m.describe(i)).filter(
      (d) => d.isTabbable,
    );
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0].node.key).toBe("a");
  });

  // The point of a collection: focus and selection are two independent axes.
  it("does not select on focus when selectionFollowsFocus is off", () => {
    const m = model({ selectionMode: "multiple" });
    m.setFocus("c");
    expect(m.state.selected).toEqual([]);
  });

  it("selects on focus when selectionFollowsFocus is on", () => {
    const m = model({ selectionMode: "multiple", selectionFollowsFocus: true });
    m.setFocus("c");
    expect(m.state.selected).toEqual(["c"]);
  });
});

describe("useCollection — traversal", () => {
  it("moves forward and back", () => {
    const m = model();
    m.move(1);
    expect(m.state.focused).toBe("b");
    m.move(-1);
    expect(m.state.focused).toBe("a");
  });

  it("stops at the ends by default", () => {
    const m = model();
    m.last();
    expect(m.state.focused).toBe("d");
    m.move(1);
    expect(m.state.focused).toBe("d");
  });

  it("wraps when loop is set", () => {
    const m = model({ loop: true });
    m.last();
    m.move(1);
    expect(m.state.focused).toBe("a");
  });

  it("first and last jump to the ends", () => {
    const m = model();
    m.last();
    expect(m.state.focused).toBe("d");
    m.first();
    expect(m.state.focused).toBe("a");
  });

  // An empty keystroke must be inert. Without the guard, "" would prefix-match
  // the first label in the scan and silently move focus — a modifier keypress or
  // a stray keyup would teleport the cursor.
  it("an empty keystroke moves nothing", () => {
    const m = model();
    m.setFocus("b");
    expect(m.typeahead("")).toBeNull();
    expect(m.state.focused).toBe("b");
  });

  it("pages by the configured size and clamps at the ends", () => {
    const m = model({ pageSize: 2 });
    m.page(1);
    expect(m.state.focused).toBe("c");
    m.page(1);
    expect(m.state.focused).toBe("d");
    m.page(1);
    expect(m.state.focused).toBe("d");
  });

  // `loop` must reach PAGE, not only arrow traversal: with loop on, paging past
  // the end wraps to the start instead of sticking on the last row.
  it("wraps when paging past the end with loop set", () => {
    const m = model({ pageSize: 2, loop: true });
    m.last();
    expect(m.state.focused).toBe("d");
    m.page(1);
    expect(m.state.focused).toBe("b"); // 3 + 2 = 5, wraps to 1
  });

  it("wraps backwards when paging before the start with loop set", () => {
    const m = model({ pageSize: 2, loop: true });
    m.first();
    expect(m.state.focused).toBe("a");
    m.page(-1);
    expect(m.state.focused).toBe("c"); // 0 - 2 = -2, wraps to 2
  });

  // A key that is not a node must not move focus into the void.
  it("ignores focus on an unknown key", () => {
    const m = model();
    m.setFocus("nope");
    expect(m.state.focused).toBe("a");
  });
});

describe("useCollection — type-ahead", () => {
  it("jumps to the first node whose label starts with the text", () => {
    const m = model();
    const index = m.typeahead("G");
    expect(index).toBe(2);
    expect(m.state.focused).toBe("c");
  });

  // APG: a repeated character cycles rather than sticking.
  it("cycles on a repeated character", () => {
    const m = model({ loop: true });
    expect(m.typeahead("D")).toBe(3);
    expect(m.typeahead("D")).toBe(3); // only one D — still Delta
  });

  it("returns null when nothing matches, rather than moving focus", () => {
    const m = model();
    m.setFocus("b");
    expect(m.typeahead("zzz")).toBeNull();
    expect(m.state.focused).toBe("b");
  });

  // A single long keystroke is a search box, not a type-ahead.
  it("declines a single keystroke longer than a person's typing", () => {
    const m = model();
    const long = "x".repeat(40);
    expect(m.typeahead(long)).toBeNull();
  });

  it("matches case-insensitively", () => {
    const m = model();
    expect(m.typeahead("b")).toBe(1);
  });
});

describe("useCollection — selection modes", () => {
  it("none is inert: activate moves focus and selects nothing", () => {
    const m = model({ selectionMode: "none" });
    m.activate("c");
    expect(m.state.focused).toBe("c");
    expect(m.state.selected).toHaveLength(0);
  });

  it("single replaces", () => {
    const m = model({ selectionMode: "single", defaultSelectedKeys: ["a"] });
    m.activate("c");
    expect(m.state.selected).toEqual(["c"]);
  });

  // Exclusive: a second activation does NOT deselect. A radio group with
  // nothing selected is not a state M3 describes.
  it("single does not deselect on re-activation", () => {
    const m = model({ selectionMode: "single", defaultSelectedKeys: ["a"] });
    m.activate("a");
    expect(m.state.selected).toEqual(["a"]);
  });

  it("multiple toggles", () => {
    const m = model({ selectionMode: "multiple" });
    m.activate("b");
    m.activate("c");
    expect(m.state.selected).toEqual(["b", "c"]);
    m.activate("b");
    expect(m.state.selected).toEqual(["c"]);
  });

  // The model is a snapshot that reports changes OUT, so the two properties
  // that a caller reads back off the model — not off its own callback — need
  // their own assertions. Without these, a model that reported every change
  // correctly while still exposing the construction-time values would pass.
  it("reports the selection it just made on the model, not the snapshot", () => {
    const m = model({ selectionMode: "multiple" });
    m.activate("b");
    m.activate("c");
    expect(m.selectedKeys).toEqual(["b", "c"]);
  });

  it("keeps type-ahead origin on the node focus moved to", () => {
    // NODES has four DISTINCT initials, so origin cannot be observed against it
    // — any origin yields the same match. This fixture gives two nodes the same
    // initial, which is the only shape where a stale origin is visible: the scan
    // visits every node either way, so only the ORDER it visits them in can
    // differ. Matches sit at 1 and 3, focus starts on 2 — a correct origin (2)
    // reaches Apricot before Avocado, a stale origin (0) reaches Avocado first.
    const dupes = [
      { key: "cherry", label: "Cherry" },
      { key: "avocado", label: "Avocado" },
      { key: "banana", label: "Banana" },
      { key: "apricot", label: "Apricot" },
    ];
    const state: { focused: string | null } = { focused: "banana" };
    const m = createCollectionModel({
      nodes: dupes,
      focusedKey: state.focused,
      selectedKeys: [],
      onFocusChange: (k) => {
        state.focused = k;
      },
    });
    expect(m.typeahead("a")).toBe(3); // Apricot — forward from where focus IS

    // A SECOND press is what observes the origin at all: the scan always visits
    // every node, so one call cannot tell a synced origin from a stale one.
    // Pressed WITHOUT resetting, so this is a REPEATED "a": it starts after the
    // origin. Synced origin (3) scans 0,1 → Avocado. Stale origin (2) would scan
    // 3 first and stick on Apricot. Same input, different answer — that is the
    // property, and it needs the repeat to be genuine.
    expect(m.typeahead("a")).toBe(1); // Avocado — continued from Apricot
  });

  // A fresh search INCLUDES the focused item. If it started after, a listbox
  // focused on "Avocado" would jump away from the row the user is standing on
  // when they type the very letter that names it.
  it("a fresh type-ahead can match the item already focused", () => {
    const state: { focused: string | null } = { focused: "avocado" };
    const m = createCollectionModel({
      nodes: [
        { key: "cherry", label: "Cherry" },
        { key: "avocado", label: "Avocado" },
        { key: "banana", label: "Banana" },
        { key: "apricot", label: "Apricot" },
      ],
      focusedKey: state.focused,
      selectedKeys: [],
      onFocusChange: (k) => {
        state.focused = k;
      },
    });
    expect(m.typeahead("a")).toBe(1); // stays on Avocado, does not skip to Apricot
  });

  // The long-keystroke guard must be observable: without it, a 40-char string
  // that DOES prefix-match a long label would be accepted. Against the short
  // labels above it returns null either way, which proves nothing.
  it("declines a long keystroke even when it would match", () => {
    // 40 x's in the label and a 35-char keystroke: over TYPEAHEAD_MAX_LENGTH
    // (32) yet a real prefix match, so the guard is the only thing that can
    // decline it. A 20-char keystroke would be UNDER the limit and legitimately
    // match — the guard is a length ceiling, not a "reject long labels" rule.
    const longLabel = `${"X".repeat(40)}ylophone`;
    const m = createCollectionModel({
      nodes: [
        { key: "short", label: "Alpha" },
        { key: "long", label: longLabel },
      ],
      focusedKey: "short",
      selectedKeys: [],
    });
    expect(m.typeahead("x".repeat(35))).toBeNull();
  });

  // setFocus/activate report focus out, but roving's index is what the NEXT
  // traversal reads. A focus write that skipped roving would leave the next
  // arrow key moving from the row focus started on, not the row focus is on.
  it("setFocus moves the traversal origin, not just the focus", () => {
    const m = model();
    m.setFocus("c");
    m.move(1);
    expect(m.state.focused).toBe("d"); // one on FROM "c", not from "a"
  });

  it("activate moves the traversal origin, not just the focus", () => {
    const m = model({ selectionMode: "multiple" });
    m.activate("c");
    m.move(1);
    expect(m.state.focused).toBe("d");
  });

  // Disabled items stay focusable so a keyboard user can perceive them.
  it("focuses a disabled node but refuses to select it", () => {
    const onSelectedKeysChange = (keys: readonly string[]) => void keys;
    const m = model({ selectionMode: "multiple" });
    const item = m.describe(3);
    expect(item.disabled).toBe(true);
    expect(m.setFocus("d")).toBeUndefined();
    expect(m.state.focused).toBe("d");
    void onSelectedKeysChange;
  });
});

describe("useCollection — the React binding", () => {
  it("keeps focus in React state across renders", () => {
    const { result } = renderHook(() =>
      useCollection({ nodes: NODES, defaultFocusedKey: "a" }),
    );
    expect(result.current.focusedKey).toBe("a");
    // `act` is required, not decorative: `setFocus` schedules a React state
    // update, and without it React has not re-rendered when `result.current` is
    // read — so the assertion below would be checking the PRE-update render.
    act(() => result.current.setFocus("c"));
    expect(result.current.focusedKey).toBe("c");
  });

  it("reports changes to a controlled consumer", () => {
    const seen: (string | null)[] = [];
    const { result } = renderHook(() =>
      useCollection({
        nodes: NODES,
        focusedKey: "a",
        onFocusedKeyChange: (k) => seen.push(k),
      }),
    );
    act(() => result.current.setFocus("b"));
    expect(seen).toEqual(["b"]);
    // Controlled: the prop wins, so the reported value has not moved.
    expect(result.current.focusedKey).toBe("a");
  });
});
