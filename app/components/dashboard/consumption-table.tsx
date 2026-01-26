import { Card, CardTitle } from "@/components/ui/card";
import { DataTable } from "../data-table";
import { consumptionColumns } from "./consumption.columns";
import { ConsumptionEntry } from "@/lib/dashboard/dashboard.types";
import { getRecentConsumption } from "@/lib/dashboard/dashboard.api";

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

export default async function ConsumptionTable() {
  const data = await getRecentConsumption();
  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-4">
      <Card className="mb-4 rounded-xl">
        <CardTitle className="px-6 pt-6">
          Recent Consumption Table (last 10 entries)
        </CardTitle>
        <div className="px-6 py-4">
          {data ? (
            <DataTable columns={consumptionColumns} data={data} />
          ) : (
            <p>No consumption data available.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
