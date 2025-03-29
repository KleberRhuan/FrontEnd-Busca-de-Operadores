<script setup lang="ts">
import { CheckIcon } from 'lucide-vue-next'
import { computed, inject, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  disabled?: boolean
  value: string
  class?: string
}>()

const select = inject('select', {})

const isHorizontal = computed(() => select?.orientation === 'horizontal')
const isSelected = computed(() => props.value === select?.value?.value)

const baseClasses = computed(() => {
  return cn(
    'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
    isHorizontal.value ? 'items-center' : '',
    props.disabled && 'pointer-events-none opacity-50',
    isSelected.value ? 'bg-white/5 text-white' : 'text-white/80 hover:bg-white/10',
    props.class,
  )
})
</script>

<template>
  <SelectItemImpl
    v-bind="{ ...$attrs, disabled: props.disabled, value: props.value }"
    :class="baseClasses"
  >
    <span v-if="isSelected" class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-white">
      <CheckIcon class="h-4 w-4" />
    </span>
    <slot />
  </SelectItemImpl>
</template>
