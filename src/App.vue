<script setup lang="ts">
import { onMounted } from 'vue'
import DataTable from "@/components/data-table/DataTable.vue";
import { columns } from '@/app/utils/columns'
import { fetchOperators } from '@/app/services/operatorService'

onMounted(() => {
  document.body.className = 'antialiased dark bg-black'
})
</script>

<template>
  <main class="min-h-screen w-full bg-gradient-to-b from-[#000000] via-[#121212] to-[#181818]">
    <div class="container min-h-screen px-4 py-8 mx-auto flex flex-col">
      <header class="mb-6 text-center">
        <h1 class="text-4xl font-light text-white mb-2 tracking-tight">Cadastro de Operadores</h1>
        <p class="text-white/60 text-lg font-light max-w-lg mx-auto mb-4 text-balance">
          Visualize e pesquise operadores do sistema com facilidade
        </p>
      </header>
      
      <div class="relative z-10 flex-grow mb-6 w-full">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl opacity-50 -z-10"></div>
        <div class="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl h-full flex flex-col w-full">
          <DataTable 
            :fetch-fn="fetchOperators"
            :columns="columns"
            persist-key="operator-table"
            :default-page-size="10"
          />
        </div>
      </div>
      
      <footer class="mt-4 text-center text-white/40 text-sm font-light w-full">
        <p>Sistema de Cadastro de Operadores &copy; {{ new Date().getFullYear() }}</p>
      </footer>
    </div>
  </main>
</template>

<style>
:root {
  --scrollbar-thumb: rgba(255, 255, 255, 0.3);
  --scrollbar-track: rgba(0, 0, 0, 0.4);
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>


