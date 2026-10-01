/**
 * Live demos: form controls and selection components.
 */
import {
  Checkbox,
  CheckboxGroup,
  Field,
  FieldMessage,
  Fieldset,
  Form,
  Input,
  InputOTP,
  NumberField,
  RadioGroup,
  RadioGroupItem,
  Search,
  Slider,
  Switch,
  Textarea,
  Toggle,
  ToggleGroup,
} from "@xoroh/kern";
import { Preview, PreviewStack, Row } from "../../components/preview/preview";

export function InputDemo() {
  return (
    <PreviewStack>
      <Preview label="default" span={3}>
        <div className="w-full max-w-sm">
          <Input placeholder="you@example.com" aria-label="Email" />
        </div>
      </Preview>
      <Preview label="error" span={3}>
        <div className="w-full max-w-sm">
          <Input
            placeholder="bad@example"
            error
            aria-label="Email with error"
          />
        </div>
      </Preview>
      <Preview label="state — disabled" span={3}>
        <div className="w-full max-w-sm">
          <Input placeholder="Disabled" disabled aria-label="Disabled" />
        </div>
      </Preview>
    </PreviewStack>
  );
}

export function TextareaDemo() {
  return (
    <Preview label="Textarea" span={3}>
      <div className="w-full max-w-sm">
        <Textarea placeholder="Tell us what happened…" aria-label="Message" />
      </div>
    </Preview>
  );
}

export function FieldDemo() {
  return (
    <Preview label="Field — Root · Label · Control · Description" span={3}>
      <div className="w-full max-w-sm">
        <Field.Root>
          <Field.Label>Email address</Field.Label>
          <Field.Control placeholder="you@example.com" />
          <Field.Description>We only use this for sign-in.</Field.Description>
        </Field.Root>
      </div>
    </Preview>
  );
}

export function FieldMessageDemo() {
  return (
    <Preview label="variant — description · error" span={3}>
      <div className="flex w-full max-w-sm flex-col gap-2">
        <FieldMessage>Helper text</FieldMessage>
        <FieldMessage variant="error">That address is not valid</FieldMessage>
      </div>
    </Preview>
  );
}

export function FormDemo() {
  return (
    <Preview label="Form" span={3}>
      <Form className="flex w-full max-w-sm flex-col gap-3">
        <Field.Root>
          <Field.Label>Full name</Field.Label>
          <Field.Control placeholder="Ada Lovelace" required />
        </Field.Root>
        <button
          type="submit"
          className="kern-button inline-flex h-10 items-center justify-center rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-primary) px-4 text-sm font-medium text-(--md-sys-color-on-primary)"
        >
          Save
        </button>
      </Form>
    </Preview>
  );
}

export function FieldsetDemo() {
  return (
    <Preview label="Fieldset — grouped controls with a legend" span={3}>
      <div className="w-full max-w-sm">
        <Fieldset.Root>
          <Fieldset.Legend>Delivery address</Fieldset.Legend>
          <Input placeholder="Street and number" aria-label="Street" />
        </Fieldset.Root>
      </div>
    </Preview>
  );
}

export function CheckboxDemo() {
  return (
    <Preview
      label="checked · unchecked · indeterminate · disabled · with label"
      span={3}
    >
      <Row>
        <Checkbox defaultChecked aria-label="Checked" />
        <Checkbox aria-label="Unchecked" />
        <Checkbox indeterminate aria-label="Indeterminate" />
        <Checkbox disabled aria-label="Disabled" />
      </Row>
      <Checkbox label="Subscribe to updates" defaultChecked />
    </Preview>
  );
}

export function CheckboxGroupDemo() {
  return (
    <Preview label="CheckboxGroup — shared multi-select value" span={3}>
      <div className="w-full max-w-sm">
        <CheckboxGroup.Root defaultValue={["email"]} aria-label="Notifications">
          <CheckboxGroup.Item value="email" label="Email" />
          <CheckboxGroup.Item value="push" label="Push" />
          <CheckboxGroup.Item value="sms" label="SMS" />
        </CheckboxGroup.Root>
      </div>
    </Preview>
  );
}

export function RadioGroupDemo() {
  return (
    <Preview label="RadioGroup — exclusive, with a disabled option" span={3}>
      <RadioGroup defaultValue="standard" aria-label="Shipping">
        <RadioGroupItem value="standard">Standard — 5 days</RadioGroupItem>
        <RadioGroupItem value="express">Express — 2 days</RadioGroupItem>
        <RadioGroupItem value="pickup" disabled>
          Pickup — unavailable
        </RadioGroupItem>
      </RadioGroup>
    </Preview>
  );
}

export function SwitchDemo() {
  return (
    <Preview label="on · off · disabled">
      <Row>
        <Switch defaultChecked aria-label="On" />
        <Switch aria-label="Off" />
        <Switch disabled aria-label="Disabled" />
      </Row>
    </Preview>
  );
}

export function ToggleDemo() {
  return (
    <Preview label="pressed · unpressed · disabled" span={3}>
      <Row>
        <Toggle defaultPressed aria-label="Bold">
          Bold
        </Toggle>
        <Toggle aria-label="Italic">Italic</Toggle>
        <Toggle disabled aria-label="Disabled">
          Disabled
        </Toggle>
      </Row>
    </Preview>
  );
}

export function ToggleGroupDemo() {
  return (
    <Preview label="ToggleGroup — multi-select of format toggles" span={3}>
      <ToggleGroup.Root defaultValue={["bold"]} aria-label="Format">
        <ToggleGroup.Item value="bold" aria-label="Bold">
          B
        </ToggleGroup.Item>
        <ToggleGroup.Item value="italic" aria-label="Italic">
          I
        </ToggleGroup.Item>
        <ToggleGroup.Item value="underline" aria-label="Underline">
          U
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </Preview>
  );
}

export function SliderDemo() {
  return (
    <Preview label="Slider — continuous value" span={3}>
      <div className="w-full max-w-sm">
        <Slider.Root defaultValue={40} aria-label="Volume">
          <Slider.Label>Volume</Slider.Label>
          <Slider.Value />
          <Slider.Thumb />
        </Slider.Root>
      </div>
    </Preview>
  );
}

export function SearchDemo() {
  return (
    <PreviewStack>
      <Preview label="default" span={3}>
        <div className="w-full max-w-sm">
          <Search label="Search components" placeholder="Search components" />
        </div>
      </Preview>
      <Preview label="with a value (clear button appears)" span={3}>
        <div className="w-full max-w-sm">
          <Search label="Search" defaultValue="button" />
        </div>
      </Preview>
    </PreviewStack>
  );
}

export function InputOTPDemo() {
  return (
    <Preview label="InputOTP — one boxed character per position" span={3}>
      <InputOTP.Root length={4} aria-label="One-time code">
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
      </InputOTP.Root>
    </Preview>
  );
}

export function NumberFieldDemo() {
  return (
    <Preview label="NumberField — increment and decrement" span={3}>
      <div className="w-full max-w-xs">
        <NumberField.Root
          defaultValue={2}
          min={0}
          max={10}
          aria-label="Quantity"
        >
          <NumberField.Input />
        </NumberField.Root>
      </div>
    </Preview>
  );
}
