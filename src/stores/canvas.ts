import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

export const useCanvas = defineStore('canvas', () => {
  const svg = shallowRef<Element>()

  function set(el: Element) {
    svg.value = el
  }

  function getBoundingClientRect() {
    return svg.value?.getBoundingClientRect()
  }

  return {
    svg,
    set,
    getBoundingClientRect
  }
})
