"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"; // [web:6]
import { Input } from "@/components/ui/input"; // [web:8]
import { Label } from "@/components/ui/label"; // [web:6]

interface AddReelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddReelDialog({ open, onOpenChange }: AddReelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Reel</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Reel Number */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reelNumber" className="text-right">
              Reel Number
            </Label>
            <Input
              id="reelNumber"
              placeholder="e.g., R001234"
              className="col-span-3"
            />
          </div>

          {/* Supplier (input instead of select) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">
              Supplier
            </Label>
            <Input
              id="supplier"
              placeholder="Enter supplier"
              className="col-span-3"
            />
          </div>

          {/* Ply */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ply" className="text-right">
              Ply
            </Label>
            <Input id="ply" placeholder="e.g., 3" className="col-span-3" />
          </div>

          {/* Gross Wt (kg) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="grossWt" className="text-right">
              Gross Wt (kg)
            </Label>
            <Input
              id="grossWt"
              type="number"
              placeholder="e.g., 1000"
              className="col-span-3"
            />
          </div>

          {/* Net Wt (kg) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="netWt" className="text-right">
              Net Wt (kg)
            </Label>
            <Input
              id="netWt"
              type="number"
              placeholder="e.g., 950"
              className="col-span-3"
            />
          </div>

          {/* Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Input
              id="status"
              placeholder="e.g., In stock"
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
