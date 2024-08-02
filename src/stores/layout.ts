import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useWindowSize } from '@vueuse/core';

const minLeftWidth = 230;
const minRightWidth = 230;
const minContentWidth = 300;

export const useLayout = defineStore('layout', () => {
  const leftWidth = ref(minLeftWidth);
  const rightWidth = ref(minRightWidth);
  const showLeft = ref(true);
  const showRight = ref(false);

  const { width } = useWindowSize();

  const contentWidth = computed(() => {
    return width.value - leftWidth.value - rightWidth.value;
  });

  const gridTemplateColumnsStyle = computed(() => {
    const leftStyle = showLeft.value ? `${leftWidth.value}px` : '';
    const rightStyle = showRight.value ? `${rightWidth.value}px` : '';
    return `${leftStyle} 1fr ${rightStyle}`;
  });

  let ow = 0;
  let sx = 0;
  let isDown = false;
  let isLeft = false;

  function leftPointerDown(x: number) {
    isDown = true;
    ow = leftWidth.value;
    sx = x;
    isLeft = true;
  }

  function onPointerMove(x: number) {
    if (!isDown) return;
    const dx = x - sx;

    const nw = isLeft ? ow + dx : ow - dx;

    const tempWidth = width.value - nw - (isLeft ? rightWidth.value : leftWidth.value);
    if (tempWidth <= minContentWidth) return; // 防止内容区域过小

    if (isLeft) {
      leftWidth.value = nw <= minLeftWidth ? minLeftWidth : nw;
    } else {
      rightWidth.value = nw <= minRightWidth ? minRightWidth : nw;
    }
  }

  function rightPointerDown(x: number) {
    isDown = true;
    ow = rightWidth.value;
    sx = x;
    isLeft = false;
  }

  function onPointerUp() {
    isDown = false;
  }

  function $reset() {
    leftWidth.value = minLeftWidth;
    rightWidth.value = minRightWidth;
  }

  function toPlainObject() {
    return {
      leftWidth: leftWidth.value,
      rightWidth: rightWidth.value
    };
  }

  function resize() {
    if (contentWidth.value < minContentWidth) {
      const dt = minContentWidth - contentWidth.value;
      if (leftWidth.value - dt >= minLeftWidth) {
        leftWidth.value -= dt;
        return;
      }
      if (rightWidth.value - dt >= minRightWidth) {
        rightWidth.value -= dt;
        return;
      }
      leftWidth.value = minLeftWidth;
      rightWidth.value -= dt - minLeftWidth;
    }
  }

  function fromPlainObject(obj: any) {
    leftWidth.value = obj?.leftWidth ?? 200;
    rightWidth.value = obj?.rightWidth ?? 300;
  }

  return {
    $reset,
    leftWidth,
    rightWidth,
    gridTemplateColumnsStyle,
    showLeft,
    showRight,
    contentWidth,
    toPlainObject,
    fromPlainObject,
    leftPointerDown,
    rightPointerDown,
    onPointerMove,
    onPointerUp,
    resize
  };
});
