/**
 * Tipos de erro suportados pelo sistema
 */
export enum ErrorType {
  VALIDATION = 'validation',
  API = 'api',
  NETWORK = 'network',
  UNKNOWN = 'unknown',
  BUSINESS = 'business',
  PERMISSION = 'permission',
}

/**
 * Interface para erros de aplicação com contexto adicional
 */
export interface AppError extends Error {
  type: ErrorType
  userMessage: string
  data?: Record<string, unknown>
}
