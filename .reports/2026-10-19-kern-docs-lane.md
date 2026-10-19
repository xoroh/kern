# Lane report — 2026-10-19-kern-docs-lane

## Outcome (running)
- Job 1 (roadmap item 2, docs gate 2): burn 924 → 0 undocumented generated props, then flip gate to failing.
- Job 2 (roadmap item 3, decision 013): top-20 list + thin-page contract as a gate-checked file.

## Discoveries (verify before each PR)
- `main` @ `b1393a38`, clean, 0 open PRs. nocompat worktree exists (`feat/nocompat-button-aliases`) with NO commits yet — button/loading-button/link-button files stay untouched until its alias-removal PR merges.
- `check-props.mjs`: stale rows (471 = baseline, must not grow, enforced) vs uncovered (924 reported, not failing). Gate compares GENERATED names vs content `api` names in `apps/site/src/content/web/*.ts`.
- Every `api` row in a family file attributes to EVERY part in that file. Measured: only 196 of 670 missing (family,name) pairs are safely addable unscoped; 474 are part-specific (e.g. `nativeButton` on Trigger only) and would grow stale if added raw. So job 1 NEEDS gate scoping first (`for:` row field, render already merges per-part by name so no render change).
- 855/924 missing have GEN notes (Base UI JSDoc, authoritative for passthrough); 69 lack notes (mostly `children`/`id`/structural + ~25 local kern props needing source reads).
- Batches (921 props, button.ts 3 excluded): B1 command/combobox/autocomplete 157; B2 menubar/menu/context-menu/navigation-menu 127; B3 country-select/select/slider/tabs/radio-group/switch/checkbox 152; B4 drawer/dialog/alert-dialog/popover/sheet/tooltip 163; B5 accordion/field/number-field/sonner/snackbar/checkbox-group/input-otp/preview-card/icon-button/segmented-button/toolbar/avatar/collapsible 191; B6 rest 131.

## PR log
| PR | What | SHA | Checks | Result |
|---|---|---|---|---|
| gate-scope | `for:` scoped attribution in check-props + lib + test (5 tests), PropRow.for, grammar note | — | build ok; site typecheck ok (after CI-style route regen; routes failures pre-existing at baseline); biome clean; full check:docs chain green (mcp-index needed CI-style pre-gen); test:scripts 32 pass; check-props output byte-identical (471/924) | MERGED #76 (091a705d) |
| batch-1 | command/combobox/autocomplete content (157 props: 924→767), 2 JSDoc + carried notes, parser balanced-scan fix + regression test | — | root build ok; kern + site typecheck ok; repo lint clean; full check:docs chain exit 0 (twice: pre- and post-merge); checkApiUnique forced single-row-per-name (per-part rows collapsed); merged origin/main #77 (biome helper reformat — one conflict hunk in props.ts, resolved to new style + my notes, regen-verified byte-identical) | MERGED #79 (03c5a476) |
| batch-2 | menubar/menu/context-menu/navigation-menu content (127 props: 767→640) | MERGED #80 (55a159b6) | site typecheck ok; full check:docs chain exit 0; checkApiUnique single-row rule held (combined orientation/value-style notes) | MERGED #80 |
| batch-3 | country-select/select/slider/tabs/radio-group/switch/checkbox content (152 props: 640→488) | — | site typecheck ok; full check:docs chain exit 0; no-values rule forced 2 rewords (px literals) | ready to open |
