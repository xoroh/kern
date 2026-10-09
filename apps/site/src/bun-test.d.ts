/**
 * Minimal `bun:test` declarations.
 *
 * The site's tests run under `bun test` (the same runner `scripts/lib/
 * codeowners.test.mjs` uses at the root), but `bun-types` is not hoisted
 * into this workspace's node_modules and adding a dep for five functions is
 * not worth the lockfile churn. This declares exactly the surface the site's
 * tests use — nothing more, so a test reaching past it fails to compile and
 * grows this file deliberately.
 */
declare module "bun:test" {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
  export function expect(value: unknown): {
    toEqual(expected: unknown): void;
    toBe(expected: unknown): void;
    not: {
      toThrow(expected?: unknown): void;
    };
  };
}
