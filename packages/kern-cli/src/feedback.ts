/**
 * `kern feedback` — Preview feedback intake, inbox, and digest (F1).
 *
 * Transport decision (owner): GitHub Issue Form (`.github/ISSUE_TEMPLATE/
 * kern-feedback.yml`), CLI-only scope, 90-day local retention. No hosted
 * service, no database, no network calls: the CLI validates, discloses,
 * stores locally, and prints a pre-filled issue URL the human files by hand.
 * The current digest is deterministic; it does not invoke AI. Any future AI
 * assistance must remain advisory, evidence-linked, and human-reviewed.
 *
 * Privacy: `defineFeedback` bounds every field and refuses evidence without
 * `consent: true`. The inbox holds exactly the validated report plus receipt
 * metadata (id, received-at); nothing else is collected. Retention:
 * `pruneFeedback` deletes entries older than the given days (default 90);
 * deletion is explicit and tested.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import {
  defineFeedback,
  FEEDBACK_SCHEMA_VERSION,
  type FeedbackCategory,
  type FeedbackReport,
} from "@xoroh/kern-contracts";

export const FEEDBACK_RETENTION_DAYS = 90;

export type FeedbackInput = {
  category: string;
  title: string;
  description: string;
  component?: string;
  block?: string;
  preset?: string;
  renderer?: string;
  framework?: string;
  steps?: string;
  evidence?: string;
  consent?: boolean;
};

export type FeedbackReceipt = {
  id: string;
  receivedAt: string;
  duplicate: boolean;
  report: FeedbackReport;
};

export type SubmitOptions = {
  /** Project dir the inbox lives under. Default: process.cwd(). */
  cwd?: string;
  /** Validate + disclose without writing anything. */
  dryRun?: boolean;
};

function fail(msg: string): never {
  throw new Error(`kern feedback: ${msg}`);
}

/** Stable id from the report content (duplicates converge, not multiply). */
export function feedbackId(report: FeedbackReport): string {
  const canonical = JSON.stringify({
    category: report.category,
    title: report.title.trim().toLowerCase(),
    description: report.description.trim(),
    component: report.component ?? "",
  });
  let hash = 0;
  for (let i = 0; i < canonical.length; i++) {
    hash = (Math.imul(hash, 31) + canonical.charCodeAt(i)) | 0;
  }
  return `fb-${Math.abs(hash).toString(36)}`;
}

function inboxDir(cwd: string): string {
  return join(cwd, ".kern", "feedback");
}

/** What will be stored and where — printed before every submission. */
export function disclosure(report: FeedbackReport, dir: string): string {
  const lines = [
    "feedback disclosure (nothing sent anywhere automatically):",
    `  id: ${feedbackId(report)}`,
    `  category: ${report.category}`,
    `  title: ${report.title}`,
    `  description: ${report.description.length} chars`,
  ];
  for (const [key, value] of Object.entries({
    component: report.component,
    block: report.block,
    preset: report.preset,
    renderer: report.renderer,
    framework: report.framework,
    steps: report.steps,
  })) {
    if (value !== undefined) lines.push(`  ${key}: ${value}`);
  }
  lines.push(
    report.evidence !== undefined
      ? `  evidence: ${report.evidence.length} chars (consented)`
      : "  evidence: none",
  );
  lines.push(`  inbox: ${join(dir, `${feedbackId(report)}.json`)}`);
  lines.push(`  transport: file it yourself — ${issueUrl(report)}`);
  return lines.join("\n");
}

