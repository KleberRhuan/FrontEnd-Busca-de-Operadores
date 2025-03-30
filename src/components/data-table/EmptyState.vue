<template>
  <div class="w-full h-[250px] flex flex-col items-center justify-center">
    <div class="empty-state relative">
      <!-- Gradiente de fundo sutil (bloom effect) -->
      <div
        class="absolute -inset-4 bg-gradient-radial from-slate-500/5 via-slate-400/3 to-transparent rounded-3xl blur-3xl opacity-70"
      ></div>

      <!-- Bloom effect para dar profundidade -->
      <div
        class="absolute -inset-1 bg-gradient-to-br from-white/2 via-slate-500/3 to-transparent rounded-3xl blur-xl opacity-60"
      ></div>

      <!-- Container com efeito de vidro escuro -->
      <div
        class="empty-state-backdrop absolute inset-0 rounded-xl bg-black/75 backdrop-blur-lg border border-white/5 shadow-lg"
      ></div>

      <div class="p-6 flex flex-col items-center justify-center relative z-10">
        <!-- Ícone com efeito de vidro -->
        <div
          class="mb-4 rounded-full bg-black/80 p-4 border border-white/8 relative overflow-hidden"
        >
          <!-- Reflexo sutil -->
          <div
            class="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/8 to-transparent rounded-t-full"
          ></div>
          <SearchXIcon class="h-8 w-8 text-white/80 relative z-10" />
        </div>

        <!-- Texto -->
        <p class="text-white/80 text-center text-lg font-medium mb-2">
          {{ title }}
        </p>
        <p class="text-white/50 text-center text-sm font-light max-w-md">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchXIcon } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    default: 'Nenhum operador encontrado',
  },
  message: {
    type: String,
    default: 'Tente modificar sua pesquisa ou filtros para encontrar o que está procurando.',
  },
})
</script>

<style scoped>
.empty-state {
  width: auto;
  min-width: 300px;
  filter: drop-shadow(0 10px 20px rgb(0 0 0 / 0.5));
}

.empty-state-backdrop {
  box-shadow:
    0 10px 30px -5px rgba(0, 0, 0, 0.7),
    inset 0 1px 1px rgba(255, 255, 255, 0.05);
}
</style>
