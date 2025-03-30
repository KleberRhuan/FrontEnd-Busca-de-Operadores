import { ref } from 'vue'
import { useToast } from '@/app/composables/useToast'

export interface SearchOptions {
  onSearch?: (value: string) => void
  minLength?: number
}

export function useSearch(options: SearchOptions = {}) {
  const { onSearch, minLength = 2 } = options

  const toast = useToast()
  const searchTerm = ref('')
  const isSearching = ref(false)

  const search = (value: string) => {
    try {
      if (onSearch && (value === '' || value.length >= minLength)) {
        onSearch(value)
      }
    } catch (error) {
      toast.error(
        'Erro na busca',
        'Ocorreu um erro ao processar a busca. Tente novamente com outros termos.',
      )
    } finally {
      isSearching.value = false
    }
  }

  const handleSearch = (value: string) => {
    if (value.length > 0 && value.length < minLength) {
      toast.info(
        'Termo de busca curto',
        `Digite pelo menos ${minLength} caracteres para realizar a busca.`,
      )
      return
    }

    isSearching.value = true
    searchTerm.value = value
    search(value)
  }

  const clearSearch = () => {
    searchTerm.value = ''
  }

  return {
    searchTerm,
    isSearching,
    handleSearch,
    clearSearch,
  }
}
