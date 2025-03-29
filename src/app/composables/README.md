# Composables para DataTable

Este diretório contém composables que encapsulam a lógica para gerenciar diferentes aspectos do DataTable.

## Composable Principal

### useDataTable

Centraliza todos os outros composables e gerencia o estado geral da tabela.

```typescript
function useDataTable<T>(options: DataTableOptions<T>): {
  // Estados
  items: Ref<T[]>;
  columns: Ref<ColumnDefinition[]>;
  visibleColumns: ComputedRef<ColumnDefinition[]>;
  isEmpty: ComputedRef<boolean>;
  isLoading: Ref<boolean>;
  isSearching: Ref<boolean>;
  fetchError: Ref<any>;
  searchTerm: Ref<string>;
  pagination: Ref<PaginationState>;
  sortConfig: Ref<SortConfig>;

  // Ações
  toggleColumnVisibility: (columnId: string) => void;
  isColumnVisible: (columnId: string) => boolean;
  resetColumns: () => void;
  handleSort: (field: string) => boolean;
  handlePageChange: (page: number) => boolean;
  handlePageSizeChange: (size: number) => boolean;
  handleSearch: (term: string) => void;
  clearSearch: () => void;
  refresh: () => Promise<any>;
  reset: () => void;
  dispose: () => void;
}
```

## Composables Especializados

### useFetchWithAbort

Gerencia operações de busca com suporte a cancelmento via AbortController.

```typescript
function useFetchWithAbort<T>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
  options?: FetchOptions<T>
): {
  data: Ref<T | null>;
  error: Ref<any>;
  isLoading: Ref<boolean>;
  execute: () => Promise<T | null>;
  abort: () => void;
}
```

### usePagination

Gerencia o estado de paginação e operações relacionadas.

```typescript
function usePagination(
  defaultPage?: number,
  defaultPageSize?: number
): {
  pagination: Ref<PaginationState>;
  handlePageChange: (page: number) => boolean;
  handlePageSizeChange: (size: number) => boolean;
  updatePaginationInfo: (total: number, totalPages: number) => void;
  resetPage: () => void;
}
```

### useSearch

Implementa busca com debounce para evitar requisições desnecessárias.

```typescript
function useSearch(options?: SearchOptions): {
  searchTerm: Ref<string>;
  debouncedSearchTerm: Ref<string>;
  isSearching: Ref<boolean>;
  handleSearch: (term: string) => void;
  clearSearch: () => void;
  dispose: () => void;
}
```

### useSorting

Gerencia a ordenação de colunas.

```typescript
function useSorting(
  defaultField?: string,
  defaultOrder?: 'asc' | 'desc'
): {
  sortConfig: Ref<SortConfig>;
  handleSorting: (field: string) => boolean;
  sortParam: ComputedRef<string>;
}
```

### useTableColumns

Gerencia a visibilidade e configuração das colunas da tabela.

```typescript
function useTableColumns(options: TableColumnOptions): {
  columns: Ref<ColumnDefinition[]>;
  visibleColumns: ComputedRef<ColumnDefinition[]>;
  toggleColumnVisibility: (columnId: string) => void;
  isColumnVisible: (columnId: string) => boolean;
  resetColumns: () => void;
}
```

## Benefícios dessa Arquitetura

1. **Separação de Responsabilidades**: Cada composable gerencia um aspecto específico da tabela.
2. **Reutilização**: Os composables podem ser utilizados independentemente em outros componentes.
3. **Testabilidade**: Cada composable pode ser testado isoladamente.
4. **Manutenibilidade**: Facilita a manutenção ao isolar cada funcionalidade.
5. **Composição**: Permite compor funcionalidades complexas de forma modular. 