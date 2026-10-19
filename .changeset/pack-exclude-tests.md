---
"@xoroh/kern": patch
"@xoroh/kern-native": patch
---

Stop shipping test files in the published tarballs: `src/**/*.test.*`,
`src/**/*.rntest.*` and `src/**/__tests__` are negated in `files`.
Component sources still ship (packed `kern add` vendors from them); only
the 114 test files (1.7MB) drop out. No API or behavior change.
