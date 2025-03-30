<template>
  <TableHeader class="sticky top-0 z-10 bg-black/60 backdrop-blur-md">
    <TableRow class="border-b border-white/20 grid gap-1" :style="gridTemplateColumnsStyle">
      <TableHead
        v-for="column in columns"
        :key="column.id"
        v-memo="[
          column.id,
          column.sortable,
          currentSortField === column.id,
          currentSortField === column.id ? currentSortDirection : '',
        ]"
        :class="getHeaderClasses(column)"
        @click="column.sortable ? handleSorting(column.id as SortableFields) : null"
      >
        <div class="flex items-center justify-center gap-2 px-2 h-12 relative">
          <p
            class="whitespace-nowrap overflow-hidden text-ellipsis text-center"
            :title="column.title"
            @click.stop="column.sortable ? handleSortFieldClick(column.id as SortableFields) : null"
          >
            {{ column.title }}
          </p>

          <SortingIcon
            v-if="column.sortable"
            :is-active="currentSortField === column.id"
            :direction="currentSortField === column.id ? currentSortDirection : undefined"
            :field="column.id as SortableFields"
            class="ml-1 flex-shrink-0"
            @click.stop="handleSortDirectionClick(column.id as SortableFields)"
          />
        </div>
      </TableHead>
    </TableRow>
  </TableHeader>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, markRaw } from 'vue'
import { TableHead, TableHeader, TableRow } from '@/components/ui/table/index'
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from 'lucide-vue-next'
import { SortDirection, type ColumnDefinition, SortableFields } from '@/app/types'

const props = defineProps<{
  columns: ColumnDefinition[]
  sortParams: Record<string, string>
  minColumnWidth?: number
}>()

// Definir valores padrão para props opcionais
const minColumnWidth = props.minColumnWidth || 160

// Computed para grid de colunas - responsivo horizontal
const gridTemplateColumnsStyle = computed(() => {
  return `grid-template-columns: repeat(${props.columns.length}, minmax(${minColumnWidth}px, 1fr))`
})

const emit = defineEmits<{
  (e: 'sort', field: SortableFields): void
  (e: 'sort-field', field: SortableFields): void
  (e: 'sort-order', order: SortDirection): void
  (e: 'toggle-order'): void
}>()

// Componente para os ícones de ordenação
const SortingIcon = markRaw(
  defineComponent({
    props: {
      isActive: Boolean,
      direction: String,
      field: String,
    },
    setup(props) {
      return () => {
        const baseClass = 'flex-shrink-0 transition-colors duration-200'
        const iconClass = props.isActive
          ? `${baseClass} h-4 w-4 text-white/50`
          : `${baseClass} h-4 w-4 text-white/50 hover:text-white/80`

        if (props.isActive && props.direction === SortDirection.ASC) {
          return h(ArrowUpIcon, { class: iconClass })
        } else if (props.isActive && props.direction === SortDirection.DESC) {
          return h(ArrowDownIcon, { class: iconClass })
        } else {
          return h(ArrowUpDownIcon, { class: iconClass })
        }
      }
    },
  }),
)

const currentSortField = computed(() => props.sortParams.field)
const currentSortDirection = computed(() => props.sortParams.order)

const headerClassesCache = new Map()
const getHeaderClasses = (column: ColumnDefinition) => {
  if (headerClassesCache.has(column.id)) {
    return headerClassesCache.get(column.id)
  }

  const classes = [
    'text-white/90 font-medium flex items-center justify-center text-center',
    { 'cursor-pointer hover:bg-white/10 transition-colors': column.sortable },
  ]

  headerClassesCache.set(column.id, classes)
  return classes
}

const handleSorting = (field: SortableFields) => {
  emit('sort', field)
}

const handleSortFieldClick = (field: SortableFields) => {
  emit('sort-field', field)
}

const handleSortDirectionClick = (field: SortableFields) => {
  if (field === currentSortField.value) {
    emit('toggle-order')
  } else {
    emit('sort-field', field)
    emit('sort-order', SortDirection.DESC)
  }
}
</script>
