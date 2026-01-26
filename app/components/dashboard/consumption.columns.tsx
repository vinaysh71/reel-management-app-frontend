import { ConsumptionEntry } from "@/lib/dashboard/dashboard.types";
import { ColumnDef } from "@tanstack/react-table";

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
