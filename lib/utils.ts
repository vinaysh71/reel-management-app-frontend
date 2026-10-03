import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

type errorType = {
  field?: string;
  message?: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function handleBusinessError(err: errorType, setError: (field: string, error: { type: string; message?: string }) => void) {
  const field = err?.field;
  const message = err?.message;

  // ✅ field-level error
  if (field) {
    setError(field, {
      type: "server",
      message,
    });
    return;
  }

  // fallback
  alert(message || "Something went wrong");
}
