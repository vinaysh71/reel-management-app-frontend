import { getIdToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!BASE_URL) {
    throw new Error("API base URL is not defined");
  }
  console.log("BASE_URL:", BASE_URL);
  console.log("ENDPOINT:", endpoint);
  console.log("REQUEST:", `${BASE_URL}${endpoint}`);
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
    const error = await response.text();

    throw new Error(`API Error ${response.status}: ${error}`);
  }

  return response.json() as T;
}
