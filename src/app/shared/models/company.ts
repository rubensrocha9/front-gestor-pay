export interface Company{
  id?: number;
  nameCompany: string;
  documentNumber: string;
  email: string;
}

export interface CompanyProfile {
  id?: number;
  name: string;
  documentNumber: string;
  phoneNumber: string;
  email: string;
  role?: string;
  criationDate?: string;
  address: CompanyAddress;
}

export interface CompanyAddress {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}
