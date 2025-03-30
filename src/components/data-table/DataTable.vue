<template>
  <div>
    <TableControls
      v-model:search="searchTerm"
      :is-searching="isLoading"
      :is-loading="isLoading"
      @refresh="refresh"
      @search="handleSearch"
    />

    <TableContainer>
      <Table>
        <TableHeaders
          :columns="visibleColumns"
          :sort-params="sortParams"
          @sort-field="handleSortFieldChange"
          @sort-order="handleSortDirectionChange"
          @toggle-order="toggleSortDirection"
        />

        <TableContent
          :columns="visibleColumns"
          :items="items"
          :loading="isLoading"
          :empty="isEmpty"
          :error="error"
          :on-retry="refresh"
        />
      </Table>
    </TableContainer>

    <PaginationControls
      :pagination="pagination"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import {Table} from '@/components/ui/table'
import TableControls from '@/components/data-table/TableControls.vue'
import TableHeaders from '@/components/data-table/TableHeaders.vue'
import TableContainer from '@/components/data-table/TableContainer.vue'
import TableContent from '@/components/data-table/TableContent.vue'
import PaginationControls from '@/components/data-table/PaginationControls.vue'
import { useDataTable } from '@/app/composables/useDataTable.ts'
import type { ColumnDefinition } from '@/app/types'

interface DataTableProps {
  columns: ColumnDefinition[]
  persistKey?: string
  defaultPageSize?: number
  globalDebounce?: number
}

const props = defineProps<DataTableProps>()

const {
  items,
  visibleColumns,
  isEmpty,
  isLoading,
  searchTerm,
  pagination,
  sortParams,
  handlePageChange,
  handlePageSizeChange,
  handleSearch,
  refresh,
  error,
  handleSortFieldChange,
  handleSortDirectionChange,
  toggleSortDirection,
} = useDataTable({
  columns: props.columns,
  persistKey: props.persistKey,
  defaultPageSize: props.defaultPageSize,
  globalDebounce: props.globalDebounce,
})
</script>
