"use client";

import { useState } from "react";
import PageHeader from "../components/page-header";
import { HeaderActions } from "../components/header-actions";
import { DataTable } from "../components/data-table";
import { supplierColumns } from "./columns";
import { Supplier } from "@/lib/supplier/supplier.types";
import { AddSupplierDialog } from "./add-supplier.dialog";
import { getAllSuppliers } from "@/lib/supplier/supplier.api";

type SuppliersClientProps = {
  suppliersData: Supplier[];
};

export function SuppliersClient({ suppliersData }: SuppliersClientProps) {
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>(suppliersData);

  const refreshSuppliersData = async () => {
    // You can implement a function in your API layer to fetch the latest suppliers data
    // For example, if you have a function called getAllSuppliers, you can call it here:
    const updatedSuppliers = await getAllSuppliers(true); // Pass true to bypass cache if implemented
    setSuppliers(updatedSuppliers);
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
          data={suppliers}
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
