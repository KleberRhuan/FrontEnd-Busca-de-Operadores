import { ref } from 'vue'
import type { PaginationState } from '@/app/types'

export function usePagination(
  defaultPage: number = 1,
  defaultPageSize: number = 10
) {

  const pagination = ref<PaginationState>({
    page: defaultPage,
    pageSize: defaultPageSize,
    total: 0,
    totalPages: 0
  })

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

  const updatePaginationInfo = (total: number, totalPages: number) => {
    pagination.value.total = total
    pagination.value.totalPages = totalPages
  }

  const resetPage = () => {
    pagination.value.page = 1
  }

  return {
    pagination,
    handlePageChange,
    handlePageSizeChange,
    updatePaginationInfo,
    resetPage
  }
}
