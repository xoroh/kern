# a11y overrides — hand-authored judgment, per page

Optional `<platform>/<slug>.json` files merge EXTRA expectations into the
generated `*.a11y.json` for that page. Every entry merged from here is
stamped `provenance: "authored"` by the generator — the generator never
emits `authored` itself.

Shape: `{ "<ExportName>": [{ "rule": "...", "expect": "pass|gap|fail", "basis": "..." }] }`.

Rules for adding one:
- Only judgment goes here — anything derivable from the page's own content
  belongs in `scripts/a11y-derive.mjs` instead.
- Never invent an axe verdict by eye. An `expect: "pass"` here means you ran
  axe against the live demo and it passed; say which axe version and which
  demo state in the basis.
- Unknown keys fail the gate (`check-a11y.mjs` rejects overrides for parts
  the content doc does not list), so a renamed export surfaces loudly.

The directory starts empty on purpose: zero authored entries ship until
someone exercises judgment. An empty overrides dir is a fact, not a gap.
