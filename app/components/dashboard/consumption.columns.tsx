import { UsageLog } from "@/lib/dashboard/dashboard.types";
import { ColumnDef } from "@tanstack/react-table";

export const consumptionColumns: ColumnDef<UsageLog>[] = [
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
