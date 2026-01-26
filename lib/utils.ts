import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getDashboardData() {
  const res = await fetch(`${process.env.BASE_URL}/dashboard/kpis`);
  const data = await res.json();
  return data;
}