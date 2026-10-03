import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddSupplierDialog } from "./add-supplier.dialog";
import { createSupplierAction } from "@/lib/supplier/supplier.actions";

vi.mock("@/lib/supplier/supplier.actions", () => ({
  createSupplierAction: vi.fn(),
}));

const actionMock = vi.mocked(createSupplierAction);

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText("Add supplier name"), "Acme Papers");
  await user.type(screen.getByPlaceholderText("Enter contact phone"), "9876543210");
  await user.type(screen.getByPlaceholderText("Enter contact email"), "orders@acme.test");
  await user.type(screen.getByPlaceholderText("Enter GSTIN"), "22AAAAA0000A1Z5");
}

describe("AddSupplierDialog", () => {
  it("submits a valid supplier through the server action and reports success", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    actionMock.mockResolvedValue({
      ok: true,
      supplier: { id: 1, name: "Acme Papers" } as never,
    });

    render(
      <AddSupplierDialog open onOpenChange={onOpenChange} onSuccess={onSuccess} />,
    );
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(actionMock).toHaveBeenCalledWith({
        name: "Acme Papers",
        contact: { phone: "9876543210", email: "orders@acme.test" },
        gstIn: "22AAAAA0000A1Z5",
      });
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByText("Supplier already exists")).not.toBeInTheDocument();
  });

  it("blocks submission on client-side validation", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();

    render(
      <AddSupplierDialog open onOpenChange={onOpenChange} onSuccess={onSuccess} />,
    );
    await user.type(screen.getByPlaceholderText("Add supplier name"), "Acme Papers");
    await user.type(screen.getByPlaceholderText("Enter contact phone"), "12345");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Invalid mobile number")).toBeInTheDocument();
    expect(actionMock).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("shows a required error for an empty supplier name", async () => {
    const user = userEvent.setup();

    render(
      <AddSupplierDialog open onOpenChange={vi.fn()} onSuccess={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Supplier name is required")).toBeInTheDocument();
    expect(actionMock).not.toHaveBeenCalled();
  });

  it("surfaces a field-level business error from the server action", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    actionMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        message: "Supplier already exists",
        field: "supplierName",
        code: "SUPPLIER_ALREADY_EXISTS",
      },
    });

    render(
      <AddSupplierDialog open onOpenChange={onOpenChange} onSuccess={onSuccess} />,
    );
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Supplier already exists")).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("keeps the dialog open and alerts for a non-field server error", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    window.alert = vi.fn();
    actionMock.mockResolvedValue({
      ok: false,
      error: { status: 500, message: "Internal server error" },
    });

    render(
      <AddSupplierDialog open onOpenChange={onOpenChange} onSuccess={onSuccess} />,
    );
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Internal server error");
    });
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
