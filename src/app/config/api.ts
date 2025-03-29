// Configurações relacionadas à API

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  ENDPOINTS: {
    OPERATORS: '/operators',
    OPERATOR_DETAIL: (id: number) => `/operators/${id}`,
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 30, 50, 100],
  },
  SORT: {
    DEFAULT_FIELD: 'registration',
    DEFAULT_ORDER: 'asc' as 'asc' | 'desc',
  },
  TIMEOUT: 10000, // 10 segundos
}; 