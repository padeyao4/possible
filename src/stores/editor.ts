import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useEditor = defineStore('canvas-editor', () => {
  const visible = ref(false)
  const width = ref(360)
  const height = ref(240)
  const x = ref(0)
  const y = ref(0)
  const nodeId = ref('')

  const left = computed(() => x.value)
  const right = computed(() => x.value + width.value)
  const top = computed(() => y.value)
  const bottom = computed(() => y.value + height.value)

  return {
    visible,
    left,
    right,
    top,
    bottom,
    width,
    height,
    x,
    y,
    nodeId
  }
})