import { CreateReelRequest, Reel } from "./reel.types";

let cachedData: Reel[] | null = null;
export async function getReelsData(clearCache = false): Promise<Reel[]> {
  if (cachedData && !clearCache) {
    return cachedData;
  }
  if (clearCache) {
    cachedData = null;
  }
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/reels`;

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

export async function addReel(reelData: Omit<CreateReelRequest, "id">): Promise<Reel> {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/reels`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reelData),
  });

   const data = await res.json();
  if (!res.ok) {
    throw {
      ...data,
      status: res.status,
    }
  }

  return data;
}
