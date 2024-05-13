import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEditor = defineStore('editor', () => {
  const visible = ref(false)
  const width = ref(360)
  const height = ref(240)
  const x = ref(0)
  const y = ref(0)
  const nodeId = ref('')

  return {
    visible,
    width,
    height,
    x,
    y,
    nodeId
  }
})