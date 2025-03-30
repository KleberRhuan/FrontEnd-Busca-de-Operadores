import { ref, computed } from 'vue'
import {SortDirection, SortableFields, type SortConfig } from '@/app/types'

export function useSorting() {
  const sortConfig = ref<SortConfig>({
    order: null,
    field: null,
  })

  const sortParams = computed(() => { return {
    sortField: sortConfig.value.field,
    sortDirection: sortConfig.value.order,}
  })

  const handleSortFieldChange = (field: SortableFields) => {
    if (sortConfig.value.field !== field) {
      sortConfig.value.field = field
      return true
    }
    return false
  }

  const handleSortDirectionChange = (order: SortDirection) => {
    if (sortConfig.value.order !== order) {
      sortConfig.value.order = order
      return true
    }
    return false
  }

  const toggleSortDirection = () => {
    const newOrder =
      sortConfig.value.order === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
    return handleSortDirectionChange(newOrder)
  }

  const setSortFromApi = (field: SortableFields, order: SortDirection) => {
    if (field && (field !== sortConfig.value.field || order !== sortConfig.value.order)) {
      sortConfig.value = { field, order }
    }
  }

  return {
    setSortFromApi,
    sortParams,
    handleSortFieldChange,
    handleSortDirectionChange: handleSortDirectionChange,
    toggleSortDirection: toggleSortDirection,
  }
}
