import { Supplier } from "./supplier.types";

let cachedSuppliers: Supplier[] | null = null;

export async function getAllSuppliers(): Promise<Supplier[]> {
    if (cachedSuppliers) {
        return cachedSuppliers;
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