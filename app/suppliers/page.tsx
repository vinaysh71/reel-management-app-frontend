import { Supplier } from "@/lib/supplier/supplier.types";
import { Suspense } from "react";
import { ReelsTableSkeleton } from "../components/table-skeleton";
import { SupplierServer } from "./supplier-server";

export default function Page() {
  return (
    <>
      <Suspense fallback={<ReelsTableSkeleton />}>
        <SupplierServer />
      </Suspense>
    </>
  );
}
