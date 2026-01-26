import PageHeader from "../components/page-header";
import { Layers, Activity, TrendingUp, TriangleAlert } from "lucide-react";
import { HeaderActions } from "../components/header-actions";
import DashboardStats from "../components/dashboard/dashboard-stats";
import { Suspense } from "react";
import ConsumptionTable from "../components/dashboard/consumption-table";
import LowStockCard from "../components/dashboard/low-stock.card";

const DashboardStats1 = [
  { label: "Total Reels", value: 12, icon: Layers },
  { label: "In use", value: 345, icon: Activity },
  { label: "Consumed today", value: 89, icon: TrendingUp },
  { label: "Low Stock", value: 120, icon: TriangleAlert },
];

// const LowStockReels = [
//   { id: "R001", name: "Reel A", stock: "5kg" },
//   { id: "R002", name: "Reel B", stock: "3kg" },
//   { id: "R003", name: "Reel C", stock: "8kg" },
// ];

export default async function Page() {
  return (
    <>
      <PageHeader title="Dashboard">
        <HeaderActions />
      </PageHeader>
      <div className="flex flex-row gap-4 p-10">
        <div className="mt-2 flex-grow grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={<div>Loading stats...</div>}>
            <DashboardStats />
          </Suspense>

          <Suspense fallback={<div>Loading consumption table...</div>}>
            <ConsumptionTable />
          </Suspense>

          {/* <div className="col-span-1 sm:col-span-2 lg:col-span-4">
            <Card className="mb-4 rounded-xl">
              <CardTitle className="px-6 pt-6">
                Recent Consumption Table (last 10 entries)
              </CardTitle>
              <div className="px-6 py-4">
                <DataTable
                  columns={consumptionColumns}
                  data={recentConsumptionData}
                />
              </div>
            </Card>
          </div> */}
        </div>
        <div className="w-1/5">
          <Suspense fallback={<div>Loading low stock reels...</div>}>
            <LowStockCard />
          </Suspense>

          {/* <Card className="mt-2 p-6 rounded-xl">
            <CardTitle>Low stock reels</CardTitle>
            <div className="flex flex-col items-end">
              {LowStockReels.map(({ id, name, stock }) => (
                <div
                  key={id}
                  className="flex w-full m-2 items-center justify-between rounded-full bg-muted px-4 py-2 text-sm"
                >
                  <span>{name}</span>
                  <Badge className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                    {stock}
                  </Badge>
                </div>
              ))}
            </div>
            <CardContent></CardContent>
          </Card> */}
        </div>
      </div>
    </>
  );
}
