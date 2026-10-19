# Gate 1 — undocumented exports to zero, coverage gate flipped

Brief: `.reports/review-usage-presentation.md` follow-up directive — drive the
doc-coverage debt to zero gate-by-gate. This PR is gate 1 of 3: the 16
undocumented inventory exports (web 7, mobile 9; coverage 402/418) are
documented, and `check:docs`'s coverage report is flipped from report-only to
failing. Gate 2 (920 props rows) and gate 3 (227 off-scale utilities, now
handled by PR #59) follow separately.

Branch: `docs/gate1-undocumented-exports-zero` (worktree
`/tmp/opencode/kern-gate1-orphans`, from main @ `937e8730`).
PR: https://github.com/xoroh/kern/pull/62

## Outcome

Every one of the 418 inventory exports now has exactly one documenting family
(402 → 418, 100%), and an export with no page FAILS `check:docs` instead of
being printed and waved through. Two stale cross-renderer claims were fixed by
the same work: native `Combobox` and native `Kbd` exist (shipped, contract
rows in `docs/parity-contract.md`), so web's `nativePeer: "none"` on both was
wrong and is now the peer name.

## What the 16 orphans got

| Export | Disposition |
|---|---|
| web `CardActions` `CardContent` `CardHeader` | claimed by the card family (`parts` + anatomy rows); card API already documents `as`/`variant`/`className` |
| mobile `CardActions` `CardContent` `CardHeader` | same, on the mobile card page; `notSupported` corrected — the parts exist, so "no slots" was false |
| web `RichTooltip` | claimed by the rich-tooltip family as the namespace object (the `Combobox` precedent) |
| mobile `ExpressiveShape` | claimed by the shape-art family |
| mobile `TopAppBarToggle` | claimed by the top-app-bar family; `open`/`onToggle` API rows added (name says what the press does; `expanded` mirrors `open`) |
| web `FocusRing` | new page: the `FOCUS_RING_CLASS` wrapper, 3px secondary ring (`FOCUS_RING_WIDTH_PX`/`_COLOR_ROLE`/`_OFFSET_PX` verified in `packages/kern-tokens/src/focus.ts`), web-only (`nativePeer: "none"` — no focus ring on touch) |
| web `LinkButton` | new page: the `Button` bridge, `href` required, no `asChild`, `iconPosition="end"` ignored with a dev warning (verified in source); level 0 with a K11 deviation row |
| web `SelectGroup` | new page: `role="group"` named by `SelectGroupLabel` (verified in `@base-ui/react/select/group`), presentation only — the select owns the value |
| mobile `Combobox` | new page: read-only trigger + popup with the filter field inside, `expanded` on the trigger, popup renders level 2 (3dp, verified) with a K6 deviation row; web `combobox` `nativePeer` flipped to `Combobox` |
| mobile `Kbd` | new page: monospace static text (`accessibilityRole="text"`), caller-composed chords; web `kbd` `nativePeer` flipped to `Kbd` |
| mobile `SettingsRow` | new page: label + supporting (`numberOfLines` 1/2) + trailing control, `accessibilityRole="summary"`, not pressable |
| mobile `StatusBar` | new page: centered status (`minHeight` 32, `surfaceContainer`, outlineVariant top rule), `summary` landmark, string child labels the center |

Every claim above was read out of the implementation before writing, not from
memory. One error of that kind was caught and fixed in review: the mobile card
anatomy originally said the action row is "announced as the set they are" —
native `CardActions` ships `accessibilityRole="none"` (each control announces
itself), and the row now says so.

## The gate flip + test (fail-before / pass-after)

`apps/site/scripts/check-docs.mjs`: each orphan is now pushed into `errors`
(the script already `process.exit(1)`s on `errors.length > 0`); the per-platform
listing is kept so the empty list is still shown.

`apps/site/scripts/check-docs.test.mjs` (new, wired into the `check:docs`
chain) pins both halves: zero debt passes, and hiding a page makes the run
exit 1 with the orphan named. Real output:

Before (base content + the flipped gate — the test fails, exit 1):

```
Expected: 418
Received: 402
(fail) check-docs orphan gate > every inventory export has a documenting family [1876.92ms]
(fail) check-docs orphan gate > an export with no documenting family fails the run, not just reports [2.20ms]
 0 pass  2 fail
```

Before-before (base gate, report-only — for the record, captured pre-flip):

```
check-docs: coverage 402/418 inventory exports documented (96%)
check-docs: web — 7 undocumented export(s) remaining
check-docs: mobile — 9 undocumented export(s) remaining
(exit 0 — the state this PR ends)
```

After (this branch):

```
check-docs: coverage 418/418 inventory exports documented (100%)
check-docs: ok
 2 pass  0 fail
```

## Commands + real output

```
$ cd apps/site && node scripts/check-docs.mjs
check-docs: coverage 418/418 inventory exports documented (100%)
check-docs: ok

$ bun test scripts/check-docs.test.mjs
 2 pass  0 fail   (6 expect() calls)

$ bun run typecheck            # apps/site
check-dist-types: ok — 6 consumed package(s) have type declarations
(tsc --noEmit: no output, exit 0)

$ bun run check:docs           # apps/site — full chain
... check-docs: ok; check-docs.test.mjs 2 pass 0 fail; check-spec-urls 221 pages;
    check-typescale: 227 off-scale reported (report-only on this base — gate 3);
    check-primitives-docs passes; check-search passes; check-examples ok (14);
    check-tokens ok (327 names); check-markdown ok; check-llms ok (248 links);
    check-seo ok (211 pages metadata); check-blocks ok (3);
    check-gallery ok (demo-less reported, 3 web + 56 mobile, report-only by design);
    check-a11y ok (204); check-grammar ok (204); check-page-md ok (212);
    check-mcp-index ok (212)
  ... BUT the chain dies at scripts/lib/extract-prop-names.test.mjs:
  (fail) collectTypeSymbols > union member-only props are collected [8985.45ms]
  (fail) collectTypeSymbols > intersection members are still collected [6045.23ms]
    ^ this test timed out after 5000ms.

$ uptime
load average: 26,84, 29,35, 26,38   # 8 cores, box 3x oversubscribed
$ bun test scripts/lib/extract-prop-names.test.mjs   # load dipped
 5 pass  0 fail
```

The `extract-prop-names` timeouts are the documented pre-existing flake (5s
budget vs a cold TS program; also fails on unmodified main under load — see
the session record). Because the chain stops there, everything after it was
run as the chain tail, one command after another, all green:

```
$ { node scripts/check-props.mjs && bun scripts/check-nav.mjs && node scripts/check-component-nav.mjs &&
     bun scripts/check-primitives-docs.mjs && node scripts/check-focus-trap.mjs && bun scripts/check-search.mjs &&
     bun ... check-examples.mjs && bun scripts/check-tokens.mjs && bun scripts/check-markdown.mjs &&
     bun ... check-llms.mjs && bun ... check-seo.mjs && bun ... check-configurators.mjs &&
     node scripts/check-blocks.mjs && bun test src/theme-studio/studio-state.test.ts &&
     bun ... check-gallery.mjs && bun ... check-a11y.mjs && node scripts/check-grammar.mjs &&
     bun ... check-page-md.mjs && bun ... check-mcp-index.mjs; }
TAIL_EXIT=0
```

```
$ bun run check:snippets              # apps/site
check-snippets: 19 TypeScript snippets compile, 9 non-standalone skipped

$ ./node_modules/.bin/biome check .   # repo root
Checked 1257 files in 15s. No fixes applied.

$ bun run check:generated             # repo root (after bun run generate in apps/site)
generated output is fresh: 19 generators, 24 derived files byte-match a fresh run

$ bun run check:generated:census
generated-artifact census passes: 54 tracked file(s) ... 19 generators / 24 output path(s), all present.

$ KERN_TEAM_ROOT=/home/novexo/Desktop/Business/xoroh-monorepo/.team bun run check:elevation-parity
parity holds: both renderers agree per component, the registry matches the
code, and every deviation id resolves to a registered reason.
```

(`bun run icons:sync` was needed first in this fresh worktree — empty icons
catalog crashes the icons generator, same as every fresh worktree; it produced
no tracked-file diff.)

## Acceptance

1. ✅ Coverage 418/418 printed by the real gate, and an export with no page
   exits 1 with its name (both test directions captured above).
2. ✅ No consumer regression: full `check:docs` chain + tail, snippets,
   elevation-parity, freshness, census, lint, typecheck all green.
3. ✅ Test fails before (402/418 + missing fixture page) and passes after
   (2 pass), captured from both states.

## What's still weak (honest)

- The new pages carry no live demos (they join the reported demo-less lists —
  3 web, 56 mobile; `check-gallery` reports, never thresholds, by design).
- `extract-prop-names.test.mjs` still flakes under load; it is untouched by
  this diff and predates it. A raise of its 5s budget belongs to whoever owns
  that file — this PR does not weaken it.
- This branch is cut from main @ `937e8730`, i.e. before #61's
  `kern-material-3 → kern-m3` hard rename; the owner-side merge order is
  #59 → #61 → #60 → this PR, and conflict resolution follows that order.

## Gaps for other leads

- Gate 2 (920 undocumented generated props rows, `check-props` coverage-debt)
  is next and untouched here.
- Gate 3 (227 off-scale type utilities) is taken by PR #59 per the 06:45 CEST
  coordination note — skipped here, `check-typescale` left as-is.

## Suggested next item

Gate 2: burn the `check-props` coverage debt to zero and flip its ratchet to
fail, same pattern as this PR.
