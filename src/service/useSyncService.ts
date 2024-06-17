import { useAccount } from '@/stores/account';
import { useProjectStore } from '@/stores/project';
import { useDebounceFn } from '@vueuse/core';
import { computed, ref, watch } from 'vue';

/**
 * 如果用户开启了同步服务(用户已登录并且开启远程存储)，监听项目变换并发送数据到远程服务器
 */
export default function () {
  const account = useAccount();
  const projects = useProjectStore();

  const isSync = computed(() => {
    return account.online && account.enableSync;
  });

  const unsubscribe = ref();

  const syncFnc = useDebounceFn(() => {
    account.sendProjects().then();
  }, 1000);

  watch(
    isSync,
    (newValue) => {
      if (newValue) {
        unsubscribe.value?.();
        unsubscribe.value = projects.$subscribe(syncFnc);
      }
    },
    { immediate: true }
  );
}
