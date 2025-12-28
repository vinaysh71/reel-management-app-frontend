// app/reels/reels-client.tsx
"use client";

import { useState } from "react";
import PageHeader from "../components/page-header";
import { DataTable } from "../components/data-table";
import { HeaderActions } from "../components/header-actions";
import { AddReelDialog } from "./add-reel-dialog";
import { reelsColumns, reelsData } from "./columns";

export function ReelsClient() {
  const [isAddReelOpen, setIsAddReelOpen] = useState(false);

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
          data={reelsData}
          properties={{
            isSearchable: true,
            showColumnChooser: true,
            isFilterable: true,
            isSortable: true,
            showPagination: true,
          }}
        />
      </div>

      <AddReelDialog open={isAddReelOpen} onOpenChange={setIsAddReelOpen} />
    </>
  );
}
