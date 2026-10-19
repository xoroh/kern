# Report: PR 2 — Adopt render in M3 and eliminate type casts in Button and Command

Date: 2026-10-19
Branch: `feat/m3-axis-render-adoption`
PR: https://github.com/xoroh/kern/pull/64
Related: Part 2 of 3 for Kern adopting current Axis

## Overview
Adopted proper typing and prop partitioning to remove type casts in M3 web and native:
1. Eliminated `anchorProps as unknown as ComponentPropsWithRef<"a">` and `onClick as unknown as ...` in `packages/kern/src/components/button.tsx` by introducing cleanly typed prop-splitting partition functions (`anchorDOMProps` and `buttonDOMProps`) across the discriminated `ButtonProps = ButtonAnchorProps | ButtonButtonProps` union.
2. Eliminated `items={options as unknown as CommandOption[]}` and `item as CommandOption` in `packages/kern/src/components/command.tsx` by using Base UI's parameterized `ComboboxPrimitive.Root<string, false, CommandOption>` with `ComboboxPrimitive.Root.Props<string, false, CommandOption>`.
3. Verified native Button and IconButton: native components compose styles and handlers via Axis primitives (`useKernPress`, `resolveRender`, `mergeSlotProps`).
4. Re-synced generated props documentation in `apps/site/src/generated/props.ts` and `props-table.ts`.

## Verification Gates
- `bun run typecheck`: Passed (all 6 workspace packages clean)
- `bun run --cwd packages/kern test`: Passed (77 test suites, 834 tests pass)
- `bun run test:native`: Passed (9 test suites, 103 tests pass)
- `bun run test:native:jest`: Passed (50 test suites, 449 tests pass)
- `bun run check:generated`: Passed (19 generators fresh, 24 derived files match)
- `bun run lint`: Passed (Biome 0 errors)
