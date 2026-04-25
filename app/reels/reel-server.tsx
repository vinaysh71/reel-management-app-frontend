import { getReelsData } from "@/lib/reel/reel.api";
import { Reel } from "@/lib/reel/reel.types";
import { ReelsClient } from "./reel-client";

export async function ReelServer() {
  const reelsData: Reel[] = await getReelsData();

  return <ReelsClient reelsData={reelsData} />;
}
