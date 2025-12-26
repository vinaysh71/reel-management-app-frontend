import PageHeader from "../components/page-header";
import { Layers, Activity, TrendingUp, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "../components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { HeaderActions } from "../components/header-actions";
import { StatCard } from "../components/stat-card";

const DashboardStats = [
  { label: "Total Reels", value: 12, icon: Layers },
  { label: "In use", value: 345, icon: Activity },
  { label: "Consumed today", value: 89, icon: TrendingUp },
  { label: "Low Stock", value: 120, icon: TriangleAlert },
];

const LowStockReels = [
  { id: "R001", name: "Reel A", stock: "5kg" },
  { id: "R002", name: "Reel B", stock: "3kg" },
  { id: "R003", name: "Reel C", stock: "8kg" },
];

export type ConsumptionEntry = {
  date: string;
  reelNo: string;
  orderNo: string;
  qtyUsed: string;
  operator: string;
};

export const consumptionColumns: ColumnDef<ConsumptionEntry>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "reelNo",
    header: "Reel No",
  },
  {
    accessorKey: "orderNo",
    header: "Order No",
  },
  {
    accessorKey: "qtyUsed",
    header: "Qty Used",
  },
  {
    accessorKey: "operator",
    header: "Operator",
  },
];

export const recentConsumptionData: ConsumptionEntry[] = [
  {
    date: "2025-10-11",
    reelNo: "R001234",
    orderNo: "O345",
    qtyUsed: "50 kg",
    operator: "John D.",
  },
  {
    date: "2025-10-11",
    reelNo: "R001235",
    orderNo: "O346",
    qtyUsed: "12 kg",
    operator: "Jane S.",
  },
  {
    date: "2025-10-10",
    reelNo: "R001230",
    orderNo: "O342",
    qtyUsed: "35 kg",
    operator: "Mike R.",
  },
  {
    date: "2025-10-10",
    reelNo: "R001228",
    orderNo: "O340",
    qtyUsed: "28 kg",
    operator: "Sarah L.",
  },
  {
    date: "2025-10-09",
    reelNo: "R001220",
    orderNo: "O338",
    qtyUsed: "45 kg",
    operator: "Tom B.",
  },
];

export default function Page() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        primaryAction={{
          label: "Add Reel",
        }}
      >
        <HeaderActions />
      </PageHeader>
      <div className="flex flex-row gap-4 p-10">
        <div className="mt-2 flex-grow grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DashboardStats.map(({ label, value, icon }, index) => (
            <div key={index} className="">
              <StatCard label={label} value={value} icon={icon} />
            </div>
          ))}

          <div className="col-span-1 sm:col-span-2 lg:col-span-4">
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
          </div>
        </div>
        <div className="w-1/5">
          <Card className="mt-2 p-6 rounded-xl">
            <CardTitle>Low stock reels</CardTitle>
            <div className="flex flex-col">
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
          </Card>
        </div>
      </div>
    </>
  );
}
