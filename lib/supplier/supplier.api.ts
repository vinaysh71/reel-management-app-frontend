import { CreateSupplierRequest, Supplier } from "./supplier.types";

let cachedSuppliers: Supplier[] | null = null;

export async function getAllSuppliers(clearCache = false): Promise<Supplier[]> {
    if (cachedSuppliers && !clearCache) {
        return cachedSuppliers;
    }
    if (clearCache) {
        cachedSuppliers = null;
    }
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/suppliers`;

    const res = await fetch(url, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch suppliers data");
    }
    const data = await res.json();
    cachedSuppliers = data;
    return data;
}

export async function addSupplier(supplierData: Omit<CreateSupplierRequest, "id">): Promise<Supplier> {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/suppliers`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(supplierData),
    });

    const data = await res.json();
    if (!res.ok) {
        throw {
            ...data,
            status: res.status,
        };
    }

    return data;
}