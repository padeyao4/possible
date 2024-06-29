import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettings = defineStore('settings', () => {
  /**
   * 左侧边栏,激活项
   */
  const sideWidth = ref(240);
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

  return {
    sideWidth,
    unitHeight,
    unitWidth,
    offsetCardX,
    offsetCardY
  };
});
