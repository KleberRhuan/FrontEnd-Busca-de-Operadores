import type { ColumnDefinition } from '@/app/composables/useTableColumns'

export const columns: ColumnDefinition[] = [
  {
    id: 'registration',
    title: 'Registro',
    sortable: true,
    visible: true
  },
  {
    id: 'cnpj',
    title: 'CNPJ',
    sortable: true,
    visible: true
  },
  {
    id: 'businessName',
    title: 'Razão Social',
    sortable: true,
    visible: true
  },
  {
    id: 'tradeName',
    title: 'Nome Fantasia',
    sortable: true,
    visible: true
  },
  {
    id: 'modality',
    title: 'Modalidade',
    sortable: true,
    visible: true
  },
  {
    id: 'street',
    title: 'Rua',
    sortable: true,
    visible: false
  },
  {
    id: 'number',
    title: 'Número',
    sortable: false,
    visible: false
  },
  {
    id: 'complement',
    title: 'Complemento',
    sortable: false,
    visible: false
  },
  {
    id: 'neighborhood',
    title: 'Bairro',
    sortable: true,
    visible: false
  },
  {
    id: 'city',
    title: 'Cidade',
    sortable: true,
    visible: true
  },
  {
    id: 'state',
    title: 'Estado',
    sortable: true,
    visible: true
  },
  {
    id: 'postalCode',
    title: 'CEP',
    sortable: false,
    visible: false
  },
  {
    id: 'phone',
    title: 'Telefone',
    sortable: false,
    visible: true
  },
  {
    id: 'email',
    title: 'Email',
    sortable: true,
    visible: true
  },
  {
    id: 'representative',
    title: 'Representante',
    sortable: true,
    visible: true
  },
  {
    id: 'registrationDate',
    title: 'Data de Registro',
    sortable: true,
    visible: true
  }
]
