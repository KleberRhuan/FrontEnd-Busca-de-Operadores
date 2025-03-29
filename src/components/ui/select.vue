<script setup lang="ts">
import { computed, provide, ref, toRef, watch } from 'vue'
import { ChevronDownIcon, CheckIcon } from 'lucide-vue-next'
import { 
  Listbox, 
  ListboxButton, 
  ListboxOptions, 
  ListboxOption, 
  ListboxLabel 
} from '@headlessui/vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  name?: string
}>()

const emit = defineEmits(['update:modelValue'])

const selectedValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Provide context for children components
provide('select', {
  selectedValue,
  name: toRef(props, 'name'),
  disabled: toRef(props, 'disabled'),
  placeholder: toRef(props, 'placeholder')
})
</script>

<template>
  <Listbox 
    v-model="selectedValue" 
    :disabled="disabled"
    as="div" 
    class="relative"
  >
    <slot />
  </Listbox>
</template> 