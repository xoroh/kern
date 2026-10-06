# NativeBase — part-by-part vs kern (legacy record)

**Identity:** universal (Android/iOS/web) themed library, v3 accessible + multiplatform. **Status: superseded — new projects are directed to gluestack-ui** (docs.nativebase.io banner). Record kept so kern never re-learns its lessons.
**Sources:** docs.nativebase.io (deprecation banner + v2/v3 history).

## Parts: they-have / we-will-have
- Universal themed components (v3 set): Y-was / **B** via kern's own packages (do not adopt NativeBase).
- Lessons (why it lost): perf + maintainability of a monolithic styled system → the gluestack split (headless + styling engine + copy-paste). kern's parallel: keep behavior primitives lean, tokens separate, no monolithic styled runtime.
- Web support (from v2.4.1): Y-was / kern web is first-class, not an add-on.

## Verdict
Do not adopt, do not mirror. Keep this file as the tombstone + lessons only.
