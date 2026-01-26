export type DashboardData = {
    kpis: DashboardKpis,
    recentConsumptions: any[]; // TODO: replace 'any' with UsageLog model type
    lowStockAlerts: any[]; // TODO: replace 'any' with Reel model type
}

export type DashboardKpis = {
    totalReels: number;
    inUse: number;
    consumedToday: number;
    lowStock: number;
    wastagePercent: number;
};

export type ConsumptionEntry = {
  date: string;
  reelNo: string;
  orderNo: string;
  qtyUsed: string;
  operator: string;
};
