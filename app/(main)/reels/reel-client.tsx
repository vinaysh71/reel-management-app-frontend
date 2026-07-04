// app/reels/reels-client.tsx
"use client";

import { useState } from "react";
import PageHeader from "../../components/page-header";
import { DataTable } from "../../components/data-table";
import { HeaderActions } from "../../components/header-actions";
import { AddReelDialog } from "./add-reel-dialog";
import { reelsColumns } from "./columns";
import { Reel } from "@/lib/reel/reel.types";
import { Supplier } from "@/lib/supplier/supplier.types";
import { getReelsData } from "@/lib/reel/reel.api";

type ReelClientProps = {
  reelsData: Reel[];
  supplierList: Supplier[];
};

export function ReelsClient({ reelsData, supplierList }: ReelClientProps) {
  const [isAddReelOpen, setIsAddReelOpen] = useState(false);
  const [reels, setReels] = useState<Reel[]>(reelsData);

  const refreshReelsData = async () => {
    const updatedReels = await getReelsData(true);
    setReels(updatedReels);
  };

  return (
    <>
      <PageHeader
        title="Reels"
        primaryAction={{
          label: "Add Reel",
          onClick: () => setIsAddReelOpen(true),
        }}
      >
        <HeaderActions />
      </PageHeader>

      <div className="p-10">
        <DataTable
          columns={reelsColumns}
          data={reels}
          properties={{
            isSearchable: true,
            showColumnChooser: true,
            isFilterable: true,
            isSortable: true,
            showPagination: true,
          }}
        />
      </div>

      <AddReelDialog
        open={isAddReelOpen}
        onOpenChange={setIsAddReelOpen}
        supplierList={supplierList}
        onSuccess={refreshReelsData}
      />
    </>
  );
}
