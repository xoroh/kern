# Documentations

Where each change type goes. One rule above all: no detail in
`AGENTS.md` / `README.md` — one-line pointers only.

```
Code/behavior/token change  → apps/docs/ component page (+ llms content later)
                              + changeset if packages/ changed
Design-canonical knowledge  → skills/kern/ (+ references/)
Agent process knowledge     → skills/docs/ (this skill)
Repo process/decisions      → docs/ (+ ADRs for why)
```

- Product docs (`apps/docs/`) are written for users, human and AI.
- Contributor docs (`docs/`) are written for people working in this repo.
- Agent knowledge (`skills/`) is written for agents; humans may read it
  but never duplicate it elsewhere — link instead.
