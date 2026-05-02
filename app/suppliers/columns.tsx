import { ColumnDef } from "@tanstack/react-table";
import { Supplier } from "@/lib/supplier/supplier.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export const supplierColumns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "name",
    header: "Supplier Name",
    meta: {
      filterable: true,
    },
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorFn: (row) => row.contact?.phone,
    header: "Contact Phone",
    meta: {
      filterable: true,
    },
    cell: ({ getValue }) => <span>{(getValue() as string) || "-"}</span>,
  },
  {
    accessorFn: (row) => row.contact?.email,
    header: "Contact Email",
    cell: ({ getValue }) => <span>{(getValue() as string) || "-"}</span>,
  },
  {
    accessorKey: "gstIn",
    header: "GST",
    cell: ({ row }) => {
      return <span>{row.original.gstIn || "-"}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const supplier = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("Edit", supplier)}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-600"
              onClick={() => console.log("Delete", supplier)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
