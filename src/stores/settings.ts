import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettings = defineStore('settings', () => {
  const sideWidth = ref(240)
  const unitWidth = ref(120)
  const unitHeight = ref(80)
  const offsetX = ref(20)
  const offsetY = ref(40)
  const active = ref('today')
  return {
    active,
    sideWidth,
    unitHeight,
    unitWidth,
    offsetX,
    offsetY
  }
})