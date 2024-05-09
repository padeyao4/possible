import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettings = defineStore('settings', () => {
  const sideWidth = ref(240)
  return {
    sideWidth
  }
})