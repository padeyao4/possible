import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';

export const KEYS = {
  GET_DATA_FAILED: Symbol(),
  PUT_DATA_FAILED: Symbol()
};

// 定义一个通知存储
export const useNotify = defineStore('notify', () => {
  const notifies = reactive<Map<string | Symbol, string>>(new Map());

  const hasNotify = computed(() => {
    return notifies.size !== 0;
  });

  function addNotify(key: string | Symbol, value: string) {
    notifies.set(key, value);
  }

  function removeNotify(key: string | Symbol) {
    notifies.delete(key);
  }

  function getNotify(key: string | Symbol) {
    return notifies.get(key);
  }

  function clearNotify() {
    notifies.clear();
  }

  function $reset() {
    clearNotify();
  }

  return {
    notifies,
    hasNotify,
    addNotify,
    removeNotify,
    clearNotify,
    getNotify,
    $reset
  };
});
