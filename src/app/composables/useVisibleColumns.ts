import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { apiErrorState } from '@/app/composables/useApiErrorState'

export interface Column {
  key: string
  label: string
  visible?: boolean
  sortable?: boolean
  defaultSort?: boolean
  defaultSortDirection?: 'asc' | 'desc'
  formatter?: (value: any) => string
  width?: string
}

export interface VisibleColumnsOptions {
  persistKey?: string
  defaultColumns?: Column[]
}

export function useVisibleColumns(options: VisibleColumnsOptions = {}) {
  const { persistKey, defaultColumns = [] } = options

  const loadSavedColumns = (): Column[] => {
    if (!persistKey) return defaultColumns

    try {
      const saved = localStorage.getItem(`table-columns-${persistKey}`)
      if (saved) {
        const parsedColumns = JSON.parse(saved) as Column[]
        const mergedColumns = [...parsedColumns]

        defaultColumns.forEach((defaultCol) => {
          const existingColIndex = mergedColumns.findIndex((col) => col.key === defaultCol.key)

          if (existingColIndex === -1) {
            mergedColumns.push(defaultCol)
          }
        })

        return mergedColumns
      }
    } catch (error) {
      apiErrorState.setError(
        error instanceof Error ? error : new Error(String(error)),
        'Carregamento de configuração de colunas',
      )
    }

    return defaultColumns
  }

  const columns = ref<Column[]>(loadSavedColumns())

  const visibleColumns = computed(() => columns.value.filter((column) => column.visible !== false))

  const saveColumns = () => {
    if (!persistKey) return

    try {
      localStorage.setItem(`table-columns-${persistKey}`, JSON.stringify(columns.value))
    } catch (error) {
      apiErrorState.setError(
        error instanceof Error ? error : new Error(String(error)),
        'Salvamento de configuração de colunas',
      )
    }
  }

  const toggleColumnVisibility = (key: string) => {
    const columnIndex = columns.value.findIndex((col) => col.key === key)

    if (columnIndex !== -1) {
      const updatedColumn = { ...columns.value[columnIndex] }
      updatedColumn.visible = updatedColumn.visible === false ? true : false

      const updatedColumns = [...columns.value]
      updatedColumns[columnIndex] = updatedColumn
      columns.value = updatedColumns

      saveColumns()
    }
  }

  const setColumns = (newColumns: Column[]) => {
    columns.value = newColumns
    saveColumns()
  }

  const resetToDefault = () => {
    columns.value = defaultColumns
    saveColumns()
  }

  return {
    columns,
    visibleColumns,
    toggleColumnVisibility,
    setColumns,
    resetToDefault,
  }
}
