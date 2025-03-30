import { type Ref, ref } from 'vue'
import { ErrorType, type AppError } from '@/app/types/errors'

/**
 * Cria um erro de aplicação tipado com mensagem amigável
 *
 * @param title Título do erro (utilizado como error.name)
 * @param type Tipo do erro conforme ErrorType
 * @param userMessage Mensagem amigável para exibição ao usuário
 * @param data Dados adicionais relacionados ao erro
 * @returns Um objeto AppError
 */
export function createAppError(
  title: string,
  type: ErrorType,
  userMessage: string,
  data?: Record<string, unknown>,
): AppError {
  const error = new Error(userMessage) as AppError
  error.name = title
  error.type = type
  error.userMessage = userMessage
  error.data = data
  return error
}

/**
 * Manipula o log e tratamento de erros
 *
 * @param error O erro a ser tratado
 * @param context O contexto onde o erro ocorreu
 */
function handleError(error: unknown, context: string): void {
  if (!error) return

  const errorObj = error instanceof Error ? error : new Error(String(error))
  const isAppError = 'type' in errorObj && 'userMessage' in errorObj

  // Log no console com contexto
  console.error(`[${context}] ${isAppError ? 'App Error' : 'Error'}:`, errorObj)
}

/**
 * Utilitário genérico para tratar erros em funções assíncronas
 */
function errorWrapper<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context: string,
  errorRef?: Ref<Error | null>,
) {
  // Função wrapper que vai gerenciar os erros
  const wrappedFn = async (...args: Parameters<T>) => {
    try {
      // Limpa o erro se existir uma referência
      if (errorRef) {
        errorRef.value = null
      }

      // Executa a função original
      return await fn(...args)
    } catch (err) {
      // Trata o erro usando o handler interno
      handleError(err, context)

      // Atualiza a referência de erro se fornecida
      if (errorRef && err instanceof Error) {
        errorRef.value = err
      }

      // Re-lança o erro para tratamento adicional se necessário
      throw err
    }
  }

  return wrappedFn as (...args: Parameters<T>) => Promise<ReturnType<T>>
}

/**
 * Hook personalizado para gerenciar erros em toda a aplicação
 * Este hook combina gestão de erros genéricos com recursos específicos de API
 *
 * @example
 * // Em um componente Vue
 * <script setup>
 * import { useApiErrorState } from '@/app/composables/useApiErrorState'
 *
 * // Obtenha a instância global ou crie uma nova
 * const { error, isRateLimited, retryAfter, clearError } = useApiErrorState.instance
 *
 * // Use-os em seu template
 * </script>
 *
 * <template>
 *   <!-- Exibir mensagem de erro geral -->
 *   <div v-if="error" class="error-message">
 *     {{ error.message }}
 *     <button @click="clearError">Fechar</button>
 *   </div>
 *
 *   <!-- Exibir aviso específico de rate limit -->
 *   <div v-if="isRateLimited" class="rate-limit-warning">
 *     Muitas requisições! Aguarde {{ retryAfter }} segundos.
 *   </div>
 * </template>
 *
 * @returns Objeto com estado e métodos para gerenciar erros
 */
export const useApiErrorState = () => {
  // Estado básico de erro
  const error = ref<Error | null>(null)
  const isError = ref(false)
  const errorMessage = ref('')
  const errorType = ref<ErrorType | null>(null)

  // Estados específicos para API
  const isRateLimited = ref(false)
  const retryAfter = ref(0)

  // Métodos de gerenciamento de erro básicos
  const setError = (err: Error | null, context?: string) => {
    error.value = err
    isError.value = !!err
    errorMessage.value = err ? err.message : ''

    // Extrair o tipo de erro se for um AppError
    if (err && 'type' in err && typeof err.type === 'string') {
      errorType.value = err.type as ErrorType
    } else {
      errorType.value = null
    }

    if (err && context) {
      handleError(err, context)
    }
  }

  const clearError = () => {
    error.value = null
    isError.value = false
    errorMessage.value = ''
    errorType.value = null
  }

  /**
   * Cria e define um erro de aplicação
   */
  const createError = (
    title: string,
    type: ErrorType,
    userMessage: string,
    data?: Record<string, unknown>,
    context?: string,
  ) => {
    const error = createAppError(title, type, userMessage, data)
    setError(error, context)
    return error
  }

  /**
   * Cria um erro específico de rate limit da API
   */
  const getRateLimitError = (headers: Record<string, string>, remainingTime?: number) => {
    const retryAfter = headers['retry-after']
    const limitRemaining = headers['x-ratelimit-remaining']
    const seconds = retryAfter ? parseInt(retryAfter) : 60
    const remSeconds = remainingTime ? remainingTime : seconds

    return createAppError(
      'Limite de requisições atingido',
      ErrorType.API,
      `Aguarde ${remSeconds} segundos antes de tentar novamente. Requisições restantes: ${limitRemaining || 0}`,
      { remSeconds, limitRemaining },
    )
  }

  // Método específico para erros de rate limit
  const setRateLimitError = (seconds: number) => {
    isRateLimited.value = true
    retryAfter.value = seconds

    setTimeout(() => {
      isRateLimited.value = false
      retryAfter.value = 0
    }, seconds * 1000)
  }

  // Função wrapper para tratar erros em operações assíncronas
  const wrap = <T extends (...args: unknown[]) => Promise<unknown>>(fn: T, context: string) =>
    errorWrapper(fn, context, error)

  return {
    // Estado de erro
    error,
    isError,
    errorMessage,
    errorType,

    // Estado específico de API
    isRateLimited,
    retryAfter,

    // Métodos de gerenciamento de erro
    setError,
    clearError,
    createError,
    wrap,

    // Métodos específicos de API
    getRateLimitError,
    setRateLimitError,
  }
}

// Cria uma instância global para ser compartilhada por toda a aplicação
const globalInstance = useApiErrorState()

// Adiciona a instância global ao hook para acesso fácil
useApiErrorState.instance = globalInstance

// Exporta também a instância global para uso direto quando necessário
export const apiErrorState = globalInstance
