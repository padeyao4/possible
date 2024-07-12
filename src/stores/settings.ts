import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettings = defineStore('settings', () => {
  /**
   * 画布中每个单元格宽度
   */
  const unitWidth = ref(120);
  const unitHeight = ref(80);
  /**
   * 每个卡片相对于单元格左上角偏移
   */
  const offsetCardX = ref(10);
  const offsetCardY = ref(10);

  function $reset() {
    unitWidth.value = 120;
    unitHeight.value = 80;
    offsetCardX.value = 10;
    offsetCardY.value = 10;
  }

  return {
    unitHeight,
    unitWidth,
    offsetCardX,
    offsetCardY,
    $reset
  };
});
