import { useProjectStore } from '@/stores/project';
import { useDebounceFn } from '@vueuse/core';

/**
 * 1.加载本地数据
 * 2.开启内存数据实时同步到本地数据
 */
export default function () {
  const projects = useProjectStore();

  (() => {
    const s = localStorage.getItem('projects');
    const o = JSON.parse(s);
    projects.deserialize(o);
  })();

  const syncFnc = useDebounceFn(() => {
    const o = projects.serialize();
    const s = JSON.stringify(o);
    localStorage.setItem('projects', s);
  }, 500);

  projects.$subscribe(syncFnc);
}
