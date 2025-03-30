import {SortableFields, SortDirection} from '@/app/types'

/**
 * Parâmetros para busca de operadores na API
 */
export interface FetchOperatorsParams extends FetchParams{
  sortField?: SortableFields
  sortDirection?: SortDirection
}

/**
 * Parâmetros genéricos para busca em qualquer endpoint
 */
export interface FetchParams extends Record<string, unknown> {
  page: number
  pageSize: number
  search?: string
  sortField?: string
  sortDirection?: SortDirection
}
