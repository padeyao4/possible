import { defineStore } from 'pinia';
import { ref } from 'vue';

const minxSideWidth = 230;
const minContentWidth = 400;

// 鼠标状态
export const useSide = defineStore('side', () => {
  const width = ref(minxSideWidth);

  let ow = 0;
  let sx = 0;
  let isDown = false;

  function onPointerDown(x: number) {
    isDown = true;
    ow = width.value;
    sx = x;
  }

  function onPointerMove(x: number) {
    if (!isDown) return;
    const dx = x - sx;
    const nw = ow + dx;

    if (nw < minxSideWidth) {
      width.value = minxSideWidth;
      return;
    }
    if (nw > document.body.clientWidth - minContentWidth) {
      width.value = document.body.clientWidth - minContentWidth;
      return;
    }
    width.value = nw;
  }

  function onPointerUp() {
    isDown = false;
  }

  function $reset() {
    width.value = 200;
  }

  function toPlainObject() {
    return {
      width: width.value
    };
  }

  function fromPlainObject(obj: any) {
    width.value = obj?.width ?? 200;
  }

  return {
    $reset,
    width,
    toPlainObject,
    fromPlainObject,
    onPointerDown,
    onPointerMove,
    onPointerUp
  };
});
