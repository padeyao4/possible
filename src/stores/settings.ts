import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettings = defineStore('settings', () => {
  const isMaximize = ref<boolean>(false)

  return { isMaximize }
})