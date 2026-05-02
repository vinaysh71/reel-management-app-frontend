import { Layers, Activity, TrendingUp, TriangleAlert } from "lucide-react";
import { DashboardKpis } from "./dashboard.types";



export const buildDashboardStats = (data: DashboardKpis) => [
  { label: "Total Reels", value: data.totalReels, icon: Layers },
  { label: "In use", value: data.inUse, icon: Activity },
  { label: "Consumed today", value: data.consumedToday, icon: TrendingUp },
  { label: "Low Stock", value: data.lowStock, icon: TriangleAlert },
];
