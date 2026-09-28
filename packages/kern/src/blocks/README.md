# Use-case blocks

The core (`../web`, `../native`, `../theme`) is domain-neutral and never
imports from here. A **block** is a use-case pack: composed components +
preset theme built on core primitives.

```
blocks/
  mobility/     # first pack: dispatch, fleet, ride contexts (planned)
  <usecase>/    # future packs follow the same shape
```

Rules:

- Blocks depend on core; core never depends on blocks.
- A block may add a preset theme under `../theme/themes/` (e.g. a
  mobility preset), but must resolve through the shared role registry.
- A block graduates to its own package only if it needs independent
  versioning; until then it ships inside `@xoroh/kern` (web) or
  `@xoroh/kern/native`.
