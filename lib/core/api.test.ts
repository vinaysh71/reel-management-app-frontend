import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./api";
import { apiFetch } from "./fetch";

vi.mock("./fetch", () => ({ apiFetch: vi.fn() }));

const apiFetchMock = vi.mocked(apiFetch);

describe("api HTTP verbs", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
    apiFetchMock.mockResolvedValue(undefined as never);
  });

  it("get issues a GET request without a body", () => {
    void api.get("/reels");

    // Only the endpoint is forwarded — no options object at all.
    expect(apiFetchMock.mock.calls[0]).toEqual(["/reels"]);
    expect(apiFetchMock).toHaveBeenCalledWith("/reels");
  });

  it("post serializes the body exactly once (no double encoding)", () => {
    const payload = { reelNo: "R001", supplierId: 5, status: "Available" };

    void api.post("/reels", payload);

    expect(apiFetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = apiFetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/reels");
    expect(init.method).toBe("POST");
    expect(typeof init.body).toBe("string");
    // One JSON.parse must yield the original object — a second stringify
    // would make the first parse return a string.
    expect(JSON.parse(init.body as string)).toEqual(payload);
    expect(init.body).toBe(JSON.stringify(payload));
  });

  it("put serializes the body exactly once", () => {
    const payload = { name: "Acme", contact: { phone: "9876543210" } };

    void api.put("/suppliers/1", payload);

    const [url, init] = apiFetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/suppliers/1");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body as string)).toEqual(payload);
  });

  it("patch serializes the body exactly once", () => {
    const payload = { status: "In Use" };

    void api.patch("/reels/1", payload);

    const [url, init] = apiFetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/reels/1");
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body as string)).toEqual(payload);
  });

  it("delete issues a DELETE request without a body", () => {
    void api.delete("/reels/1");

    const [url, init] = apiFetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/reels/1");
    expect(init.method).toBe("DELETE");
    expect(init.body).toBeUndefined();
  });
});
