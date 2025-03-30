<template>
  <TableBody>
    <template v-if="loading">
      <div class="w-full h-full flex items-center justify-center">
        <Loader2Icon class="h-16 w-16 animate-spin text-primary" />
      </div>
    </template>
    <template v-else-if="error">
      <TableRow
        class="w-full grid h-full flex items-center justify-center"
        :style="gridTemplateColumnsStyle"
      >
        <TableCell :colspan="columns.length" class="col-span-full">
          <ErrorState
            title="Ocorreu um erro"
            :message="errorMessage"
            :error="error"
            :on-retry="onRetry"
          />
        </TableCell>
      </TableRow>
    </template>
    <template v-else-if="!empty && items.length">
      <TableRow
        v-for="(item, index) in items"
        :key="tableContentHelper.getItemKey(item) || index"
        class="border-b border-white/10 hover:bg-white/5 transition-colors w-full grid gap-1"
        :style="gridTemplateColumnsStyle"
      >
        <TableCell
          v-for="column in columns"
          :key="`${tableContentHelper.getItemKey(item) || index}-${column.id}`"
          class="text-white/80 py-3 min-h-[56px] px-3 flex items-center justify-center text-center"
        >
          <div class="w-full text-center truncate" :title="formatCellValue(item, column)">
            {{ formatCellValue(item, column) }}
          </div>
        </TableCell>
      </TableRow>
    </template>
    <template v-else>
      <div class="w-full h-full flex items-center justify-center">
        <p class="text-white/80 text-center text-lg font-medium">Nenhum operador encontrado.</p>
      </div>
    </template>
  </TableBody>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TableBody, TableCell, TableRow } from '@/components/ui/table/index'
import { Loader2Icon } from 'lucide-vue-next'
import { type ColumnDefinition, SortableFields } from '@/app/types'
import TableContentHelper from '@/app/utils/TableContentHelper.ts'
import ErrorState from './ErrorState.vue'

const props = withDefaults(
  defineProps<{
    columns: ColumnDefinition[]
    items: Record<string, unknown>[]
    loading: boolean
    empty: boolean
    minColumnWidth?: number
    formatters?: Record<string, (value: unknown) => string>
    keyField?: string
    error?: Error | null
    onRetry?: () => void
  }>(),
  {
    minColumnWidth: 140,
  },
)

const tableContentHelper = new TableContentHelper(props)
const gridTemplateColumnsStyle = computed(() => {
  return `grid-template-columns: repeat(${props.columns.length}, minmax(${props.minColumnWidth}px, 1fr))`
})
const formatCache = new Map<string, string>()

const errorMessage = computed(() => {
  if (!props.error) return ''
  return props.error.message || 'Não foi possível carregar os dados. Tente novamente mais tarde.'
})

// Função principal que coordena a formatação
const formatCellValue = (item: Record<string, unknown>, column: ColumnDefinition): string => {
  const field = column.id
  const cacheKey = tableContentHelper.generateCacheKey(item, field as string)

  // Verificar cache
  const cachedValue = tableContentHelper.getFromCache(cacheKey, formatCache)
  if (cachedValue !== null) {
    return cachedValue
  }

  const value = item[field]
  let formatted: string

  // Aplicar formatação na ordem de prioridade
  if (column.formatter && typeof column.formatter === 'function') {
    formatted = tableContentHelper.applyColumnFormatter(value, column.formatter)
  } else if (props.formatters && props.formatters[field as string]) {
    formatted =
      tableContentHelper.applyPropFormatter(value, field as string) ||
      tableContentHelper.formatDefault(value)
  } else if (field === SortableFields.REGISTRATION_DATE) {
    formatted = tableContentHelper.formatDate(value) || tableContentHelper.formatDefault(value)
  } else {
    formatted = tableContentHelper.formatDefault(value)
  }

  // Armazenar no cache
  formatCache.set(cacheKey, formatted)
  return formatted
}
</script>
