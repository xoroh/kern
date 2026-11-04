import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import {
  type ContactAdapter,
  ContactCard,
  ContactDirectory,
  ContactGroupList,
  ContactRow,
  contactInitials,
  contactToneFor,
  filterContacts,
  groupContacts,
} from "./kern-contact";

async function axeClean(container: HTMLElement) {
  const result = await axe.run(container, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
    },
  });
  expect(result.violations).toEqual([]);
}

const ADA: ContactAdapter = {
  id: "ada",
  name: "Ada Lovelace",
  detail: "Driver · +31 6 1234 5678",
};
const GRACE: ContactAdapter = {
  id: "grace",
  name: "Grace Hopper",
  detail: "Dispatcher",
  group: "Staff",
};

describe("contactToneFor + contactInitials", () => {
  it("picks deterministically within the registry (never neutral)", () => {
    expect(contactToneFor("ada")).toBe(contactToneFor("ada"));
    expect(contactToneFor("ada")).not.toBe("neutral");
    for (const key of ["a", "b", "user-1", "driver-99", "x@y.z"]) {
      expect([
        "primary",
        "secondary",
        "success",
        "warning",
        "error",
        "info",
      ]).toContain(contactToneFor(key));
    }
  });

  it("initials take the first two words", () => {
    expect(contactInitials("Ada Lovelace")).toBe("AL");
    expect(contactInitials("Plato")).toBe("PL");
    expect(contactInitials("  ")).toBe("?");
  });
});

describe("ContactRow", () => {
  it("renders initials disc + name + meta, named by the contact", async () => {
    const user = userEvent.setup();
    let picked: ContactAdapter | null = null;
    render(<ContactRow contact={ADA} onSelect={(c) => (picked = c)} />);
    expect(screen.getByText("AL")).toBeInTheDocument();
    expect(screen.getByText("Driver · +31 6 1234 5678")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ada Lovelace" }));
    expect(picked).toEqual(ADA);
  });

  it("falls back to the initials disc until the photo loads", () => {
    // Base UI `Avatar.Image` renders nothing until the image loads (jsdom
    // never loads), so the row must stay named and complete on fallback.
    render(
      <ContactRow
        contact={{ ...ADA, photoUrl: "https://example.com/ada.jpg" }}
      />,
    );
    expect(screen.getByText("AL")).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
  });

  it("is axe-clean", async () => {
    const { container } = render(
      <ContactRow contact={ADA} onSelect={() => {}} />,
    );
    await axeClean(container);
  });
});

describe("ContactCard", () => {
  it("shows identity + status + actions", () => {
    render(
      <ContactCard
        contact={ADA}
        status={<span>Online</span>}
        actions={<button type="button">Call</button>}
      />,
    );
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Call" })).toBeInTheDocument();
  });
});

describe("ContactGroupList", () => {
  it("selects rows and reports both channels", async () => {
    const user = userEvent.setup();
    let changed = "";
    let picked: ContactAdapter | null = null;
    render(
      <ContactGroupList
        groups={[{ id: "s", title: "Staff", contacts: [ADA, GRACE] }]}
        onValueChange={(id) => (changed = id)}
        onSelect={(c) => (picked = c)}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Grace Hopper" }));
    expect(changed).toBe("grace");
    expect(picked).toEqual(GRACE);
  });

  it("honours a controlled value", () => {
    render(
      <ContactGroupList
        groups={[{ id: "s", title: "Staff", contacts: [ADA] }]}
        value="ada"
        onValueChange={() => {}}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Ada Lovelace" }),
    ).toBeInTheDocument();
  });
});

describe("filterContacts + groupContacts", () => {
  it("matches name and detail, case-insensitively", () => {
    expect(filterContacts([ADA, GRACE], "hopper")).toEqual([GRACE]);
    expect(filterContacts([ADA, GRACE], "DRIVER")).toEqual([ADA]);
    expect(filterContacts([ADA, GRACE], "")).toHaveLength(2);
  });

  it("groups by contact.group, order-preserving", () => {
    expect(groupContacts([ADA, GRACE]).map((g) => g.id)).toEqual([
      "Contacts",
      "Staff",
    ]);
  });
});

describe("ContactDirectory", () => {
  it("searches and empties with recovery text", async () => {
    const user = userEvent.setup();
    render(<ContactDirectory contacts={[ADA, GRACE]} />);
    const box = screen.getByPlaceholderText("Search");
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    await user.type(box, "hopper");
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
    expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
    await user.clear(box);
    await user.type(box, "zzz");
    expect(screen.getByText("No contacts")).toBeInTheDocument();
  });

  it("reports query changes", async () => {
    const user = userEvent.setup();
    let query = "";
    render(
      <ContactDirectory contacts={[ADA]} onQueryChange={(q) => (query = q)} />,
    );
    await user.type(screen.getByPlaceholderText("Search"), "a");
    expect(query).toBe("a");
  });

  it("directory with results is axe-clean", async () => {
    const { container } = render(<ContactDirectory contacts={[ADA, GRACE]} />);
    await axeClean(container);
  });
});
