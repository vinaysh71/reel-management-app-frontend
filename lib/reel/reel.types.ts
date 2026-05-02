import { Supplier } from "../supplier/supplier.types";

export type ReelStatus = 'Available' | 'In Use' | 'Consumed' | 'Damaged';

export type Reel = {
  id: number;
  reelNo: string;
  supplier: Supplier;
  gsm: number;
  ply: number;
  grossWeight: number;
  netWeight: number;
  remainingWeight: number;
  status: ReelStatus; 
  receivedDate?: string;
  location: string;
  notes?: string;
};

export type CreateReelRequest = {
  reelNo: string;
  supplierId: number;
  gsm?: number;
  ply?: number;
  grossWeight: number;
  netWeight: number;
  status: "Available" | "In Use" | "Consumed" | "Damaged";
};