import { type MutableRefObject, type Ref, useCallback, useRef } from "react";

/**
 * Wave 1 of the P2c-3 extraction (`docs/conventions/primitives.md` §3): give
 * behaviour that already exists TWICE with independent implementations one
 * owner. This is the `useControllableState` failure mode repeating.
 *
 * `render` interop is what needs it — a part that lets the consumer substitute
 * the element must still hand its own ref somewhere, or the ref silently stops
 * working the moment a consumer passes `render`.
 */

export type PossibleRef<T> = Ref<T> | undefined | null;

/** Assign one value to every ref in the list, cleaning each up as it goes. */
export function assignRef<T>(ref: PossibleRef<T>, value: T | null): void {
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  if (ref) {
    // A mutable ref is the common case; an immutable one (RefObject) is not
    // writable and must be left alone rather than throwing on assignment.
    try {
      (ref as MutableRefObject<T | null>).current = value;
    } catch {
      // A frozen RefObject cannot take the write. Swallowing is correct: the
      // consumer handed us a ref they cannot themselves mutate, and failing the
      // whole render over it would be worse than not writing.
    }
  }
}

/**
 * Compose several refs into one callback ref.
 *
 * Every input is supported — callback refs, mutable ref objects, and `null`/`undefined`
 * — because a caller merging "my ref" with "the part's internal ref" cannot know
 * which kind each side holds.
 */
export function mergeRefs<T>(
  ...refs: PossibleRef<T>[]
): (value: T | null) => void {
  return (value: T | null) => {
    for (const ref of refs) assignRef(ref, value);
  };
}

/**
 * `useMergeRefs` — the stable-identity version of {@link mergeRefs}.
 *
 * The returned callback keeps the SAME identity across renders, so it is safe
 * in a dependency array and does not re-run an effect that only wants to run
 * when the underlying refs change. The refs are read through a ref-of-refs
 * precisely so that a new inline arrow passed on each render does not become a
 * new callback identity — that is the difference between this and `mergeRefs`
 * above, and it is why both exist.
 */
export function useMergeRefs<T>(
  ...refs: PossibleRef<T>[]
): (value: T | null) => void {
  // Held in a ref so the stable callback below can see the CURRENT refs
  // without depending on them.
  const latest = useRefOfRefs(refs);
  return useStableCallback((value: T | null) => {
    for (const ref of latest.current) assignRef(ref, value);
  });
}

function useRefOfRefs<T>(value: PossibleRef<T>[]) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

/**
 * A callback whose IDENTITY never changes, so a consumer effect that depends on
 * it does not re-run on every render.
 *
 * biome-ignore lint/correctness/useExhaustiveDependencies: the empty dep array
 * IS the feature — including `fn` would defeat the whole function. The stale-
 * closure risk is handled by routing through a ref instead of memoising `fn`,
 * and `mergeRefs.test.ts` asserts the identity is stable across a rerender, so
 * this is checked rather than assumed.
 */
// biome-ignore lint/correctness/useExhaustiveDependencies: stable identity is the contract; see above.
function useStableCallback<T extends (...args: never[]) => unknown>(fn: T): T {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback(((...args: never[]) => ref.current(...args)) as T, []);
}
