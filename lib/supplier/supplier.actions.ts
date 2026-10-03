"use server";

import { toApiErrorDetails, ApiErrorDetails } from "@/lib/core/api-error";
import { addSupplier, getAllSuppliers } from "@/lib/supplier/supplier.api";
import { CreateSupplierRequest, Supplier } from "@/lib/supplier/supplier.types";

export type CreateSupplierActionResult =
  | { ok: true; supplier: Supplier }
  | { ok: false; error: ApiErrorDetails };

/**
 * Server Action that runs the authenticated create-supplier call on the server
 * (keeping `getServerSession`-backed code out of the client bundle) and
 * refreshes the server-side suppliers cache so the following `router.refresh()`
 * picks up the new data.
 */
export async function createSupplierAction(
  payload: Omit<CreateSupplierRequest, "id">,
): Promise<CreateSupplierActionResult> {
  try {
    const supplier = await addSupplier(payload);
    await getAllSuppliers(true);
    return { ok: true, supplier };
  } catch (err) {
    // Returned instead of thrown: server action errors are masked in production.
    return { ok: false, error: toApiErrorDetails(err) };
  }
}