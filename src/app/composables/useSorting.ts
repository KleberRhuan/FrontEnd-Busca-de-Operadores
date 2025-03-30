import { SortDirection, SortableFields, type SortConfig } from '@/app/types'
import { ref, computed } from 'vue'

export function useSorting() {
  const sortConfig = ref<SortConfig>({
    sortField: null,
    sortDirection: null
  })

  const sortParams = computed(() => ({
    sortField: sortConfig.value.sortField,
    sortDirection: sortConfig.value.sortDirection
  }))

  /**
   * Atualiza o campo de ordenação. Se o campo for diferente do atual,
   * define o novo campo e reseta a direção para ASC.
   * Se o campo for o mesmo, permite atualizar a direção se necessário.
   * Retorna true se houve alteração.
   */
  const updateSort = (field: SortableFields, direction?: SortDirection) => {
    if (sortConfig.value.sortField !== field) {
      sortConfig.value = { sortField: field, sortDirection: SortDirection.ASC }
      return true
    }

    if (direction && sortConfig.value.sortDirection !== direction) {
      sortConfig.value.sortDirection = direction
      return true
    }

    return false
  }

  const toggleSortDirection = () => {
    const newDirection =
      sortConfig.value.sortDirection === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC
    return updateSort(sortConfig.value.sortField!, newDirection)
  }

  return {
    sortParams,
    updateSort,
    toggleSortDirection
  }
}
