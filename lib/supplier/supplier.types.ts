export type Supplier = {
  id: number;
  name: string;
  contact: {
    email: string;
    phone: string;
  };
  gstIn: string;
  address: string;
};
