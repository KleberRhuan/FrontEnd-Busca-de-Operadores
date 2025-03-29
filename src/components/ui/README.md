# Componentes UI

Este diretório contém componentes UI reutilizáveis para a aplicação.

## Estrutura

Os componentes estão organizados em subdiretórios por tipo:

### Button

Componente de botão com vários estados e variantes.

### Checkbox

Componente de caixa de seleção personalizada.

### Dropdown Menu

Conjunto de componentes para criar menus suspensos.

### Input

Componente de entrada de texto estilizado.

### Select

Componente de seleção personalizado.

### Table

Conjunto de componentes para construir tabelas semânticas.

## Padrão de Uso

Todos os componentes seguem um padrão de exportação semelhante, com arquivos `index.ts` que reexportam os componentes individuais para facilitar o uso.

## Extensibilidade

Estes componentes foram projetados para serem:

1. **Estilizáveis** - Usando classes CSS que podem ser sobrescritas
2. **Acessíveis** - Seguindo as melhores práticas de acessibilidade
3. **Tipados** - Com TypeScript para melhor experiência de desenvolvimento

## Como Usar

Importe os componentes em seus arquivos Vue:

```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
```

E use-os em seus templates:

```vue
<template>
  <div>
    <Input v-model="searchTerm" placeholder="Pesquisar..." />
    <Button>Buscar</Button>
  </div>
</template>
``` 