import type { FilterFn } from '@tanstack/vue-table'
import type { OperatorRecord } from '../types/OperatorRecord'

// Função de filtro global que busca em todos os campos do operador
export const operatorRecordGlobalFilterFn: FilterFn<OperatorRecord> = (
  row,
  columnId,
  filterValue
) => {
  // Se não há valor de filtro, retorna true para incluir a linha
  if (!filterValue || typeof filterValue !== 'string') return true

  const searchTerm = filterValue.toLowerCase().trim()
  if (!searchTerm) return true

  const operator = row.original
  
  // Busca em cada campo do operador
  const searchableValues = [
    operator.registration,
    operator.cnpj,
    operator.businessName,
    operator.tradeName,
    operator.modality,
    operator.street,
    operator.number,
    operator.complement,
    operator.neighborhood,
    operator.city,
    operator.state,
    operator.postalCode,
    operator.areaCode,
    operator.phone,
    operator.fax,
    operator.email,
    operator.representative,
    operator.representativePosition,
    operator.marketingRegion?.toString(),
    operator.registrationDate
  ]
  
  // Verifica se algum dos valores contém o termo de busca
  return searchableValues.some(value => 
    value && value.toString().toLowerCase().includes(searchTerm)
  )
}
