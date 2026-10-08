# Kern starter (scaffolded by `kern init`, kern __KERN_VERSION__)

A working first run: install, start the dev server, and the themed screen is
at `http://localhost:3000` — preset picker (kern / sharp / brand / demo
tenant) plus the light/dark axis.

```sh
bun install
bun run dev
```

## Where the dependencies come from

Kern is `__KERN_VERSION__` and **unpublished**: the registry names
(`@xoroh/kern`, `@xoroh/kern-tokens`) resolve only after the first publish,
so this scaffold points both at your checkout with `file:` dependencies (see
`package.json`). That is the dogfood path, not a forever decision — at
publish, swap the two `file:` entries for the published version and delete
this section.

Everything else (`react`, `vite`, `tailwindcss`) installs from the registry
today. Tailwind v4 is required, not decorative: Kern components are styled
with utility classes, and the token stylesheet only supplies the values those
classes read.

## Next steps (never executed for you)

- `kern add <component>` (run from the kern checkout with
  `KERN_WORKSPACE` set, or from this app once the CLI is published) vendors
  one more component plus its closure into `components/kern`.
- `kern add <component> --self-contained` additionally vendors the token CSS
  snapshot — the eject path for owning your values.
- `kern.receipt.json` records the kern version this scaffold was stamped
  from. `kern list` / `kern diff` / `kern upgrade` read it when they ship;
  until then it is the audit trail, and mixing versions in one destination is
  refused.
