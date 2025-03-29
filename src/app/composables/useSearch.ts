import { ref } from 'vue'
import type { Ref } from 'vue'

export interface SearchOptions {
  debounceDelay?: number
  onSearch?: (term: string) => void
}

export function useSearch(options: SearchOptions = {}) {
  const { 
    debounceDelay = 500,
    onSearch
  } = options

  // Estados
  const searchTerm = ref('')
  const debouncedSearchTerm = ref('')
  const isSearching = ref(false)
  
  // Timeout para debounce
  let debounceTimeout: number | null = null

  // Limpar timeout de debounce se existir
  const clearDebounceTimeout = () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
      debounceTimeout = null
    }
  }

  // Função principal de busca com debounce
  const handleSearch = (term: string) => {
    // Atualiza o termo sendo exibido imediatamente para feedback
    debouncedSearchTerm.value = term
    
    // Indica que a busca está em andamento para feedback visual
    isSearching.value = true
    
    // Cancela o temporizador anterior se existir
    clearDebounceTimeout()
    
    // Configura novo temporizador
    debounceTimeout = window.setTimeout(() => {
      // Verifica se o termo mudou para evitar buscas desnecessárias
      if (searchTerm.value === term) {
        isSearching.value = false
        return
      }
      
      // Atualiza o termo de busca
      searchTerm.value = term
      
      // Executa o callback de busca, se fornecido
      if (onSearch) {
        onSearch(term)
      }
      
      // Fim da busca
      debounceTimeout = null
      isSearching.value = false
    }, debounceDelay)
  }

  // Limpar busca
  const clearSearch = () => {
    clearDebounceTimeout()
    searchTerm.value = ''
    debouncedSearchTerm.value = ''
    isSearching.value = false
  }

  // Limpeza de recursos
  const dispose = () => {
    clearDebounceTimeout()
  }

  return {
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    handleSearch,
    clearSearch,
    dispose
  }
} 