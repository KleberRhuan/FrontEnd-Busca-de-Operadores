# Tipos e Estrutura de Dados

Este documento descreve os principais tipos, interfaces e enums utilizados na aplicação, suas responsabilidades e relacionamentos.

## Enums

### `ApiField`

Define todos os campos disponíveis na API:

```typescript
export enum ApiField {
  OPERATOR_REGISTRY = 'operator_registry',
  TAX_IDENTIFIER = 'tax_identifier',
  CORPORATE_NAME = 'corporate_name',
  TRADE_NAME = 'trade_name',
  MODALITY = 'modality',
  STREET = 'street',
  NUMBER = 'number',
  COMPLEMENT = 'complement',
  NEIGHBORHOOD = 'neighborhood',
  CITY = 'city',
  STATE = 'state',
  ZIP = 'zip',
  AREA_CODE = 'area_code',
  PHONE = 'phone',
  FAX = 'fax',
  EMAIL_ADDRESS = 'email_address',
  REPRESENTATIVE = 'representative',
  REPRESENTATIVE_POSITION = 'representative_position',
  SALES_REGION = 'sales_region',
  REGISTRATION_DATE = 'registration_date',
  // Outros campos da API
}
```

### `FrontendField`

Define os nomes dos campos no frontend, que são mapeados para os campos da API:

```typescript
export enum FrontendField {
  REGISTRATION = 'registration',
  CNPJ = 'cnpj',
  BUSINESS_NAME = 'businessName',
  TRADE_NAME = 'tradeName',
  MODALITY = 'modality',
  STREET = 'street',
  NUMBER = 'number',
  COMPLEMENT = 'complement',
  NEIGHBORHOOD = 'neighborhood',
  CITY = 'city',
  STATE = 'state',
  POSTAL_CODE = 'postalCode',
  AREA_CODE = 'areaCode',
  PHONE = 'phone',
  FAX = 'fax',
  EMAIL = 'email',
  REPRESENTATIVE = 'representative',
  REPRESENTATIVE_POSITION = 'representativePosition',
  MARKETING_REGION = 'marketingRegion',
  REGISTRATION_DATE = 'registrationDate',
  // Outros campos do frontend
}
```

### `SortDirection`

Define as direções de ordenação:

```typescript
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}
```

## Interfaces de API

### `ApiOperator`

Define a estrutura de dados de um operador conforme recebido da API:

```typescript
export interface ApiOperator {
  [ApiField.OPERATOR_REGISTRY]: string
  [ApiField.TAX_IDENTIFIER]: string
  [ApiField.CORPORATE_NAME]: string
  [ApiField.TRADE_NAME]: string
  [ApiField.MODALITY]: string
  [ApiField.STREET]: string
  [ApiField.NUMBER]: string
  [ApiField.COMPLEMENT]: string
  [ApiField.NEIGHBORHOOD]: string
  [ApiField.CITY]: string
  [ApiField.STATE]: string
  [ApiField.ZIP]: string
  [ApiField.AREA_CODE]: string
  [ApiField.PHONE]: string
  [ApiField.FAX]: string
  [ApiField.EMAIL_ADDRESS]: string
  [ApiField.REPRESENTATIVE]: string
  [ApiField.REPRESENTATIVE_POSITION]: string
  [ApiField.SALES_REGION]: string
  [ApiField.REGISTRATION_DATE]: string
}
```

### `ApiResponse`

Define a estrutura da resposta da API:

```typescript
export interface ApiResponse {
  data: ApiOperator[]
  total_items: number
  page: number | string
  page_size: number | string
  total_pages: number | string
  query: string
  order_by: string | null
  order_direction: SortDirection
}
```

### `FetchOperatorsParams`

Define os parâmetros para busca de operadores:

```typescript
export interface FetchOperatorsParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortDirection?: SortDirection
  search?: string
}
```

## Interfaces Frontend

### `OperatorRecord`

Define a estrutura de dados de um operador no frontend, após conversão:

```typescript
export interface OperatorRecord {
  registration: string
  cnpj: string
  businessName: string
  tradeName?: string
  modality: string
  street: string
  number: string
  complement?: string
  neighborhood?: string
  city?: string
  state: string
  postalCode?: string
  areaCode?: string
  phone?: string
  fax?: string
  email?: string
  representative?: string
  representativePosition?: string
  marketingRegion?: number
  registrationDate: Date
}
```

### `PaginatedResponse<T>`

Define a estrutura de resposta paginada para qualquer tipo de dado:

```typescript
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  query?: string
  sortField?: string
  sortDirection?: SortDirection
}
```

## Interfaces de Componentes

### `ColumnDefinition`

Define a estrutura de uma coluna da tabela:

```typescript
export interface ColumnDefinition {
  id: string // Identificador único da coluna (geralmente um FrontendField)
  title: string // Título exibido no cabeçalho
  sortable: boolean // Se a coluna pode ser ordenada
  visible?: boolean // Se a coluna é visível (padrão: true)
  formatter?: (value: unknown) => string // Função para formatar o valor
  width?: string // Largura CSS opcional (ex: '150px', '10%')
}
```

### `SortConfig`

Define a configuração de ordenação:

