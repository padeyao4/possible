import { defineStore } from 'pinia'
import { ref } from 'vue'

export function changeMouseStyle(style: string) {
  const mouseState = useMouseStyle()
  if (!mouseState.isLock) {
    document.body.style.cursor = style
  }
}

export function unlockMouseStyle() {
  useMouseStyle().unlock()
}

export function lockMouseStyle(style: string) {
  const mouseState = useMouseStyle()
  if (!mouseState.isLock) {
    mouseState.lock()
    document.body.style.cursor = style
  }
}

export const useMouseStyle = defineStore('mouseStyle', () => {
  const isLock = ref(false)

  const unlock = () => {
    isLock.value = false
  }

  const lock = () => {
    isLock.value = true
  }

  return {
    isLock,
    unlock,
    lock
  }
})