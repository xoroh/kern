---
"@xoroh/kern": patch
---

Test-selector contract: `testID` on `Button`, `DialogContent`, `Switch`.

Each renders `data-testid` on its root node when provided (nothing when
not), matching the native `testID` passthrough — one selector across
jsdom, RNTL, and Playwright. Documented in `parity/testid-contract.md`
with the grandfathered menu-family defaults noted as the exception.
