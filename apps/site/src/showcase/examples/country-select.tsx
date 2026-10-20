import { CountrySelect } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Country select examples — one country from a list.
 *
 * Kern ships no country dataset: `options` is the caller's, so the same
 * control serves a full ISO list, a billing-region list, or a locale list.
 */
export const COUNTRY_SELECT_EXAMPLES: ExampleSpec[] = [
  {
    id: "country-select-trigger",
    title: "The country list is the caller's",
    description:
      "`options` is data, so the same control serves a full ISO list or a three-region list. The trigger shows the chosen country's flag, name and dial code.",
    render: () => (
      <CountrySelect.Root
        options={[
          { code: "PT", name: "Portugal", dialCode: "351" },
          { code: "SE", name: "Sweden", dialCode: "46" },
        ]}
      >
        <CountrySelect.Label>Country</CountrySelect.Label>
        <CountrySelect.Trigger>
          <CountrySelect.Value placeholder="Choose a country" />
        </CountrySelect.Trigger>
        <CountrySelect.Content>
          <CountrySelect.Item value="PT">Portugal +351</CountrySelect.Item>
          <CountrySelect.Item value="SE">Sweden +46</CountrySelect.Item>
        </CountrySelect.Content>
      </CountrySelect.Root>
    ),
    code: `<CountrySelect.Root
  options={[
    { code: "PT", name: "Portugal", dialCode: "351" },
    { code: "SE", name: "Sweden", dialCode: "46" },
  ]}
>
  <CountrySelect.Label>Country</CountrySelect.Label>
  <CountrySelect.Trigger>
    <CountrySelect.Value placeholder="Choose a country" />
  </CountrySelect.Trigger>
  <CountrySelect.Content>
    <CountrySelect.Item value="PT">Portugal +351</CountrySelect.Item>
    <CountrySelect.Item value="SE">Sweden +46</CountrySelect.Item>
  </CountrySelect.Content>
</CountrySelect.Root>`,
  },
];
