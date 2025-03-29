<template>
  <TableHeader class="sticky top-0 z-10 bg-black/60 backdrop-blur-md w-full">
    <TableRow 
      class="border-b border-white/20 w-full grid gap-1" 
      :style="gridTemplateColumnsStyle"
    >
      <TableHead 
        v-for="column in columns" 
        :key="column.id"
        v-memo="[column.id, column.sortable, currentSortField === column.id, currentSortField === column.id ? currentSortOrder : '']"
        :class="getHeaderClasses(column)"
        @click="column.sortable ? handleSorting(column.id) : undefined"
      >
        <div class="flex items-center justify-between px-3 h-12 whitespace-nowrap">
          <span class="whitespace-nowrap overflow-hidden text-ellipsis">{{ column.title }}</span>
          <SortingIcon 
            v-if="column.sortable" 
            :is-active="currentSortField === column.id"
            :direction="currentSortField === column.id ? currentSortOrder : undefined"
            :field="column.id"
          />
        </div>
      </TableHead>
    </TableRow>
  </TableHeader>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, markRaw } from 'vue';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table/index';
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from 'lucide-vue-next';

// Tipagem das props
interface Column {
  id: string;
  title: string;
  sortable: boolean;
  isVisible?: boolean;
}

interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

const props = defineProps<{
  columns: Column[];
  sortConfig: SortConfig;
  minColumnWidth?: number;
}>();

// Definir valores padrão para props opcionais
const minColumnWidth = props.minColumnWidth || 140;

// Computed para grid de colunas - responsivo horizontal
const gridTemplateColumnsStyle = computed(() => {
  return `grid-template-columns: repeat(${props.columns.length}, minmax(${minColumnWidth}px, 1fr))`;
});

const emit = defineEmits<{
  (e: 'sort', field: string): void;
}>();

// Componente para os ícones de ordenação
const SortingIcon = markRaw(defineComponent({
  props: {
    isActive: Boolean,
    direction: String,
    field: String
  },
  setup(props) {
    return () => {
      const isRegistrationDate = props.field === 'registrationDate';
      const iconClass = isRegistrationDate ? 'h-4 w-4 min-w-4 min-h-4' : 'h-4 w-4';
      
      if (props.isActive && props.direction === 'asc') {
        return h(ArrowUpIcon, { class: iconClass });
      } else if (props.isActive && props.direction === 'desc') {
        return h(ArrowDownIcon, { class: iconClass });
      } else {
        return h(ArrowUpDownIcon, { class: `${iconClass} opacity-50` });
      }
    };
  }
}));

// Acesso facilitado aos valores do sortConfig
const currentSortField = computed(() => props.sortConfig.field);
const currentSortOrder = computed(() => props.sortConfig.order);

// Gerenciamento das classes dos headers com cache para otimização
const headerClassesCache = new Map();
const getHeaderClasses = (column: Column) => {
  if (headerClassesCache.has(column.id)) {
    return headerClassesCache.get(column.id);
  }

  const classes = [
    'text-white/90 font-medium text-center',
    'flex items-center',
    { 'cursor-pointer hover:bg-white/10 transition-colors': column.sortable }
  ];

  headerClassesCache.set(column.id, classes);
  return classes;
};

// Função para lidar com a ordenação
const handleSorting = (field: string) => {
  emit('sort', field);
};
</script> 