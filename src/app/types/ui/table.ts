import { type SortDirection, type FetchParams, type Operator, SortableFields } from '@/app/types'

/**
 * Definição de uma coluna de tabela
 */
export interface ColumnDefinition {
  id: keyof Operator
  title: string
  sortable: boolean
  visible?: boolean
  formatter?: (value: unknown) => string
  width?: string
}

/**
 * Opções para configuração das colunas da tabela
 */
export interface TableColumnOptions {
  persistKey?: string
  initialColumns: ColumnDefinition[]
}

/**
 * Opções para configuração do componente DataTable
 */
export interface DataTableOptions<T> {
  columns: ColumnDefinition[]
  persistKey?: string
  defaultPageSize?: number
  globalDebounce?: number
}

export interface SortConfig {
  sortField: SortableFields | null
  sortDirection: SortDirection | null
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
  totalPages: number
}
