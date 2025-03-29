<template>
  <div class="rounded-xl border border-white/20 overflow-hidden backdrop-blur-lg shadow-xl bg-black/40 w-full">
    <div class="h-[60vh] overflow-y-auto overflow-x-auto custom-scrollbar w-full relative">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// Sem propriedades ou lógica específica, apenas encapsulando o container
</script>

<style>
/* Estilização das scrollbars - com cores que combinam com o tema do site */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(79, 70, 229, 0.6) rgba(0, 0, 0, 0.2);
  overflow-x: auto !important; /* Garantindo o scroll horizontal */
  overflow-y: auto !important;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(79, 70, 229, 0.6); /* Cor primária com transparência */
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(79, 70, 229, 0.8); /* Cor mais intensa no hover */
}

/* Indicar rolagem horizontal em dispositivos móveis */
@media (max-width: 1024px) {
  .custom-scrollbar::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.5));
    pointer-events: none;
    z-index: 5;
  }
  
  /* Destaque visual para indicar rolagem */
  .rounded-xl::before {
    content: "◄ deslize ►";
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: rgba(79, 70, 229, 0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10;
    opacity: 0.8;
  }
}
</style> 