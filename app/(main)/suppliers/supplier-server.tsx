import { getAllSuppliers } from "@/lib/supplier/supplier.api";
import { Supplier } from "@/lib/supplier/supplier.types";
import { SuppliersClient } from "./suppliers-client";

export async function SupplierServer() {
  const suppliersData: Supplier[] = await getAllSuppliers();

  return <SuppliersClient suppliersData={suppliersData} />;
}
