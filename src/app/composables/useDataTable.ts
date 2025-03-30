import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import {
  useSwrvCache,
  useTableColumns,
  useSearch,
  usePagination,
  useSorting,
} from '@/app/composables'
import {
  type DataTableOptions,
  type FetchOperatorsParams,
  type PaginatedResponse,
  SortableFields,
} from '@/app/types'
import { API_CONFIG } from '@/app/config/api.ts'
import { apiErrorState } from '@/app/composables/useApiErrorState'

export function useDataTable<T extends Record<string, unknown>>(options: DataTableOptions<T>) {
  const {
    columns: initialColumns,
    persistKey,
    defaultPageSize = 10,
    globalDebounce = 1000,
  } = options

  const { error, setError, clearError, wrap } = apiErrorState

  const { columns, visibleColumns, toggleColumnVisibility, isColumnVisible, resetColumns } =
    useTableColumns({
      persistKey,
      initialColumns,
    })

  const handleSort = (field: SortableFields) => {
    updateSort(field)
    resetPage()
  }

  const toggleSortDirection = () => {
    rawToggleSortDirection()
    resetPage()
  }

  const handlePageChange = (page: number) => rawHandlePageChange(page)
  const handlePageSizeChange = (size: number) => rawHandlePageSizeChange(size)

  const { sortParams, updateSort, toggleSortDirection: rawToggleSortDirection } = useSorting()

  const {
    pagination,
    handlePageChange: rawHandlePageChange,
    handlePageSizeChange: rawHandlePageSizeChange,
    updatePaginationInfo,
    resetPage,
  } = usePagination(1, defaultPageSize)

  const { searchTerm, handleSearch, clearSearch } = useSearch({
    onSearch: () => resetPage(),
    minLength: 2,
  })

  const fetchParams = computed<FetchOperatorsParams>(() => ({
    page: pagination.value.page,
    pageSize: pagination.value.pageSize,
    search: searchTerm.value,
    sortField: sortParams.value.sortField,
    sortDirection: sortParams.value.sortDirection,
  }))

  const items = ref<T[]>([])
  const isEmpty = computed(() => !items.value || items.value.length === 0)
  const total = ref(0)
  const debouncingRequest = ref(false)
  const actualFetchParams = ref<FetchOperatorsParams>(fetchParams.value)

  const filteredFetchParams = computed(() => {
    const params = actualFetchParams.value
    return Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== '',
      ),
    )
  })

  const {
    data: response,
    isLoading: isLoadingFetch,
    refresh: rawRefresh,
    error: apiError,
  } = useSwrvCache<PaginatedResponse<T>>(API_CONFIG.ENDPOINTS.OPERATORS, filteredFetchParams)

  const updateAndRefresh = useDebounceFn(async (newParams: FetchOperatorsParams) => {
    const newParamsString = JSON.stringify(newParams)
    const currentParamsString = JSON.stringify(actualFetchParams.value)
    if (newParamsString !== currentParamsString) {
      actualFetchParams.value = newParams
      await refresh()
      debouncingRequest.value = false
    }
  }, globalDebounce)

  watch(
    fetchParams,
    async (newParams, oldParams) => {
      const newParamsString = JSON.stringify(newParams)
      const oldParamsString = JSON.stringify(oldParams)
      if (newParamsString !== oldParamsString) {
        debouncingRequest.value = true
        await updateAndRefresh(newParams)
      }
    },
    { deep: true },
  )

  // Função de refresh com tratamento de erro centralizado
  const refresh = wrap(async () => {
    clearError()
    return await rawRefresh()
  }, 'Atualização de dados')

  // Observa erros da API
  watch(
    apiError,
    (newError) => {
      if (newError) {
        setError(newError, 'Carregamento de dados')
      }
    },
    { immediate: true },
  )

  // Observa respostas da API
  watch(
    response,
    (dataResponse) => {
      try {
        if (dataResponse) {
          const responseData = dataResponse.data as unknown as PaginatedResponse<T>
          items.value = responseData.data
          total.value = responseData.totalItems
          updatePaginationInfo(responseData.totalItems, Number(responseData.totalPages))
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)), 'Processamento de resposta')
      }
    },
    { immediate: true },
  )

  // Reset com tratamento de erro centralizado
  const reset = wrap(async () => {
    clearSearch()
    resetPage()
    actualFetchParams.value = fetchParams.value
    await refresh()
  }, 'Reset de dados')

  const maxPage = computed(() => pagination.value.totalPages)
  const displayRange = computed(() => {
    try {
      const start = (pagination.value.page - 1) * pagination.value.pageSize + 1
      const end = Math.min(pagination.value.page * pagination.value.pageSize, total.value)
      return { start, end }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)), 'Cálculo de intervalo')
      return { start: 0, end: 0 }
    }
  })

  return {
    items,
    columns,
    visibleColumns,
    isEmpty,
    isLoading: computed(() => isLoadingFetch.value || debouncingRequest.value),
    searchTerm,
    pagination,
    sortParams,
    total,
    maxPage,
    displayRange,
    error,

    toggleColumnVisibility,
    isColumnVisible,
    resetColumns,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    clearSearch,
    refresh,
    reset,

    toggleSortDirection: toggleSortDirection,
    handleSort,
  }
}
