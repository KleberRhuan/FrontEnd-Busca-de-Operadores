import type { ColumnDef } from '@tanstack/vue-table'
import type { OperatorRecord } from '@/app/types/OperatorRecord.ts'

export const operatorRecordColumns: ColumnDef<OperatorRecord>[] = [
  {
    accessorKey: 'registration',
    header: 'Registration'
  },
  {
    accessorKey: 'cnpj',
    header: 'CNPJ'
  },
  {
    accessorKey: 'businessName',
    header: 'Business Name'
  },
  {
    accessorKey: 'tradeName',
    header: 'Trade Name'
  },
  {
    accessorKey: 'modality',
    header: 'Modality'
  },
  {
    accessorKey: 'street',
    header: 'Street'
  },
  {
    accessorKey: 'number',
    header: 'Number'
  },
  {
    accessorKey: 'complement',
    header: 'Complement'
  },
  {
    accessorKey: 'neighborhood',
    header: 'Neighborhood'
  },
  {
    accessorKey: 'city',
    header: 'City'
  },
  {
    accessorKey: 'state',
    header: 'State'
  },
  {
    accessorKey: 'postalCode',
    header: 'Postal Code'
  },
  {
    accessorKey: 'areaCode',
    header: 'Area Code'
  },
  {
    accessorKey: 'phone',
    header: 'Phone'
  },
  {
    accessorKey: 'fax',
    header: 'Fax'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'representative',
    header: 'Representative'
  },
  {
    accessorKey: 'representativePosition',
    header: 'Representative Position'
  },
  {
    accessorKey: 'marketingRegion',
    header: 'Marketing Region'
  },
  {
    accessorKey: 'registrationDate',
    header: 'Registration Date',
    cell: ({ row }) => {
      const dateValue = row.getValue('registrationDate') as string | number;
      return new Date(dateValue).toLocaleDateString();
    }
  },
]
