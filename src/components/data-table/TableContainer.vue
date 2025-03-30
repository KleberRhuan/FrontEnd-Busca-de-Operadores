<template>
  <div
    class="rounded-xl border border-white/20 backdrop-blur-lg shadow-xl bg-black/40 w-full overflow-auto"
  >
    <div class="h-fit max-h-[60dvh] overflow-y-auto overflow-x-auto custom-scrollbar w-full">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style>
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
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.8), rgba(100, 90, 255, 0.6));
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: inset 0 0 3px rgba(255, 255, 255, 0.2);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(100, 90, 255, 0.9), rgba(120, 110, 255, 0.7));
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.custom-scrollbar::-webkit-scrollbar-corner {
  background: rgba(0, 0, 0, 0.2);
}

/* Indicar rolagem horizontal em dispositivos móveis */
@media (max-width: 1024px) {
  .custom-scrollbar::after {
    content: '';
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
    content: '◄ deslize ►';
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
