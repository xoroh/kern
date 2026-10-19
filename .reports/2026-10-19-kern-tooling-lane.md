# Tooling lane report — `2026-10-19-kern-tooling-lane`

## Job 1 — deploy.yml workflow_dispatch-only

- Outcome: done. Production deploys no longer trigger on push to main; only explicit `workflow_dispatch`.
- PR: https://github.com/xoroh/kern/pull/75 (squash-merged, branch deleted)
- Commands + real output:
  - `git worktree add ../kern-tooling -b chore/deploy-manual-only origin/main` → HEAD at `b1393a38`.
  - Edit `.github/workflows/deploy.yml`: removed the 3-line `push: branches: [main]` trigger; `on:` now lists only `workflow_dispatch:`. No deploy run, cancelled, or approved.
  - `gh pr checks 75` → 14/14 pass (apps, cold-install, dist-gates, e2e, gates, 9× pkg).
  - `gh pr view 75 --json mergeable,mergeStateStatus` → `MERGEABLE` / `CLEAN` before merge.
  - `gh pr merge 75 --squash --delete-branch` (Kern Lead delegates routine merges to this lane).
- Acceptance: pass — workflow file shows only `workflow_dispatch`; CI green.
- Still weak: nothing; 3-line deletion, no behavior except trigger removal.
- Next item: Job 2 (F-02 site-manifest generator formatting).
