export type UsageLog = {
  id?: string;
  date?: string;
  reelNo?: string;
  orderNo?: string;
  qtyUsed?: number | string;
  operator?: string;
};

export type Reel = {
  id?: string;
  reelNo?: string;
  stock?: number;
  location?: string;
  status?: string;
};

export type DashboardData = {
    kpis: DashboardKpis,
    recentConsumptions: UsageLog[];
    lowStockAlerts: Reel[];
}

export type DashboardKpis = {
    totalReels: number;
    inUse: number;
    consumedToday: number;
    lowStock: number;
    wastagePercent: number;
};
