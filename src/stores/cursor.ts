import { defineStore } from 'pinia';
import { ref } from 'vue';

// 鼠标状态
export const useCursor = defineStore('cursor', () => {
  const isLock = ref(false);

  function unlock() {
    isLock.value = false;
  }

  function lock(style: string) {
    if (!isLock.value) {
      document.body.style.cursor = style;
      isLock.value = true;
    }
  }

  function setWithUnlock(style: string) {
    if (!isLock.value) {
      document.body.style.cursor = style;
    }
  }

  /**
   * 刷新鼠标状态
   * @param event
   */
  function refresh(event: MouseEvent) {
    const el = event.target as Element;
    const style = el.getAttribute('data-mouse-style') ?? 'default';
    setWithUnlock(style);
  }

  function $reset() {}

  return {
    isLock,
    unlock,
    refresh,
    lock,
    setWithUnlock,
    $reset
  };
});