```typescript
export interface SortConfig {
  field: string // Campo a ser ordenado (FrontendField)
  order: SortDirection // Direção da ordenação
}
```

### `DataTableOptions<T>`

Define as opções de configuração para o DataTable:

```typescript
export interface DataTableOptions<T> {
  columns: ColumnDefinition[] // Definições de colunas
  persistKey?: string // Chave para persistência de configurações
  defaultPageSize?: number // Tamanho de página padrão
  searchDebounce?: number // Atraso para busca em ms
  sortDebounce?: number // Atraso para ordenação em ms
  paginationDebounce?: number // Atraso para paginação em ms
  fetchFn: (
    params: FetchParams,
    signal?: AbortSignal,
  ) => Promise<{
    items: T[]
    total: number
  }>
  initialSort?: { field: string; direction: SortDirection }
  sortable?: Record<string, boolean>
  initialItemsPerPage?: number
  itemsPerPageOptions?: number[]
  refetchOnOptionsChange?: boolean
}
```

## Mapeamentos

### `fieldMappings`

Define o mapeamento entre campos do frontend e campos da API:

```typescript
export const fieldMappings: Record<string, string> = {
  [FrontendField.REGISTRATION]: ApiField.OPERATOR_REGISTRY,
  [FrontendField.CNPJ]: ApiField.TAX_IDENTIFIER,
  [FrontendField.BUSINESS_NAME]: ApiField.CORPORATE_NAME,
  [FrontendField.TRADE_NAME]: ApiField.TRADE_NAME,
  [FrontendField.MODALITY]: ApiField.MODALITY,
  [FrontendField.STREET]: ApiField.STREET,
  [FrontendField.NUMBER]: ApiField.NUMBER,
  [FrontendField.COMPLEMENT]: ApiField.COMPLEMENT,
  [FrontendField.NEIGHBORHOOD]: ApiField.NEIGHBORHOOD,
  [FrontendField.CITY]: ApiField.CITY,
  [FrontendField.STATE]: ApiField.STATE,
  [FrontendField.POSTAL_CODE]: ApiField.ZIP,
  [FrontendField.AREA_CODE]: ApiField.AREA_CODE,
  [FrontendField.PHONE]: ApiField.PHONE,
  [FrontendField.FAX]: ApiField.FAX,
  [FrontendField.EMAIL]: ApiField.EMAIL_ADDRESS,
  [FrontendField.REPRESENTATIVE]: ApiField.REPRESENTATIVE,
  [FrontendField.REPRESENTATIVE_POSITION]: ApiField.REPRESENTATIVE_POSITION,
  [FrontendField.MARKETING_REGION]: ApiField.SALES_REGION,
  [FrontendField.REGISTRATION_DATE]: ApiField.REGISTRATION_DATE,
}
```

## Fluxo de Conversão

### API → Frontend

1. A API retorna dados no formato `ApiResponse`
2. `operatorService.processApiResponse` converte para `PaginatedResponse<OperatorRecord>`
3. Para cada operador na resposta, `mapApiOperatorToRecord` converte `ApiOperator` para `OperatorRecord`
4. Cada campo é mapeado usando a correspondência em `fieldMappings`

### Frontend → API

1. O usuário interage com a UI, gerando novos parâmetros de busca
2. `useDataTable` monta o objeto `fetchParams` com os parâmetros atuais
3. `operatorService.buildApiParams` converte esses parâmetros para o formato da API
4. Campos como `sortField` são convertidos para `order_by` usando `fieldMappings`
5. Os parâmetros são enviados para a API

## Relações entre Tipos

```
┌─────────────────┐     mapeia     ┌─────────────────┐
│   ApiField      │<───────────────│  FrontendField  │
└─────────────────┘                └─────────────────┘
         ▲                                  ▲
         │                                  │
         │ usa                              │ usa
         │                                  │
┌─────────────────┐     converte    ┌─────────────────┐
│   ApiOperator   │─────────────────│  OperatorRecord │
└─────────────────┘                 └─────────────────┘
         ▲                                  ▲
         │                                  │
         │ contém                           │ contém
         │                                  │
┌─────────────────┐     converte    ┌─────────────────┐
│   ApiResponse   │─────────────────│PaginatedResponse│
└─────────────────┘                 └─────────────────┘
```

## Dicas para Desenvolvimento

1. **Adicionando Novos Campos**:

   - Adicione o campo ao enum `ApiField`
   - Adicione o campo ao enum `FrontendField`
   - Atualize o mapeamento em `fieldMappings`
   - Atualize as interfaces `ApiOperator` e `OperatorRecord`

2. **Formatação de Valor Específico**:

   - Defina um formatador na definição da coluna em `columns.ts`

   ```typescript
   {
     id: FrontendField.REGISTRATION_DATE,
     title: 'Data de Registro',
     sortable: true,
     formatter: (value: unknown) =>
       value instanceof Date
         ? value.toLocaleDateString('pt-BR')
         : String(value)
   }
   ```

3. **Validações de Tipos**:
   - Use o TypeScript para garantir consistência entre os tipos
   - Valide dados da API antes de mapeá-los
   - Use `unknown` como tipo seguro para valores externos até validá-los
