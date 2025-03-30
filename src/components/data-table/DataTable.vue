<template>
  <div>
    <!-- Alerta de erro de API -->
    <div
      v-if="apiError && apiError.message"
      class="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-white flex items-center justify-between"
    >
      <div class="flex items-center">
        <div class="mr-3 text-red-400">
          <AlertCircleIcon class="h-5 w-5" />
        </div>
        <span>{{ apiError.message }}</span>
      </div>
      <button
        @click="clearApiError"
        class="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
      >
        <XIcon class="h-4 w-4" />
      </button>
    </div>

    <!-- Alerta de rate limit -->
    <div
      v-if="isRateLimited"
      class="mb-4 p-3 bg-amber-900/30 border border-amber-700 rounded-lg text-white flex items-center justify-between"
    >
      <div class="flex items-center">
        <div class="mr-3 text-amber-400">
          <ClockIcon class="h-5 w-5" />
        </div>
        <span>Muitas requisições! Aguarde {{ retryAfter }} segundos para continuar.</span>
      </div>
    </div>

    <TableControls
      v-model:search="searchTerm"
      :is-loading="isLoading"
      @refresh="refresh"
      @search="handleSearch"
    />

    <TableContainer ref="tableContainerRef">
      <Table>
        <TableHeaders
          :columns="visibleColumns"
          :sort-params="sortParams"
          @sort="handleSort"
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
import { Table } from '@/components/ui/table'
import TableControls from '@/components/data-table/TableControls.vue'
import TableHeaders from '@/components/data-table/TableHeaders.vue'
import TableContainer from '@/components/data-table/TableContainer.vue'
import TableContent from '@/components/data-table/TableContent.vue'
import PaginationControls from '@/components/data-table/PaginationControls.vue'
import { useDataTable } from '@/app/composables/useDataTable.ts'
import type { ColumnDefinition } from '@/app/types'
import { AlertCircleIcon, XIcon, ClockIcon } from 'lucide-vue-next'
import { apiErrorState } from '@/app/composables/useApiErrorState'
const { error: apiError, isRateLimited, retryAfter, clearError: clearApiError } = apiErrorState

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
  toggleSortDirection,
  handleSort,
} = useDataTable({
  columns: props.columns,
  persistKey: props.persistKey,
  defaultPageSize: props.defaultPageSize,
  globalDebounce: props.globalDebounce,
})
</script>
