import {SortableFields, SortDirection} from '@/app/types'

/**
 * Estrutura genérica de resposta paginada da API
 */
export interface PaginatedResponse<T> {
  data: T[]
  totalItems: number
  page: number | string
  pageSize: number | string
  totalPages: number | string
  search: string
  sortField: SortableFields | null
  sortDirection: SortDirection
}

/**
 * Estrutura de erros retornados pela API
 */
export interface ApiError {
  status: number
  type: string
  title: string
  detail: string
  timestamp: string
  violations?: Array<{ name: string; message: string }>
  userMessage?: string
}
