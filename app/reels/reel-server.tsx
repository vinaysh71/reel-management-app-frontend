import { getReelsData } from "@/lib/reel/reel.api";
import { Reel } from "@/lib/reel/reel.types";
import { ReelsClient } from "./reel-client";
import { get } from "http";
import { getAllSuppliers } from "@/lib/supplier/supplier.api";

export async function ReelServer() {
  const reelsData: Reel[] = await getReelsData();
  const supplierList = await getAllSuppliers();

  return <ReelsClient reelsData={reelsData} supplierList={supplierList} />;
}
