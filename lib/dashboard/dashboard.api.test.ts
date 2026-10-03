import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/core/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

type ApiModule = typeof import("@/lib/core/api");
type DashboardModule = typeof import("./dashboard.api");

let api: ApiModule["api"];
let dashboardApi: DashboardModule;

const dashboardData = {
  kpis: {
    totalReels: 42,
    inUse: 17,
    consumedToday: 5,
    lowStock: 3,
    wastagePercent: 2.5,
  },
  recentConsumptions: [{ id: "1", reelNo: "R001" }],
  lowStockAlerts: [{ id: 1, reelNo: "R002", stock: 1 }],
};

// Module-level cache: reload the module for an isolated cache per test.
beforeEach(async () => {
  vi.resetModules();
  dashboardApi = await import("./dashboard.api");
  api = (await import("@/lib/core/api")).api;
});

describe("dashboard data cache", () => {
  it("fetches the dashboard payload only once across all selectors", async () => {
    vi.mocked(api.get).mockResolvedValue(dashboardData);

    const kpis = await dashboardApi.getDashboardKpis();
    const recent = await dashboardApi.getRecentConsumption();
    const lowStocks = await dashboardApi.getLowStocks();

    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get).toHaveBeenCalledWith("/dashboardData");
    expect(kpis).toEqual(dashboardData.kpis);
    expect(recent).toEqual(dashboardData.recentConsumptions);
    expect(lowStocks).toEqual(dashboardData.lowStockAlerts);
  });

  it("does not log the fetched payload", async () => {
    const logSpy = vi.spyOn(console, "log");
    vi.mocked(api.get).mockResolvedValue(dashboardData);

    await dashboardApi.getDashboardData();

    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
