---
"@xoroh/kern-native": patch
---

Manifest hygiene: drop the duplicate `./native` subpath (byte-identical to
`.`, zero consumers) and declare `sideEffects: false` for tree-shaking.
No runtime change.
