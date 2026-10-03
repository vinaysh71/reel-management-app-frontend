import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddReelDialog } from "./add-reel-dialog";
import { createReelAction } from "@/lib/reel/reel.actions";
import { Supplier } from "@/lib/supplier/supplier.types";

vi.mock("@/lib/reel/reel.actions", () => ({ createReelAction: vi.fn() }));

const actionMock = vi.mocked(createReelAction);

const supplierList: Supplier[] = [
  {
    id: 5,
    name: "Acme Papers",
    contact: { email: "", phone: "9876543210" },
    gstIn: "",
    address: "",
  },
];

function renderDialog(onOpenChange = vi.fn(), onSuccess = vi.fn()) {
  render(
    <AddReelDialog
      open
      onOpenChange={onOpenChange}
      supplierList={supplierList}
      onSuccess={onSuccess}
    />,
  );
  return { onOpenChange, onSuccess };
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText("e.g., R001234"), "R001234");

  // The Radix select triggers expose an empty accessible name for their
  // placeholder state, so address them by position: supplier, then status.
  await user.click(screen.getAllByRole("combobox")[0]);
  await user.click(await screen.findByRole("option", { name: "Acme Papers" }));

  await user.click(screen.getAllByRole("combobox")[1]);
  await user.click(await screen.findByRole("option", { name: "Available" }));

  await user.type(screen.getByPlaceholderText("e.g., 150"), "150");
  await user.type(screen.getByPlaceholderText("e.g., 1000"), "1000");
  await user.type(screen.getByPlaceholderText("e.g., 950"), "950");
}

describe("AddReelDialog", () => {
  it("submits a valid reel matching the backend DTO and reports success", async () => {
    const user = userEvent.setup();
    const { onOpenChange, onSuccess } = renderDialog();
    actionMock.mockResolvedValue({ ok: true, reel: {} as never });

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Add Reel" }));

    await waitFor(() => {
      expect(actionMock).toHaveBeenCalledWith({
        reelNo: "R001234",
        supplierId: 5,
        gsm: 150,
        ply: undefined,
        grossWeight: 1000,
        netWeight: 950,
        status: "Available",
      });
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("blocks submission on client-side validation", async () => {
    const user = userEvent.setup();
    const { onOpenChange, onSuccess } = renderDialog();

    await user.click(screen.getByRole("button", { name: "Add Reel" }));

    expect(await screen.findByText("Reel number is required")).toBeInTheDocument();
    expect(actionMock).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("surfaces a field-level business error from the server action", async () => {
    const user = userEvent.setup();
    const { onOpenChange, onSuccess } = renderDialog();
    actionMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        message: "Reel already exists",
        field: "reelNo",
        code: "REEL_ALREADY_EXISTS",
      },
    });

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Add Reel" }));

    expect(await screen.findByText("Reel already exists")).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("closes without submitting when Cancel is pressed", async () => {
    const user = userEvent.setup();
    const { onOpenChange, onSuccess } = renderDialog();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(actionMock).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
