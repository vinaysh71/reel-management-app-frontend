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
} from "@/components/ui/dialog"; // [web:6]
import { Input } from "@/components/ui/input"; // [web:8]
import { Label } from "@/components/ui/label"; // [web:6]
import { z } from "zod"; // [web:6]
import { handleBusinessError } from "@/lib/utils";
import { addSupplier } from "@/lib/supplier/supplier.api";

/* ------------------ SCHEMA ------------------ */
const supplierSchema = z.object({
  supplierName: z.string().min(1, "Supplier name is required"),
  contactPhone: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, "")) // remove spaces
    .refine(
      (val) => /^(\+91|91)?[6-9]\d{9}$/.test(val),
      "Invalid mobile number",
    ),
  contactEmail: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || z.email().safeParse(val).success,
      "Invalid email",
    ),
  gstIn: z.string().optional().or(z.literal("")),
});

type SupplierForm = z.infer<typeof supplierSchema>;

interface AddSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void; // Callback to refresh data after successful addition
}

export function AddSupplierDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddSupplierDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<SupplierForm>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      supplierName: "",
      contactPhone: "",
      contactEmail: "",
      gstIn: "",
    },
  });

  const onSubmit = async (data: SupplierForm) => {
    const payload = {
      name: data.supplierName,
      contact: {
        phone: data.contactPhone,
        email: data.contactEmail,
      },
      gstIn: data.gstIn,
    };
    // 👉 call your API here
    try {
      await addSupplier(payload);
      reset(); // clear form
      onOpenChange(false); // close dialog
      onSuccess(); // refresh suppliers data
    } catch (error) {
      handleBusinessError(error, setError);
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
          <DialogTitle>Add Supplier</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Supplier Name */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Supplier Name*</Label>

              <div className="col-span-3 space-y-1">
                <Input
                  {...register("supplierName")}
                  placeholder="Add supplier name"
                  className={errors.supplierName ? "border-red-500" : ""}
                />

                {errors.supplierName && (
                  <p className="text-red-500 text-xs">
                    {errors.supplierName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Phone */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="contactPhone" className="text-right">
                Contact Phone*
              </Label>

              <div className="col-span-3 space-y-1">
                <Input
                  id="contactPhone"
                  placeholder="Enter contact phone"
                  className="col-span-3"
                  {...register("contactPhone")}
                />
                {errors.contactPhone && (
                  <p className="text-red-500 text-xs">
                    {errors.contactPhone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Email */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="contactEmail" className="text-right">
                Contact Email
              </Label>

              <div className="col-span-3 space-y-1">
                <Input
                  id="contactEmail"
                  placeholder="Enter contact email"
                  className="col-span-3"
                  {...register("contactEmail")}
                />
                {errors.contactEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>
            </div>

            {/* GSTIN */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="gstIn" className="text-right">
                GSTIN
              </Label>

              <div className="col-span-3 space-y-1">
                <Input
                  id="gstIn"
                  placeholder="Enter GSTIN"
                  className="col-span-3"
                  {...register("gstIn")}
                />
                {errors.gstIn && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gstIn.message}
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
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
