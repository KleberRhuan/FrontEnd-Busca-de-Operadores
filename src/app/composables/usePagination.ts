import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface PaginationState {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export function usePagination(
  defaultPage: number = 1,
  defaultPageSize: number = 10
) {
  // Estado da paginação
  const pagination = ref<PaginationState>({
    page: defaultPage,
    pageSize: defaultPageSize,
    total: 0,
    totalPages: 0
  })

  // Handlers para mudanças de página
  const handlePageChange = (page: number) => {
    if (pagination.value.page === page) return false
    pagination.value = { ...pagination.value, page }
    return true
  }

  const handlePageSizeChange = (size: number) => {
    if (pagination.value.pageSize === size) return false
    pagination.value = { ...pagination.value, pageSize: size, page: 1 }
    return true
  }

  // Atualizar informações da paginação
  const updatePaginationInfo = (total: number, totalPages: number) => {
    pagination.value = {
      ...pagination.value,
      total,
      totalPages
    }
  }

  // Resetar paginação para página 1
  const resetPage = () => {
    pagination.value = {
      ...pagination.value,
      page: 1
    }
  }

  return {
    pagination,
    handlePageChange,
    handlePageSizeChange,
    updatePaginationInfo,
    resetPage
  }
} 