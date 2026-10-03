"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "../../components/page-header";
import { HeaderActions } from "../../components/header-actions";
import { DataTable } from "../../components/data-table";
import { supplierColumns } from "./columns";
import { Supplier } from "@/lib/supplier/supplier.types";
import { AddSupplierDialog } from "./add-supplier.dialog";

type SuppliersClientProps = {
  suppliersData: Supplier[];
};

export function SuppliersClient({ suppliersData }: SuppliersClientProps) {
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const router = useRouter();

  const refreshSuppliersData = () => {
    // Re-render the Server Components so SupplierServer re-fetches fresh data.
    router.refresh();
  };

  return (
    <>
      <PageHeader
        title="Suppliers"
        primaryAction={{
          label: "Add Supplier",
          onClick: () => setIsAddSupplierOpen(true),
        }}
      >
        <HeaderActions />
      </PageHeader>

      <div className="p-10 w-full">
        <DataTable
          columns={supplierColumns}
          data={suppliersData}
          properties={{
            isSearchable: true,
            showColumnChooser: true,
            isFilterable: true,
            isSortable: true,
            showPagination: true,
          }}
        />
      </div>

      <AddSupplierDialog
        open={isAddSupplierOpen}
        onOpenChange={setIsAddSupplierOpen}
        onSuccess={refreshSuppliersData}
      />
    </>
  );
}
