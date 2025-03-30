import axios, { AxiosError } from 'axios'
import { API_CONFIG } from '@/app/config/api'
import type { ApiError } from '@/app/types'
import { ErrorType } from '@/app/types/errors'
import { apiErrorState } from '@/app/composables/useApiErrorState'

/**
 * Configuração do cliente Axios com interceptors para tratamento de erros
 *
 * Este arquivo configura um cliente Axios com interceptors para tratar erros de API
 * de forma centralizada. Os erros são tratados através do hook useApiErrorState,
 * que mantém um estado reativo global para erros de API, permitindo que componentes
 * em toda a aplicação possam reagir a falhas na API.
 *
 * Todas as requisições e respostas são monitoradas, com tratamento especial para:
 * - Rate limiting (status 429)
 * - Erros de rede
 * - Erros de servidor e cliente
 *
 * O estado de erro global pode ser acessado em qualquer componente:
 * ```
 * import { apiErrorState } from '@/app/composables/useApiErrorState'
 * ```
 */

// Obtém os métodos e estados do apiErrorState
const { setError, createError, getRateLimitError, setRateLimitError, isRateLimited } = apiErrorState

// Mapeamento de mensagens de erro padrão do Axios para português brasileiro
const networkErrorMessages = {
  'network error': 'Erro de conexão: Verifique sua internet e tente novamente',
  'timeout of': 'Tempo limite excedido: o servidor demorou muito para responder',
  'Request failed with status code': 'Falha na requisição',
  ECONNABORTED: 'A conexão foi interrompida',
  ECONNREFUSED: 'Conexão recusada: o servidor não está acessível',
  ENOTFOUND: 'Servidor não encontrado',
  ERR_NETWORK: 'Erro de rede: não foi possível conectar ao servidor',
  'Failed to fetch': 'Falha ao buscar dados: verifique sua conexão',
}

/**
 * Traduz mensagens de erro de rede do Axios para mensagens amigáveis em português
 */
function getNetworkErrorMessage(error: Error): string {
  const errorMessage = error.message.toLowerCase()
  const errorName = error.name.toLowerCase()

  for (const [key, translation] of Object.entries(networkErrorMessages)) {
    if (errorMessage.includes(key.toLowerCase())) {
      return translation
    }
  }

  return 'Problema de comunicação com o servidor. Verifique sua conexão e tente novamente. ' +
    'Se o problema persistir, entre em contato com o suporte.'
}

if (!API_CONFIG.BASE_URL) {
  createError(
    'URL da API não configurada',
    ErrorType.API,
    'A URL da API não está configurada. Por favor, configure a variável VITE_API_URL no arquivo .env',
    undefined,
    'Inicialização da API',
  )
}

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL || 'http://localhost:8000',
  timeout: API_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
})

// Variáveis para controle interno de rate limiting
let rateLimitExpiresAt = 0
let lastRateLimitMessageTime = 0

const handleRateLimit = (headers: Record<string, string>) => {
  const retryAfter = headers['retry-after']
  const seconds = retryAfter ? parseInt(retryAfter) : 60

  setRateLimitError(seconds)
  rateLimitExpiresAt = Date.now() + seconds * 1000
  setError(getRateLimitError(headers), 'Rate Limit')
}

const logRequestError = (error: Error) => {
  const userMessage = getNetworkErrorMessage(error)

  createError(
    'Falha de conexão',
    ErrorType.NETWORK,
    userMessage,
    { originalError: error },
    'Requisição HTTP',
  )

  error.message = userMessage
  return Promise.reject(error)
}

const logResponseError = (error: AxiosError<ApiError>) => {
  if (error.response) {
    if (error.response.status === 429) {
      handleRateLimit(error.response.headers as Record<string, string>)
    } else {
      const data = error.response.data
      const title = data?.title ?? 'Erro na requisição'
      const message = data?.userMessage ?? 'Ocorreu um erro inesperado. Tente novamente mais tarde.'

      createError(
        title,
        ErrorType.API,
        message,
        {
          status: error.response.status,
          url: error.config?.url,
        },
        'API',
      )
    }
  } else if (error.request) {
    return logRequestError(error)
  } else {
    createError(
      'Erro inesperado',
      ErrorType.UNKNOWN,
      'Um erro inesperado ocorreu. Por favor, tente novamente mais tarde.',
      { error },
      'Axios',
    )
  }
  return Promise.reject(error)
}

api.interceptors.request.use((config) => {
  if (isRateLimited.value) {
    const remainingTime = Math.ceil((rateLimitExpiresAt - Date.now()) / 1000)
    const now = Date.now()
    const rateLimitError = getRateLimitError(
      config.headers as Record<string, string>,
      remainingTime,
    )

    if (now - lastRateLimitMessageTime > 5000) {
      lastRateLimitMessageTime = now
      setError(rateLimitError, 'Rate Limit')
      rateLimitError.name = 'RateLimitError'
    }

    return Promise.reject(rateLimitError)
  }
  return config
}, logRequestError)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Verificar se é um erro de rede por nome ou mensagem
    if (
      error.message?.includes('Network Error') ||
      error.message?.includes('network') ||
      error.name?.includes('Network') ||
      !error.response
    ) {
      return logRequestError(error)
    }

    if (error.name === 'RateLimitError') {
      return Promise.reject(error)
    }

    // Para erros de timeout (código: ECONNABORTED), personalizamos a mensagem
    if (error.code === 'ECONNABORTED') {
      const timeoutError = new Error('O servidor demorou muito para responder') as AxiosError
      timeoutError.config = error.config
      timeoutError.code = error.code
      return logRequestError(timeoutError)
    }

    return logResponseError(error)
  },
)

export default api
