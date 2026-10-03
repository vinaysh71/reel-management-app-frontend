import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ConsumptionTable from "./consumption-table";
import { getRecentConsumption } from "@/lib/dashboard/dashboard.api";

vi.mock("@/lib/dashboard/dashboard.api", () => ({
  getRecentConsumption: vi.fn(),
}));

describe("ConsumptionTable", () => {
  it("renders recent consumption entries", async () => {
    vi.mocked(getRecentConsumption).mockResolvedValue([
      {
        id: "1",
        date: "2026-10-01",
        reelNo: "R001",
        orderNo: "O-100",
        qtyUsed: 12,
        operator: "John",
      },
    ]);

    const ui = await ConsumptionTable();
    render(ui);

    expect(
      screen.getByText("Recent Consumption Table (last 10 entries)"),
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Reel No" })).toBeInTheDocument();
    expect(screen.getByText("R001")).toBeInTheDocument();
    expect(screen.getByText("O-100")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("renders the fallback when there is no consumption data", async () => {
    vi.mocked(getRecentConsumption).mockResolvedValue(null as never);

    const ui = await ConsumptionTable();
    render(ui);

    expect(
      screen.getByText("No consumption data available."),
    ).toBeInTheDocument();
  });
});
