import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toApiErrorDetails } from "@/lib/core/api-error"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function handleBusinessError<TField extends string>(
  err: unknown,
  setError: (field: TField, error: { type: string; message?: string }) => void,
) {
  const details = toApiErrorDetails(err);

  // ✅ field-level error
  if (details.field) {
    setError(details.field as TField, {
      type: "server",
      message: details.message,
    });
    return;
  }

  // fallback
  alert(details.message || "Something went wrong");
}
