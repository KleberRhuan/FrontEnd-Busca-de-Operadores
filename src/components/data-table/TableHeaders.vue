<template>
  <TableHeader class="sticky top-0 z-10 bg-black/60 backdrop-blur-md">
    <TableRow class="border-b border-white/20 grid gap-1" :style="gridTemplateColumnsStyle">
      <TableHead
        v-for="column in columns"
        :key="column.id"
        v-memo="[
          column.id,
          column.sortable,
          currentSortedField === column.id,
          currentSortedField === column.id ? currentSortedDirection : '',
        ]"
        :class="getHeaderClasses(column)"
        @click="column.sortable ? handleSorting(column.id as SortableFields) : null"
      >
        <div class="flex items-center justify-center gap-2 px-2 h-12 relative">
          <p
            class="whitespace-nowrap overflow-hidden text-ellipsis text-center"
            :title="column.title"
          >
            {{ column.title }}
          </p>

          <SortingIcon
            v-if="column.sortable"
            :is-active="currentSortedField === column.id"
            :direction="currentSortedField === column.id ? currentSortedDirection : undefined"
            :field="column.id as SortableFields"
            class="ml-1 flex-shrink-0"
          />
        </div>
      </TableHead>
    </TableRow>
  </TableHeader>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, markRaw, type PropType } from 'vue'
import { TableHead, TableHeader, TableRow } from '@/components/ui/table/index'
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from 'lucide-vue-next'
import { SortDirection, type ColumnDefinition, SortableFields, type SortConfig } from '@/app/types'

const props = defineProps<{
  columns: ColumnDefinition[]
  sortParams: SortConfig
  minColumnWidth?: number
}>()

const minColumnWidth = props.minColumnWidth || 180

// Computed para grid de colunas - responsivo horizontal
const gridTemplateColumnsStyle = computed(() => {
  return `grid-template-columns: repeat(${props.columns.length}, minmax(${minColumnWidth}px, 1fr))`
})

const emit = defineEmits<{
  (e: 'sort', field: SortableFields): void
  (e: 'toggle-order'): void
}>()

// Componente para os ícones de ordenação
const SortingIcon = markRaw(
  defineComponent({
    props: {
      isActive: Boolean,
      direction: String as PropType<SortDirection | null>,
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

const currentSortedField = computed(() => {
  return props.sortParams.sortField
})

const currentSortedDirection = computed(() => {
  return props.sortParams.sortDirection
})

const headerClassesCache = new Map()
const getHeaderClasses = (column: ColumnDefinition) => {
  if (headerClassesCache.has(column.id)) {
    return headerClassesCache.get(column.id)
  }

  const classes = [
    'text-white/90 font-medium flex items-center justify-center text-center',
    {
      'cursor-pointer hover:bg-white/10 transition-colors': column.sortable,
    },
  ]

  headerClassesCache.set(column.id, classes)
  return classes
}

const handleSorting = (field: SortableFields) => {
  if (field === currentSortedField.value) {
    emit('toggle-order')
    return
  }
  emit('sort', field)
}
</script>
