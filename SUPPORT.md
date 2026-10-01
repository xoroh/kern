# Support

Status: current

Kern is maintained in the open. This page says where to ask and what to
expect.

## Before you ask

Most questions are already answered:

| Question | Where |
| --- | --- |
| How do I install and use a component? | <https://kern.xoroh.org/getting-started>, and each package's README |
| What components exist? | <https://kern.xoroh.org/components> — the same data is generated into [`docs/components.md`](docs/components.md) |
| How do web and native differ? | [`docs/platform-parity.md`](docs/platform-parity.md) |
| Why is it built this way? | [`docs/architecture.md`](docs/architecture.md) and [`docs/adr/`](docs/adr/) |
| How do I contribute? | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| Why was X removed? | [`docs/plan/README.md`](docs/plan/README.md) — hard cuts are recorded there |
| Which version is stable? | <https://www.npmjs.com/package/@xoroh/kern> — Kern is pre-1.0; track latest |

## Asking a question

Open a discussion or an issue on
<https://github.com/xoroh/kern>. A question that turns into a documentation
gap is a bug in the docs — say so and it will be fixed rather than answered
once.

Include:

- the package and version (`bun pm ls | grep @xoroh`);
- the platform (web or React Native) and its version;
- a minimal reproduction — a component tree is better than a description;
- what you expected and what happened.

**AI agents:** read [`docs/`](docs/README.md) and
[`.agents/skills/kern/`](.agents/skills/kern/) first, and
[`@xoroh/kern-mcp`](packages/mcp/README.md) if your host supports MCP. It
lists components with real/stub status, returns component source and tokens,
and runs a design audit. Asking an agent to guess when the registry can
answer produces a wrong answer, not a fast one.

## Reporting a bug

Use the repository templates in `.github/ISSUE_TEMPLATE/`.

A useful report has a reproduction that fails for someone else. "The theme
toggle does not work" is not reproducible; "clicking `ThemeToggle` in an
`AppShell` with `variant="m3"` leaves the page in light mode after a dark
OS setting" is.

## Version support

| Version | Supported |
| --- | --- |
| Latest published `0.x` | yes |
| Any earlier `0.x` | no |

Kern is pre-1.0. Security fixes target the latest release only; there are no
backports. Upgrade to the latest `0.x` before reporting a problem — the most
common cause of a "bug" is a version mismatch between the packages.

All six published packages version independently. If you see a behavior that
disagrees with the docs, run `bun x changeset status` and check that every
`@xoroh/*` dependency resolved to the version you expect. Mixed versions are
supported in principle (peer ranges are permissive) but not a supported
configuration to debug against.

## Security issues

Do not open a public issue. Follow [`SECURITY.md`](SECURITY.md) and report
through GitHub Security Advisories.

## Conduct

[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) applies in issues, pull requests,
and discussions.