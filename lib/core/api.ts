import { apiFetch } from "./fetch";

export const api = {
  get: <T>(url: string) => apiFetch<T>(url),

  post: <T>(url: string, body: unknown) =>
    apiFetch<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(url: string, body: unknown) =>
    apiFetch<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(url: string, body: unknown) =>
    apiFetch<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(url: string) =>
    apiFetch<T>(url, {
      method: "DELETE",
    }),
};