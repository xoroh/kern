import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  digestFeedback,
  disclosure,
  feedbackId,
  issueUrl,
  pruneFeedback,
  readInbox,
  submitFeedback,
} from "./feedback";

function freshCwd(): string {
  return mkdtempSync(join(tmpdir(), "kern-feedback-"));
}

const valid = {
  category: "bug",
  title: "Switch track ignores the comp override on native",
  description: "Setting the variable changes web but not native.",
};

describe("kern feedback (F1 intake)", () => {
  it("validates, discloses, and stores a report with a stable id", () => {
    const cwd = freshCwd();
    try {
      const r = submitFeedback(valid, { cwd });
      expect(r.duplicate).toBe(false);
      expect(r.id).toBe(feedbackId(r.report));
      expect(existsSync(join(cwd, ".kern", "feedback", `${r.id}.json`))).toBe(
        true,
      );
      const text = disclosure(r.report, join(cwd, ".kern", "feedback"));
      expect(text).toContain("nothing sent anywhere automatically");
      expect(text).toContain("evidence: none");
      expect(issueUrl(r.report)).toContain("issues/new");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("dry-run writes nothing", () => {
    const cwd = freshCwd();
    try {
      const r = submitFeedback(valid, { cwd, dryRun: true });
      expect(existsSync(join(cwd, ".kern"))).toBe(false);
      expect(r.id).toBe(feedbackId(r.report));
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("rejects malformed reports without writing", () => {
    const cwd = freshCwd();
    try {
      expect(() =>
        submitFeedback({ ...valid, category: "rant" }, { cwd }),
      ).toThrow("category");
      expect(() => submitFeedback({ ...valid, title: "  " }, { cwd })).toThrow(
        "title",
      );
      // Evidence without consent is refused, never stored silently.
      expect(() =>
        submitFeedback({ ...valid, evidence: "log snippet" }, { cwd }),
      ).toThrow("consent");
      expect(readInbox(cwd)).toEqual([]);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("converges duplicates instead of multiplying them", () => {
    const cwd = freshCwd();
    try {
      const first = submitFeedback(valid, { cwd });
      const second = submitFeedback(
        { ...valid, title: `  ${valid.title.toUpperCase()}  ` },
        { cwd },
      );
      expect(second.duplicate).toBe(true);
      expect(second.id).toBe(first.id);
      expect(readInbox(cwd)).toHaveLength(1);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("digests group with evidence ids for human triage", () => {
    const cwd = freshCwd();
    try {
      const a = submitFeedback(valid, { cwd });
      const b = submitFeedback(
        {
          category: "improvement",
          title: "Document the pm flag",
          description: "README omits pnpm/yarn spellings.",
          component: "cli",
          evidence: "README excerpt",
          consent: true,
        },
        { cwd },
      );
      const digest = digestFeedback(cwd);
      expect(digest).toContain("## bug (1)");
      expect(digest).toContain("## improvement (1)");
      expect(digest).toContain(`[${a.id}]`);
      expect(digest).toContain(`[${b.id}]`);
      expect(digest).toContain("+evidence");
      expect(digest).toContain("manually");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("refuses to skip corrupt inbox entries", () => {
    const cwd = freshCwd();
    try {
      submitFeedback(valid, { cwd });
      const dir = join(cwd, ".kern", "feedback");
      const { writeFileSync } = require("node:fs") as typeof import("node:fs");
      writeFileSync(join(dir, "broken.json"), "{not json");
      expect(() => readInbox(cwd)).toThrow("corrupt");
      expect(() => digestFeedback(cwd)).toThrow("corrupt");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("prunes entries past retention and keeps the rest", () => {
    const cwd = freshCwd();
    try {
      const fresh = submitFeedback(valid, { cwd });
      const old = submitFeedback(
        { ...valid, title: "Ancient report with a different title" },
        { cwd },
      );
      // Backdate the old entry past the 90-day default.
      const dir = join(cwd, ".kern", "feedback");
      const path = join(dir, `${old.id}.json`);
      const raw = JSON.parse(readFileSync(path, "utf8"));
      raw.receivedAt = new Date(Date.now() - 100 * 86_400_000).toISOString();
      const { writeFileSync } = require("node:fs") as typeof import("node:fs");
      writeFileSync(path, `${JSON.stringify(raw, null, 2)}\n`);
      const pruned = pruneFeedback(cwd);
      expect(pruned).toEqual([old.id]);
      expect(readInbox(cwd).map((r) => r.id)).toEqual([fresh.id]);
      // Invalid retention is refused, not silently coerced.
      expect(() => pruneFeedback(cwd, -1)).toThrow("retention");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});
