import { buildDashboardStats } from "@/lib/dashboard/buildDashboardStats";

import { StatCard } from "../stat-card";
import {
  getDashboardData,
  getDashboardKpis,
} from "@/lib/dashboard/dashboard.api";

export default async function DashboardStats() {
  const data = await getDashboardKpis();
  const stats = buildDashboardStats(data);

  return (
    <>
      {stats.map(({ label, value, icon }) => (
        <StatCard key={label} label={label} value={value} icon={icon} />
      ))}
    </>
  );
}
