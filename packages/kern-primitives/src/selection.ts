import { useCallback, useMemo } from "react";
import { useControllableState } from "./useControllableState";

/**
 * The collection/selection model shared by every Kern control that selects.
 *
 * ## Why this is a primitive
 *
 * SegmentedButton, ToggleGroup, Accordion, List and Select all reduce to the same
 * two questions: is this value selected, and what happens when it is activated.
 * The answer differs in exactly one way — whether selection is exclusive or
 * additive — and that difference is a Kern decision (M3's segmented button is
 * multi-select; its radio group is not), not a platform detail.
 *
 * So the model is shared and the rendering is not. On web the selection axis is
 * Base UI's `multiple`; on native it is `accessibilityRole` switching between
 * `radio` and `checkbox`. Neither of those belongs in this file, which is why it
 * can be the layer's second real primitive rather than contract data.
 *
 * ## Representation
 *
 * Selection is ALWAYS an array, including in single mode where it holds at most
 * one entry. Normalising to one shape removes the branch every consumer
 * otherwise writes (`isMultiple ? values : [value]`) — and with it the class of
 * bug where a control renders the wrong count of selected items after a
 * controlled/uncontrolled flip.
 */

export type SelectionMode = "single" | "multiple";

/** At most one entry in `single` mode; any number in `multiple`. */
export type Selection = readonly string[];

/** Coerce a caller's single-or-array value into the array representation. */
export function normalizeSelection(
  value: string | readonly string[] | undefined,
  mode: SelectionMode,
): Selection {
  if (value === undefined) return [];
  const list = typeof value === "string" ? [value] : value;
  if (mode === "single") return list.slice(0, 1);
  // Deduplicate: a multi-select that reports the same value twice is a caller
  // bug, and carrying it would make `length` lie about how many are selected.
  return [...new Set(list)];
}

/** Whether `value` is currently selected. */
export function isSelected(selected: Selection, value: string): boolean {
  return selected.includes(value);
}

/**
 * Apply an activation to the selection.
 *
 * In `single` mode an activation always REPLACES, even re-activating the current
 * value — that is what a radio group does, and a "click the selected one to
 * deselect" behaviour would leave the group with no selection, which M3 does not
 * describe. In `multiple` mode it toggles.
 */
export function toggleSelection(
  selected: Selection,
  value: string,
  mode: SelectionMode,
): Selection {
  if (mode === "single") return [value];
  return selected.includes(value)
    ? selected.filter((entry) => entry !== value)
    : [...selected, value];
}

/**
 * The selection state, controlled or uncontrolled, with a stable `select`
 * callback.
 *
 * `mode` changes are normalised immediately rather than waiting for an
 * interaction: widening single -> multiple keeps the selection, narrowing
 * multiple -> single keeps the FIRST entry, so the control never reports more
 * selected items than its mode permits.
 */
export function useSelection({
  value,
  defaultValue,
  onChange,
  mode,
}: {
  value?: string | readonly string[];
  defaultValue?: string | readonly string[];
  onChange?: (next: Selection) => void;
  mode: SelectionMode;
}): [Selection, (value: string) => void] {
  // `useControllableState` is generic over T, so its `onChange` is typed
  // `(next: T) => void`. Our T is the caller's single-or-array, but our onChange
  // receives the normalised array — so the bridge is a real function rather than
  // a cast, which would hide the difference between "what the caller passed in"
  // and "what we report back".
  //
  // It is `useCallback`'d because `useControllableState` keeps `onChange` in the
  // deps of its own setter: a fresh closure every render would rebuild `setRaw`
  // every render, and therefore `select` too. That is a real defect — a `select`
  // whose identity changes each render breaks any consumer memoising on it.
  const notify = useCallback(
    (next: string | readonly string[] | undefined) => {
      onChange?.(normalizeSelection(next, mode));
    },
    [onChange, mode],
  );

  const [raw, setRaw] = useControllableState<
    string | readonly string[] | undefined
  >(value, defaultValue, notify);

  const selected = useMemo(() => normalizeSelection(raw, mode), [raw, mode]);

  const select = useCallback(
    (next: string) => {
      setRaw((previous) => {
        const current = normalizeSelection(previous, mode);
        const updated = toggleSelection(current, next, mode);
        // Compare by VALUE. `useControllableState` skips when `Object.is`
        // matches, and two arrays with equal contents are never identical — so
        // re-activating the selected item in single mode would report a change
        // that did not happen, and a consumer wiring `onChange` to a state setter
        // would loop.
        if (sameSelection(current, updated)) return previous;
        return updated;
      });
    },
    [mode, setRaw],
  );

  return [selected, select];
}

/** Equality by contents, in an order that does not depend on activation order. */
function sameSelection(a: Selection, b: Selection): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every((entry) => setA.has(entry));
}
