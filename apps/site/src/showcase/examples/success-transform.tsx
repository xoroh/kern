import { SuccessTransform } from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * Success transform examples — the completion moment.
 *
 * NATIVE-ONLY export: `SuccessTransform` ships in `@xoroh/kern-native` and
 * has no web counterpart to show, so the fence declares the package it
 * imports from — without that, the copyable export would resolve the fence's
 * tags against the web barrel, which exports no `SuccessTransform`, and hand
 * the reader a module that cannot compile.
 *
 * Two states and no more: `loading` is the unmeasured wait, `success` is the
 * outcome. There is no `error` — a failure is a message, not a transform.
 */
export const SUCCESS_TRANSFORM_EXAMPLES: ExampleSpec[] = [
  {
    id: "success-transform-two-moments",
    title: "The wait, and the outcome",
    description:
      "`loading` shows the loader that precedes the completion; `success` is the disc and the tick. The two colours are separate, so the wait and the outcome can be told apart.",
    render: () => (
      <div className="flex items-center gap-8">
        <SuccessTransform state="loading" />
        <SuccessTransform state="success" />
      </div>
    ),
    code: `<SuccessTransform state="loading" />
<SuccessTransform state="success" />`,
    package: "@xoroh/kern-native",
  },
];
