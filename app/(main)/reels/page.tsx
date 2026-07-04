import { Reel } from "@/lib/reel/reel.types";
import { ReelsClient } from "./reel-client";
import { getReelsData } from "@/lib/reel/reel.api";
import { Suspense } from "react";
import { ReelsTableSkeleton } from "../../components/table-skeleton";
import { ReelServer } from "./reel-server";

export default function Page() {
  return (
    <>
      <Suspense fallback={<ReelsTableSkeleton />}>
        <ReelServer />
      </Suspense>
    </>
  );
}
