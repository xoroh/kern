# Governance

Status: current

How decisions get made about Kern, who can make them, and what cannot be
changed by a normal pull request.

## What Kern is

An open-source Material Design 3 design system published as MIT-licensed npm
packages under `@xoroh/*`. It is standalone: consumers depend on Kern, never
the reverse, and no downstream product appears in Kern's code, docs, or
public API.

## The system law

Locked 2026-09-29, recorded in
[`docs/plan/README.md`](docs/plan/README.md). These are not style preferences
— they are the conditions under which the system stays coherent, and they are
enforced by `bun run check:m3`:

1. **Material 3 governs structure, behavior, and naming.** Kern's
   expression (flat surfaces, 9999px pills, neutral chrome, Inter) is
   recorded per component as a deliberate override. An override is a
   documented deviation from MD3, never a new design language.
2. **Naming law** — unprefixed PascalCase, M3-canonical concepts (`Button`,
   `TopAppBar`, `NavigationBar`, `CircularProgress`, `Icon`). No prefixes,
   no product names, no bridge names, no deprecation aliases.
3. **Hard cuts over deprecation machinery.** Removed means deleted: no
   warning shims, no stub packages, no alias layers.
4. **Standalone** — no references to consuming products or their codebases.

Changing any of these is a governance decision, not a code review.

## Decision records

Architectural decisions live in [`docs/adr/`](docs/adr/). One problem per
file, numbered, with `Status: accepted` or `Status: superseded by ADR-NNN`.

A decision needs an ADR when it:

- adds or removes a package, or changes the dependency direction between
  them;
- changes the public export surface or the naming law;
- changes the token pipeline or how a scheme is resolved;
- makes a new external dependency part of the public contract.

Routine work — a new component, a bug fix, a performance change inside a
package — needs a changeset, not an ADR.

## Who decides what

| Decision | Decided by | Recorded in |
| --- | --- | --- |
| Component names, `variant` meanings | Design authority, enforced by `check:m3` | `docs/platform-parity.md` |
| Token values | Design authority, enforced by `check:contrast` | `packages/kern-theme/src/tokens.json` |
| Package boundaries, dependencies | Maintainers | ADR |
| Deprecations and removals | Maintainers, with an ADR | ADR + changeset |
| Release timing and publishing | Maintainers | `docs/releases.md` |
| License | Maintainers | `LICENSE` |

"Maintainers" means the Xoroh maintainers of this repository. Anyone can open
an issue or PR proposing a change; a proposal that contradicts the system law
needs an ADR that explains the contradiction, not just a diff.

## Contribution governance

Contributions follow [`CONTRIBUTING.md`](CONTRIBUTING.md). In short: a
changeset for published-package changes, docs in the same change, lint,
types, tests, and the `check:*` gates green before review.

Review is enforced by the gates rather than by reviewer memory: `check:m3`
decides token and role legality, `check:contrast` decides WCAG conformance,
`check:publish` decides whether a package is publishable. A reviewer
exercises judgment on what no gate can decide — whether a component is
genuinely useful, whether an MD3 override is justified, whether a difference
between web and native is a real gap or a platform constraint.

## Code of conduct

[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — Contributor Covenant. It applies
in the repository, in issues, in pull requests, and anywhere someone
represents the project.

## Security

[`SECURITY.md`](SECURITY.md) has the reporting channel and the support
window. Security fixes target the latest published `0.x` release; there are
no backports.

## Support

[`SUPPORT.md`](SUPPORT.md) — where to ask questions and what to expect.