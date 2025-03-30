# Sistema de Cadastro de Operadores

Aplicação Vue.js para visualização, pesquisa e gerenciamento de operadoras de saúde, com interface moderna e responsiva.

![Screenshot da Aplicação](./docs/screenshot.png)

## Características

- 🔍 **Busca instantânea** com debounce de digitação
- 📱 **Interface responsiva** que funciona em dispositivos móveis e desktop
- 🔄 **Ordenação avançada** por todos os campos disponíveis
- 📊 **Paginação eficiente** com controle de tamanho de página
- 🎨 **Design moderno** com tema escuro e efeitos visuais
- 🚀 **Alto desempenho** com otimizações de renderização
- 💾 **Persistência de preferências** do usuário para configurações de tabela

## Tecnologias

- **Vue 3** com Composition API
- **TypeScript** para tipagem estática
- **Vite** para desenvolvimento rápido
- **Axios** para comunicação com API
- **Tailwind CSS** para estilização
- **Vue Use** para composables utilitários
- **Lucide Icons** para ícones vetoriais

## Arquitetura

O projeto segue uma arquitetura baseada em componentes com separação clara de responsabilidades:

### Camadas Principais

1. **Composables** - Lógica reutilizável (hooks)
2. **Serviços** - Comunicação com API e processamento de dados
3. **Componentes** - Interface do usuário
4. **Tipos** - Definições de tipos TypeScript

### Fluxo de Dados

O fluxo de dados da aplicação segue o seguinte caminho:

```
[API Backend] <---> [Serviços] <---> [Composables] <---> [Componentes UI]
```

### Estrutura de Arquivos

```
src/
├── app/                 # Lógica da aplicação
│   ├── composables/     # Hooks reutilizáveis
│   ├── config/          # Configurações
│   ├── services/        # Serviços (API, etc)
│   ├── types/           # Definições de tipos
│   ├── utils/           # Utilitários
│   └── styles/          # Estilos globais
├── components/          # Componentes da UI
│   ├── data-table/      # Componentes da tabela de dados
│   └── ui/              # Componentes UI básicos
├── lib/                 # Bibliotecas/utilitários
└── App.vue              # Componente raiz
```

## Integração com API

A aplicação se integra com uma API RESTful para buscar dados de operadoras. Os principais parâmetros suportados são:

- `query` - Texto de busca (mínimo 2 caracteres)
- `page` - Número da página (começa em 1)
- `page_size` - Quantidade de resultados por página
- `order_by` - Campo para ordenação
- `order_direction` - Direção da ordenação (`asc` ou `desc`)

## Tipos e Enums

O sistema utiliza TypeScript com tipos fortemente definidos:

- `ApiField` - Enum para campos da API
- `FrontendField` - Enum para campos do frontend
- `SortDirection` - Enum para direções de ordenação
- `ApiOperator` - Interface para dados da operadora da API
- `OperatorRecord` - Interface para dados da operadora no frontend

## Funcionalidades Principais

### DataTable

Componente principal que orquestra a exibição de dados tabulares com:

- Cabeçalhos clicáveis para ordenação
- Paginação com navegação intuitiva
- Campo de busca para filtrar dados
- Indicadores de carregamento
- Estados vazios para resultados não encontrados

### Ordenação

Sistema de ordenação que:

- Alterna entre ordenação ascendente e descendente
- Sincroniza estado com a API
- Exibe indicadores visuais da ordenação atual

### Busca

Campo de busca inteligente que:

- Implementa debounce para reduzir chamadas à API
- Valida comprimento mínimo da busca
- Exibe feedback visual durante a busca

## Configuração do Projeto

### Requisitos

- Node.js 16+
- npm ou yarn

### Instalação

```sh
# Instalar dependências
npm install

# Compilar e iniciar servidor de desenvolvimento
npm run dev

# Verificar tipos, compilar e minificar para produção
npm run build

# Executar linter
npm run lint
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```sh
VITE_API_URL=http://sua-api-url.com
```

## Componentes UI

### Table

Componente de tabela altamente personalizável com:

- `TableHeader` - Cabeçalho da tabela
- `TableBody` - Corpo da tabela
- `TableRow` - Linha da tabela
- `TableCell` - Célula da tabela
- `TableHead` - Célula de cabeçalho

### TableControls

Barra de controles com:

- Campo de busca
- Botão de atualização
- Indicador de carregamento

### PaginationControls

Controles de paginação com:

- Navegação por páginas
- Seletor de tamanho de página
- Indicador de resultados

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

[MIT](LICENSE.md)
