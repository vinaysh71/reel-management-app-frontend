import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardStats from "./dashboard-stats";
import { getDashboardKpis } from "@/lib/dashboard/dashboard.api";

vi.mock("@/lib/dashboard/dashboard.api", () => ({ getDashboardKpis: vi.fn() }));

describe("DashboardStats", () => {
  it("renders one stat card per KPI with its value", async () => {
    vi.mocked(getDashboardKpis).mockResolvedValue({
      totalReels: 42,
      inUse: 17,
      consumedToday: 5,
      lowStock: 3,
      wastagePercent: 2.5,
    });

    const ui = await DashboardStats();
    render(ui);

    expect(screen.getByText("Total Reels")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("In use")).toBeInTheDocument();
    expect(screen.getByText("17")).toBeInTheDocument();
    expect(screen.getByText("Consumed today")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Low Stock")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(getDashboardKpis).toHaveBeenCalledTimes(1);
  });
});