/** Pre-filled GitHub issue URL for the human to file (never opened by us). */
export function issueUrl(report: FeedbackReport): string {
  const params = new URLSearchParams({
    template: "kern-feedback.yml",
    title: `[${report.category}] ${report.title}`,
    body: [
      `Category: ${report.category}`,
      report.component ? `Component: ${report.component}` : "",
      `Description: ${report.description}`,
      report.steps ? `Steps: ${report.steps}` : "",
      report.evidence ? `Evidence: ${report.evidence}` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
  });
  return `https://github.com/xoroh/kern/issues/new?${params.toString()}`;
}

export function submitFeedback(
  input: FeedbackInput,
  opts: SubmitOptions = {},
): FeedbackReceipt {
  const cwd = opts.cwd ?? process.cwd();
  const report = defineFeedback({
    schemaVersion: FEEDBACK_SCHEMA_VERSION,
    category: input.category as FeedbackCategory,
    title: input.title,
    description: input.description,
    component: input.component,
    block: input.block,
    preset: input.preset,
    renderer: input.renderer as FeedbackReport["renderer"],
    framework: input.framework,
    steps: input.steps,
    evidence: input.evidence,
    consent: input.consent ?? false,
  });
  const dir = inboxDir(cwd);
  const id = feedbackId(report);
  const receivedAt = new Date().toISOString();
  if (opts.dryRun) {
    return { id, receivedAt, duplicate: false, report };
  }
  mkdirSync(dir, { recursive: true });
  const path = join(dir, `${id}.json`);
  const duplicate = existsSync(path);
  if (!duplicate) {
    writeFileSync(
      path,
      `${JSON.stringify({ id, receivedAt, report }, null, 2)}\n`,
    );
  }
  return { id, receivedAt, duplicate, report };
}

export function readInbox(cwd: string): FeedbackReceipt[] {
  const dir = inboxDir(cwd);
  if (!existsSync(dir)) return [];
  const out: FeedbackReceipt[] = [];
  for (const entry of readdirSync(dir).sort()) {
    if (!entry.endsWith(".json")) continue;
    try {
      const raw = JSON.parse(readFileSync(join(dir, entry), "utf8"));
      defineFeedback(raw.report);
      out.push(raw as FeedbackReceipt);
    } catch {
      // A hand-edited or partial file never silently vanishes: surface it.
      throw new Error(
        `kern feedback: inbox entry ${entry} is corrupt — fix or delete it, digest refuses to skip evidence.`,
      );
    }
  }
  return out;
}

/**
 * Maintainer digest: counts by category, then component, with report ids as
 * evidence links back to inbox files. Advisory only — grouping is
 * transparent (exact normalized-title match) and every line traces to an id.
 */
export function digestFeedback(cwd: string): string {
  const entries = readInbox(cwd);
  const lines = [
    `# Feedback digest (${entries.length} report${entries.length === 1 ? "" : "s"})`,
    "",
    "Advisory grouping for human triage — open, prioritize, and decide manually.",
    "",
  ];
  const byCategory = new Map<string, FeedbackReceipt[]>();
  for (const e of entries) {
    const list = byCategory.get(e.report.category) ?? [];
    list.push(e);
    byCategory.set(e.report.category, list);
  }
  for (const category of [...byCategory.keys()].sort()) {
    const list = byCategory.get(category) as FeedbackReceipt[];
    lines.push(`## ${category} (${list.length})`, "");
    const byComponent = new Map<string, FeedbackReceipt[]>();
    for (const e of list) {
      const key = e.report.component ?? "(no component)";
      const l = byComponent.get(key) ?? [];
      l.push(e);
      byComponent.set(key, l);
    }
    for (const component of [...byComponent.keys()].sort()) {
      lines.push(`### ${component}`);
      for (const e of byComponent.get(component) as FeedbackReceipt[]) {
        lines.push(
          `- [${e.id}] ${e.report.title} (received ${e.receivedAt})` +
            (e.report.evidence !== undefined ? " +evidence" : ""),
        );
      }
      lines.push("");
    }
  }
  return lines.join("\n");
}

/**
 * Retention: delete inbox entries older than `days` (default 90). Returns
 * the pruned ids. Explicit, tested, and never silent — the caller reports.
 */
export function pruneFeedback(
  cwd: string,
  days: number = FEEDBACK_RETENTION_DAYS,
): string[] {
  if (!Number.isFinite(days) || days < 0) {
    fail(`retention days is ${days} — pass 0 or more.`);
  }
  const dir = inboxDir(cwd);
  if (!existsSync(dir)) return [];
  const cutoff = Date.now() - days * 86_400_000;
  const pruned: string[] = [];
  for (const receipt of readInbox(cwd)) {
    if (new Date(receipt.receivedAt).getTime() < cutoff) {
      rmSync(join(dir, `${receipt.id}.json`));
      pruned.push(receipt.id);
    }
  }
  return pruned;
}
