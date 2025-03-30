<template>
  <div class="h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
    <div class="text-red-500 rounded-full bg-red-500/10 p-3 mb-2">
      <AlertTriangleIcon class="h-12 w-12" />
    </div>
    <h3 class="text-xl font-semibold text-white">{{ title }}</h3>
    <p class="text-white/70 max-w-md">{{ message }}</p>
    <button
      v-if="onRetry"
      @click="onRetry"
      class="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md flex items-center gap-2 transition-colors"
    >
      <RefreshCwIcon class="h-4 w-4" />
      Tentar novamente
    </button>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-vue-next'

defineProps<{
  title: string
  message: string
  error?: Error
  onRetry?: () => void
}>()
</script>
