import { CountrySelect } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * CountrySelect configurator — the twenty-fifth Part-4 configurator
 * (move #28), second select surface past Select (move #5) and deliberately
 * its dataset-driven sibling: the consumer passes `options` (Kern ships no
 * country dataset), each option carrying code/name plus optional dialCode,
 * flag, and disabled. Knobs are the axes the component doc leaves open:
 * `required` and `disabled` (states), `defaultOpen` (open at first paint —
 * the painted-verify role), `withDisabledOption` (whether the dataset
 * includes a disabled option — the edge composition, carried from the
 * move-5 Group lesson: a disabled country cannot be chosen). The
 * `onCountryChange` callback is app wiring, not a knob. The stage shows
 * the documented anatomy whole — label, trigger, grouped options with dial
 * codes — so the fence teaches it too. The stage remounts by key on every
 * knob so it cannot drift from the fence.
 */
type Option = {
  code: string;
  name: string;
  dialCode: string;
  disabled?: boolean;
};

const BASE_OPTIONS: Option[] = [
  { code: "DE", name: "Germany", dialCode: "49" },
  { code: "FR", name: "France", dialCode: "33" },
  { code: "NL", name: "Netherlands", dialCode: "31" },
];

const DISABLED_OPTION: Option = {
  code: "AQ",
  name: "Antarctica",
  dialCode: "672",
  disabled: true,
};

function optionsOf(v: ConfigValues): Option[] {
  return withDisabledOptionOf(v)
    ? [...BASE_OPTIONS, DISABLED_OPTION]
    : BASE_OPTIONS;
}

function requiredOf(v: ConfigValues): boolean {
  return v.required === true;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function openOf(v: ConfigValues): boolean {
  return v.defaultOpen === true;
}

function withDisabledOptionOf(v: ConfigValues): boolean {
  return v.withDisabledOption === true;
}

function rootPropsOf(v: ConfigValues): string {
  const out = ["options={COUNTRIES}"];
  if (requiredOf(v)) out.push("required");
  if (disabledOf(v)) out.push("disabled");
  if (openOf(v)) out.push("defaultOpen");
  return ` ${out.join(" ")}`;
}

function optionsFence(v: ConfigValues, withDisabled: boolean): string {
  const list = withDisabled ? [...BASE_OPTIONS, DISABLED_OPTION] : BASE_OPTIONS;
  const decls = list
    .map(
      (o) =>
        `  { code: "${o.code}", name: "${o.name}", dialCode: "${o.dialCode}"${o.disabled ? ", disabled: true" : ""} },`,
    )
    .join("\n");
  const items = list
    .map(
      (o) =>
        `    <CountrySelect.Item key="${o.code}" value="${o.code}"${o.disabled ? " disabled" : ""}>\n      ${o.name} +${o.dialCode}\n    </CountrySelect.Item>`,
    )
    .join("\n");
  return `const COUNTRIES = [\n${decls}\n];\n\n<CountrySelect.Root${rootPropsOf(v)}>\n  <CountrySelect.Label>Country</CountrySelect.Label>\n  <CountrySelect.Trigger>\n    <CountrySelect.Value placeholder="Choose a country" />\n  </CountrySelect.Trigger>\n  <CountrySelect.Content>\n${items}`;
}

export const COUNTRY_SELECT_CONFIGURATOR: ConfiguratorSpec = {
  id: "country-select-knobs",
  title: "Configure the country select",
  description:
    "Required and disabled states, open at first paint, dataset with or without a disabled option. Kern ships no country list — the options array is yours (ISO codes, billing regions, whatever fits); the fence shows a three-country list so the shape is concrete. A disabled country renders but cannot be chosen — that is the edge, not a bug. The knobs describe the next mount (the stage remounts by key): picking a live country does not flip them back, so a picked stage with untouched knobs is by design.",
  controls: [
    {
      kind: "boolean",
      name: "required",
      label: "Required",
      default: false,
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled",
      default: false,
    },
    {
      kind: "boolean",
      name: "defaultOpen",
      label: "Open (initial state)",
      default: false,
    },
    {
      kind: "boolean",
      name: "withDisabledOption",
      label: "Disabled option in list",
      default: false,
    },
  ],
  render: (v) => {
    const options = optionsOf(v);
    return (
      <CountrySelect.Root
        key={`${requiredOf(v) ? "req" : "opt"}-${disabledOf(v) ? "off" : "on"}-${openOf(v) ? "open" : "shut"}-${withDisabledOptionOf(v) ? "dis" : "plain"}`}
        options={options}
        required={requiredOf(v)}
        disabled={disabledOf(v)}
        defaultOpen={openOf(v)}
      >
        <CountrySelect.Label>Country</CountrySelect.Label>
        <CountrySelect.Trigger>
          <CountrySelect.Value placeholder="Choose a country" />
        </CountrySelect.Trigger>
        <CountrySelect.Content>
          {options.map((country) => (
            <CountrySelect.Item
              key={country.code}
              value={country.code}
              disabled={country.disabled}
            >
              {country.name} +{country.dialCode}
            </CountrySelect.Item>
          ))}
        </CountrySelect.Content>
      </CountrySelect.Root>
    );
  },
  code: (v) =>
    `${optionsFence(v, withDisabledOptionOf(v))}\n  </CountrySelect.Content>\n</CountrySelect.Root>`,
};
