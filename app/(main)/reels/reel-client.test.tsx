import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReelsClient } from "./reel-client";
import { createReelAction } from "@/lib/reel/reel.actions";
import { Reel } from "@/lib/reel/reel.types";
import { Supplier } from "@/lib/supplier/supplier.types";

const mocks = vi.hoisted(() => ({ refresh: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mocks.refresh }),
}));
vi.mock("@/lib/reel/reel.actions", () => ({ createReelAction: vi.fn() }));

const actionMock = vi.mocked(createReelAction);

const supplier: Supplier = {
  id: 5,
  name: "Acme Papers",
  contact: { email: "orders@acme.test", phone: "9876543210" },
  gstIn: "",
  address: "",
};

const reel: Reel = {
  id: 1,
  reelNo: "R001234",
  supplier,
  gsm: 150,
  ply: 3,
  grossWeight: 1000,
  netWeight: 950,
  remainingWeight: 800,
  status: "Available",
  location: "WH-1",
};

describe("ReelsClient", () => {
  beforeEach(() => {
    mocks.refresh.mockReset();
    actionMock.mockReset();
  });

  it("renders the reels data from the server component props", () => {
    render(<ReelsClient reelsData={[reel]} supplierList={[supplier]} />);

    expect(screen.getByRole("heading", { name: "Reels" })).toBeInTheDocument();
    expect(screen.getByText("R001234")).toBeInTheDocument();
    expect(screen.getByText("Acme Papers")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Reel" })).toBeInTheDocument();
  });

  it("opens the add dialog with the supplied list of suppliers", async () => {
    const user = userEvent.setup();
    render(<ReelsClient reelsData={[reel]} supplierList={[supplier]} />);

    await user.click(screen.getByRole("button", { name: "Add Reel" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "Add Reel" })).toBeInTheDocument();

    await user.click(within(dialog).getAllByRole("combobox")[0]);
    expect(
      await screen.findByRole("option", { name: "Acme Papers" }),
    ).toBeInTheDocument();
    // Select the option to close the dropdown; while it is open, Radix marks
    // the dialog as aria-hidden, making its buttons inaccessible to queries.
    await user.click(await screen.findByRole("option", { name: "Acme Papers" }));

    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it("adds a reel and refreshes the server data on success", async () => {
    const user = userEvent.setup();
    actionMock.mockResolvedValue({ ok: true, reel });
    render(<ReelsClient reelsData={[reel]} supplierList={[supplier]} />);

    await user.click(screen.getByRole("button", { name: "Add Reel" }));
    const dialog = await screen.findByRole("dialog");

    await user.type(within(dialog).getByPlaceholderText("e.g., R001234"), "R00999");
    await user.click(within(dialog).getAllByRole("combobox")[0]);
    await user.click(await screen.findByRole("option", { name: "Acme Papers" }));
    await user.click(within(dialog).getAllByRole("combobox")[1]);
    await user.click(await screen.findByRole("option", { name: "In Use" }));
    await user.type(within(dialog).getByPlaceholderText("e.g., 1000"), "1200");
    await user.type(within(dialog).getByPlaceholderText("e.g., 950"), "1100");
    await user.click(within(dialog).getByRole("button", { name: "Add Reel" }));

    await waitFor(() => expect(mocks.refresh).toHaveBeenCalledTimes(1));
    expect(actionMock).toHaveBeenCalledWith({
      reelNo: "R00999",
      supplierId: 5,
      gsm: undefined,
      ply: undefined,
      grossWeight: 1200,
      netWeight: 1100,
      status: "In Use",
    });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });
});
