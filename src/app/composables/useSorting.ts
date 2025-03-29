import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface SortConfig {
  field: string
  order: 'asc' | 'desc'
}

export function useSorting(defaultField: string = 'id', defaultOrder: 'asc' | 'desc' = 'asc') {
  // Estado da ordenação
  const sortConfig = ref<SortConfig>({
    field: defaultField,
    order: defaultOrder
  })

  // Handlers para ordenação
  const handleSorting = (field: string) => {
    let order: 'asc' | 'desc' = 'asc'
    
    if (sortConfig.value.field === field) {
      // Inverter a ordem se o campo já está selecionado
      order = sortConfig.value.order === 'asc' ? 'desc' : 'asc'
    }
    
    // Atualizar apenas se algo mudou
    if (sortConfig.value.field !== field || sortConfig.value.order !== order) {
      sortConfig.value = { field, order }
      return true
    }

    return false
  }

  // Computar o parâmetro de ordenação para a API
  const sortParam = computed(() => {
    const { field, order } = sortConfig.value
    return order === 'desc' ? `-${field}` : field
  })

  return {
    sortConfig,
    handleSorting,
    sortParam
  }
} 