import {SortableFields, SortDirection} from '@/app/types'

const BASE_URL = import.meta.env.VITE_API_URL

export const API_CONFIG = {
  BASE_URL: BASE_URL,
  ENDPOINTS: {
    OPERATORS: '/api/v1/operators',
    OPERATOR_DETAIL: (id: number) => `/api/v1/operators?query=${id}&page_size=1`,
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 30, 50, 100],
  },
  SORT: {
    DEFAULT_FIELD: SortableFields,
    DEFAULT_ORDER: SortDirection.DESC,
  },
  TIMEOUT: 10000,
}
