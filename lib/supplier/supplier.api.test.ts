import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/core/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

type ApiModule = typeof import("@/lib/core/api");
type SupplierModule = typeof import("./supplier.api");

let api: ApiModule["api"];
let supplierApi: SupplierModule;

// Module-level cache: reload the module for an isolated cache per test.
beforeEach(async () => {
  vi.resetModules();
  supplierApi = await import("./supplier.api");
  api = (await import("@/lib/core/api")).api;
});

describe("getAllSuppliers cache", () => {
  it("fetches once and serves later calls from the cache", async () => {
    const suppliers = [{ id: 1, name: "Acme" }];
    vi.mocked(api.get).mockResolvedValue(suppliers);

    const first = await supplierApi.getAllSuppliers();
    const second = await supplierApi.getAllSuppliers();

    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get).toHaveBeenCalledWith("/suppliers");
    expect(first).toBe(second);
  });

  it("bypasses the cache when clearCache is true", async () => {
    vi.mocked(api.get).mockResolvedValue([]);

    await supplierApi.getAllSuppliers();
    await supplierApi.getAllSuppliers();
    expect(api.get).toHaveBeenCalledTimes(1);

    await supplierApi.getAllSuppliers(true);
    expect(api.get).toHaveBeenCalledTimes(2);
  });
});

describe("addSupplier", () => {
  it("posts the raw payload object (no double JSON encoding)", async () => {
    vi.mocked(api.post).mockResolvedValue({} as never);
    const payload = {
      name: "Acme Papers",
      contact: { phone: "9876543210", email: "orders@acme.test" },
      gstIn: "22AAAAA0000A1Z5",
    };

    await supplierApi.addSupplier(payload);

    expect(api.post).toHaveBeenCalledWith("/suppliers", payload);
    expect(typeof vi.mocked(api.post).mock.calls[0][1]).toBe("object");
  });
});
