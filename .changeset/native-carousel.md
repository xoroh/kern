---
"@xoroh/kern-native": minor
"@xoroh/kern-primitives": patch
---

Native `Carousel`, the roving primitive's first real consumer — and it found a
real bug in the primitive it was built on.

`useRovingModel` rebuilt the model on every render, and the model holds its index
in a closure created per call, so an uncontrolled index reset to
`defaultActiveIndex` on every change. Carousel reported the correct index and
rendered the wrong slide.

**No model-only test could have found it — the model has no render cycle.** The
primitive's 15 tests all passed throughout. Fixed by holding uncontrolled state
in React and always passing a resolved `activeIndex`, so the model behaves as
controlled and reports rather than mutating its own copy. Covered by a new hook
suite (5 tests) that drives an explicit render cycle.

This is the argument for extracting a primitive with a real consumer rather than
one built in isolation: the first thing built on it found the bug its own tests
were structurally unable to see.