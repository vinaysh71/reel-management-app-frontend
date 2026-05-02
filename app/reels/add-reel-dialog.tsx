"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import z from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Supplier } from "@/lib/supplier/supplier.types";
import { stat } from "fs";
import { addReel, getReelsData } from "@/lib/reel/reel.api";
import { CreateReelRequest } from "@/lib/reel/reel.types";
import { handleBusinessError } from "@/lib/utils";

/* ------------------ SCHEMA ------------------ */
const reelSchema = z.object({
  reelNo: z.string().min(1, "Reel number is required"),
  supplier: z.string().min(1, "Supplier is required"),
  gsm: z.string().optional().or(z.literal("")),
  ply: z.string().optional().or(z.literal("")),
  status: z.enum(["Available", "In Use", "Consumed", "Damaged"] as const, {
    message: "Status is required",
  }),
  grossWeight: z.string().min(1, "Gross weight must be greater than 0"),
  netWeight: z.string().min(1, "Net weight must be greater than 0"),
});

type ReelForm = z.infer<typeof reelSchema>;

interface AddReelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplierList: Supplier[];
  onSuccess: () => void; // Callback to refresh data after successful addition
}

export function AddReelDialog({
  open,
  onOpenChange,
  supplierList,
  onSuccess,
}: AddReelDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
    control,
  } = useForm<ReelForm>({
    resolver: zodResolver(reelSchema),
    defaultValues: {
      reelNo: "",
      supplier: "",
      gsm: "",
      ply: "",
      grossWeight: "",
      netWeight: "",
    },
  });

  const onSubmit = async (data: ReelForm) => {
    const payload: CreateReelRequest = {
      reelNo: data.reelNo,
      supplierId: Number(data.supplier),
      gsm: data.gsm ? Number(data.gsm) : undefined,
      ply: data.ply ? Number(data.ply) : undefined,
      grossWeight: Number(data.grossWeight),
      netWeight: Number(data.netWeight),
      status: data.status,
    };
    // 👉 call your API here
    try {
      await addReel(payload);
      await getReelsData(true);
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      handleBusinessError(err, setError);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Reel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Reel Number */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="reelNo" className="text-right">
                Reel Number*
              </Label>

              <div className="col-span-3 space-y-1">
                <Input
                  id="reelNo"
                  placeholder="e.g., R001234"
                  className="col-span-3"
                  {...register("reelNo")}
                />
                {errors.reelNo && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.reelNo.message}
                  </p>
                )}
              </div>
            </div>

            {/* Supplier */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier*
              </Label>

              <div className="col-span-3 space-y-1">
                {/* TODO: Fetch suppliers from API instead of using hardcoded values */}
                <Controller
                  name="supplier"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Supplier" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {supplierList.map((supplier) => (
                            <SelectItem
                              key={supplier.id}
                              value={String(supplier.id)}
                            >
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.supplier && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.supplier.message}
                  </p>
                )}
              </div>
            </div>

            {/* GSM */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="gsm" className="text-right">
                Gsm
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="gsm"
                  placeholder="e.g., 150"
                  className="col-span-3"
                  {...register("gsm")}
                />
              </div>
            </div>

            {/* Ply */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="ply" className="text-right">
                Ply
              </Label>

              <div className="col-span-3 space-y-1">
                <Input
                  id="ply"
                  placeholder="e.g., 3"
                  className="col-span-3"
                  {...register("ply")}
                />
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="status" className="text-right">
                Status*
              </Label>

              <div className="col-span-3 space-y-1">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {["Available", "In Use", "Consumed", "Damaged"].map(
                            (status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            {/* Gross Wt (kg) */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="grossWt" className="text-right">
                Gross Wt (kg)*
              </Label>

              <div className="col-span-3 space-y-1">
                <Input
                  id="grossWt"
                  type="number"
                  placeholder="e.g., 1000"
                  className="col-span-3"
                  {...register("grossWeight")}
                />
                {errors.grossWeight && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.grossWeight.message}
                  </p>
                )}
              </div>
            </div>

            {/* Net Wt (kg) */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="netWt" className="text-right">
                Net Wt (kg)*
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="netWt"
                  type="number"
                  placeholder="e.g., 950"
                  className="col-span-3"
                  {...register("netWeight")}
                />
                {errors.netWeight && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.netWeight.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Reel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
