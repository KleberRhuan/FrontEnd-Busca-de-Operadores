# Utilitários de Tratamento de Erros

Este documento descreve como utilizar o utilitário de tratamento de erros disponível no projeto.

## Visão Geral

O sistema utiliza um único utilitário centralizado para gerenciamento de erros:

`apiErrorState` - Um gerenciador de erros global para toda a aplicação, com suporte especial para erros de API.

## Estrutura do Código

- **Tipos e interfaces** - `src/app/types/errors.ts`

  - `ErrorType` - Enum com os tipos de erro suportados
  - `AppError` - Interface para erros com contexto adicional

- **Lógica de tratamento de erros** - `src/app/composables/useApiErrorState.ts`
  - `createAppError` - Função para criar erros tipados
  - `useApiErrorState` - Hook principal para gerenciamento de erros
  - `apiErrorState` - Instância global do gerenciador de erros

## Uso do apiErrorState

### Em um Componente

```vue
<template>
  <div>
    <!-- Exibir erro genérico -->
    <div v-if="error" class="erro">
      {{ error.message }}
      <button @click="clearError">Fechar</button>
    </div>

    <!-- Exibir alerta específico para rate limit -->
    <div v-if="isRateLimited" class="rate-limit">
      Muitas requisições! Aguarde {{ retryAfter }} segundos.
    </div>

    <button @click="buscarDados" :disabled="isLoading || isRateLimited">
      {{ isLoading ? 'Carregando...' : 'Carregar Dados' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { apiErrorState } from '@/app/composables/useApiErrorState'
import api from '@/lib/axios'

// Desestruture os estados e métodos necessários
const { error, isRateLimited, retryAfter, clearError, wrap } = apiErrorState

const isLoading = ref(false)

// Use o wrap para proteger funções assíncronas
const buscarDados = wrap(async () => {
  isLoading.value = true
  try {
    clearError() // Limpa erros anteriores
    const resultado = await api.get('/dados')
    return resultado.data
  } finally {
    isLoading.value = false
  }
}, 'Busca de Dados')
</script>
```

### Em um Composable

```typescript
import { ref } from 'vue'
import { apiErrorState } from '@/app/composables/useApiErrorState'
import { ErrorType } from '@/app/types/errors'

export function useMeuRecurso() {
  // Obtém os métodos do gerenciador de erro global
  const { error, setError, clearError, wrap, createError } = apiErrorState

  const dadosCarregados = ref(null)

  // Função que usa wrap para tratamento automático de erros
  const carregarDados = wrap(async () => {
    clearError() // Limpa erros anteriores
    const resultado = await fetch('/api/dados')

    if (!resultado.ok) {
      throw createError(
        'Falha ao carregar dados',
        ErrorType.API,
        'Não foi possível carregar os dados. Tente novamente mais tarde.',
        { status: resultado.status },
      )
    }

    dadosCarregados.value = await resultado.json()
    return dadosCarregados.value
  }, 'Carregamento de Dados')

  return {
    dadosCarregados,
    carregarDados,
    // Não é necessário retornar o error, pois ele é global
    // Use apiErrorState.error em componentes se necessário
  }
}
```

## API do apiErrorState

O `apiErrorState` fornece os seguintes recursos:

### Estados Reativos

- `error`: O erro atual (Ref\<Error | null\>)
- `isError`: Boolean indicando se há um erro
- `errorMessage`: Mensagem de erro formatada
- `errorType`: Tipo do erro atual (API, NETWORK, etc)
- `isRateLimited`: Boolean indicando se houve rate limit
- `retryAfter`: Segundos até poder tentar novamente após rate limit

### Métodos

- `setError(error, context)`: Define um erro manualmente
- `clearError()`: Limpa o estado de erro atual
- `createError(title, type, message, data)`: Cria e define um erro estruturado
- `wrap(fn, context)`: Envolve uma função assíncrona com tratamento de erro
- `setRateLimitError(seconds)`: Define estado de rate limit
- `getRateLimitError(headers, remainingTime)`: Cria um erro de rate limit

### Enums (importados de @/app/types/errors)

- `ErrorType`: Tipos de erro suportados (API, NETWORK, VALIDATION, etc)

## Boas Práticas

1. **Use o wrap para funções assíncronas**:

   ```typescript
   const minhaFuncao = apiErrorState.wrap(async () => {
     // Código que pode gerar erro
   }, 'Contexto do erro')
   ```

2. **Limpe erros antes de operações**:

   ```typescript
   apiErrorState.clearError()
   // Inicie sua operação que pode gerar erro
   ```

3. **Forneça mensagens amigáveis para o usuário**:

   ```typescript
   apiErrorState.createError(
     'Título do Erro',
     ErrorType.API,
     'Mensagem amigável para o usuário ver',
     { dadosAdicionais: 'valor' },
   )
   ```

4. **Sempre trate promessas rejeitadas**:

   ```typescript
   try {
     await minhaFuncao()
   } catch (err) {
     // O erro já foi registrado pelo wrap, mas você pode fazer algo adicional aqui
   }
   ```

5. **Aproveite o estado global**:
   Em vez de criar múltiplos estados de erro em cada componente, use o `apiErrorState` centralizado.
