import { useToast } from '@/app/composables/useToast'

export enum ErrorType {
  API = 'api',
  VALIDATION = 'validation',
  NETWORK = 'network',
  AUTH = 'auth',
  UNKNOWN = 'unknown',
}

export interface AppError extends Error {
  type?: ErrorType
  details?: Record<string, unknown>
  userMessage?: string
}

/**
 * Classe para tratamento centralizado de exceções
 */
class ExceptionHandler {
  private toast = useToast()

  /**
   * Captura e trata uma exceção, exibindo toast e logando informações
   */
  public handle(error: unknown, context?: string): void {
    const appError = this.normalizeError(error)
    this.logError(appError, context)
    this.showErrorToast(appError)
  }

  /**
   * Cria um handler de função para uso em try/catch
   */
  public createHandler(context: string) {
    return (error: unknown) => this.handle(error, context)
  }

  /**
   * Método para envolver uma função com tratamento de erro
   * Exemplo: const safeFunction = errorHandler.withErrorHandling(riskyFunction, 'Operação de Risco')
   */
  public withErrorHandling<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context: string,
  ): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | undefined> {
    return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | undefined> => {
      try {
        return await fn(...args)
      } catch (error) {
        this.handle(error, context)
        return undefined
      }
    }
  }

  /**
   * Converte diferentes tipos de erro para um formato padronizado
   */
  private normalizeError(error: unknown): AppError {
    if (error instanceof Error) {
      return error as AppError
    }

    if (typeof error === 'string') {
      const newError = new Error(error) as AppError
      newError.type = ErrorType.UNKNOWN
      return newError
    }

    const newError = new Error('Erro desconhecido') as AppError
    newError.type = ErrorType.UNKNOWN
    newError.details = { originalError: error }
    return newError
  }

  /**
   * Registra o erro no console com informações de contexto
   */
  private logError(error: AppError, context?: string): void {
    console.error(`[${context || 'App'}] ${error.type || 'ERROR'}:`, error.message, error)
  }

  /**
   * Exibe o toast apropriado baseado no tipo de erro
   */
  private showErrorToast(error: AppError): void {
    const title = this.getErrorTitle(error)
    const message = error.userMessage || error.message || 'Ocorreu um erro inesperado'

    switch (error.type) {
      case ErrorType.VALIDATION:
        this.toast.warning(title, message)
        break
      case ErrorType.NETWORK:
        this.toast.error(title, message)
        break
      case ErrorType.AUTH:
        this.toast.info(title, message)
        break
      default:
        this.toast.error(title, message)
    }
  }

  /**
   * Define o título do toast baseado no tipo de erro
   */
  private getErrorTitle(error: AppError): string {
    switch (error.type) {
      case ErrorType.API:
        return 'Erro na API'
      case ErrorType.VALIDATION:
        return 'Erro de validação'
      case ErrorType.NETWORK:
        return 'Erro de conexão'
      case ErrorType.AUTH:
        return 'Erro de autenticação'
      default:
        return 'Erro'
    }
  }
}

export const errorHandler = new ExceptionHandler()

export function createAppError(
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  userMessage?: string,
  details?: Record<string, unknown>,
): AppError {
  const error = new Error(message) as AppError
  error.type = type
  error.userMessage = userMessage
  error.details = details
  return error
}
