<template>
  <div class="flex items-center justify-center mt-4 py-2 w-full">
    <div class="backdrop-blur-md bg-black/30 rounded-full px-3 py-1.5 border border-white/20 shadow-lg w-full max-w-xl">
      <div class="flex items-center justify-between gap-2 lg:gap-3 w-full">
        <div class="flex items-center space-x-1">
          <Button
            variant="ghost"
            class="page-button nav-button h-7 w-7 p-0 text-white/80 rounded-full transition-colors duration-150"
            :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30 hover:text-white active:scale-95'"
            :disabled="currentPage === 1"
            @click="onPageChange(1)"
            aria-label="Primeira página"
          >
            <span class="sr-only">Primeira página</span>
            <ChevronFirstIcon class="h-3.5 w-3" />
          </Button>
          <Button
            variant="ghost"
            class="page-button nav-button h-7 w-7 p-0 text-white/80 rounded-full transition-colors duration-150"
            :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30 hover:text-white active:scale-95'"
            :disabled="currentPage === 1"
            @click="onPageChange(currentPage - 1)"
            aria-label="Página anterior"
          >
            <span class="sr-only">Página anterior</span>
            <ChevronLeftIcon class="h-3.5 w-3" />
          </Button>
        </div>

        <div class="flex items-center space-x-1 flex-grow justify-center">
          <div class="flex items-center space-x-1">
            <span class="text-xs font-medium text-white/80">Página</span>
            <span class="bg-black/30 px-1.5 py-1 rounded text-xs font-medium text-white border border-white/20">{{ currentPage }}</span>
            <span class="text-xs font-medium text-white/70">de</span>
            <span class="bg-black/30 px-1.5 py-1 rounded text-xs font-medium text-white border border-white/20">{{ totalPages || 1 }}</span>
          </div>
        </div>

        <div class="flex items-center space-x-1">
          <Button
            variant="ghost"
            class="page-button nav-button h-7 w-7 p-0 text-white/80 rounded-full transition-colors duration-150"
            :class="currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30 hover:text-white active:scale-95'"
            :disabled="currentPage === totalPages || totalPages === 0"
            @click="onPageChange(currentPage + 1)"
            aria-label="Próxima página"
          >
            <span class="sr-only">Próxima página</span>
            <ChevronRightIcon class="h-3.5 w-3" />
          </Button>
          <Button
            variant="ghost"
            class="page-button nav-button h-7 w-7 p-0 text-white/80 rounded-full transition-colors duration-150"
            :class="currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30 hover:text-white active:scale-95'"
            :disabled="currentPage === totalPages || totalPages === 0"
            @click="onPageChange(totalPages)"
            aria-label="Última página"
          >
            <span class="sr-only">Última página</span>
            <ChevronLastIcon class="h-3.5 w-3" />
          </Button>
        </div>

        <div class="hidden md:flex items-center pl-2 border-l border-white/20">
          <div class="flex items-center justify-center">
            <span class="text-xs font-medium text-white/70 mr-1">Itens</span>
            <div class="select-wrapper relative">
              <select
                :value="pageSize"
                class="items-per-page h-7 w-12 rounded-full border border-white/20 bg-black/30 text-white py-0.5 text-xs backdrop-blur-sm font-medium hover:border-white/40 hover:bg-black/40 transition-colors cursor-pointer"
                @change="onPageSizeChange"
                aria-label="Itens por página"
              >
                <option v-for="size in pageSizeOptions" :key="size" :value="size">
                  {{ size }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon, ChevronFirstIcon, ChevronLastIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import type {PaginationState} from "@/app/types";
import {API_CONFIG} from "@/app/config/api.ts";

const pageSizeOptions = API_CONFIG.PAGINATION.PAGE_SIZE_OPTIONS

const props = defineProps<{
  pagination: PaginationState;
}>();

const currentPage = computed(() => props.pagination.page);
const totalPages = computed(() => props.pagination.totalPages);
const pageSize = computed(() => props.pagination.pageSize);

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
  (e: 'page-size-change', pageSize: number): void;
}>();

const onPageChange = (page: number) => {
  emit('page-change', page);
};

const onPageSizeChange = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  emit('page-size-change', parseInt(select.value));
};
</script>

<style scoped>
select {
  appearance: none;
  text-align: center;
  padding-left: 0 !important;
  padding-right: 12px !important; /* Espaço para a seta */
}

.items-per-page {
  font-weight: 500;
  text-align-last: center; /* Propriedade específica para centralizar opções em selects */
}

.select-wrapper {
  position: relative;
  display: inline-block;
}

/* Adicionar seta customizada */
.select-wrapper::after {
  content: '';
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-top: 3px solid rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.select-wrapper:hover::after {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.nav-button {
  position: relative;
  overflow: hidden;
}

.page-button {
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.page-button:not([disabled]):hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.page-button:not([disabled]):active {
  transform: translateY(0) scale(0.95);
}

/* Estilo para options */
option {
  background-color: #1a1a1a;
  color: white;
  padding: 4px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  text-align: center;
}
</style>
