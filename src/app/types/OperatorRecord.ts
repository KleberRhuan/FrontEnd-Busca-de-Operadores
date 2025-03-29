export interface OperatorRecord {
  id: number;
  registration: string;
  cnpj: string;
  businessName: string;
  tradeName?: string;
  modality: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state: string;
  postalCode?: string;
  areaCode?: string;
  phone?: string;
  fax?: string;
  email?: string;
  representative?: string;
  representativePosition?: string;
  marketingRegion?: number;
  registrationDate: string;
}
