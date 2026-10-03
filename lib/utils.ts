import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

type errorType = {
  field?: string;
  message?: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function handleBusinessError<TField extends string>(
  err: unknown,
  setError: (field: TField, error: { type: string; message?: string }) => void,
) {
  const businessError = typeof err === "object" && err !== null ? err as errorType : {};
  const field = typeof businessError.field === "string" ? businessError.field : undefined;
  const message = typeof businessError.message === "string" ? businessError.message : undefined;

  // ✅ field-level error
  if (field) {
    setError(field as TField, {
      type: "server",
      message,
    });
    return;
  }

  // fallback
  alert(message || "Something went wrong");
}
