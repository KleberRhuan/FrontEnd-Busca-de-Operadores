# Sistema de Cadastro de Operadores

Aplicação Vue.js para gerenciamento e visualização de operadores do sistema.

## Estrutura do Projeto

```
src/
├── app/                   # Lógica de aplicação
│   ├── composables/        # Composables reutilizáveis (lógica de negócios)
│   ├── config/             # Configurações globais 
│   ├── services/           # Serviços para comunicação com APIs
│   ├── styles/             # Estilos globais
│   ├── types/              # Definições de tipos TypeScript
│   └── utils/              # Funções utilitárias
├── components/            # Componentes Vue
│   ├── data-table/         # Componentes específicos da tabela de dados 
│   └── ui/                 # Componentes UI reutilizáveis
├── lib/                   # Bibliotecas e configurações de terceiros
└── App.vue                # Componente raiz da aplicação
```

## Arquitetura

O projeto segue uma arquitetura baseada em composables (Composition API) para máxima reutilização e separação de responsabilidades:

1. **Camada de UI (components/)**: Componentes visuais com mínima lógica de negócio
2. **Camada de Lógica (app/composables/)**: Lógica de negócio encapsulada em composables
3. **Camada de Serviços (app/services/)**: Comunicação com APIs externas
4. **Camada de Dados (app/types/)**: Definições de tipos para garantir consistência

## Tecnologias Principais

- **Vue.js 3**: Framework reativo para construção de interfaces
- **TypeScript**: Linguagem tipada para melhor manutenção e refatoração
- **Composition API**: Abordagem funcional para reutilização de código
- **TailwindCSS**: Framework CSS para estilização

## Recursos e Funcionalidades

### DataTable

O componente central é um DataTable altamente otimizado e personalizável com:

- Ordenação de colunas
- Paginação
- Pesquisa global
- Seleção de colunas visíveis
- Persistência de configurações do usuário
- Estados de carregamento e vazio
- Design não-responsivo com scroll horizontal

### Composables

Os composables fornecem funcionalidades reutilizáveis:

- `useDataTable`: Gerenciamento geral do estado da tabela
- `useSearch`: Busca com debounce
- `usePagination`: Controle de paginação
- `useSorting`: Ordenação de colunas
- `useTableColumns`: Gerenciamento de colunas visíveis
- `useFetchWithAbort`: Fetch com suporte a cancelamento
- `useToast`: Sistema de notificações

## Otimizações de Performance

O projeto implementa várias técnicas para maximizar o desempenho:

1. **Memoização**: Uso de `v-memo` para prevenir re-renderizações
2. **Componentes não-reativos**: `markRaw` para componentes estáticos
3. **Cache**: Armazenamento em cache de valores e classes computadas
4. **Cancelamento de requisições**: Prevenção de race conditions em chamadas API
5. **Debounce**: Limitação de execuções frequentes em operações pesadas 