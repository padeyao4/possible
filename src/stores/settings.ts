import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettings = defineStore('settings', () => {
  const sideWidth = ref(240)
  /**
   * 画布中每个单元格宽度
   */
  const unitWidth = ref(120)
  const unitHeight = ref(80)
  /**
   * 每个卡片相对于单元格左上角偏移
   */
  const offsetCardX = ref(10)
  const offsetCardY = ref(10)
  /**
   * 相对于画布坐上角偏移
   */
  const offsetX = ref(40)
  const offsetY = ref(40)
  const active = ref('today')
  return {
    active,
    sideWidth,
    unitHeight,
    unitWidth,
    offsetX,
    offsetY,
    offsetCardX,
    offsetCardY
  }
})