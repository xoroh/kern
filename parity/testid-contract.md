# Test-selector contract — `testID` / `data-testid`

Status: current. Owner: Kern (both renderers). Ports: web DOM queries,
RNTL queries, Playwright selectors, MCP `install_plan` verification.

## The rule

Every interactive component accepts an optional `testID` prop:

- **Web** renders `data-testid={testID}` on its root node, only when
  `testID` is provided. No default is invented for new additions — an
  unasked `data-testid` is DOM churn every consumer snapshot would absorb.
  (`MenuScreen`/`MenuSheet`/`FilterChipRow`/`DockSheet` predate this rule
  and keep their `kern-*` defaults; grandfathered, not the pattern.)
- **Native** passes `testID` to the host element, falling back to the same
  `kern-*` default where the family already has one. React Native maps
  `testID` to `data-testid` on web-parity builds, so one selector works in
  RNTL (`getByTestId`), jsdom (`getByTestId`), and Playwright
  (`[data-testid=...]`).
- **Axis** owns the same convention independently (`testID` on its
  components, "no `data-*`" inside its own contract): Kern maps at its own
  boundary, never by reaching into Axis internals.

## Covered components (gated by unit tests, not prose)

`Button` (both branches), `DialogContent`, `Switch`, `MenuScreen`,
`MenuSheet`, `FilterChipRow`. Each has a ref-attachment-style test
asserting the selector lands on the right node. Extending coverage is
per-component work with a test — never a bulk rename.

## Non-goals

Scrim (`-scrim`) and checkmark (`-checkmark`) suffix conventions, a shared
`@xoroh/kern-testkit` helper, and measured-vs-expected a11y splits stay
future work (review backlog). This contract standardizes naming only.
