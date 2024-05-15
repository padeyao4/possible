import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModeDialog = defineStore('mouseStyle', () => {
  const dialog = ref({
    visible: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })

  const data = ref()

  return {
    dialog,
    data
  }
})