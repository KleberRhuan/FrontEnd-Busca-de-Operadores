<template>
  <Teleport to="body">
    <div 
      v-if="visible" 
      :class="[
        'fixed top-4 right-4 p-4 rounded-md shadow-lg backdrop-blur-md transition-all duration-300 z-50',
        'bg-black/60 border border-white/20',
        isClosing ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
      ]"
    >
      <div class="flex items-center space-x-3">
        <div v-if="type === 'success'" class="text-green-400">
          <CheckCircleIcon class="h-6 w-6" />
        </div>
        <div v-else-if="type === 'error'" class="text-red-400">
          <AlertCircleIcon class="h-6 w-6" />
        </div>
        <div v-else-if="type === 'warning'" class="text-yellow-400">
          <AlertTriangleIcon class="h-6 w-6" />
        </div>
        <div v-else class="text-blue-400">
          <InfoIcon class="h-6 w-6" />
        </div>
        
        <div class="flex-1">
          <p class="text-white font-medium">{{ title }}</p>
          <p v-if="message" class="text-white/80 text-sm">{{ message }}</p>
        </div>
        
        <button @click="close" class="text-white/60 hover:text-white">
          <XIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircleIcon, AlertCircleIcon, AlertTriangleIcon, InfoIcon, XIcon } from 'lucide-vue-next';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void
}>()

const visible = ref(false);
const isClosing = ref(false);
let timeoutId: number | null = null;

const close = () => {
  isClosing.value = true;
  
  setTimeout(() => {
    visible.value = false;
    emit('close');
  }, 300);
  
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};

onMounted(() => {
  visible.value = true;
  
  if (props.duration !== 0) {
    timeoutId = window.setTimeout(() => {
      close();
    }, props.duration || 5000);
  }
});

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script> 