import axios, { AxiosError } from 'axios'
import { API_CONFIG } from '@/app/config/api'
import type { ApiError } from '@/app/types'
import { errorHandler, createAppError, ErrorType } from '@/app/utils/exceptionHandler'

if (!API_CONFIG.BASE_URL) {
  console.error('ERRO: VITE_API_URL não está definida no arquivo .env')
  errorHandler.handle(
    createAppError(
      'URL da API não configurada',
      ErrorType.API,
      'A URL da API não está configurada. Por favor, configure a variável VITE_API_URL no arquivo .env',
    ),
    'Inicialização da API',
  )
}

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL || 'http://localhost:8000',
  timeout: API_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
})

let isRateLimited = false
let rateLimitExpiresAt = 0
let lastRateLimitMessageTime = 0

const setRateLimit = (seconds: number) => {
  isRateLimited = true
  rateLimitExpiresAt = Date.now() + seconds * 1000

  setTimeout(() => {
    if (Date.now() >= rateLimitExpiresAt) {
      isRateLimited = false
      console.info('Rate limit expirado. Requisições podem ser retomadas.')
    }
  }, seconds * 1000)

  console.warn(
    `Rate limit ativado por ${seconds} segundos até ${new Date(rateLimitExpiresAt).toLocaleTimeString()}`,
  )
}

const handleRateLimit = (headers: Record<string, string>) => {
  const retryAfter = headers['retry-after']
  const limitRemaining = headers['x-ratelimit-remaining']
  const seconds = retryAfter ? parseInt(retryAfter) : 60

  setRateLimit(seconds)

  errorHandler.handle(
    createAppError(
      'Limite de requisições atingido',
      ErrorType.API,
      `Aguarde ${seconds} segundos antes de tentar novamente. Requisições restantes: ${limitRemaining || 0}`,
      { seconds, limitRemaining },
    ),
    'Rate Limit',
  )
}

const shouldBlockRequest = () => {
  if (isRateLimited) {
    const remainingTime = Math.ceil((rateLimitExpiresAt - Date.now()) / 1000)
    const now = Date.now()

    if (now - lastRateLimitMessageTime > 5000) {
      lastRateLimitMessageTime = now

      errorHandler.handle(
        createAppError(
          'Requisição bloqueada',
          ErrorType.API,
          `Limite de requisições atingido. Aguarde mais ${remainingTime} segundos.`,
          { remainingTime },
        ),
        'Rate Limit',
      )
    }
    return true
  }
  return false
}

api.interceptors.request.use(
  (config) => {
    if (shouldBlockRequest()) {
      const rateLimitError = createAppError(
        'Requisição cancelada devido a rate limit ativo',
        ErrorType.API,
      )
      rateLimitError.name = 'RateLimitError'
      return Promise.reject(rateLimitError)
    }

    return config
  },
  (error: Error) => {
    errorHandler.handle(
      createAppError(
        'Erro ao preparar requisição',
        ErrorType.NETWORK,
        'Não foi possível enviar a requisição para o servidor.',
        { originalError: error },
      ),
      'Requisição HTTP',
    )
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<ApiError>) => {
    if (error.name === 'RateLimitError') {
      return Promise.reject(error)
    }

    if (error.response) {
      if (error.response.status === 429) {
        handleRateLimit(error.response.headers as Record<string, string>)
      } else {
        const data = error.response.data
        const title = data?.title ?? 'Erro na requisição'
        const message =
          data?.userMessage ?? 'Ocorreu um erro inesperado. Tente novamente mais tarde.'

        errorHandler.handle(
          createAppError(title, ErrorType.API, message, {
            status: error.response.status,
            url: error.config?.url,
          }),
          'API',
        )
      }
    } else if (error.request) {
      errorHandler.handle(
        createAppError(
          'Falha na comunicação',
          ErrorType.NETWORK,
          'Não foi possível obter resposta do servidor. Verifique sua conexão.',
          { request: error.request },
        ),
        'Conexão API',
      )
    } else {
      errorHandler.handle(
        createAppError(
          'Erro inesperado',
          ErrorType.UNKNOWN,
          'Um erro inesperado ocorreu. Tente novamente mais tarde.',
          { error },
        ),
        'Axios',
      )
    }

    return Promise.reject(error)
  },
)

export default api
