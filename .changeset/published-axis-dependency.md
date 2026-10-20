---
"@xoroh/kern": patch
"@xoroh/kern-native": patch
"@xoroh/kern-cli": patch
---

Depend on the PUBLISHED `@xoroh/axis` instead of a vendored copy.

Axis is released (0.1.2 on the npm registry), so the vendored tarball was no
longer a fallback — it was a second Axis to keep in step, and it was 92 files
behind when Axis moved. Three things follow:

- The dependency is a registry range (`^0.1.2`). A `file:` specifier is not
  installable by a consumer: `preflight:publish --release` refuses it, and a
  published `@xoroh/kern` would fail every consumer install with
  EUNSUPPORTEDPROTOCOL.
- The WEB package imports the Axis MODELS entry (`@xoroh/axis/models`)
  rather than the root entry. The root entry is the native zone, so importing
  it made every web consumer install react-native — whose source is Flow,
  which no JS runtime can parse. The models entry is a published, gated
  surface whose closure Axis's own boundary gate proves is renderer-free.
- The CLI's scaffolded app pins the same published range, read from the
  library's own manifest, so a scaffold can never resolve a different Axis
  than the code it was written against.
