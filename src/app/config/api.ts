const BASE_URL = import.meta.env.VITE_API_URL

export const API_CONFIG = {
  BASE_URL: BASE_URL,
  ENDPOINTS: {
    OPERATORS: '/api/v1/operators',
    OPERATOR_DETAIL: (id: number) => `/api/v1/operators?query=${id}&page_size=1`,
  },
  PAGINATION: {
    PAGE_SIZE_OPTIONS: [10, 20, 30, 50, 100],
  },
  TIMEOUT: 10000,
}
