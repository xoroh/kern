---
"@xoroh/kern-tokens": minor
"@xoroh/kern-native": minor
---

M3 Expressive shape library as data + renderer. `@xoroh/kern-tokens`: `expressive-shapes` module (10 family-parameterized forms — superellipse/scallop/star descriptors, `expressiveShapePath()` byte-identical per name+size on every renderer, `list/get/has/register` registry mirroring `registerHue`). Core 10-entry shape scale untouched. `@xoroh/kern-native`: `ExpressiveShape` renderer on `react-native-svg` + `expressiveShapeArtStyles`. Vertex-exact Compose tables are not vendored anywhere in-repo, so forms are family-parameterized (stated in the module header). XR components scoped out by design (documented in the mobile-foundation skill reference; DOM+RN primitives cannot host a scene graph — escape hatch is a future `@xoroh/kern-xr` behind its own ADR).
