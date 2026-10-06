# Ant Design — part-by-part vs kern

**Identity:** enterprise React system: design language (`/docs/spec`: values, global styles, patterns, principles, template documents) + huge component catalog + AntV visualization + Mobile.
**Sources:** SITE-REDESIGN-benchmark.md (Ant IA); ant.design.

## Parts: they-have / we-will-have
- Components (~80: general/nav/data-entry/data-display/feedback): Y / **B** for M3-overlapping; enterprise extras (transfer, tree-select, cascader, mentions, affix, anchor, back-top, float-button, tour, QRCode, watermark): mostly **G** — decide per part, none M3-core.
- Design language (values, colors/layout/font/icons/dark/shadow, patterns: feedback/navigation/data-entry/data-display/copywriting, principles: proximity/alignment/…, template documents: form/workbench/list/result/exception pages): Y / kern Foundations + Blocks/templates (steal the whole layer shape).
- Pro components / templates (dashboard, login, CRUD scaffolds): Y / kern blocks/showcase track.
- Charts (AntV G2/G6/X6, Ant Design Charts): Y / **R**.
- Mobile (mobile.ant.design): Y / **N** (kern-native is the answer).
- Theme gallery + theme editor (live preset switching): Y / steal as the dynamic-color hero hook.

## Patterns to carry
Design-language layer separate from components; template documents; live theme gallery; LLMs.md per page.
