import { Card, CardTitle } from "@/components/ui/card";
import { DataTable } from "../data-table";
import { consumptionColumns } from "./consumption.columns";
import { ConsumptionEntry } from "@/lib/dashboard/dashboard.types";
import { getRecentConsumption } from "@/lib/dashboard/dashboard.api";

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
