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

// export const reelsData: Reel[] = [
//   {
//     reelNo: "R001234",
//     supplier: "AccuCo",
//     gsm: 150,
//     ply: 3,
//     grossWtKg: 1000,
//     netWtKg: 950,
//     remainingKg: 120,
//     status: "Available",
//     location: "Rack A1",
//   },
//   {
//     reelNo: "R001235",
//     supplier: "AccuCo",
//     gsm: 140,
//     ply: 2,
//     grossWtKg: 980,
//     netWtKg: 920,
//     remainingKg: 60,
//     status: "In Use",
//     location: "Rack A5",
//   },
//   {
//     reelNo: "R001236",
//     supplier: "PaperCo",
//     gsm: 160,
//     ply: 3,
//     grossWtKg: 1050,
//     netWtKg: 980,
//     remainingKg: 250,
//     status: "Available",
//     location: "Rack B2",
//   },
//   {
//     reelNo: "R001237",
//     supplier: "AccuCo",
//     gsm: 150,
//     ply: 3,
//     grossWtKg: 1000,
//     netWtKg: 950,
//     remainingKg: 45,
//     status: "In Use",
//     location: "Rack A1",
//   },
//   {
//     reelNo: "R001238",
//     supplier: "PaperCo",
//     gsm: 170,
//     ply: 4,
//     grossWtKg: 1100,
//     netWtKg: 1020,
//     remainingKg: 380,
//     status: "Available",
//     location: "Rack C3",
//   },
//   {
//     reelNo: "R001239",
//     supplier: "MillWorks",
//     gsm: 155,
//     ply: 3,
//     grossWtKg: 1020,
//     netWtKg: 960,
//     remainingKg: 200,
//     status: "Available",
//     location: "Rack B1",
//   },
//   {
//     reelNo: "R001240",
//     supplier: "AccuCo",
//     gsm: 145,
//     ply: 2,
//     grossWtKg: 990,
//     netWtKg: 930,
//     remainingKg: 80,
//     status: "In Use",
//     location: "Rack A2",
//   },
//   {
//     reelNo: "R001241",
//     supplier: "PaperCo",
//     gsm: 165,
//     ply: 3,
//     grossWtKg: 1080,
//     netWtKg: 1010,
//     remainingKg: 310,
//     status: "Available",
//     location: "Rack C1",
//   },
//   {
//     reelNo: "R001242",
//     supplier: "MillWorks",
//     gsm: 150,
//     ply: 3,
//     grossWtKg: 1010,
//     netWtKg: 955,
//     remainingKg: 120,
//     status: "In Use",
//     location: "Rack B3",
//   },
//   {
//     reelNo: "R001243",
//     supplier: "AccuCo",
//     gsm: 140,
//     ply: 2,
//     grossWtKg: 970,
//     netWtKg: 915,
//     remainingKg: 55,
//     status: "Available",
//     location: "Rack A4",
//   },
//   {
//     reelNo: "R001244",
//     supplier: "PaperCo",
//     gsm: 175,
//     ply: 4,
//     grossWtKg: 1120,
//     netWtKg: 1045,
//     remainingKg: 400,
//     status: "Available",
//     location: "Rack C4",
//   },
//   {
//     reelNo: "R001245",
//     supplier: "MillWorks",
//     gsm: 160,
//     ply: 3,
//     grossWtKg: 1060,
//     netWtKg: 995,
//     remainingKg: 260,
//     status: "In Use",
//     location: "Rack B4",
//   },
//   {
//     reelNo: "R001246",
//     supplier: "AccuCo",
//     gsm: 150,
//     ply: 3,
//     grossWtKg: 1005,
//     netWtKg: 948,
//     remainingKg: 130,
//     status: "Available",
//     location: "Rack A3",
//   },
//   {
//     reelNo: "R001247",
//     supplier: "PaperCo",
//     gsm: 155,
//     ply: 3,
//     grossWtKg: 1035,
//     netWtKg: 972,
//     remainingKg: 220,
//     status: "In Use",
//     location: "Rack C2",
//   },
//   {
//     reelNo: "R001248",
//     supplier: "MillWorks",
//     gsm: 145,
//     ply: 2,
//     grossWtKg: 960,
//     netWtKg: 905,
//     remainingKg: 70,
//     status: "Available",
//     location: "Rack B5",
//   },
// ];
