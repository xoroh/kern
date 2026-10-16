# 007. No backward compatibility before 1.0 Preview publish

Status: accepted (owner rule, 2026-10-16 — supersedes earlier instructions where they conflict)

Relationship to ADR-004 (still `proposed`, pending founder sign-off): 004
already says "before 1.0, removed means deleted: no shims, no aliases". This
ADR accepts and operationalizes that pre-1.0 half now — sweep scope,
URL-redirect tension, expiry. 004's post-1.0 deprecation window and its
sign-off state are untouched by this change.

## Context

Nothing is published: every package sits at `0.0.0`, the release hold is on,
and no external consumer can depend on any Kern API. Backward-compatibility
machinery (deprecated aliases, compat barrels and re-exports, legacy paths,
URL redirects, defensive fallbacks) therefore protects nobody — it only
doubles the API surface reviewers, agents, and gates must reason about, and
every alias kept now becomes a promise that survives 1.0.

## Decision

Until the 1.0 Preview publish, there is **one clean current API per thing**:

- Remove deprecated aliases (old prop names, size names kept under
  pre-expressive names, warn-once shims) instead of keeping them beside
  their replacements. Pre-publish removal is a cleanup, not a break.
- No compat barrels, re-exports, legacy paths, or URL redirects. A move
  deletes the old name; it does not alias it.
- No unnecessary fallbacks or defensive dead code. Keep only fallbacks that
  serve a real runtime/platform need, and say why in code next to them.
- Applied to everything touched, plus sweeps of what already landed. The
  first sweep (PR: fab `medium`, loader 24px default + `xl`, versioning
  example, switch docs row) sets the pattern.

## Consequences

- Renames land as renames (codemod + tests + docs in the same PR), never as
  alias-then-remove sequences — there is no "then" before 1.0.
- The D-BUTTON-NAMES migration removes `BUTTON_VARIANT_ALIASES` instead of
  deprecating through them.
- URL redirects for moved docs pages go with the moves; D-URLS's "generated
  redirects from all current paths" is in direct tension with this rule and
  needs an explicit owner ruling before the URL migration lands (no silent
  reinterpretation either way).
- After the Preview publish this ADR expires: post-1.0 removals follow a
  deprecation protocol (to be recorded separately).
