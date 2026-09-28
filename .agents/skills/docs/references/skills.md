# Skills

How to author and maintain skills (including this one).

- `SKILL.md` stays a router (<150 lines): frontmatter with trigger
  phrases, decision tree, pointers. Detail lives in `references/`.
- Frontmatter `description` must say **when to use** the skill — that's
  how agents discover it. One skill per topic area; split detail into
  reference files, never into a second skill for the same topic.
- After editing any skill, re-verify: grep for stale paths and check
  relative links resolve.
- Porting from private sources: sweep for leaks first
  (`xoroh-platform`, `libs/kern`, internal product names, mailboxes,
  backend domains). If in doubt, generalize or drop it.
