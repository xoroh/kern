# ADR-005: EmDash as first platform adapter

Status: accepted
Date: 2026-09-28

## Context

Users live on WordPress and EmDash (Cloudflare's Astro + TypeScript CMS).
WordPress needs a Gutenberg-blocks plugin (PHP shell); EmDash renders
React natively in Astro themes.

## Decision

Ship `@xoroh/kern-emdash` (Astro integration + block plugin) first;
WordPress blocks second; headless-WP export via Studio later.

## Consequences

- Fastest path to a live CMS story on a TS-native stack.
- Adapter must be re-verified against each EmDash `0.1.x` minor (beta).
