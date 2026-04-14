import { Reel } from "@/lib/reel/reel.types";
import { ReelsClient } from "./reel-client";
import { getReelsData } from "@/lib/reel/reel.api";

export default async function Page() {
  const reelsData: Reel[] = await getReelsData();
  console.log("fffffff", reelsData);

  return <ReelsClient reelsData={reelsData} />;
}
