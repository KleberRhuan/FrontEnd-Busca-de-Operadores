import { ref, computed } from 'vue'
import type { Ref } from 'vue'

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
  const {
    persistKey,
    defaultColumns = []
  } = options

  // Tenta carregar colunas do localStorage se persistKey fornecido
  const loadSavedColumns = (): Column[] => {
    if (!persistKey) return defaultColumns
    
    try {
      const saved = localStorage.getItem(`table-columns-${persistKey}`)
      if (saved) {
        const parsedColumns = JSON.parse(saved) as Column[]
        
        // Certifique-se de que todas as colunas padrão existam
        // Isso é útil quando novas colunas são adicionadas após a persistência
        const mergedColumns = [...parsedColumns]
        
        defaultColumns.forEach(defaultCol => {
          const existingColIndex = mergedColumns.findIndex(col => col.key === defaultCol.key)
          
          if (existingColIndex === -1) {
            mergedColumns.push(defaultCol)
          }
        })
        
        return mergedColumns
      }
    } catch (error) {
      console.error('Erro ao carregar colunas salvas:', error)
    }
    
    return defaultColumns
  }

  // Inicializa as colunas
  const columns = ref<Column[]>(loadSavedColumns())

  // Calcula as colunas visíveis
  const visibleColumns = computed(() => 
    columns.value.filter(column => column.visible !== false)
  )

  // Salva as configurações de colunas
  const saveColumns = () => {
    if (!persistKey) return
    
    try {
      localStorage.setItem(`table-columns-${persistKey}`, JSON.stringify(columns.value))
    } catch (error) {
      console.error('Erro ao salvar colunas:', error)
    }
  }

  // Alterna a visibilidade de uma coluna
  const toggleColumnVisibility = (key: string) => {
    const columnIndex = columns.value.findIndex(col => col.key === key)
    
    if (columnIndex !== -1) {
      // Cria uma nova referência para o objeto da coluna para manter a reatividade
      const updatedColumn = { ...columns.value[columnIndex] }
      updatedColumn.visible = updatedColumn.visible === false ? true : false
      
      // Atualiza o array de colunas
      const updatedColumns = [...columns.value]
      updatedColumns[columnIndex] = updatedColumn
      columns.value = updatedColumns
      
      // Persiste a alteração
      saveColumns()
    }
  }

  // Define colunas iniciais ou redefine para os valores padrão
  const setColumns = (newColumns: Column[]) => {
    columns.value = newColumns
    saveColumns()
  }

  // Redefine para as colunas padrão
  const resetToDefault = () => {
    columns.value = defaultColumns
    saveColumns()
  }

  return {
    columns,
    visibleColumns,
    toggleColumnVisibility,
    setColumns,
    resetToDefault
  }
} 