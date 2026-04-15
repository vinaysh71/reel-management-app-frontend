"use client";

import { Supplier } from "@/lib/supplier/supplier.types";
import { ColumnDef } from "@tanstack/react-table";

export interface ReelColumns {
  reelNo: string;
  supplier: Supplier;
  gsm: number;
  ply: number;
  grossWeight: number;
  netWeight: number;
  remainingWeight: number;
  status: "Available" | "In Use" | "Damaged" | "Consumed";
  location: string;
}

export const reelsColumns: ColumnDef<ReelColumns>[] = [
  {
    accessorKey: "reelNo",
    header: "Reel No",
  },
  {
    id: "supplier",
    accessorFn: (row) => row.supplier?.name,
    header: "Supplier",
    meta: {
      filterable: true,
    },
    cell: ({ row }) => (
      <span className="font-medium">{row.original.supplier?.name}</span>
    ),
  },
  {
    accessorKey: "gsm",
    header: "GSM",
    cell: ({ row }) => <span>{row.getValue("gsm")} </span>,
  },
  {
    accessorKey: "ply",
    header: "Ply",
  },
  {
    accessorKey: "grossWeight",
    header: "Gross Wt",
    cell: ({ row }) => <span>{row.getValue("grossWeight")} kg</span>,
  },
  {
    accessorKey: "netWeight",
    header: "Net Wt",
    cell: ({ row }) => <span>{row.getValue("netWeight")} kg</span>,
  },
  {
    accessorKey: "remainingWeight",
    header: "Remaining",
    cell: ({ row }) => <span>{row.getValue("remainingWeight")} kg</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      filterable: true, // dynamic dropdown filter
    },
    cell: ({ row }) => {
      const status = row.getValue<"Available" | "In Use">("status");

      let colorClass = "";
      if (status === "Available") {
        colorClass = "bg-emerald-600/90";
      } else if (status === "In Use") {
        colorClass = "bg-blue-600";
      } else if (status === "Damaged") {
        colorClass = "bg-red-600";
      } else {
        colorClass = "bg-neutral-600";
      }

      return (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colorClass}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
];
