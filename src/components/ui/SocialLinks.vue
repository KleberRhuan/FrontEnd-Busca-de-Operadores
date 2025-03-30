<template>
  <div class="social-links flex gap-5 justify-center items-center mt-2">
    <a
      v-for="link in links"
      :key="link.name"
      :href="link.url"
      :aria-label="link.name"
      target="_blank"
      rel="noopener noreferrer"
      class="social-link relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-black/90 to-zinc-900/80 backdrop-blur-lg border border-white/5 shadow-lg hover:border-white/10 transition-all duration-300 ease-out group overflow-hidden"
    >
      <!-- Bloom effect sutil -->
      <span
        class="absolute -inset-2 opacity-0 group-hover:opacity-60 transition-opacity duration-500"
        :class="link.bloomColor"
      ></span>

      <!-- Container para ícone com vidro escuro -->
      <span class="relative z-10 flex items-center justify-center w-full h-full">
        <!-- Reflexo sutil na parte superior -->
        <span
          class="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/8 to-transparent rounded-t-full opacity-40 group-hover:opacity-60 transition-opacity duration-300"
        ></span>

        <!-- Ícone -->
        <component
          :is="link.icon"
          class="w-4.5 h-4.5 text-white/70 group-hover:text-white/90 transition-all duration-300"
          :style="{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }"
        />
      </span>

      <span class="sr-only">{{ link.name }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { Github, Mail, Linkedin } from 'lucide-vue-next'

const links = [
  {
    name: 'GitHub',
    url: 'https://github.com/kleberrhuan',
    icon: Github,
    bloomColor: 'bg-gradient-radial from-indigo-500/10 via-indigo-500/5 to-transparent blur-xl',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/kleber-rhuan',
    icon: Linkedin,
    bloomColor: 'bg-gradient-radial from-blue-500/10 via-blue-500/5 to-transparent blur-xl',
  },
  {
    name: 'Email',
    url: 'mailto:kleber.rhuan@hotmail.com',
    icon: Mail,
    bloomColor: 'bg-gradient-radial from-emerald-500/10 via-emerald-500/5 to-transparent blur-xl',
  },
]
</script>

<style scoped>
.social-link {
  /* Aparência premium de vidro fosco escuro */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.5),
    inset 0 1px 1px rgba(255, 255, 255, 0.05);
}

/* Transição suave ao passar o mouse */
.social-link {
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.social-link:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.5),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

@keyframes pulse-subtle {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

.social-link:hover component {
  animation: pulse-subtle 2s infinite ease-in-out;
}

/* Adicionar tamanho personalizado para ícones */
.h-4\.5 {
  height: 1.125rem;
}

.w-4\.5 {
  width: 1.125rem;
}
</style>
