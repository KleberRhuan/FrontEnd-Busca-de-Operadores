<template>
  <div class="w-full">
    <TableControls 
      :loading="isLoading" 
      :search-term="searchTerm" 
      @search="handleSearch" 
      @update="refresh" 
    />

    <TableContainer>
      <Table>
        <template #header>
          <TableHeaders 
            :columns="visibleColumns" 
            :sort-config="sortConfig" 
            @sort="handleSort"
          />
        </template>
        
        <TableContent 
          :items="items" 
          :columns="visibleColumns" 
          :loading="isLoading" 
          :empty="isEmpty"
        />
      </Table>
    </TableContainer>

    <PaginationControls 
      v-if="!isEmpty" 
      :pagination="pagination" 
      @page-change="handlePageChange" 
      @page-size-change="handlePageSizeChange" 
    />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { Table } from '../ui/table/index'
import TableControls from './TableControls.vue'
import TableContainer from './TableContainer.vue'
import TableHeaders from './TableHeaders.vue'
import TableContent from './TableContent.vue'
import PaginationControls from './PaginationControls.vue'
import { useDataTable } from '../../app/composables/useDataTable'
import type { ColumnDefinition } from '../../app/composables/useTableColumns'

// Props
const props = defineProps({
  fetchFn: {
    type: Function as any,
    required: true
  },
  columns: {
    type: Array as any,
    required: true
  },
  persistKey: {
    type: String,
    default: ''
  },
  defaultPageSize: {
    type: Number,
    default: 10
  }
})

// Composable com toda a lógica da tabela
const {
  // Estados
  items,
  visibleColumns,
  isEmpty,
  isLoading,
  searchTerm,
  pagination,
  sortConfig,
  
  // Ações
  handleSort,
  handlePageChange,
  handlePageSizeChange,
  handleSearch,
  refresh,
  dispose
} = useDataTable({
  columns: props.columns,
  persistKey: props.persistKey,
  defaultPageSize: props.defaultPageSize,
  fetchFn: props.fetchFn
})

// Cleanup no unmount
onUnmounted(() => {
  dispose()
})
</script>

<style>
/* Classes específicas para estilização da tabela */
.cell-actions {
  @apply flex justify-end items-center gap-2;
}
</style>
