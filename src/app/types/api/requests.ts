import {SortableFields, SortDirection} from '@/app/types'

/**
 * Parâmetros para busca de operadores na API
 */
export interface FetchOperatorsParams extends FetchParams{
  sortField?: SortableFields | null
  sortDirection?: SortDirection | null
}

/**
 * Parâmetros genéricos para busca em qualquer endpoint
 */
export interface FetchParams extends Record<string, unknown> {
  page: number | null
  pageSize: number | null
  search?: string | null
  sortField?: string | null
  sortDirection?: SortDirection | null
}
