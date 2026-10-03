/**
 * Structured error contract for the API layer.
 *
 * Mirrors the error response shapes produced by the Go backend:
 * - business errors:  `{ code, message, field? }`   (HTTP 400/409)
 * - validation errors: `{ message, errors: [{ field, message }] }` (HTTP 400)
 * - generic errors:    `{ error }`                  (HTTP 401/404/500)
 *
 * `status: 0` means the error did not come from an HTTP response
 * (e.g. a network failure or a non-HTTP error).
 */
export type ApiErrorDetails = {
  status: number;
  message: string;
  field?: string;
  code?: string;
};

export class ApiError extends Error {
  readonly status: number;
  readonly field?: string;
  readonly code?: string;

  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.name = "ApiError";
    this.status = details.status;
    this.field = details.field;
    this.code = details.code;
  }
}

export function isApiErrorDetails(value: unknown): value is ApiErrorDetails {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  if (typeof record.message !== "string") return false;
  if (typeof record.status !== "number") return false;
  if (record.field !== undefined && typeof record.field !== "string") return false;
  if (record.code !== undefined && typeof record.code !== "string") return false;
  return true;
}

/**
 * Normalize any thrown value into {@link ApiErrorDetails} so UI error
 * handling only ever deals with the structured contract.
 */
export function toApiErrorDetails(err: unknown): ApiErrorDetails {
  if (err instanceof ApiError) {
    return { status: err.status, message: err.message, field: err.field, code: err.code };
  }
  if (isApiErrorDetails(err)) {
    return err;
  }
  if (typeof err === "object" && err !== null) {
    const record = err as Record<string, unknown>;
    const message = typeof record.message === "string" ? record.message : undefined;
    const field =
      typeof record.field === "string" && record.field ? record.field : undefined;
    if (message !== undefined || field !== undefined) {
      return { status: 0, message: message ?? "Something went wrong", field };
    }
  }
  return { status: 0, message: "Something went wrong" };
}