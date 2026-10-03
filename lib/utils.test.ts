import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, toApiErrorDetails } from "@/lib/core/api-error";
import { handleBusinessError } from "./utils";

type TestField = "reelNo" | "supplierName";

const setError = vi.fn();

function run(err: unknown) {
  handleBusinessError<TestField>(err, setError);
}

describe("handleBusinessError", () => {
  beforeEach(() => {
    setError.mockReset();
    window.alert = vi.fn();
  });

  it("maps an ApiError with a field onto the form field", () => {
    run(
      new ApiError({
        status: 409,
        message: "Reel already exists",
        field: "reelNo",
        code: "REEL_ALREADY_EXISTS",
      }),
    );

    expect(setError).toHaveBeenCalledWith("reelNo", {
      type: "server",
      message: "Reel already exists",
    });
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("alerts the message for an ApiError without a field", () => {
    run(new ApiError({ status: 500, message: "Internal server error" }));

    expect(setError).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith("Internal server error");
  });

  it("accepts the structured plain-object contract (server action results)", () => {
    run({
      status: 409,
      message: "Supplier already exists",
      field: "supplierName",
      code: "SUPPLIER_ALREADY_EXISTS",
    });

    expect(setError).toHaveBeenCalledWith("supplierName", {
      type: "server",
      message: "Supplier already exists",
    });
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("alerts the message of a plain Error (legacy behavior)", () => {
    run(new Error("network is down"));

    expect(setError).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith("network is down");
  });

  it("falls back to a generic message for unknown errors", () => {
    run(undefined);

    expect(setError).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith("Something went wrong");
  });
});

describe("toApiErrorDetails", () => {
  it("serializes an ApiError into plain details", () => {
    const details = toApiErrorDetails(
      new ApiError({ status: 400, message: "bad", field: "gsm", code: "BAD" }),
    );

    expect(details).toEqual({ status: 400, message: "bad", field: "gsm", code: "BAD" });
  });

  it("passes through an already-structured object", () => {
    const details = { status: 422, message: "nope" };
    expect(toApiErrorDetails(details)).toBe(details);
  });

  it("uses status 0 for non-HTTP errors", () => {
    expect(toApiErrorDetails(new TypeError("Failed to fetch"))).toEqual({
      status: 0,
      message: "Failed to fetch",
    });
  });

  it("defaults unknown values to a generic message", () => {
    expect(toApiErrorDetails("boom")).toEqual({
      status: 0,
      message: "Something went wrong",
    });
  });
});
