"use client";
import { useForm } from "react-hook-form";
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

/* ------------------ SCHEMA ------------------ */
const reelSchema = z.object({
  reelNumber: z.string().min(1, "Reel number is required"),
  supplier: z.string().min(1, "Supplier is required"),
  ply: z.string().optional().or(z.literal("")),
  grossWeight: z.string().min(1, "Gross weight must be greater than 0"),
  netWeight: z.string().min(1, "Net weight must be greater than 0"),
});

type ReelForm = z.infer<typeof reelSchema>;

interface AddReelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddReelDialog({ open, onOpenChange }: AddReelDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReelForm>({
    resolver: zodResolver(reelSchema),
    defaultValues: {
      reelNumber: "",
      supplier: "",
      ply: undefined,
      grossWeight: undefined,
      netWeight: undefined,
    },
  });

  const onSubmit = async (data: ReelForm) => {
    console.log("Form Data:", data);

    // 👉 call your API here

    reset();
    onOpenChange(false);
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
              <Label htmlFor="reelNumber" className="text-right">
                Reel Number
              </Label>

              <div className="col-span-3 space-y-1">
                <Input
                  id="reelNumber"
                  placeholder="e.g., R001234"
                  className="col-span-3"
                  {...register("reelNumber")}
                />
                {errors.reelNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.reelNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Supplier (input instead of select) */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>

              <div className="col-span-3 space-y-1">
                <Input
                  id="supplier"
                  placeholder="Enter supplier"
                  className="col-span-3"
                  {...register("supplier")}
                />
                {errors.supplier && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.supplier.message}
                  </p>
                )}
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

            {/* Gross Wt (kg) */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="grossWt" className="text-right">
                Gross Wt (kg)
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
                Net Wt (kg)
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
