<template>
  <div class="w-full h-[300px] flex flex-col items-center justify-center">
    <div class="fancy-loader relative">
      <!-- Gradiente de fundo sutil (bloom effect) -->
      <div
        class="absolute -inset-4 bg-gradient-radial from-indigo-500/8 via-blue-500/4 to-transparent rounded-3xl blur-3xl opacity-80"
      ></div>

      <!-- Bloom effect para dar profundidade -->
      <div
        class="absolute -inset-1 bg-gradient-to-br from-white/3 via-indigo-500/4 to-transparent rounded-3xl blur-xl opacity-60"
      ></div>

      <!-- Container principal com efeito de vidro escuro -->
      <div
        class="fancy-loader-backdrop absolute inset-0 rounded-2xl bg-black/80 backdrop-blur-lg border border-white/5 shadow-lg"
      ></div>

      <div class="p-8 flex flex-col items-center justify-center relative z-10">
        <!-- Spinner com múltiplas camadas -->
        <div class="spinner-container relative mb-5">
          <!-- Anéis de spinner externos com cores mais sutis -->
          <div
            class="spinner-ring absolute inset-0 rounded-full border-2 border-t-2 border-r-2 border-b-2 border-white/5 animate-spin"
          ></div>
          <div
            class="spinner-ring absolute inset-0 rounded-full border-2 border-t-2 border-r-transparent border-b-transparent border-l-transparent border-indigo-400/40 animate-spin-slow"
          ></div>
          <div
            class="spinner-ring absolute inset-0 scale-90 rounded-full border-2 border-r-2 border-t-transparent border-b-transparent border-l-transparent border-blue-500/30 animate-spin"
            style="animation-direction: reverse; animation-duration: 5s"
          ></div>

          <!-- Núcleo central do spinner com vidro escuro -->
          <div
            class="spinner-core flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-black/90 to-zinc-800/80 backdrop-blur-lg border border-white/8"
          >
            <!-- Brilho pulsante mais sutil -->
            <div class="absolute inset-0 rounded-full bg-indigo-600/10 animate-pulse-subtle"></div>

            <!-- Reflexo sutil de vidro -->
            <div
              class="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/8 to-transparent rounded-t-full"
            ></div>

            <!-- Ícone de carregamento -->
            <Loader2Icon class="h-7 w-7 text-white/80 relative z-10" />
          </div>
        </div>

        <!-- Texto de carregamento com animação -->
        <div class="flex flex-col items-center">
          <p class="text-white/80 text-base font-medium tracking-wide mb-1">{{ loadingText }}</p>
          <div class="dots-animation flex space-x-1.5 mt-1">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2Icon } from 'lucide-vue-next'

defineProps({
  loadingText: {
    type: String,
    default: 'Carregando dados',
  },
})

</script>

<style scoped>
.fancy-loader {
  width: auto;
  min-width: 220px;
  filter: drop-shadow(0 10px 20px rgb(0 0 0 / 0.5));
}

.fancy-loader-backdrop {
  box-shadow:
    0 10px 30px -5px rgba(0, 0, 0, 0.7),
    inset 0 1px 1px rgba(255, 255, 255, 0.05);
}

.spinner-container {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-ring {
  width: 100%;
  height: 100%;
}

.spinner-core {
  box-shadow:
    0 0 15px rgba(79, 70, 229, 0.15),
    inset 0 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

/* Removendo o after para substituir pelo div com reflexo mais sutil */
.spinner-core::after {
  content: none;
}

.dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  animation: dot-flashing 1.4s infinite alternate;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-flashing {
  0% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  100% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

:deep(.animate-spin-slow) {
  animation: spin-slow 3s linear infinite;
}

:deep(.animate-pulse-subtle) {
  animation: pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-subtle {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.2;
  }
}
</style>
