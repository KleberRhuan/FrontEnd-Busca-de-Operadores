<template>
  <div class="flex flex-wrap items-center justify-between py-4 mb-4 w-full gap-4">
    <!-- Campo de pesquisa -->
    <div class="relative flex-1 max-w-full w-full md:max-w-md">
      <!-- Ícone fixo de pesquisa -->
      <SearchIcon class="search-icon absolute left-5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
      
      <!-- Ícone de loading que aparece sobre o ícone de pesquisa -->
      <LoaderIcon 
        v-if="isActuallySearching" 
        class="search-loading absolute left-5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary animate-spin" 
      />
      
      <Input 
        placeholder="Pesquisar operadores..." 
        class="pl-12 py-6 bg-black/40 border-white/20 backdrop-blur-md text-white rounded-full shadow-lg placeholder:text-white/50 focus-visible:ring-white/40 focus-visible:border-white/30 w-full"
        v-model="searchTerm"
        @input="onSearchInput"
        aria-label="Pesquisar operadores"
      />
    </div>
    
    <!-- Botão de atualização -->
    <Button 
      variant="default" 
      class="refresh-button bg-transparent border border-white/10 hover:bg-white/20 hover:border-white/30 text-white/90 hover:text-white backdrop-blur-sm text-sm font-medium rounded-full px-4 py-2 h-10 transition-all shadow-sm ml-auto mt-0 md:mt-0"
      @click="onRefresh"
      :disabled="isActuallySearching"
      aria-label="Atualizar dados"
    >
      <RefreshCcwIcon v-if="!isRefreshing" class="mr-1.5 h-3.5 w-3.5" />
      <LoaderIcon v-else class="mr-1.5 h-3.5 w-3.5 animate-spin" />
      <span>Atualizar</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, computed } from 'vue';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCcwIcon, SearchIcon, LoaderIcon } from 'lucide-vue-next';

// Tipagem para as colunas
interface TableColumn {
  id: string;
  title: string;
  isVisible: boolean;
  toggleVisibility: () => void;
}

const props = defineProps<{
  columns: TableColumn[];
  isSearching?: boolean;
  isRefreshing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'search', term: string): void;
  (e: 'refresh'): void;
}>();

const searchTerm = ref('');

// Garantir que isSearching seja tratado como booleano
const isActuallySearching = computed(() => Boolean(props.isSearching));

/**
 * Emite o evento de pesquisa imediatamente
 * O debounce será gerenciado pelo componente pai
 */
const onSearchInput = () => {
  emit('search', searchTerm.value);
};

/**
 * Aciona o evento de atualização de dados
 */
const onRefresh = () => {
  emit('refresh');
};
</script>

<style scoped>
/* Garante que o ícone de pesquisa esteja visível e corretamente posicionado */
.search-icon {
  pointer-events: none;
  z-index: 10;
}

/* Estilo para o ícone de carregamento */
.search-loading {
  pointer-events: none;
  z-index: 20; /* Maior que o ícone de busca para ficar por cima */
}

input:focus ~ .search-icon {
  color: rgba(255, 255, 255, 0.8);
}

.refresh-button {
  position: relative;
  overflow: hidden;
}

.refresh-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.refresh-button:active {
  transform: translateY(0);
}

/* Efeito de brilho no hover */
.refresh-button::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  transform: scale(0);
  opacity: 0;
  transition: transform 0.3s, opacity 0.3s;
  pointer-events: none;
}

.refresh-button:hover::after {
  transform: scale(1);
  opacity: 1;
}
</style>
