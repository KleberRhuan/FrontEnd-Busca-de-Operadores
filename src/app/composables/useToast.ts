import { ref, markRaw, h, render } from 'vue'
import Toast from '@/components/ui/toast.vue'

interface ToastOptions {
  title: string
  message?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toastQueue = ref<ToastOptions[]>([])
let toastContainer: HTMLDivElement | null = null

// Função para criar o container de toasts (apenas uma vez)
const createToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.style.position = 'fixed'
    toastContainer.style.top = '1rem'
    toastContainer.style.right = '1rem'
    toastContainer.style.zIndex = '9999'
    toastContainer.style.display = 'flex'
    toastContainer.style.flexDirection = 'column'
    toastContainer.style.gap = '0.5rem'
    toastContainer.style.maxWidth = '384px' // w-96
    document.body.appendChild(toastContainer)
  }
  return toastContainer
}

// Função para remover um toast da fila
const removeToast = (index: number) => {
  toastQueue.value.splice(index, 1)
}

// Função principal para exibir um toast
const showToast = (options: ToastOptions) => {
  const container = createToastContainer()

  toastQueue.value.push(options)

  const toastId = `toast-${Date.now()}`
  const toastElement = document.createElement('div')
  toastElement.id = toastId
  toastElement.style.width = '100%'
  toastElement.style.transition = 'all 0.3s ease'
  container.appendChild(toastElement)

  // Criar o componente Vue
  const toastVNode = h(markRaw(Toast), {
    ...options,
    onClose: () => {
      const index = toastQueue.value.findIndex((toast) => toast === options)
      if (index !== -1) {
        removeToast(index)
      }

      setTimeout(() => {
        if (toastElement.parentNode) {
          toastElement.parentNode.removeChild(toastElement)
        }
      }, 300)
    },
  })

  render(toastVNode, toastElement)

  if (options.duration !== 0) {
    setTimeout(() => {
      const index = toastQueue.value.findIndex((toast) => toast === options)
      if (index !== -1) {
        removeToast(index)

        setTimeout(() => {
          if (toastElement.parentNode) {
            toastElement.parentNode.removeChild(toastElement)
          }
        }, 300)
      }
    }, options.duration || 5000)
  }
}

// Exportar o composable
export function useToast() {
  return {
    show: showToast,
    success: (title: string, message?: string, duration?: number) =>
      showToast({ title, message, type: 'success', duration }),
    error: (title: string, message?: string, duration?: number) =>
      showToast({ title, message, type: 'error', duration }),
    warning: (title: string, message?: string, duration?: number) =>
      showToast({ title, message, type: 'warning', duration }),
    info: (title: string, message?: string, duration?: number) =>
      showToast({ title, message, type: 'info', duration }),
  }
}
