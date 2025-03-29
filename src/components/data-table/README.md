# Componentes do DataTable

Este diretório contém os componentes necessários para implementar uma tabela de dados reativa e altamente personalizável.

## Estrutura

A estrutura do DataTable é modularizada em diversos componentes, cada um responsável por uma parte específica da tabela:

### DataTable.vue

Componente principal que organiza todos os outros componentes e gerencia o estado da tabela. Utiliza o composable `useDataTable` para toda a lógica de negócio.

**Props:**
- `fetchFn`: Função para buscar dados (obrigatório)
- `columns`: Array de definições de colunas (obrigatório)
- `persistKey`: Chave para persistência de configurações no localStorage (opcional)
- `defaultPageSize`: Tamanho padrão da página (padrão: 10)

### TableContainer.vue

Wrapper com estilização que fornece o container visual para a tabela, incluindo bordas, fundo e scrollbars customizadas.

### TableHeaders.vue

Renderiza o cabeçalho da tabela com suporte a ordenação.

**Props:**
- `columns`: Definições das colunas a serem exibidas
- `gridTemplateColumnsStyle`: Estilo CSS para definir o layout de grid
- `sortConfig`: Configuração atual de ordenação
- `minColumnWidth`: Largura mínima para cada coluna

**Events:**
- `sort`: Emitido quando uma coluna ordenável é clicada

### TableContent.vue

Renderiza as linhas de dados da tabela, incluindo estados de carregamento e vazio.

**Props:**
- `columns`: Definições das colunas
- `items`: Dados a serem exibidos
- `loading`: Flag indicando se os dados estão sendo carregados
- `gridTemplateColumnsStyle`: Estilo CSS para definir o layout de grid
- `minColumnWidth`: Largura mínima para cada coluna
- `formatters`: Objeto com funções para formatar valores específicos de colunas

### TableControls.vue

Barra de controles superior com campo de busca e botão de atualização.

**Props:**
- `loading`: Flag indicando se a tabela está carregando
- `searchTerm`: Termo de busca atual

**Events:**
- `search`: Emitido quando o termo de busca é alterado
- `update`: Emitido quando o botão de atualização é clicado

### PaginationControls.vue

Controles de paginação exibidos abaixo da tabela.

**Props:**
- `pagination`: Estado atual da paginação (página atual, tamanho da página, total de itens, etc)

**Events:**
- `page-change`: Emitido quando a página é alterada
- `page-size-change`: Emitido quando o tamanho da página é alterado

## Design Responsivo

O DataTable é projetado para ser não-responsivo, adicionando um scroll horizontal quando necessário para preservar a integridade dos dados em telas menores. As colunas têm uma largura mínima definida e o cabeçalho permanece fixo durante a rolagem.

## Otimizações de Performance

Os componentes usam várias técnicas para otimizar o desempenho:

1. **Memoização de componentes**: Uso de `v-memo` para evitar re-renderizações desnecessárias
2. **Componentes com `markRaw`**: Prevenindo que componentes internos se tornem reativos
3. **Cache de valores formatados**: Reusando valores formatados para evitar processamento repetitivo
4. **Cache de classes CSS**: Evitando recálculos de classes CSS a cada renderização

## Como estender

Para adicionar novos recursos à tabela:

1. Crie ou modifique os composables relacionados em `src/app/composables/`
2. Atualize os componentes visuais neste diretório conforme necessário
3. Se necessário, adicione novos eventos ou props aos componentes existentes 