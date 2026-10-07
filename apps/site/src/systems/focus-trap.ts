/**
 * The Tab-trap decision for the ⌘K palette dialog — pure, so the keyboard
 * contract is unit-tested, not just rendered.
 *
 * The dialog owns `items` (its tabbable elements, in DOM order) and the index
 * of `document.activeElement` within them (`-1` when focus is outside the
 * dialog — possible on the tick before React moves it, or when the pointer
 * pulled focus to the scrim). Given the direction, this returns the index to
 * move focus to, or `null` when the browser's natural Tab order is already
 * correct and the handler must not interfere.
 *
 * The rule is first↔last wrap with pull-in: Tab from the last item or from
 * outside wraps to the first; Shift+Tab from the first item or from outside
 * wraps to the last. Anything else is a normal in-dialog move.
 */
export function trapTarget(
  count: number,
  activeIndex: number,
  shiftKey: boolean,
): number | null {
  if (count === 0) return null;
  if (shiftKey) {
    if (activeIndex <= 0) return count - 1;
  } else if (activeIndex < 0 || activeIndex === count - 1) {
    return 0;
  }
  return null;
}
