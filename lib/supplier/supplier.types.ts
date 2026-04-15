export type Supplier = {
  id: number;
  name: string;
  contact: {
    email: string;
    phone: string;
  };
  gstin: string;
  address: string;
};
