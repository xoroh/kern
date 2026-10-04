/**
 * Live demos: pickers, menus, and transient messaging.
 */
import {
  AlertDialog,
  Autocomplete,
  Button,
  Calendar,
  Combobox,
  CountrySelect,
  createSonnerManager,
  Menubar,
  NativeSelect,
  Snackbar,
  Sonner,
} from "@xoroh/kern";
import { useState } from "react";
import { Preview, PreviewStack, Row } from "../../components/preview/preview";

export function AlertDialogDemo() {
  return (
    <Preview label="AlertDialog — focus stays inside, open it" span={3}>
      <AlertDialog.Root>
        <AlertDialog.Trigger
          render={
            <Button className="bg-(--md-sys-color-error) text-(--md-sys-color-on-error) hover:bg-(--md-sys-color-error)/90">
              Delete project
            </Button>
          }
        />
        <AlertDialog.Content>
          <AlertDialog.Title>Delete this project?</AlertDialog.Title>
          <AlertDialog.Description>
            The project and its build history are removed. This cannot be
            undone.
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Close
              render={<Button variant="ghost">Cancel</Button>}
            />
            <AlertDialog.Close
              render={
                <Button className="bg-(--md-sys-color-error) text-(--md-sys-color-on-error) hover:bg-(--md-sys-color-error)/90">
                  Delete
                </Button>
              }
            />
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Preview>
  );
}

const AUTOCOMPLETE_ITEMS = [
  { value: "kern", label: "Kern" },
  { value: "xoroh", label: "Xoroh" },
  { value: "base-ui", label: "Base UI" },
];

export function AutocompleteDemo() {
  return (
    <Preview label="Autocomplete — free text with a filtered list" span={3}>
      <div className="w-full max-w-xs">
        <Autocomplete.Root items={AUTOCOMPLETE_ITEMS}>
          <Autocomplete.Label>Project</Autocomplete.Label>
          <Autocomplete.Input placeholder="Search projects" />
          <Autocomplete.Content>
            <Autocomplete.Empty>No project matches.</Autocomplete.Empty>
            {AUTOCOMPLETE_ITEMS.map((item) => (
              <Autocomplete.Item key={item.value} value={item.value}>
                {item.label}
              </Autocomplete.Item>
            ))}
          </Autocomplete.Content>
        </Autocomplete.Root>
      </div>
    </Preview>
  );
}

const COMBOBOX_ITEMS = [
  { value: "css", label: "CSS" },
  { value: "tailwind", label: "Tailwind" },
  { value: "tokens", label: "Design tokens" },
];

