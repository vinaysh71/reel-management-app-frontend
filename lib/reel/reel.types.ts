export type ReelStatus = 'Available' | 'In Use' | 'Consumed' | 'Damaged';

export type Reel = {
  id: number;
  reelNo: string;
  supplierId: string;
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