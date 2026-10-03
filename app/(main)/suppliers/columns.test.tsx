import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CellContext } from "@tanstack/react-table";
import { supplierColumns } from "./columns";
import { Supplier } from "@/lib/supplier/supplier.types";

const supplier: Supplier = {
  id: 7,
  name: "Acme Papers",
  contact: { email: "orders@acme.test", phone: "9876543210" },
  gstIn: "22AAAAA0000A1Z5",
  address: "Mumbai",
};

// Column order: name, contact phone, contact email, gst, actions.
const [nameCol, phoneCol, emailCol, gstCol, actionsCol] = supplierColumns;

function ctx(row: Partial<Supplier>, value?: unknown): CellContext<Supplier, unknown> {
  return {
    // Cells that destructure `getValue` from the context get the column value.
    getValue: () => value,
    row: {
      original: row as Supplier,
      getValue: (key: keyof Supplier) => row[key],
    },
  } as unknown as CellContext<Supplier, unknown>;
}

function renderCell(
  column: (typeof supplierColumns)[number],
  row: Partial<Supplier>,
  value?: unknown,
) {
  if (!column.cell) throw new Error("column has no cell renderer");
  if (typeof column.cell !== "function") {
    throw new Error("column cell is not a renderer function");
  }
  return render(<>{column.cell(ctx(row, value))}</>);
}

describe("supplierColumns", () => {
  it("renders the supplier name emphasised", () => {
    renderCell(nameCol, supplier);

    const cell = screen.getByText("Acme Papers");
    expect(cell).toBeInTheDocument();
    expect(cell.className).toContain("font-medium");
  });

  it("renders the contact phone", () => {
    renderCell(phoneCol, supplier, supplier.contact.phone);

    expect(screen.getByText("9876543210")).toBeInTheDocument();
  });

  it("falls back to a dash when the phone is missing", () => {
    renderCell(phoneCol, { contact: undefined }, undefined);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders the contact email", () => {
    renderCell(emailCol, supplier, supplier.contact.email);

    expect(screen.getByText("orders@acme.test")).toBeInTheDocument();
  });

  it("falls back to a dash when the email is missing", () => {
    renderCell(emailCol, { contact: { phone: "9876543210", email: "" } }, "");

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders the GST number when present", () => {
    renderCell(gstCol, supplier);

    expect(screen.getByText("22AAAAA0000A1Z5")).toBeInTheDocument();
  });

  it("falls back to a dash when the GST number is missing", () => {
    renderCell(gstCol, { gstIn: "" });

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("offers Edit and Delete actions per row", async () => {
    const user = userEvent.setup();
    renderCell(actionsCol, supplier);

    await user.click(screen.getByRole("button"));

    expect(await screen.findByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(await screen.findByRole("menuitem", { name: "Delete" })).toBeInTheDocument();
  });

  it("marks name and phone as filterable", () => {
    expect(nameCol.meta?.filterable).toBe(true);
    expect(phoneCol.meta?.filterable).toBe(true);
    expect(gstCol.meta?.filterable).toBeUndefined();
  });
});
