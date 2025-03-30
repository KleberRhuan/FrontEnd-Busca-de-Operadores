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
  SortDirection,
} from '@/app/types'
import { API_CONFIG } from '@/app/config/api.ts'
import { errorHandler } from '@/app/utils/exceptionHandler'

export function useDataTable<T extends Record<string, unknown>>(options: DataTableOptions<T>) {
  const {
    columns: initialColumns,
    persistKey,
    defaultPageSize = 10,
    globalDebounce = 1500,
  } = options

  const { columns, visibleColumns, toggleColumnVisibility, isColumnVisible, resetColumns } =
    useTableColumns({
      persistKey,
      initialColumns,
    })

  const {
    sortParams,
    handleSortFieldChange: rawHandleSortFieldChange,
    handleSortDirectionChange: rawHandleSortDirectionChange,
    toggleSortDirection: rawToggleSortDirection,
  } = useSorting()

  const handleSortFieldChange = (field: SortableFields) => {
    try {
      rawHandleSortFieldChange(field)
    } catch (error) {
      errorHandler.handle(error, 'Alteração de campo de ordenação')
    }
  }

  const handleSortDirectionChange = (order: SortDirection) => {
    try {
      rawHandleSortDirectionChange(order)
    } catch (error) {
      errorHandler.handle(error, 'Alteração de direção de ordenação')
    }
  }

  // Nova função para alternar a direção de ordenação
  const toggleSortDirection = () => {
    try {
      console.log('Alternando direção de ordenação')
      rawToggleSortDirection()
    } catch (error) {
      errorHandler.handle(error, 'Alternância de direção de ordenação')
    }
  }

  const {
    pagination,
    handlePageChange: rawHandlePageChange,
    handlePageSizeChange: rawHandlePageSizeChange,
    updatePaginationInfo,
    resetPage,
  } = usePagination(1, defaultPageSize)

  const handlePageChange = (page: number) => {
    try {
      rawHandlePageChange(page)
    } catch (error) {
      errorHandler.handle(error, 'Mudança de página')
    }
  }

  const handlePageSizeChange = (size: number) => {
    try {
      rawHandlePageSizeChange(size)
    } catch (error) {
      errorHandler.handle(error, 'Alteração de itens por página')
    }
  }

  const { searchTerm, handleSearch, clearSearch } = useSearch({
    onSearch: () => resetPage(),
    minLength: 2,
  })

  const items = ref<T[]>([])
  const isEmpty = computed(() => !items.value || items.value.length === 0)
  const total = ref(0)
  const error = ref<Error | null>(null)
  const debouncingRequest = ref(false)

  const fetchParams = computed<FetchOperatorsParams>(() => ({
    page: pagination.value.page,
    pageSize: pagination.value.pageSize,
    search: searchTerm.value,
    sortField: sortParams.value.sortField,
    sortDirection: sortParams.value.sortDirection,
  }))

  const actualFetchParams = ref<FetchOperatorsParams>(fetchParams.value)

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
    sortParams,
    (newValue, oldValue) => {
      console.log('sortParams mudou de', oldValue, 'para', newValue)
    },
    { deep: true, immediate: true },
  )

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

  const filteredFetchParams = computed(() => {
    const params = actualFetchParams.value;
    return Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );
  });

  const {
    data: response,
    isLoading: isLoadingFetch,
    refresh: rawRefresh,
    error: apiError,
  } = useSwrvCache<PaginatedResponse<T>>(API_CONFIG.ENDPOINTS.OPERATORS, filteredFetchParams)

  const refresh = errorHandler.withErrorHandling(async () => {
    error.value = null
    return await rawRefresh()
  }, 'Atualização de dados')

  // Observa erros da API
  watch(
    apiError,
    (newError) => {
      if (newError) {
        console.error('Erro ao carregar dados:', newError)
        error.value = newError
        errorHandler.handle(newError, 'Carregamento de dados')
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
          console.log('dataResponse', dataResponse)
          const responseData = dataResponse.data as unknown as PaginatedResponse<T>
          items.value = responseData.data
          total.value = responseData.totalItems
          updatePaginationInfo(responseData.totalItems, Number(responseData.totalPages))
        }
      } catch (err) {
        errorHandler.handle(err, 'Processamento de resposta')
      }
    },
    { immediate: true }
  )

  const reset = async () => {
    try {
      clearSearch()
      resetPage()
      actualFetchParams.value = fetchParams.value
      await refresh()
    } catch (err) {
      errorHandler.handle(err, 'Reset de dados')
    }
  }

  const maxPage = computed(() => pagination.value.totalPages)
  const displayRange = computed(() => {
    try {
      const start = (pagination.value.page - 1) * pagination.value.pageSize + 1
      const end = Math.min(pagination.value.page * pagination.value.pageSize, total.value)
      return { start, end }
    } catch (err) {
      errorHandler.handle(err, 'Cálculo de intervalo')
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

    handleSortFieldChange,
    handleSortDirectionChange: handleSortDirectionChange,
    toggleSortDirection: toggleSortDirection,
  }
}
