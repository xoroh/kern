/**
 * Feedback records (F1) — shared, versioned, transport-agnostic.
 *
 * Preview decisions (owner default, §14.8): GitHub Issue Form transport,
 * CLI-only submission, and 90-day local retention. This package contains only
 * the shared schema and validator; persistence and the human-filed issue URL
 * live in the CLI. Nothing here transmits anything: validation is pure, and
 * evidence handling follows the consent rule below.
 *
 * Privacy rules (non-negotiable, §14.5):
 * - `evidence` (snippets/attachments) requires `consent: true`. Without
 *   consent the report must omit evidence — the validator refuses it.
 * - Environment fields are optional and omitted when unknown, never guessed.
 * - All strings are length-bounded; the report is data, never executed.
 */

export const FEEDBACK_SCHEMA_VERSION = "1.0.0" as const;

export type FeedbackCategory =
  | "bug"
  | "improvement"
  | "docs"
  | "compatibility"
  | "discovery";

const CATEGORIES: FeedbackCategory[] = [
  "bug",
  "improvement",
  "docs",
  "compatibility",
  "discovery",
];

export type FeedbackReport = {
  schemaVersion: typeof FEEDBACK_SCHEMA_VERSION;
  category: FeedbackCategory;
  title: string;
  description: string;
  component?: string;
  block?: string;
  preset?: string;
  renderer?: "web" | "native" | "both";
  framework?: string;
  package?: string;
  packageVersion?: string;
  cliVersion?: string;
  steps?: string;
  /** Snippets/attachments — only with `consent: true`. */
  evidence?: string;
  consent: boolean;
};

const MAX_TITLE = 200;
const MAX_DESCRIPTION = 8000;
const MAX_FIELD = 500;

function fail(what: string): never {
  throw new Error(`Invalid FeedbackReport: ${what}`);
}

function bounded(
  value: unknown,
  max: number,
  what: string,
  required: boolean,
): void {
  if (value === undefined) {
    if (required) fail(`${what} is missing`);
    return;
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    fail(`${what} is blank`);
  }
  if ((value as string).length > max) fail(`${what} exceeds ${max} chars`);
}

/** Fail-loud validation for a feedback report. Returns the report. */
export function defineFeedback(report: FeedbackReport): FeedbackReport {
  if (report.schemaVersion !== FEEDBACK_SCHEMA_VERSION) {
    fail(`schemaVersion is ${report.schemaVersion}`);
  }
  if (!CATEGORIES.includes(report.category)) {
    fail(`category is ${report.category}`);
  }
  bounded(report.title, MAX_TITLE, "title", true);
  bounded(report.description, MAX_DESCRIPTION, "description", true);
  for (const [key, value] of Object.entries({
    component: report.component,
    block: report.block,
    preset: report.preset,
    framework: report.framework,
    package: report.package,
    packageVersion: report.packageVersion,
    cliVersion: report.cliVersion,
    steps: report.steps,
  })) {
    bounded(value, MAX_FIELD, key, false);
  }
  if (
    report.renderer !== undefined &&
    !["web", "native", "both"].includes(report.renderer)
  ) {
    fail(`renderer is ${report.renderer}`);
  }
  if (typeof report.consent !== "boolean") fail("consent is not a boolean");
  if (report.evidence !== undefined) {
    if (!report.consent) {
      fail("evidence without consent — omit evidence or set consent: true");
    }
    bounded(report.evidence, MAX_DESCRIPTION, "evidence", true);
  }
  return report;
}
