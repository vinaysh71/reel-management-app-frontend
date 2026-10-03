import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SuppliersClient } from "./suppliers-client";
import { createSupplierAction } from "@/lib/supplier/supplier.actions";
import { Supplier } from "@/lib/supplier/supplier.types";

const mocks = vi.hoisted(() => ({ refresh: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mocks.refresh }),
}));
vi.mock("@/lib/supplier/supplier.actions", () => ({
  createSupplierAction: vi.fn(),
}));

const actionMock = vi.mocked(createSupplierAction);

const supplier: Supplier = {
  id: 1,
  name: "Acme Papers",
  contact: { email: "orders@acme.test", phone: "9876543210" },
  gstIn: "22AAAAA0000A1Z5",
  address: "Mumbai",
};

describe("SuppliersClient", () => {
  beforeEach(() => {
    mocks.refresh.mockReset();
    actionMock.mockReset();
  });

  it("renders the suppliers data from the server component props", () => {
    render(<SuppliersClient suppliersData={[supplier]} />);

    expect(
      screen.getByRole("heading", { name: "Suppliers" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Acme Papers")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Supplier" }),
    ).toBeInTheDocument();
  });

  it("opens and closes the add dialog", async () => {
    const user = userEvent.setup();
    render(<SuppliersClient suppliersData={[supplier]} />);

    await user.click(screen.getByRole("button", { name: "Add Supplier" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(actionMock).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it("adds a supplier and refreshes the server data on success", async () => {
    const user = userEvent.setup();
    actionMock.mockResolvedValue({ ok: true, supplier });
    render(<SuppliersClient suppliersData={[supplier]} />);

    await user.click(screen.getByRole("button", { name: "Add Supplier" }));
    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByPlaceholderText("Add supplier name"), "Beta Mills");
    await user.type(within(dialog).getByPlaceholderText("Enter contact phone"), "9876543211");
    await user.click(within(dialog).getByRole("button", { name: "Save" }));

    await waitFor(() => expect(mocks.refresh).toHaveBeenCalledTimes(1));
    expect(actionMock).toHaveBeenCalledWith({
      name: "Beta Mills",
      contact: { phone: "9876543211", email: "" },
      gstIn: "",
    });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("keeps the dialog open and skips the refresh on a server error", async () => {
    const user = userEvent.setup();
    window.alert = vi.fn();
    actionMock.mockResolvedValue({
      ok: false,
      error: { status: 500, message: "Internal server error" },
    });
    render(<SuppliersClient suppliersData={[supplier]} />);

    await user.click(screen.getByRole("button", { name: "Add Supplier" }));
    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByPlaceholderText("Add supplier name"), "Beta Mills");
    await user.type(within(dialog).getByPlaceholderText("Enter contact phone"), "9876543211");
    await user.click(within(dialog).getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Internal server error");
    });
    expect(mocks.refresh).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
