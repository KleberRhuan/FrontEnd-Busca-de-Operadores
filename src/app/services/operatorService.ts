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

// Função para uso direto no DataTable
export const fetchOperators = async (
  params: FetchOperatorsParams = {}, 
  signal?: AbortSignal
): Promise<PaginatedResponse<OperatorRecord>> => {
  return operatorService.fetchOperators(params, signal);
};

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
    
    // Para simular dados (remover em produção)
    return {
      items: getMockOperators(pageSize),
      total: 100,
      page,
      pageSize,
      totalPages: 10
    };
    
    // Descomente o código abaixo para usar a API real
    /*
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
    */
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

// Função para gerar dados de exemplo
function getMockOperators(count: number): OperatorRecord[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    registration: `REG${(10000 + i).toString()}`,
    cnpj: `${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
    businessName: `Empresa ${i + 1} Ltda`,
    tradeName: `Empresa ${i + 1}`,
    modality: i % 2 === 0 ? 'Operadora' : 'Seguradora',
    street: `Rua ${i + 1}`,
    number: `${i + 100}`,
    complement: i % 3 === 0 ? `Sala ${i}` : '',
    neighborhood: `Bairro ${Math.floor(i / 5) + 1}`,
    city: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador'][i % 5],
    state: ['SP', 'RJ', 'MG', 'DF', 'BA'][i % 5],
    postalCode: `${10000000 + i * 1000}`,
    phone: `(${10 + i % 90}) 9${1000 + i}${2000 + i}`,
    email: `contato${i + 1}@empresa${i + 1}.com.br`,
    representative: `Representante ${i + 1}`,
    representativePosition: `Cargo ${i + 1}`,
    registrationDate: new Date(2020, i % 12, (i % 28) + 1).toISOString()
  }))
}
