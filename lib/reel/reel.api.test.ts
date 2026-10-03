import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/core/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

type ApiModule = typeof import("@/lib/core/api");
type ReelModule = typeof import("./reel.api");

let api: ApiModule["api"];
let reelApi: ReelModule;

// Module-level cache: reload the module for an isolated cache per test.
beforeEach(async () => {
  vi.resetModules();
  reelApi = await import("./reel.api");
  api = (await import("@/lib/core/api")).api;
});

describe("getReelsData cache", () => {
  it("fetches once and serves later calls from the cache", async () => {
    const reels = [{ id: 1, reelNo: "R001" }];
    vi.mocked(api.get).mockResolvedValue(reels);

    const first = await reelApi.getReelsData();
    const second = await reelApi.getReelsData();

    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get).toHaveBeenCalledWith("/reels");
    expect(first).toBe(second);
  });

  it("bypasses the cache when clearCache is true", async () => {
    vi.mocked(api.get).mockResolvedValue([]);

    await reelApi.getReelsData();
    await reelApi.getReelsData();
    expect(api.get).toHaveBeenCalledTimes(1);

    await reelApi.getReelsData(true);
    expect(api.get).toHaveBeenCalledTimes(2);
  });
});

describe("addReel", () => {
  it("posts the raw payload object (no double JSON encoding)", async () => {
    vi.mocked(api.post).mockResolvedValue({} as never);
    const payload = {
      reelNo: "R001",
      supplierId: 5,
      gsm: 150,
      ply: 3,
      grossWeight: 1000,
      netWeight: 950,
      status: "Available" as const,
    };

    await reelApi.addReel(payload);

    // The payload must reach api.post as an object — api.post performs the
    // single JSON.stringify. A string here would produce a double-encoded body.
    expect(api.post).toHaveBeenCalledWith("/reels", payload);
    expect(typeof vi.mocked(api.post).mock.calls[0][1]).toBe("object");
  });
});
