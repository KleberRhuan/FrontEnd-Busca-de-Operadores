<script setup lang="ts">
import { cn } from '@/lib/utils'
import {
  SelectContent,
  type SelectContentEmits,
  type SelectContentProps,
  SelectPortal,
  SelectViewport,
  useForwardPropsEmits,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import { SelectScrollDownButton, SelectScrollUpButton } from '.'
import { FloatingPortal } from 'reka-ui'
import { Transition } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<SelectContentProps & { class?: HTMLAttributes['class'] }>(),
  {
    position: 'popper',
  },
)
const emits = defineEmits<SelectContentEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <FloatingPortal>
    <Transition
      name="select"
      @after-leave="afterLeave"
    >
      <div
        ref="contentRef"
        v-if="open"
        :class="cn(
          'z-50 rounded-md overflow-hidden shadow-md',
          'bg-black/70 backdrop-blur-lg border border-white/20',
          'text-white text-popover-foreground data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-h-56',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          props.class,
        )"
        :style="floatingStyles"
      >
        <SelectScrollUpButton v-if="select.scrollUpButton" />
        <div :class="cn('p-0.5', position === 'popper' && 'max-h-[var(--radix-select-content-available-height)]')">
          <slot />
        </div>
        <SelectScrollDownButton v-if="select.scrollDownButton" />
      </div>
    </Transition>
  </FloatingPortal>
</template>
