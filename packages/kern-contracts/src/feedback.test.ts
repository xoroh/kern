import { describe, expect, test } from "vitest";
import {
  defineFeedback,
  FEEDBACK_SCHEMA_VERSION,
  type FeedbackReport,
} from "./feedback";

const report = (over: Partial<FeedbackReport> = {}): FeedbackReport => ({
  schemaVersion: FEEDBACK_SCHEMA_VERSION,
  category: "bug",
  title: "Switch track ignores the comp override on native",
  description: "Setting --comp-switch-track-shape changes web but not native.",
  consent: false,
  ...over,
});

describe("feedback", () => {
  test("a minimal report validates", () => {
    expect(defineFeedback(report()).category).toBe("bug");
  });

  test("a full report with consented evidence validates", () => {
    const full = defineFeedback(
      report({
        category: "improvement",
        component: "switch",
        preset: "material-3",
        renderer: "native",
        framework: "expo",
        package: "@xoroh/kern-native",
        packageVersion: "0.0.0",
        cliVersion: "0.0.0",
        steps: "1. Set the variable 2. Observe",
        evidence: "borderRadius stayed 9999",
        consent: true,
      }),
    );
    expect(full.renderer).toBe("native");
  });

  test("unknown category fails", () => {
    expect(() => defineFeedback(report({ category: "rant" as never }))).toThrow(
      "category",
    );
  });

  test("blank title and description fail", () => {
    expect(() => defineFeedback(report({ title: "  " }))).toThrow("title");
    expect(() => defineFeedback(report({ description: "" }))).toThrow(
      "description",
    );
  });

  test("evidence without consent fails — the privacy gate", () => {
    expect(() =>
      defineFeedback(report({ evidence: "log snippet", consent: false })),
    ).toThrow("consent");
  });

  test("oversize fields fail instead of silently truncating", () => {
    expect(() => defineFeedback(report({ title: "x".repeat(201) }))).toThrow(
      "exceeds",
    );
    expect(() =>
      defineFeedback(report({ description: "x".repeat(8001) })),
    ).toThrow("exceeds");
  });

  test("bad renderer and non-boolean consent fail", () => {
    expect(() => defineFeedback(report({ renderer: "all" as never }))).toThrow(
      "renderer",
    );
    expect(() => defineFeedback(report({ consent: "yes" as never }))).toThrow(
      "consent",
    );
  });

  test("wrong schema version fails", () => {
    expect(() =>
      defineFeedback(report({ schemaVersion: "9" as never })),
    ).toThrow("schemaVersion");
  });
});
