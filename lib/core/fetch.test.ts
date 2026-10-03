import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "./fetch";
import { ApiError } from "./api-error";
import { getIdToken } from "./auth";

vi.mock("./auth", () => ({ getIdToken: vi.fn() }));

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

function okResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as unknown as Response;
}

function errorResponse(status: number, body: string) {
  return {
    ok: false,
    status,
    json: async () => JSON.parse(body),
    text: async () => body,
  } as unknown as Response;
}

async function captureError(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (err) {
    return err as ApiError;
  }
  throw new Error("expected apiFetch to reject");
}

describe("apiFetch", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.mocked(getIdToken).mockReset();
    vi.mocked(getIdToken).mockResolvedValue("test-id-token");
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("requests BASE_URL + endpoint with JSON content type and bearer token", async () => {
    fetchMock.mockResolvedValue(okResponse({ id: 1 }));

    const result = await apiFetch<{ id: number }>("/reels");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${BASE_URL}/reels`);
    const headers = init.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers.Authorization).toBe("Bearer test-id-token");
    expect(getIdToken).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ id: 1 });
  });

  it("merges caller headers over the defaults", async () => {
    fetchMock.mockResolvedValue(okResponse({}));

    await apiFetch("/reels", {
      method: "POST",
      body: '{"reelNo":"R1"}',
      headers: { "Content-Type": "application/vnd.api+json", "X-Trace": "abc" },
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(init.method).toBe("POST");
    expect(init.body).toBe('{"reelNo":"R1"}');
    expect(headers["Content-Type"]).toBe("application/vnd.api+json");
    expect(headers["X-Trace"]).toBe("abc");
    expect(headers.Authorization).toBe("Bearer test-id-token");
  });

  it("throws a typed ApiError for backend business errors {code, message, field}", async () => {
    fetchMock.mockResolvedValue(
      errorResponse(
        409,
        JSON.stringify({
          code: "REEL_ALREADY_EXISTS",
          message: "Reel already exists",
          field: "reelNo",
        }),
      ),
    );

    const err = await captureError(apiFetch("/reels", { method: "POST" }));

    expect(err).toBeInstanceOf(ApiError);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("ApiError");
    expect(err.status).toBe(409);
    expect(err.message).toBe("Reel already exists");
    expect(err.field).toBe("reelNo");
    expect(err.code).toBe("REEL_ALREADY_EXISTS");
  });

  it("throws a typed ApiError for validation errors {message, errors[]}", async () => {
    fetchMock.mockResolvedValue(
      errorResponse(
        400,
        JSON.stringify({
          message: "Invalid input",
          errors: [{ field: "reelNo", message: "reelNo is required" }],
        }),
      ),
    );

    const err = await captureError(apiFetch("/reels", { method: "POST" }));

    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(400);
    expect(err.message).toBe("reelNo is required");
    expect(err.field).toBe("reelNo");
    expect(err.code).toBeUndefined();
  });

  it("throws a typed ApiError for generic {error} responses (HTTP 500)", async () => {
    fetchMock.mockResolvedValue(errorResponse(500, JSON.stringify({ error: "boom" })));

    const err = await captureError(apiFetch("/reels"));

    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(500);
    expect(err.message).toBe("boom");
    expect(err.field).toBeUndefined();
    expect(err.code).toBeUndefined();
  });

  it("maps 401 auth middleware errors {error} onto the contract", async () => {
    fetchMock.mockResolvedValue(
      errorResponse(401, JSON.stringify({ error: "missing authorization header" })),
    );

    const err = await captureError(apiFetch("/reels"));

    expect(err.status).toBe(401);
    expect(err.message).toBe("missing authorization header");
  });

  it("keeps the legacy message format for non-JSON error bodies", async () => {
    fetchMock.mockResolvedValue(errorResponse(502, "<html>bad gateway</html>"));

    const err = await captureError(apiFetch("/reels"));

    expect(err.status).toBe(502);
    expect(err.message).toBe("API Error 502: <html>bad gateway</html>");
  });

  it("handles empty error bodies", async () => {
    fetchMock.mockResolvedValue(errorResponse(500, ""));

    const err = await captureError(apiFetch("/reels"));

    expect(err.status).toBe(500);
    expect(err.message).toBe("API Error 500");
  });

  it("does not log requests, URLs or tokens", async () => {
    const logSpy = vi.spyOn(console, "log");
    fetchMock.mockResolvedValue(okResponse([]));

    await apiFetch("/reels");

    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it("throws when the API base URL is not configured", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "");

    const { apiFetch: freshApiFetch } = await import("./fetch");

    await expect(freshApiFetch("/reels")).rejects.toThrow(
      "API base URL is not defined",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
