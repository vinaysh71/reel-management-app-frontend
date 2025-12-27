"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Reel } from "./page";

export const reelsColumns: ColumnDef<Reel>[] = [
  {
    accessorKey: "reelNo",
    header: "Reel No",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
    meta: {
      filterable: true, // dynamic dropdown filter
    },
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("supplier")}</span>
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
    accessorKey: "grossWtKg",
    header: "Gross Wt",
    cell: ({ row }) => <span>{row.getValue("grossWtKg")} kg</span>,
  },
  {
    accessorKey: "netWtKg",
    header: "Net Wt",
    cell: ({ row }) => <span>{row.getValue("netWtKg")} kg</span>,
  },
  {
    accessorKey: "remainingKg",
    header: "Remaining",
    cell: ({ row }) => <span>{row.getValue("remainingKg")} kg</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      filterable: true, // dynamic dropdown filter
    },
    cell: ({ row }) => {
      const status = row.getValue<"Available" | "In Use">("status");

      const colorClasses =
        status === "Available"
          ? "bg-emerald-600/90 text-emerald-50"
          : "bg-blue-600/90 text-blue-50";

      return (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colorClasses}`}
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
