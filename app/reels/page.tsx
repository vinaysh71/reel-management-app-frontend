import { Reel } from "@/lib/reel/reel.types";
import { ReelsClient } from "./reel-client";
import { getReelsData } from "@/lib/reel/reel.api";
import { Suspense } from "react";

export default async function Page() {
  const reelsData: Reel[] = await getReelsData();
  console.log("fffffff", reelsData);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ReelsClient reelsData={reelsData} />;
      </Suspense>
    </>
  );
}