export function ComboboxDemo() {
  return (
    <Preview label="Combobox — input, trigger, clear, list" span={3}>
      <div className="w-full max-w-xs">
        <Combobox.Root items={COMBOBOX_ITEMS}>
          <Combobox.Label>Styling</Combobox.Label>
          <div className="flex items-center gap-2">
            <Combobox.Input placeholder="Search styling" />
            <Combobox.Trigger aria-label="Open list">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="m7 10 5 5 5-5Z" />
              </svg>
            </Combobox.Trigger>
            <Combobox.Clear aria-label="Clear" />
          </div>
          <Combobox.Content>
            <Combobox.Empty>No match.</Combobox.Empty>
            {COMBOBOX_ITEMS.map((item) => (
              <Combobox.Item key={item.value} value={item.value}>
                {item.label}
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Root>
      </div>
    </Preview>
  );
}

const COUNTRIES = [
  { code: "DE", name: "Germany", dialCode: "49" },
  { code: "FR", name: "France", dialCode: "33" },
  { code: "NL", name: "Netherlands", dialCode: "31" },
  { code: "US", name: "United States", dialCode: "1" },
];

export function CountrySelectDemo() {
  return (
    <Preview
      label="CountrySelect — the consumer passes its own country list"
      span={3}
    >
      <div className="w-full max-w-xs">
        <CountrySelect.Root options={COUNTRIES}>
          <CountrySelect.Label>Country</CountrySelect.Label>
          <CountrySelect.Trigger>
            <CountrySelect.Value placeholder="Choose a country" />
          </CountrySelect.Trigger>
          <CountrySelect.Content>
            {COUNTRIES.map((country) => (
              <CountrySelect.Item key={country.code} value={country.code}>
                {country.name} +{country.dialCode}
              </CountrySelect.Item>
            ))}
          </CountrySelect.Content>
        </CountrySelect.Root>
      </div>
    </Preview>
  );
}

export function CalendarDemo() {
  return (
    <Preview label="Calendar — month grid, arrows move the day" span={3}>
      <Calendar
        defaultValue={new Date(2026, 1, 17)}
        min={new Date(2026, 0, 1)}
        max={new Date(2026, 11, 31)}
        aria-label="Release date"
      />
    </Preview>
  );
}

export function NativeSelectDemo() {
  return (
    <Preview label="NativeSelect — the platform select element" span={3}>
      <div className="w-full max-w-xs">
        <NativeSelect aria-label="Sort order" defaultValue="recent">
          <option value="recent">Most recent</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name</option>
        </NativeSelect>
      </div>
    </Preview>
  );
}

export function MenubarDemo() {
  return (
    <Preview label="Menubar — application menu bar" span={3}>
      <Menubar.Root>
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item>New project</Menubar.Item>
            <Menubar.Item>Open…</Menubar.Item>
            <Menubar.Item>Save</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu>
          <Menubar.Trigger>Edit</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item>Undo</Menubar.Item>
            <Menubar.Item>Redo</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar.Root>
    </Preview>
  );
}

/**
 * Snackbar is imperative: a manager owns the queue, the provider owns the
 * viewport. The demo mounts a real provider plus a static preview of the
 * snackbar surface it renders, so the component is shown rather than described.
 */
export function SnackbarDemo() {
  return (
    // Self-contained: the demo mounts its own provider (as documented below),
    // so it renders correctly anywhere — gallery thumbnail, home strip, or the
    // component page. Without this it consumed `useToastManager` bare and
    // threw Base UI error #73, which is how it was found.
    <Snackbar.Provider>
      <PreviewStack>
        <Preview label="the surface a Snackbar renders" span={3}>
          <div className="w-full max-w-sm">
            <Snackbar.Root
              toast={{
                id: "demo",
                title: "Build queued",
                description: "We will email you when it finishes.",
              }}
            >
              <div className="flex min-w-0 flex-col">
                <Snackbar.Title />
                <Snackbar.Description />
              </div>
              <Snackbar.Action onClick={() => {}}>View</Snackbar.Action>
              <Snackbar.Close />
            </Snackbar.Root>
          </div>
        </Preview>
        <Preview
          label="parts: Provider · Viewport · List · Root · Title · Description · Action · Close"
          span={3}
        >
          <p className="m-0 max-w-sm text-sm text-(--md-sys-color-on-surface-variant)">
            <code>Snackbar.Provider</code> owns the toast manager,{" "}
            <code>Snackbar.Viewport</code> positions it, and{" "}
            <code>Snackbar.List</code> renders the queue. The markup above is
            the real <code>Snackbar.Root</code> the list produces.
          </p>
        </Preview>
      </PreviewStack>
    </Snackbar.Provider>
  );
}

/**
 * Sonner is the deliberate web/native asymmetry recorded as S1.3: it has no
 * native counterpart because M3 expresses transient messaging as Snackbar.
 * The demo shows the real root surface and a live button that pushes a toast
 * through a real manager.
 */
export function SonnerDemo() {
  const [manager] = useState(() => createSonnerManager());
  return (
    // Self-contained, like SnackbarDemo above: the provider is part of the
    // family (Sonner.Provider owns the toast manager), and the viewport is
    // what the pushed toasts actually render into. Without the provider the
    // roots consumed `useToastManager` bare — Base UI error #73.
    <Sonner.Provider>
      <Sonner.Viewport />
      <PreviewStack>
        <Preview label="push a toast through a real manager" span={3}>
          <Row>
            {(["info", "success", "warning", "error"] as const).map(
              (intent) => (
                <Button
                  key={intent}
                  variant="tonal"
                  size="sm"
                  onClick={() =>
                    manager[intent]({
                      title: `${intent} toast`,
                      description: "Sent by Sonner.",
                    })
                  }
                >
                  {intent}
                </Button>
              ),
            )}
          </Row>
        </Preview>
        <Preview label="the surface Sonner.Root renders" span={3}>
          <div className="w-full max-w-sm">
            <Sonner.Root
              toast={{
                id: "demo",
                title: "Saved",
                description: "Your changes are live.",
              }}
              intent="success"
            >
              <div className="flex min-w-0 flex-col">
                <Sonner.Title />
                <Sonner.Description />
              </div>
              <Sonner.Action onClick={() => {}}>Undo</Sonner.Action>
              <Sonner.Close />
            </Sonner.Root>
          </div>
        </Preview>
      </PreviewStack>
    </Sonner.Provider>
  );
}
