import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useSorting } from './useSorting'
import { usePagination } from './usePagination'
import { useSearch } from './useSearch'
import { useTableColumns, type ColumnDefinition } from './useTableColumns'
import { useFetchWithAbort } from './useFetchWithAbort'

export interface DataTableOptions<T> {
  columns: ColumnDefinition[]
  persistKey?: string
  defaultPageSize?: number
  searchDebounce?: number
  fetchFn: (params: any, signal: AbortSignal) => Promise<{
    items: T[]
    total: number
  }>
}

export function useDataTable<T = any>(options: DataTableOptions<T>) {
  const {
    columns: initialColumns,
    persistKey,
    defaultPageSize = 10,
    searchDebounce = 500,
    fetchFn
  } = options

  // Gerenciamento de colunas
  const { 
    columns, 
    visibleColumns, 
    toggleColumnVisibility, 
    isColumnVisible,
    resetColumns
  } = useTableColumns({ 
    persistKey, 
    initialColumns 
  })

  // Gerenciamento de ordenação (sorting)
  const { 
    sortConfig, 
    handleSorting, 
    sortParam 
  } = useSorting()

  // Gerenciamento de paginação
  const { 
    pagination, 
    handlePageChange, 
    handlePageSizeChange, 
    updatePaginationInfo, 
    resetPage 
  } = usePagination(1, defaultPageSize)

  // Gerenciamento de busca
  const { 
    searchTerm, 
    debouncedSearchTerm, 
    isSearching, 
    handleSearch, 
    clearSearch, 
    dispose: disposeSearch 
  } = useSearch({ 
    debounceDelay: searchDebounce,
    onSearch: () => resetPage()
  })

  // Estado para controlar os registros
  const items = ref<T[]>([])
  const isEmpty = computed(() => items.value.length === 0)

  // Parâmetros para a requisição
  const fetchParams = computed(() => {
    return {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      search: searchTerm.value,
      sort: sortParam.value
    }
  })

  // Fetch de dados usando o abort controller
  const { 
    isLoading,
    error: fetchError,
    execute: executeFetch,
    abort: abortFetch
  } = useFetchWithAbort<{ items: T[], total: number }>(
    (signal) => fetchFn(fetchParams.value, signal),
    {
      onSuccess: (result) => {
        items.value = result.items
        updatePaginationInfo(
          result.total, 
          Math.ceil(result.total / pagination.value.pageSize)
        )
      }
    }
  )

  // Atualizar dados quando os parâmetros mudarem
  watch(fetchParams, () => {
    executeFetch()
  }, { deep: true })

  // Função para atualizar dados manualmente
  const refresh = () => {
    return executeFetch()
  }

  // Função para limpar tudo e resetar
  const reset = () => {
    clearSearch()
    resetPage()
    refresh()
  }

  // Limpeza ao desmontar
  const dispose = () => {
    disposeSearch()
    abortFetch()
  }

  return {
    // Estados
    items,
    columns,
    visibleColumns,
    isEmpty,
    isLoading,
    isSearching,
    fetchError,
    searchTerm: debouncedSearchTerm,
    pagination,
    sortConfig,

    // Ações
    toggleColumnVisibility,
    isColumnVisible,
    resetColumns,
    handleSort: handleSorting,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    clearSearch,
    refresh,
    reset,
    dispose
  }
} 