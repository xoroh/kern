/**
 * Palette shortcut matchers — pure so they are unit-testable.
 *
 * The ⌘K/Ctrl+K handler lives on `window` in `search-palette.tsx`; what
 * counts as "the shortcut" lives here, where `shortcut.test.ts` pins it.
 * The review caught Ctrl+K doing nothing on Linux/Chromium: the page-level
 * handler already matched `ctrlKey`, but a browser that consumes the chord
 * (omnibox, WM, IME) never delivers the event — so `/` (GitHub's fallback,
 * inert while typing) opens the palette too.
 */

export type ShortcutKey = {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey?: boolean;
};

export type ShortcutTarget = {
  tagName?: string;
  isContentEditable?: boolean;
} | null;

/** ⌘K on macOS, Ctrl+K everywhere else — the primary palette chord. */
export function isToggleSearchKey(e: ShortcutKey): boolean {
  return (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
}

/**
 * `/` opens the palette when the user is not already typing somewhere.
 * Text fields, selects and editable regions keep the key; anywhere else it
 * is the fallback chord for environments that swallow Ctrl+K.
 */
export function isSlashSearchKey(
  e: ShortcutKey,
  target: ShortcutTarget,
): boolean {
  if (e.metaKey || e.ctrlKey || e.altKey) return false;
  if (e.key !== "/") return false;
  const tag = target?.tagName?.toUpperCase();
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return false;
  if (target?.isContentEditable) return false;
  return true;
}
