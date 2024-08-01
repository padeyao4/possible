import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useLayout = defineStore('layout', () => {
  const leftWidth = ref(240);
  const rightWidth = ref(300);
  const showLeft = ref(true);
  const showRight = ref(false);

  const gridTemplateColumnsStyle = computed(() => {
    // return `${leftWidth.value}px 1fr ${rightWidth.value}px`;
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

    if (isLeft) {
      leftWidth.value = nw <= 230 ? 230 : nw;
    } else {
      rightWidth.value = nw <= 300 ? 300 : nw;
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
    leftWidth.value = 200;
    rightWidth.value = 300;
  }

  function toPlainObject() {
    return {
      leftWidth: leftWidth.value,
      rightWidth: rightWidth.value
    };
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
    toPlainObject,
    fromPlainObject,
    leftPointerDown,
    rightPointerDown,
    onPointerMove,
    onPointerUp
  };
});
