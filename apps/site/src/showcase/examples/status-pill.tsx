import { StatusPill } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * StatusPill examples — the one tone system on seven registry tones.
 * Container/on-container role pairs, so light/dark/contrast follow the
 * scheme with no conditionals. A status that was `bg-amber-100` is now
 * `tone="warning"`.
 */
export const STATUS_PILL_EXAMPLES: ExampleSpec[] = [
  {
    id: "status-pill-tones",
    title: "Seven tones, one registry",
    description:
      "Every pill is a tone plus a label: dot, label, container roles. The icon slot replaces the dot when an icon carries the meaning.",
    render: () => (
      <div className="flex max-w-xl flex-wrap items-center gap-2">
        <StatusPill tone="success">Active</StatusPill>
        <StatusPill tone="warning">On hold</StatusPill>
        <StatusPill tone="error">Failed</StatusPill>
        <StatusPill tone="info">Scheduled</StatusPill>
        <StatusPill tone="primary">Pinned</StatusPill>
        <StatusPill tone="secondary">Shared</StatusPill>
        <StatusPill tone="neutral">Draft</StatusPill>
      </div>
    ),
    code: `<StatusPill tone="success">Active</StatusPill>
<StatusPill tone="warning">On hold</StatusPill>
<StatusPill tone="error">Failed</StatusPill>
<StatusPill tone="info">Scheduled</StatusPill>
<StatusPill tone="neutral">Draft</StatusPill>`,
  },
  {
    id: "status-pill-density-emphasis",
    title: "Compact density and solid emphasis",
    description:
      "`compact` (24px) fits table status-chip cells; `solid` fills with the tone roles for counts that must read at a glance. Soft is the default.",
    render: () => (
      <div className="flex max-w-xl flex-wrap items-center gap-2">
        <StatusPill tone="success" density="compact">
          Live
        </StatusPill>
        <StatusPill tone="error" density="compact">
          Late
        </StatusPill>
        <StatusPill tone="info" emphasis="solid">
          12 new
        </StatusPill>
      </div>
    ),
    code: `<StatusPill tone="success" density="compact">Live</StatusPill>
<StatusPill tone="info" emphasis="solid">12 new</StatusPill>`,
  },
];
