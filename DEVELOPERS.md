# Documentação Técnica para Desenvolvedores

Este documento fornece informações detalhadas sobre a arquitetura, padrões e fluxo de dados da aplicação para desenvolvedores que desejam contribuir ou entender o código.

## Arquitetura da Aplicação

O projeto segue uma arquitetura baseada em composables do Vue 3, organizada em camadas:

### 1. Camada de Serviço

**Localização:** `src/app/services/`

Responsável pela comunicação com APIs externas e processamento de dados. O principal serviço é:

- `operatorService.ts`: Gerencia toda a comunicação com a API de operadoras.

Principais responsabilidades:

- Conversão de parâmetros entre frontend e backend
- Processamento de respostas da API
- Cache de requisições para otimização
- Tratamento de erros de API

### 2. Camada de Composables (Hooks)

**Localização:** `src/app/composables/`

Implementa lógica reutilizável através de composables Vue:

- `useDataTable.ts`: Orquestra todos os outros composables para o funcionamento da tabela.
- `useSorting.ts`: Gerencia estado e lógica de ordenação.
- `usePagination.ts`: Controla paginação e navegação entre páginas.
- `useSearch.ts`: Implementa busca com debounce.
- `useTableColumns.ts`: Gerencia visibilidade e configuração de colunas.
- `useFetchWithAbort.ts`: Abstrai fetching de dados com capacidade de cancelamento.
- `useToast.ts`: Fornece sistema de notificações.

### 3. Camada de Componentes

**Localização:** `src/components/`

Implementa a interface do usuário:

- `data-table/`: Componentes específicos da tabela de dados.
- `ui/`: Componentes UI reutilizáveis (botões, inputs, etc).

### 4. Camada de Tipos

**Localização:** `src/app/types/`

Define estruturas de dados e tipos:

- `ApiTypes.ts`: Tipos relacionados à API e mapeamentos.
- `OperatorRecord.ts`: Modelo de dados para operadoras no frontend.

## Fluxo de Dados Detalhado

### Inicialização

1. `App.vue` renderiza `DataTable.vue` com propriedades necessárias.
2. `DataTable.vue` inicializa `useDataTable` passando `fetchOperators` e configurações.
3. `useDataTable` configura estado inicial e dispara busca de dados.
4. `operatorService.fetchOperators` é chamado com parâmetros iniciais.
5. Dados são buscados, processados e renderizados.

### Busca

1. Usuário digita no campo de busca em `TableControls.vue`.
2. `handleSearch` é chamado passando o texto para `useSearch`.
3. `useSearch` implementa debounce e valida comprimento mínimo.
4. Após debounce, `resetPage` é chamado para voltar à primeira página.
5. Mudança nos parâmetros dispara nova busca via `useDataTable`.
6. `fetchOperators` é chamado com novos parâmetros incluindo `query`.
7. API retorna resultados filtrados que são exibidos na tabela.

### Ordenação

1. Usuário clica em cabeçalho de coluna em `TableHeaders.vue`.
2. Evento de clique chama `handleSort` passando o ID da coluna.
3. `useSorting` processa o campo e determina direção (alterna asc/desc).
4. Mudança em `sortConfig` dispara atualização de `fetchParams`.
5. Nova requisição é feita com parâmetros `sortField` e `sortDirection`.
6. `operatorService.buildApiParams` converte para `order_by` e `order_direction`.
7. API retorna dados ordenados e UI atualiza indicadores visuais.

### Paginação

1. Usuário interage com controles em `PaginationControls.vue`.
2. `handlePageChange` ou `handlePageSizeChange` são chamados.
3. `usePagination` atualiza estado de paginação.
4. Mudança dispara atualização de parâmetros de busca.
5. Dados da nova página são buscados e exibidos.

## Mapeamento de Campos

O sistema usa enums para mapear entre campos da API e frontend:

```typescript
// Campo da API (backend) -> Campo do frontend
operator_registry -> registration
tax_identifier -> cnpj
corporate_name -> businessName
trade_name -> tradeName
// etc...
```

Este mapeamento é centralizado em `fieldMappings` no arquivo `ApiTypes.ts`.

## Otimizações Implementadas

1. **Debounce**: Aplicado em operações frequentes para reduzir chamadas à API.
2. **Cache de Resposta**: Respostas recentes são cacheadas para evitar requisições duplicadas.
3. **AbortController**: Requisições obsoletas são canceladas quando novos parâmetros são definidos.
4. **Memo**: Componentes usam `v-memo` para evitar re-renderizações desnecessárias.
5. **Memoização de Formatação**: Valores formatados são cacheados para performance.
6. **Renderização Condicional**: Estados de loading/vazio são otimizados.

## Configurações do Projeto

### Variáveis de Ambiente

O arquivo `.env` suporta as seguintes variáveis:

```
VITE_API_URL=http://localhost:3000  # URL base da API
```

### Constantes de Configuração

Definidas em `src/app/config/api.ts`:

- `API_CONFIG.BASE_URL`: URL base da API
- `API_CONFIG.ENDPOINTS`: Endpoints disponíveis
- `API_CONFIG.PAGINATION`: Configurações de paginação
- `API_CONFIG.SORT`: Configurações de ordenação padrão
- `API_CONFIG.TIMEOUT`: Timeout de requisições

## Estilização

A aplicação utiliza Tailwind CSS com algumas personalizações:

- Tema escuro com degradês e efeitos de vidro (glassmorphism)
- Animações para estados de carregamento
- Responsividade para diferentes tamanhos de tela
- Scrollbars personalizados

## Convenções de Codificação

- **Nomenclatura**: camelCase para variáveis/funções, PascalCase para componentes/interfaces
- **Enums**: SCREAMING_SNAKE_CASE para valores de enum
- **Tipagem**: Tipagem forte em todas as interfaces
- **Composables**: Prefixo 'use' para todos os composables
- **Props**: Fortemente tipadas usando defineProps com TypeScript

## Tratamento de Erros

O sistema implementa várias estratégias de tratamento de erros:

1. **Retry com Cooldown**: Após erros, espera um período antes de novas tentativas
2. **Limite de Tentativas**: Máximo de 3 tentativas antes de desistir
3. **Fallback para Cache**: Em caso de erro, utiliza dados em cache quando disponíveis
4. **Toast de Erro**: Notificações visuais informativas para o usuário
5. **Estados de Erro na UI**: Feedback visual quando operações falham

## Contribuindo com o Código

### Adicionando Novos Campos

1. Adicione o campo ao enum `ApiField` em `ApiTypes.ts`
2. Adicione o campo ao enum `FrontendField` em `ApiTypes.ts`
3. Atualize o mapeamento em `fieldMappings`
4. Adicione o campo à interface `ApiOperator`
5. Adicione o campo à interface `OperatorRecord`
6. Atualize o método `mapApiOperatorToRecord` em `operatorService.ts`
7. Adicione a coluna em `columns.ts` se deseja exibi-la na tabela

### Adicionando Novos Recursos

1. Implemente a lógica em um novo composable se for funcionalidade reutilizável
2. Crie novos componentes conforme necessário seguindo padrões existentes
3. Integre com o restante do sistema através de eventos ou props
4. Adicione testes para novas funcionalidades
5. Atualize a documentação
