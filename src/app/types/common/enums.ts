/**
 * Enums básicos compartilhados em toda a aplicação
 */

/**
 * Direções possíveis para ordenação
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Campos Permitidos para ordenação na API
 */
export enum SortableFields {
  OPERATOR_REGISTRY = 'operatorRegistry',
  CNPJ = 'cnpj',
  CORPORATE_NAME = 'corporateName',
  TRADE_NAME = 'tradeName',
  MODALITY = 'modality',
  STREET = 'street',
  NUMBER = 'number',
  COMPLEMENT = 'complement',
  NEIGHBORHOOD = 'neighborhood',
  CITY = 'city',
  STATE = 'state',
  ZIP = 'zip',
  AREA_CODE = 'areaCode',
  PHONE = 'phone',
  FAX = 'fax',
  email = 'email',
  REPRESENTATIVE = 'representative',
  REPRESENTATIVE_POSITION = 'representativePosition',
  REGISTRATION_DATE = 'registrationDate',
}
