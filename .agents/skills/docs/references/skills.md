# Skills

Standing upkeep convention. Applies to every skill present or added —
no exceptions, no per-skill variants.

- `SKILL.md` is a router (<150 lines): frontmatter, decision tree,
  pointers. Detail lives in `references/`.
- Frontmatter carries `name`, `description` (what + when), and
  `license: MIT`.
- After any edit: `bun x skills-ref validate ./.agents/skills/<name>`,
  grep stale paths, check relative links.
- Porting from private sources: sweep leaks first
  (`xoroh-platform`, `libs/kern`, product names, mailboxes, domains).
  Generalize or drop.
