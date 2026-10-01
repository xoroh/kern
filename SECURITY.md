# Security Policy

Status: current

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| Latest `0.x` release | :white_check_mark: |
| Earlier releases | :x: |

Kern is pre-1.0. Security fixes target the latest published release; there
are no backport guarantees for older versions. Upgrade to the latest `0.x`
release of **every** `@xoroh/*` package you depend on before reporting a
vulnerability — the six packages version independently.

## Reporting a vulnerability

Report privately via **GitHub Security Advisories**
(Security tab → Report a vulnerability) on the affected repo. Include:

- Affected package and version (`@xoroh/kern`, `@xoroh/kern-tokens`,
  `@xoroh/kern-native`, `@xoroh/kern-icons`, `@xoroh/kern/start`,
  `@xoroh/kern-mcp`)
- Platform and runtime (web / React Native, React version, bundler)
- Steps to reproduce and impact assessment
- Whether the issue is reachable from untrusted input

Expect acknowledgment within 72 hours. Do not open public issues for
unpatched vulnerabilities.

## What matters here

Kern is a design system: a component library, a token pipeline, and a
documentation site. It holds no user data and talks to no backend, so the
realistic risk surface is narrow:

- **Style injection.** A component that interpolated untrusted input into a
  class name or inline style could escape its token binding. Kern binds
  styling to token roles (`--md-sys-*`) rather than to caller strings;
  report anything that reintroduces raw caller-controlled styling.
- **The MCP server** (`@xoroh/kern-mcp`) is a node process that reads files
  under `KERN_REPO_ROOT`. Treat it as a local tool, not a service: do not
  expose it on a network interface or point it at a directory another user
  can write to.
- **Dependency compromise** in the small supply chain
  (`@base-ui/react`, `@modelcontextprotocol/sdk`, `zod`,
  `@fontsource-variable/inter`) — report upstream first, then notify us so we
  can bump and re-release.
- **The site** (kern.xoroh.org) is static output. Anything that would let a
  visitor inject script or content into another visitor's page is in scope.

## Out of scope

- Vulnerabilities in upstream dependencies with no Kern-specific
  amplification — report upstream.
- Findings that require a consumer to deliberately pass attacker-controlled
  data through an unsafe-HTML path.
- Denial of service from a pathological token or theme value in a
  consumer's own build configuration.
- Missing hardening headers on a consumer's deployment — Kern ships a static
  site, not a server.

## Disclosure

We ask for 90 days before public disclosure, coordinated with a fix in the
latest `0.x`. Credit is given in the advisory unless you prefer otherwise.