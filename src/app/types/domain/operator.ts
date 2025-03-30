export interface Operator extends Record<string, unknown> {
  operatorRegistry: string;
  cnpj: string;
  corporateName: string;
  tradeName?: string;
  modality: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  areaCode?: string;
  phone?: string;
  fax?: string;
  email: string;
  representative: string;
  representativePosition: string;
  salesRegion?: number;
  registrationDate: Date;
}
