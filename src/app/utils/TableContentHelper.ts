/* eslint-disable @typescript-eslint/no-explicit-any */

export default class TableContentHelper {
  private readonly props: any;

  constructor(props: any) {
    this.props = props
  }

  getItemKey = (item: Record<string, unknown>): string | null => {
    return this.props.keyField && item[this.props.keyField] ? String(item[this.props.keyField]) : null
  }

  generateCacheKey = (item: Record<string, unknown>, fieldId: string): string => {
    const itemId = this.getItemKey(item) ?? Object.values(item).join('-')
    return `${itemId}-${fieldId}`
  }

  getFromCache = (cacheKey: string, formatCache: Map<string, string>): string | null => {
    return formatCache.has(cacheKey) ? formatCache.get(cacheKey)! : null
  }

  // Aplicar formatador da definição da coluna
  applyColumnFormatter = (value: unknown, formatter: (value: unknown) => string): string => {
    return formatter(value)
  }

  // Aplicar formatador dos props
  applyPropFormatter = (value: unknown, field: string): string | null => {
    return this.props.formatters && this.props.formatters[field]
      ? this.props.formatters[field](value)
      : null
  }

  // Formatação específica para datas
  formatDate = (value: unknown): string | null => {
    return value instanceof Date ? value.toLocaleDateString('pt-BR') : null
  }

  // Formatação padrão
  formatDefault = (value: unknown): string => {
    return value !== null && value !== undefined ? String(value) : '-'
  }
}
