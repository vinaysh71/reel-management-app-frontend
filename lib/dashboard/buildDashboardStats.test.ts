import { describe, expect, it } from "vitest";
import { buildDashboardStats } from "./buildDashboardStats";
import { DashboardKpis } from "./dashboard.types";

const kpis: DashboardKpis = {
  totalReels: 42,
  inUse: 17,
  consumedToday: 5,
  lowStock: 3,
  wastagePercent: 2.5,
};

describe("buildDashboardStats", () => {
  it("builds one stat per KPI with the expected labels", () => {
    const stats = buildDashboardStats(kpis);

    expect(stats.map((stat) => stat.label)).toEqual([
      "Total Reels",
      "In use",
      "Consumed today",
      "Low Stock",
    ]);
  });

  it("maps KPI values onto the matching stats", () => {
    const stats = buildDashboardStats(kpis);

    expect(stats.map((stat) => stat.value)).toEqual([42, 17, 5, 3]);
  });

  it("provides an icon for every stat", () => {
    const stats = buildDashboardStats(kpis);

    for (const stat of stats) {
      expect(stat.icon).toBeDefined();
    }
  });
});
