---
"@xoroh/kern-cli": patch
---

The CLI package is publishable: `private: true` removed.

The manifest was already publish-shaped (`publishConfig` public +
provenance, `bin`, `files` with the registry/templates/snapshot, dual
exports); only the `private` flag blocked it. The CLI ships with 0.1.0 —
still unpublished until the founder lifts the release hold. Covered by
`check:publish`, the preflight gate, and its own CI matrix leg.
