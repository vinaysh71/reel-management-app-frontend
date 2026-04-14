import { Reel } from "./reel.types";

let cachedData: Reel[] | null = null;
export async function getReelsData(): Promise<Reel[]> {
  if (cachedData) {
    return cachedData;
  }
  const url = `${process.env.BASE_URL}/reels`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch reels data");
  }
  const data = await res.json();
  cachedData = data;
  return data;
}
