import type { Ref } from "react";

/**
 * Assign a possibly-union ref without casting.
 *
 * `Button` takes `Ref<HTMLButtonElement> | Ref<HTMLAnchorElement>` (split by
 * the `href` discriminant), so neither render branch can name the ref's
 * element type without asserting. The generic infers `T` from the union and
 * both assignments stay well-typed — a mismatched consumer ref is a type
 * error at their call site, never a cast here.
 *
 * Internal to `@xoroh/kern` (not exported from `./utils`): ref plumbing, not
 * public surface. Deliberately NOT shared with `@xoroh/axis` (no such export
 * on its public entry) or `libs/kern-primitives` (frozen pending deletion).
 */
export function assignRef<T>(ref: Ref<T> | undefined, node: T | null): void {
  if (ref === null || ref === undefined) return;
  if (typeof ref === "function") {
    ref(node);
    return;
  }
  ref.current = node;
}
