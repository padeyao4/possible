import { defineStore } from 'pinia';
import { ref } from 'vue';
import { v4 } from 'uuid';
import type { ID, Point } from '@/core/types';

export type TempPath = {
  id: ID;
  nodeId: ID;
  location: Point;
  /**
   * 表示 nodeId 确定的锚点
   */
  dummy: 'source' | 'target';
  opacity: number;
};

export const useTempPaths = defineStore('canvas-paths', () => {
  const paths = ref<Map<ID, TempPath>>(new Map());

  function createTempPath(nodeId: ID, location: Point, dummy: 'source' | 'target') {
    const ans: TempPath = {
      id: v4(),
      opacity: 1,
      nodeId,
      location,
      dummy
    };
    paths.value.set(ans.id, ans);
    return ans;
  }

  function getPath(pathId: ID) {
    return paths.value.get(pathId);
  }

  function deletePath(pathId: ID) {
    paths.value.delete(pathId);
  }

  function $reset() {}

  return {
    paths,
    createTempPath,
    getPath,
    deletePath,
    $reset
  };
});
