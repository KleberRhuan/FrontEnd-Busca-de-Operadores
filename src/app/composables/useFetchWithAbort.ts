import { ref, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export interface FetchOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
  onFinally?: () => void
}

export function useFetchWithAbort<T = any>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
  options: FetchOptions<T> = {}
) {
  const {
    immediate = false,
    onSuccess,
    onError,
    onFinally
  } = options

  // Estados
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<any>(null)
  const isLoading = ref(false)
  
  // Controller atual
  let controller: AbortController | null = null

  // Abortar requisição atual se existir
  const abort = () => {
    if (controller) {
      controller.abort()
      controller = null
    }
  }

  // Executa a requisição
  const execute = async (): Promise<T | null> => {
    // Aborta requisição anterior se existir
    abort()
    
    // Cria novo controller
    controller = new AbortController()
    const { signal } = controller
    
    // Atualiza estado
    isLoading.value = true
    error.value = null
    
    try {
      // Executa a função de fetch
      const result = await fetchFn(signal)
      
      // Só atualiza os dados se a requisição não tiver sido abortada
      if (!signal.aborted) {
        data.value = result
        
        // Executa callback de sucesso
        if (onSuccess) {
          onSuccess(result)
        }
      }
      
      return result
    } catch (err: any) {
      // Só reporta erro se não for de abort
      if (err.name !== 'AbortError') {
        error.value = err
        
        // Executa callback de erro
        if (onError) {
          onError(err)
        }
      }
      
      return null
    } finally {
      // Só atualiza o estado se a requisição não tiver sido abortada
      if (!signal.aborted) {
        isLoading.value = false
        
        // Executa callback finally
        if (onFinally) {
          onFinally()
        }
      }
      
      // Limpa controller se for o atual
      if (controller && controller.signal === signal) {
        controller = null
      }
    }
  }

  // Executa fetch imediatamente se necessário
  if (immediate) {
    execute()
  }

  // Garante que todas as requisições são abortadas ao desmontar
  onUnmounted(() => {
    abort()
  })

  return {
    data,
    error,
    isLoading,
    execute,
    abort
  }
} 