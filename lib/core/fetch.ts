import { getIdToken } from "./auth";
import { ApiError, ApiErrorDetails } from "./api-error";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * Map a non-OK backend response body onto the structured error contract.
 * Falls back to the legacy `API Error <status>: <raw body>` message when the
 * body does not match any known error shape.
 */
function parseErrorBody(status: number, raw: string): ApiErrorDetails {
  if (raw) {
    try {
      const body: unknown = JSON.parse(raw);
      if (typeof body === "object" && body !== null) {
        const record = body as Record<string, unknown>;
        const code =
          typeof record.code === "string" && record.code ? record.code : undefined;
        const field =
          typeof record.field === "string" && record.field ? record.field : undefined;

        // validation errors: { message, errors: [{ field, message }] }
        if (Array.isArray(record.errors) && record.errors.length > 0) {
          const first = record.errors[0];
          if (typeof first === "object" && first !== null) {
            const firstRecord = first as Record<string, unknown>;
            const message =
              typeof firstRecord.message === "string" && firstRecord.message
                ? firstRecord.message
                : undefined;
            const errorField =
              typeof firstRecord.field === "string" && firstRecord.field
                ? firstRecord.field
                : undefined;
            if (message) {
              return { status, message, field: errorField, code };
            }
          }
        }

        // business errors: { code, message, field? } (also top-level validation message)
        if (typeof record.message === "string" && record.message) {
          return { status, message: record.message, field, code };
        }

        // generic errors: { error }
        if (typeof record.error === "string" && record.error) {
          return { status, message: record.error, field, code };
        }
      }
    } catch {
      // body is not JSON — fall back to the raw text below
    }
    return { status, message: `API Error ${status}: ${raw}` };
  }
  return { status, message: `API Error ${status}` };
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!BASE_URL) {
    throw new Error("API base URL is not defined");
  }
  const token = await getIdToken();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new ApiError(parseErrorBody(response.status, raw));
  }

  return response.json() as T;
}
