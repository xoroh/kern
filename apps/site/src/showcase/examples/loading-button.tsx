import { LoadingButton } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Loading button examples — the wait, without the resize.
 *
 * The label stays and the footprint stays; the indicator takes the leading
 * slot. While it loads, the button is disabled, so the action cannot be
 * fired twice.
 */
export const LOADING_BUTTON_EXAMPLES: ExampleSpec[] = [
  {
    id: "loading-button-wait",
    title: "The same button, with the wait in it",
    description:
      "`loading` shows the indicator AND blocks interaction, so a double submit is not possible. `value` makes the wait determinate; omitting it gives the loop. The label never changes.",
    render: () => (
      <>
        <LoadingButton loading>Save</LoadingButton>
        <LoadingButton loading value={0.6} variant="tonal">
          Uploading
        </LoadingButton>
        <LoadingButton>Save</LoadingButton>
      </>
    ),
    code: `<LoadingButton loading>Save</LoadingButton>
<LoadingButton loading value={0.6} variant="tonal">Uploading</LoadingButton>
<LoadingButton>Save</LoadingButton>`,
  },
];
