---
"@xoroh/kern-tokens": patch
---

Fix two elevation rows that asserted nothing, and one that asserted the wrong
thing.

## `list` -> `list-item`

`packages/kern/src/components/list.tsx` does not exist. The row resolved to no
file, measured `null`, and — because a level-0 row treats absence as conformant —
passed without ever looking at a component. **A row that measures nothing is
indistinguishable from a correct one in the summary**, which is the same
proxy-for-the-property failure the level-0 rows were introduced to remove, one
level deeper. Re-keyed to `list-item`, which is both the real file and the
registry's name.

## `card` variants [1] -> [0, 1]

M3 tabulates cards twice — "card (elevated)" at 1 and "cards (filled, outlined)"
at 0 — exactly as it tabulates buttons twice. Kern's Card implements both through
its variant axis. Declaring only `[1]` read as stricter but was not: the gate
resolves a component's level from its source closure, so it measured 1 and
passed, while a consumer rendering a plain filled card was shipping level 0 that
no row permitted.

## A gate bug the above exposed

`auditElevation` flagged absence when `variants.some(level => level !== 0)`.
That is wrong for a row like Card's `[0, 1]`: it rejected a filled Card as "ships
no elevation token" when that card is conformant. The correct test is
`!variants.includes(0)` — absence is a violation only when NO permitted level is
0. Found by mutation-proving this fix: removing Card's token must pass, and it
did not.

`check-kern`'s conformant counter had the same bug in the opposite direction
(`every(level => level === 0)`), which made a fully green run report **18/19** —
a number that looks like a defect and is not one. Both now use `includes(0)`, and
the comment records why the two must stay in step.

Mutation-proven, each reverted byte-identical:

- `list-item` gains an unearned shadow -> "ships elevation level2, M3 assigns
  level0 (list)"
- Card ships level 2 -> "ships elevation level2, M3 assigns level0/1"
- Card carries no token (a filled card) -> PASSES, and reads 19/19

Verified: `check:kern` 19/19 PASS, `check:parity` PASS, `typecheck` PASS,
kern-tokens 39/39.