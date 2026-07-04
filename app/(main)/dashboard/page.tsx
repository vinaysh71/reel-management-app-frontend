import PageHeader from "../../components/page-header";
import { Layers, Activity, TrendingUp, TriangleAlert } from "lucide-react";
import { HeaderActions } from "../../components/header-actions";
import DashboardStats from "../../components/dashboard/dashboard-stats";
import { Suspense } from "react";
import ConsumptionTable from "../../components/dashboard/consumption-table";
import LowStockCard from "../../components/dashboard/low-stock.card";
import { DashboardSkeleton } from "../../components/dashboard/dashboard-skeleton";

export default async function Page() {
  return (
    <>
      <PageHeader title="Dashboard">
        <HeaderActions />
      </PageHeader>
      <div className="flex flex-row gap-4 p-10">
        <Suspense fallback={<DashboardSkeleton />}>
          <div className="mt-2 flex-grow grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardStats />
            <ConsumptionTable />
          </div>
          <div className="w-1/5">
            <LowStockCard />
          </div>
        </Suspense>
      </div>
    </>
  );
}
