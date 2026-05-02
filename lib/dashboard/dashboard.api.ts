import { DashboardData } from "./dashboard.types";

let cachedData: DashboardData | null = null;

export async function getDashboardData(): Promise<DashboardData> {
  if (cachedData) {
    return cachedData;
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboardData`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  const data = await res.json();
  cachedData = data;
  return data;
}

export async function getDashboardKpis() {
  const data = await getDashboardData();
  return data.kpis;
}

export async function getRecentConsumption() {
  const data = await getDashboardData();
  return data.recentConsumptions;
}

export async function getLowStocks() {
  const data = await getDashboardData();
  return data.lowStockAlerts;
}
