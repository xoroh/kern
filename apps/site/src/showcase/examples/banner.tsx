import { Banner } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Banner examples — the persistent, in-flow message.
 *
 * A banner does not dismiss itself: it sits in the flow for as long as the
 * condition holds. The intent colours are the status roles, so a theme
 * retints every banner at once, and `assertive` is what makes one interrupt
 * rather than wait its turn.
 *
 * WEB composition. The native banner is the same contract over a React Native
 * view; the mobile page carries its own live demo.
 */
export const BANNER_EXAMPLES: ExampleSpec[] = [
  {
    id: "banner-intents",
    title: "A message that stays until it is answered",
    description:
      "The four intents are the status roles, so the banner reads as information, a success, a caution or a failure without a word of copy saying so. The dismiss control appears only when there is something to dismiss.",
    render: () => (
      <>
        <Banner variant="info">A build finished.</Banner>
        <Banner variant="warning" onDismiss={() => {}}>
          Your session ends in 5 minutes.
        </Banner>
      </>
    ),
    code: `<Banner variant="info">A build finished.</Banner>
<Banner variant="warning" onDismiss={() => {}}>
  Your session ends in 5 minutes.
</Banner>`,
  },
];
