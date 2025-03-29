import api from '@/lib/axios';
import { API_CONFIG } from '@/app/config/api';
import type { OperatorRecord } from '@/app/types/OperatorRecord';

// Interface para parâmetros de paginação e ordenação
export interface FetchOperatorsParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Interface para resposta paginada
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Serviço de Operadores seguindo o princípio de responsabilidade única (SOLID)
export const operatorService = {
  // Buscar operadores com paginação e ordenação
  async fetchOperators(
    params: FetchOperatorsParams = {}, 
    signal?: AbortSignal
  ): Promise<PaginatedResponse<OperatorRecord>> {
    const { 
      page = API_CONFIG.PAGINATION.DEFAULT_PAGE, 
      pageSize = API_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE, 
      sortField = API_CONFIG.SORT.DEFAULT_FIELD, 
      sortOrder = API_CONFIG.SORT.DEFAULT_ORDER, 
      search 
    } = params;
    
    // Construir query params
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('page_size', pageSize.toString());
    
    if (sortField && sortOrder) {
      const order = sortOrder === 'desc' ? '-' : '';
      queryParams.append('ordering', `${order}${sortField}`);
    }
    
    if (search) {
      queryParams.append('search', search);
    }
    
    try {
      const response = await api.get<PaginatedResponse<OperatorRecord>>(
        `${API_CONFIG.ENDPOINTS.OPERATORS}?${queryParams.toString()}`,
        { signal } // Adicionar signal para permitir cancelamento
      );
      return response.data;
    } catch (error) {
      // Propagar erros de AbortController
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
      
      console.error('Erro ao buscar operadores:', error);
      // Retornar um valor padrão em caso de erro
      return {
        items: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0
      };
    }
  },
  
  // Buscar um operador pelo ID
  async fetchOperatorById(id: number): Promise<OperatorRecord | null> {
    try {
      const response = await api.get<OperatorRecord>(API_CONFIG.ENDPOINTS.OPERATOR_DETAIL(id));
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar operador ${id}:`, error);
      return null;
    }
  }
};
