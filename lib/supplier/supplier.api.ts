import { api } from "../core/api";
import { CreateSupplierRequest, Supplier } from "./supplier.types";

let cachedSuppliers: Supplier[] | null = null;

export async function getAllSuppliers(clearCache = false): Promise<Supplier[]> {
    if (cachedSuppliers && !clearCache) {
        return cachedSuppliers;
    }
    if (clearCache) {
        cachedSuppliers = null;
    }

    const res = await api.get<Supplier[]>("/suppliers")

    cachedSuppliers = res;
    return res;
}

export async function addSupplier(supplierData: Omit<CreateSupplierRequest, "id">): Promise<Supplier> {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/suppliers`;

    return await api.post<Supplier>("/suppliers", JSON.stringify(supplierData))
}