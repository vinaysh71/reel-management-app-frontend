import { CreateReelRequest, Reel } from "./reel.types";
import {api} from "@/lib/core/api"

let cachedData: Reel[] | null = null;

export async function getReelsData(clearCache = false): Promise<Reel[]> {
  if (cachedData && !clearCache) {
    return cachedData;
  }
  if (clearCache) {
    cachedData = null;
  }

  const res = await api.get<Reel[]>("/reels") 
  cachedData = res;
  return res;
}

export async function addReel(reelData: Omit<CreateReelRequest, "id">): Promise<Reel> {
    return await api.post<Reel>("/reels", reelData);
}
