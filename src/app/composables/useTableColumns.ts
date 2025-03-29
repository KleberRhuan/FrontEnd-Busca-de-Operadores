import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface ColumnDefinition {
  id: string
  title: string
  sortable?: boolean
  visible?: boolean
  formatter?: (value: any) => string
  width?: string
}

export interface TableColumnOptions {
  persistKey?: string
  initialColumns: ColumnDefinition[]
}

export function useTableColumns(options: TableColumnOptions) {
  const { 
    persistKey,
    initialColumns = []
  } = options

  // Tenta carregar colunas do localStorage se persistKey fornecido
  const loadSavedColumns = (): ColumnDefinition[] => {
    if (!persistKey) return initialColumns
    
    try {
      const savedConfig = localStorage.getItem(`table-columns-${persistKey}`)
      if (savedConfig) {
        const savedVisibility = JSON.parse(savedConfig)
        
        // Mesclar as configurações salvas com as colunas iniciais
        return initialColumns.map(col => ({
          ...col,
          visible: savedVisibility[col.id] !== undefined ? savedVisibility[col.id] : col.visible
        }))
      }
    } catch (error) {
      console.error('Erro ao carregar configuração de colunas:', error)
    }
    
    return initialColumns
  }

  // Inicializar as colunas
  const columns = ref<ColumnDefinition[]>(loadSavedColumns())

  // Obter apenas colunas visíveis
  const visibleColumns = computed(() => 
    columns.value.filter(col => col.visible !== false)
  )

  // Salvar configuração de visibilidade
  const saveColumnVisibility = () => {
    if (!persistKey) return
    
    try {
      // Salvar apenas um mapa de visibilidade por ID
      const visibilityMap = columns.value.reduce((map, col) => {
        map[col.id] = col.visible !== false
        return map
      }, {} as Record<string, boolean>)
      
      localStorage.setItem(`table-columns-${persistKey}`, JSON.stringify(visibilityMap))
    } catch (error) {
      console.error('Erro ao salvar configuração de colunas:', error)
    }
  }

  // Alternar visibilidade de uma coluna
  const toggleColumnVisibility = (columnId: string) => {
    const index = columns.value.findIndex(col => col.id === columnId)
    if (index === -1) return
    
    // Criar nova referência para o array para garantir reatividade
    const newColumns = [...columns.value]
    newColumns[index] = {
      ...newColumns[index],
      visible: newColumns[index].visible === false
    }
    
    columns.value = newColumns
    saveColumnVisibility()
  }

  // Restaurar configuração de colunas para o padrão inicial
  const resetColumns = () => {
    columns.value = initialColumns
    saveColumnVisibility()
  }

  // Verificar se uma coluna está visível
  const isColumnVisible = (columnId: string) => {
    const column = columns.value.find(col => col.id === columnId)
    return column ? column.visible !== false : false
  }

  return {
    columns,
    visibleColumns,
    toggleColumnVisibility,
    isColumnVisible,
    resetColumns
  }
} 