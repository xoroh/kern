---
"@xoroh/kern": patch
"@xoroh/kern-native": patch
---

Add tranche 1 of the cross-renderer behaviour parity suite.

`docs/parity-contract.md` asserted that the web and native renderers implement
the same behaviour. Until now nothing executed that claim — every green suite
tested one side in isolation, so a divergence would not fail anything.

`parity/contract.ts` (repo root, outside any package) declares the contract as
DATA ONLY: role, state axis, interaction kind, accessible name, and expected
state before and after activation. It imports nothing, by design — ADR 002 says
the two renderer packages must never import each other, and a shared test
contract is the most natural place to break that rule. So the contract does not
import a component; each suite supplies its own renderer and queries, and both
alias the same file as `@kern-parity/contract`.

Primitive-agnostic by construction: every field is observable semantics. Nothing
references Base UI, `data-*`, DOM nodes, or RN internals. The test of a parity
row is whether it would survive a change of behavior primitive — these do.

Tranche 1 covers `switch`, `checkbox` and `button`, which already ship on both
sides, so a failure means real divergence rather than a missing component. Each
is checked for role agreement, initial state, state after one activation,
toggle-vs-select (a checkbox returns to `false` on second activation; a select
would not), disabled behaviour, and change reporting.

Failures print the same `PARITY DIVERGENCE` report on either renderer, via
`assertParity`, because Jest's `expect` accepts no message argument and a bare
`false !== true` on the native side is far harder to act on than the web side's.

Verified by mutation, not merely green:

| Mutation | Result |
| --- | --- |
| native `Switch` reports `role="checkbox"` | 1 failed — "accessible role must match the contract … expected switch, got checkbox" |
| native `Switch` pins `checked` to `false` | 1 failed — "one activation must toggle the state (expected true, got false)" |
| web `Switch` set `readOnly` | failed on both web parity assertions |

Both mutated files restored byte-identical to `HEAD` afterwards (verified with
`git diff --quiet`). Full chain green: `typecheck`, `test:all`, `test:jest`,
`check:parity`.

No runtime change: no export, prop, token, or behaviour altered.