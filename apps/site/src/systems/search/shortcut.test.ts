import { describe, expect, it } from "bun:test";
import { isSlashSearchKey, isToggleSearchKey } from "./shortcut";

/**
 * The palette chords, pinned. These run in `check:docs`
 * (`bun test src/systems/search/shortcut.test.ts`): the review's Ctrl+K
 * finding means the chord contract gets a test, not just a handler.
 */
describe("isToggleSearchKey", () => {
  it("Control+K opens (Linux/Windows primary)", () => {
    expect(isToggleSearchKey({ key: "k", metaKey: false, ctrlKey: true })).toBe(
      true,
    );
  });
  it("Command+K opens (macOS primary)", () => {
    expect(isToggleSearchKey({ key: "k", metaKey: true, ctrlKey: false })).toBe(
      true,
    );
  });
  it("a bare k does not open", () => {
    expect(
      isToggleSearchKey({ key: "k", metaKey: false, ctrlKey: false }),
    ).toBe(false);
  });
  it("Control alone does not open", () => {
    expect(
      isToggleSearchKey({ key: "Control", metaKey: false, ctrlKey: true }),
    ).toBe(false);
  });
});

describe("isSlashSearchKey", () => {
  it("/ opens the palette outside text entry", () => {
    expect(
      isSlashSearchKey(
        { key: "/", metaKey: false, ctrlKey: false },
        { tagName: "BODY" },
      ),
    ).toBe(true);
  });
  it("/ stays text inside inputs, textareas, selects and editable regions", () => {
    for (const target of [
      { tagName: "INPUT" },
      { tagName: "TEXTAREA" },
      { tagName: "SELECT" },
      { tagName: "DIV", isContentEditable: true },
    ]) {
      expect(
        isSlashSearchKey({ key: "/", metaKey: false, ctrlKey: false }, target),
      ).toBe(false);
    }
  });
  it("modified / chords do not open", () => {
    expect(
      isSlashSearchKey(
        { key: "/", metaKey: false, ctrlKey: true },
        { tagName: "BODY" },
      ),
    ).toBe(false);
    expect(
      isSlashSearchKey(
        { key: "?", metaKey: false, ctrlKey: false },
        { tagName: "BODY" },
      ),
    ).toBe(false);
  });
});
