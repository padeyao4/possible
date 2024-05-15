import { defineStore } from 'pinia'
import { ref } from 'vue'


export interface MouseStyleType {
  isLock: boolean
  unlock: () => void
  lock: () => void
  lockStyle: (style: string) => void
  setStyleWithUnlock: (style: string) => void
}

export const useMouseStyle = defineStore('mouseStyle', () => {
  const isLock = ref(false)

  function unlock() {
    isLock.value = false
  }

  function lock() {
    isLock.value = true
  }

  function lockStyle(style: string) {
    if (!isLock.value) {
      document.body.style.cursor = style
      lock()
    }
  }

  function setStyleWithUnlock(style: string) {
    if (!isLock.value) {
      document.body.style.cursor = style
    }
  }

  function toggleMouseStyle(event: MouseEvent) {
    const el = event.target as Element
    const style = el.getAttribute('data-mouse-style') ?? 'default'
    setStyleWithUnlock(style)
  }

  return {
    isLock,
    unlock,
    lock,
    toggleMouseStyle,
    lockStyle,
    setStyleWithUnlock
  }
})