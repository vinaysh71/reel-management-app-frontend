import { api } from "@/lib/core/api";
import { DashboardData } from "./dashboard.types";

let cachedData: DashboardData | null = null;

export async function getDashboardData(): Promise<DashboardData> {
  if (cachedData) {
    return cachedData;
  }
  const res = await api.get<DashboardData>(`/dashboardData`);
  console.log("FETCHING DASHBOARD DATA:", JSON.stringify(res));
  cachedData = res;
  return res;
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
