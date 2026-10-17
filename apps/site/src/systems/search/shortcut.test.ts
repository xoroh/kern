import { describe, expect, test } from "bun:test";
import { isSlashSearchKey, isToggleSearchKey } from "./shortcut";

/**
 * The palette chords, pinned. These run in `check:docs`
 * (`bun test src/systems/search/shortcut.test.ts`): the review's Ctrl+K
 * finding means the chord contract gets a test, not just a handler.
 */
describe("isToggleSearchKey", () => {
  test("Control+K opens (Linux/Windows primary)", () => {
    expect(
      isToggleSearchKey({ key: "k", metaKey: false, ctrlKey: true }),
    ).toBe(true);
  });
  test("Command+K opens (macOS primary)", () => {
    expect(
      isToggleSearchKey({ key: "k", metaKey: true, ctrlKey: false }),
    ).toBe(true);
  });
  test("a bare k does not open", () => {
    expect(
      isToggleSearchKey({ key: "k", metaKey: false, ctrlKey: false }),
    ).toBe(false);
  });
  test("Control alone does not open", () => {
    expect(
      isToggleSearchKey({ key: "Control", metaKey: false, ctrlKey: true }),
    ).toBe(false);
  });
});

describe("isSlashSearchKey", () => {
  test("/ opens the palette outside text entry", () => {
    expect(
      isSlashSearchKey(
        { key: "/", metaKey: false, ctrlKey: false },
        { tagName: "BODY" },
      ),
    ).toBe(true);
  });
  test("/ stays text inside inputs, textareas, selects and editable regions", () => {
    for (const target of [
      { tagName: "INPUT" },
      { tagName: "TEXTAREA" },
      { tagName: "SELECT" },
      { tagName: "DIV", isContentEditable: true },
    ]) {
      expect(
        isSlashSearchKey(
          { key: "/", metaKey: false, ctrlKey: false },
          target,
        ),
      ).toBe(false);
    }
  });
  test("modified / chords do not open", () => {
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
