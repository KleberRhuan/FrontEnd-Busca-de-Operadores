import { ref, computed } from 'vue'
import type { ColumnDefinition, TableColumnOptions } from '@/app/types'
import { apiErrorState } from '@/app/composables/useApiErrorState'

export function useTableColumns(options: TableColumnOptions) {
  const { persistKey, initialColumns = [] } = options
  const loadSavedColumns = (): ColumnDefinition[] => {
    if (!persistKey) return initialColumns

    try {
      const savedConfig = localStorage.getItem(`table-columns-${persistKey}`)
      if (savedConfig) {
        const savedVisibility = JSON.parse(savedConfig)
        return initialColumns.map((col) => ({
          ...col,
          visible: savedVisibility[col.id] !== undefined ? savedVisibility[col.id] : col.visible,
        }))
      }
    } catch (error) {
      apiErrorState.setError(
        error instanceof Error ? error : new Error(String(error)),
        'Carregamento de configuração de colunas',
      )
    }

    return initialColumns
  }

  const columns = ref<ColumnDefinition[]>(loadSavedColumns())
  const visibleColumns = computed(() => columns.value.filter((col) => col.visible !== false))

  const saveColumnVisibility = () => {
    if (!persistKey) return

    try {
      const visibilityMap = columns.value.reduce(
        (map, col) => {
          map[col.id] = col.visible !== false
          return map
        },
        {} as Record<string, boolean>,
      )

      localStorage.setItem(`table-columns-${persistKey}`, JSON.stringify(visibilityMap))
    } catch (error) {
      apiErrorState.setError(
        error instanceof Error ? error : new Error(String(error)),
        'Salvamento de configuração de colunas',
      )
    }
  }

  const toggleColumnVisibility = (columnId: string) => {
    const index = columns.value.findIndex((col) => col.id === columnId)
    if (index === -1) return

    const newColumns = [...columns.value]
    newColumns[index] = {
      ...newColumns[index],
      visible: newColumns[index].visible === false,
    }

    columns.value = newColumns
    saveColumnVisibility()
  }

  const resetColumns = () => {
    columns.value = initialColumns
    saveColumnVisibility()
  }

  const isColumnVisible = (columnId: string) => {
    const column = columns.value.find((col) => col.id === columnId)
    return column ? column.visible !== false : false
  }

  return {
    columns,
    visibleColumns,
    toggleColumnVisibility,
    isColumnVisible,
    resetColumns,
  }
}
