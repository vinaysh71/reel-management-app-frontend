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

export type ContactInfo = {
  email?: string;
  phone: string;
};

export type CreateSupplierRequest = {
  name: string;
  contact: ContactInfo;
  gstIn?: string;
};
