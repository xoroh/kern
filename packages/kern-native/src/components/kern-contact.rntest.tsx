import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text as RNText } from "react-native";
import {
  ContactCard,
  ContactDirectory,
  ContactGroupList,
  ContactRow,
  contactInitials,
  contactToneFor,
  filterContacts,
  groupContacts,
} from "./kern-contact";

const ADA = {
  id: "ada",
  name: "Ada Lovelace",
  detail: "Driver",
};
const GRACE = {
  id: "grace",
  name: "Grace Hopper",
  detail: "Dispatcher",
  group: "Staff",
};

describe("contactToneFor + contactInitials (parity with web)", () => {
  it("picks deterministically within the registry (never neutral)", () => {
    expect(contactToneFor("ada")).toBe(contactToneFor("ada"));
    expect(contactToneFor("ada")).not.toBe("neutral");
    // Same expectations as the web twin: one spec, two renderers.
    expect(contactToneFor("driver-99")).toBe(contactToneFor("driver-99"));
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
  });
});

describe("ContactRow", () => {
  it("renders the disc + name + meta and reports selection", async () => {
    const onSelect = jest.fn();
    await render(<ContactRow contact={ADA} onSelect={onSelect} />);
    expect(screen.getByText("AL")).toBeTruthy();
    expect(screen.getByText("Driver")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Ada Lovelace" }));
    });
    expect(onSelect).toHaveBeenCalledWith(ADA);
  });
});

describe("ContactCard", () => {
  it("shows identity + status", async () => {
    await render(
      <ContactCard contact={ADA} status={<RNText>Online</RNText>} />,
    );
    expect(screen.getByText("Ada Lovelace")).toBeTruthy();
    expect(screen.getByText("Online")).toBeTruthy();
  });
});

describe("ContactGroupList", () => {
  it("selects rows and reports both channels", async () => {
    const onValueChange = jest.fn();
    const onSelect = jest.fn();
    await render(
      <ContactGroupList
        groups={[{ id: "s", title: "Staff", contacts: [ADA, GRACE] }]}
        onValueChange={onValueChange}
        onSelect={onSelect}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Grace Hopper" }));
    });
    expect(onValueChange).toHaveBeenCalledWith("grace");
    expect(onSelect).toHaveBeenCalledWith(GRACE);
  });
});

describe("filterContacts + groupContacts", () => {
  it("matches name and detail, case-insensitively", () => {
    expect(filterContacts([ADA, GRACE], "hopper")).toEqual([GRACE]);
    expect(filterContacts([ADA, GRACE], "DRIVER")).toEqual([ADA]);
  });

  it("groups by contact.group, order-preserving", () => {
    expect(groupContacts([ADA, GRACE]).map((g) => g.id)).toEqual([
      "Contacts",
      "Staff",
    ]);
  });
});

describe("ContactDirectory", () => {
  it("searches inline and empties with recovery text", async () => {
    await render(<ContactDirectory contacts={[ADA, GRACE]} />);
    expect(screen.getByText("Ada Lovelace")).toBeTruthy();
    await act(async () => {
      fireEvent.changeText(
        screen.getByTestId("kern-contact-directory-search"),
        "hopper",
      );
    });
    expect(screen.queryByText("Ada Lovelace")).toBeNull();
    expect(screen.getByText("Grace Hopper")).toBeTruthy();
    await act(async () => {
      fireEvent.changeText(
        screen.getByTestId("kern-contact-directory-search"),
        "zzz",
      );
    });
    expect(screen.getByText("No contacts")).toBeTruthy();
  });

  it("reports query changes", async () => {
    const onQueryChange = jest.fn();
    await render(
      <ContactDirectory contacts={[ADA]} onQueryChange={onQueryChange} />,
    );
    await act(async () => {
      fireEvent.changeText(
        screen.getByTestId("kern-contact-directory-search"),
        "a",
      );
    });
    expect(onQueryChange).toHaveBeenCalledWith("a");
  });
});
