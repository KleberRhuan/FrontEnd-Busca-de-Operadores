# Arquitetura do Sistema

Este documento detalha a arquitetura do sistema, explicando cada camada, padrões adotados, e como os diferentes componentes se comunicam.

## Visão Geral da Arquitetura

O sistema adota uma arquitetura baseada em componentes Vue.js com Composition API, organizada em camadas claras e bem definidas:

```
┌─────────────────────────────────────────────────────────────┐
│                        Componentes UI                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  DataTable   │  │ TableControls │  │ Demais Componentes│  │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                         Composables                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ useDataTable │  │  useSorting  │  │useTableColumns│       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │usePagination │  │   useSearch  │  │   useToast   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                         Serviços                             │
│               ┌────────────────────────────┐                 │
│               │      operatorService       │                 │
│               └────────────────────────────┘                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                       API External                           │
│               ┌────────────────────────────┐                 │
│               │      API de Operadoras     │                 │
│               └────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## Camadas da Aplicação

### 1. Camada de UI (Interface do Usuário)

**Responsabilidade**: Apresentação de dados e interação com o usuário.

**Componentes Principais**:

- `DataTable.vue` - Tabela principal de dados
- `TableHeaders.vue` - Cabeçalhos de tabela com ordenação
- `TableContent.vue` - Conteúdo da tabela com dados
- `TableControls.vue` - Controles para busca e atualização
- `PaginationControls.vue` - Navegação entre páginas

**Padrões**:

- Componentes focados apenas em renderização e captura de eventos
- Lógica de estado e funcionalidade delegada aos composables
- Propriedades fortemente tipadas com TypeScript

### 2. Camada de Composables

**Responsabilidade**: Lógica de negócio reutilizável e gerenciamento de estado.

**Composables Principais**:

- `useDataTable.ts` - Orquestrando todo o funcionamento da tabela
- `useSorting.ts` - Gerenciamento de ordenação
- `usePagination.ts` - Controle de paginação
- `useSearch.ts` - Funcionalidade de busca com debounce
- `useTableColumns.ts` - Gerenciamento de colunas visíveis
- `useFetchWithAbort.ts` - Abstração para requisições HTTP canceláveis

**Padrões**:

- Composição sobre herança
- Estado reativo com Vue `ref` e `computed`
- Funções bem definidas com responsabilidade única
- Retorno explícito de estados e métodos

### 3. Camada de Serviços

**Responsabilidade**: Comunicação com APIs externas e processamento de dados.

**Serviços Principais**:

- `operatorService.ts` - Comunicação com API de operadoras

**Padrões**:

- Métodos para tradução entre formatos frontend/backend
- Cache para otimização de performance
- Tratamento padronizado de erros
- Sem estado compartilhado (stateless)

### 4. Camada de Tipos

**Responsabilidade**: Definição de estruturas de dados e contratos de tipos.

**Tipos Principais**:

- `ApiTypes.ts` - Tipos relacionados à API e resposta
- `OperatorRecord.ts` - Modelo de dados para frontend

**Padrões**:

- Enums para valores constantes
- Interfaces para estruturas de dados
- Mapeamentos explícitos entre diferentes formatos

## Fluxo de Dados

### Fluxo de Inicialização

1. `App.vue` monta o aplicativo e renderiza componentes principais
2. `DataTable.vue` é inicializado com props necessárias
3. `useDataTable` é chamado para configurar o estado da tabela
4. `fetchOperators` é registrado como função de busca
5. Parâmetros iniciais são definidos (página 1, tamanho padrão)
6. `operatorService.fetchOperators` é chamado na montagem
7. API retorna dados que são mapeados e exibidos

### Fluxo de Interação

#### Ordenação:

```
Clique no Cabeçalho → TableHeaders.vue → handleSort → useSorting
→ Atualização sortConfig → Novo fetchParams → operatorService
→ API → Novos dados → Atualização UI
```

#### Paginação:

```
Clique em Controles → PaginationControls.vue → handlePageChange
→ usePagination → Atualização pagination → Novo fetchParams
→ operatorService → API → Novos dados → Atualização UI
```

#### Busca:

```
Digite no Campo → TableControls.vue → handleSearch → useSearch
→ Debounce → resetPage → Novo fetchParams → operatorService
→ API → Novos dados → Atualização UI
```

## Mapeamento de Dados

Um aspecto crítico da arquitetura é o mapeamento entre dados da API e frontend:

### API para Frontend

```
operatorService.processApiResponse
    ↓
Converte ApiResponse para PaginatedResponse<OperatorRecord>
    ↓
operatorService.mapApiOperatorToRecord
    ↓
Mapeia cada campo individual usando fieldMappings
```

### Frontend para API

```
useDataTable.fetchParams
    ↓
Prepara parâmetros de requisição
    ↓
operatorService.buildApiParams
    ↓
Converte sortField/sortDirection para order_by/order_direction
    ↓
Converte demais parâmetros para formato esperado pela API
```

## Pontos de Extensão

A arquitetura foi projetada para facilitar extensões, com pontos claros para adicionar funcionalidades:

1. **Novos Filtros**: Implementar novo composable e integrar em useDataTable
2. **Novos Campos**: Atualizar enums e mapeamentos em ApiTypes.ts
3. **Novas Visualizações**: Criar componentes que consumam useDataTable
4. **Exportação de Dados**: Implementar serviço especializado que consuma dados atuais

## Otimizações

A arquitetura implementa diversas otimizações:

1. **Cache de Resposta**: Respostas recentes são armazenadas para evitar requisições duplicadas
2. **Debounce**: Operações frequentes como digitação têm delay inteligente
3. **Abort Controller**: Requisições obsoletas são canceladas
4. **Renderização Condicional**: Componentes aplicam técnicas para minimizar re-renderizações
5. **Memoização**: Valores calculados são cacheados quando possível

## Convenções Adotadas

Para manter a consistência do código, foram adotadas as seguintes convenções:

1. **Nomenclatura**:

   - Composables: prefixo "use" (ex: useDataTable)
   - Serviços: sufixo "Service" (ex: operatorService)
   - Componentes: PascalCase (ex: TableHeaders)
   - Props e métodos: camelCase (ex: handlePageChange)

2. **Estrutura de Arquivos**:

   - Um componente por arquivo
   - Tipos agrupados por domínio
   - Composables isolados por funcionalidade

3. **Organização de Código**:
   - template → script → style em componentes Vue
   - imports → interfaces → setup em scripts
   - constantes → estado → métodos → efeitos em composables
