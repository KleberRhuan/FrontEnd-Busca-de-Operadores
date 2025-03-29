<template>
  <TableBody class="h-full">
    <template v-if="loading">
      <LoadingState :columns-count="columns.length" :min-column-width="minColumnWidth" />
    </template>
    <template v-else-if="items.length">
      <TableRow 
        v-for="item in items" 
        :key="item.id"
        class="border-b border-white/10 hover:bg-white/5 transition-colors w-full grid gap-1"
        :style="gridTemplateColumnsStyle"
      >
        <TableCell 
          v-for="column in columns" 
          :key="`${item.id}-${column.id}`"
          v-memo="[item.id, column.id]"
          class="text-white/80 py-3 min-h-[56px] text-center px-3 whitespace-normal break-words"
        >
          {{ formatCellValue(item, column.id) }}
        </TableCell>
      </TableRow>
    </template>
    <template v-else>
      <EmptyState :columns-count="columns.length" :min-column-width="minColumnWidth" />
    </template>
  </TableBody>
</template>

<script setup lang="ts">
import { defineComponent, h, markRaw } from 'vue';
import { TableBody, TableCell, TableRow } from '@/components/ui/table/index';
import { Loader2Icon } from 'lucide-vue-next';

interface TableColumn {
  id: string;
  title: string;
  sortable: boolean;
}

interface DataItem {
  id: number | string;
  [key: string]: any;
}

const props = defineProps<{
  columns: TableColumn[];
  items: DataItem[];
  loading: boolean;
  gridTemplateColumnsStyle: string;
  minColumnWidth: number;
  formatters?: Record<string, (value: any) => string>;
}>();

// Cache para formatação de valores
const formatCache = new Map();

// Formatação dos valores das células com cache
const formatCellValue = (item: any, field: string) => {
  const cacheKey = `${item.id}-${field}`;
  if (formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey);
  }
  
  const value = item[field];
  let formatted;
  
  // Se temos um formatador específico para este campo, usá-lo
  if (props.formatters && props.formatters[field]) {
    formatted = props.formatters[field](value);
  } 
  // Caso padrão para data de registro
  else if (field === 'registrationDate' && value) {
    formatted = new Date(value).toLocaleDateString('pt-BR');
  } 
  // Fallback para outros campos
  else {
    formatted = value || '-';
  }
  
  formatCache.set(cacheKey, formatted);
  return formatted;
};

// Componentes locais para estados de loading e vazio
const LoadingState = markRaw(defineComponent({
  props: {
    columnsCount: Number,
    minColumnWidth: Number
  },
  setup(props) {
    return () => h(TableRow, {
      class: "w-full grid gap-1", 
      style: `grid-template-columns: repeat(${props.columnsCount}, minmax(${props.minColumnWidth}px, 1fr))`
    }, [
      h(TableCell, {
        colspan: props.columnsCount,
        class: "h-[60vh] col-span-full flex items-center justify-center"
      }, [
        h('div', { 
          class: 'flex items-center justify-center',
          style: 'margin-bottom: 10vh;' 
        }, [
          h(Loader2Icon, { class: 'h-8 w-8 animate-spin text-primary' })
        ])
      ])
    ]);
  }
}));

const EmptyState = markRaw(defineComponent({
  props: {
    columnsCount: Number,
    minColumnWidth: Number
  },
  setup(props) {
    return () => h(TableRow, {
      class: "w-full grid gap-1", 
      style: `grid-template-columns: repeat(${props.columnsCount}, minmax(${props.minColumnWidth}px, 1fr))`
    }, [
      h(TableCell, {
        colspan: props.columnsCount,
        class: "h-[60vh] text-white/70 col-span-full flex items-center justify-center"
      }, [
        h('div', { 
          class: 'text-lg font-medium text-center w-full flex flex-col items-center justify-center',
          style: 'margin-bottom: 10vh;' 
        }, 'Nenhum operador encontrado.')
      ])
    ]);
  }
}));
</script> 