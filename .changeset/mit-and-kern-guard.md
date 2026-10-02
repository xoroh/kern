---
"@xoroh/kern": minor
"@xoroh/kern-tokens": minor
"@xoroh/kern-native": minor
"@xoroh/kern-mcp": minor
---

License is now MIT (previously Apache-2.0). Native shape values now resolve
from the M3 shape scale and the FAB shadow uses the scrim role. New
`scripts/check-kern.mjs` (`bun run check:kern`, wired into CI) enforces the
mechanically checkable M3 laws: semantic roles must exist in every scheme,
components use tokens instead of raw colors, and radii come from the shape
scale.
