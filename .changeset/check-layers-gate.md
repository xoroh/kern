---
"@xoroh/kern": patch
---

Add `check:layers` — the D-034 package map, now machine-enforced.

The map (`primitives -> tokens -> renderers`) was a table a human maintained.
That is exactly the kind of claim that drifts: the P2c primitives study put
`useControllableState` at 18 consumers when it had 21, and the parity counts were
hand-adjusted twice before the gate forced the real numbers. A structure nobody
enforces is eventually wrong and still looks right.

Two rules, each because it has already been violated in this repo or would be by
the mistake D-034 was written to prevent:

1. **A layer may only depend on layers below it.** `kern-tokens` depending on a
   renderer is precisely what folding tokens into core would have produced.
2. **No renderer-to-renderer edge, in either direction.** `kern-native`
   importing `@xoroh/kern` pulls react-dom and Base UI into a React Native
   bundle and inverts ADR 002 — the same shape as the `aspect-ratio` incident.

It also fails on a package with **no declared layer**, which is how a map rots:
someone adds a package, never says which layer it belongs to, and the map is
quietly wrong from then on.

It reads `dependencies`, `peerDependencies` AND `devDependencies`. A boundary
held only because a package forgot to declare something is not held.

Mutation-proven with three injections, each reverted and confirmed byte-identical:
`kern-native -> kern` (fails), `kern-tokens -> kern` (fails), and a package with
no layer entry (fails). Wired into CI beside `check:parity`.

Deliberately reads `package.json`, not the import graph: this gate answers *which
package may know about which*, and a declared dependency is the honest answer.
Whether a FILE crosses a boundary inside a package is `check:primitives`' job —
and that one walks the import graph, because a per-file grep provably passes a
file whose transitive import crosses the line.
