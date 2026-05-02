import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function handleBusinessError(err: any, setError: any) {
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
