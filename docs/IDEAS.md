# Kern ideas (not yet decided)

> **Direction rule.** The roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR. Roadmap: [`docs/architecture/kern-axis-migration-and-roadmap.md`](architecture/kern-axis-migration-and-roadmap.md). Vision: [`VISION.md`](VISION.md).

Status: living list. Every entry carries one status: `idea`, `researching`, `accepted to roadmap with link`, or `rejected with reason`. Nothing here is planned work until an ADR moves it to the roadmap.

| Idea | Status | Notes |
| --- | --- | --- |
| AI chat UI primitives and components | accepted to roadmap with link | Placed by ADR [019](decisions/019-ai-chat-in-kern.md): styled chat parts and blocks live in Kern design systems, behavior models in Axis, voice deferred. |
| Component scope review: move design patterns out of Axis | accepted to roadmap with link | Decided by Axis ADR 006 (scope is primitives only; patterns move to Kern design systems), packaged per [017](decisions/017-per-system-packages.md). |
