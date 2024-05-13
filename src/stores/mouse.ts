import { defineStore } from 'pinia'
import { ref } from 'vue'

export function changeMouseStyle(style: string) {
  const mouseState = useMouseState()
  if (!mouseState.isLock) {
    document.body.style.cursor = style
  }
}

export function lockStyle(style: string) {
  const mouseState = useMouseState()
  if (!mouseState.isLock) {
    mouseState.lock()
    document.body.style.cursor = style
  }
}

export const useMouseState = defineStore('mouseState', () => {
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