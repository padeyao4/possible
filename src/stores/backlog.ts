import { defineStore } from 'pinia';
import { generateIndex, type ID } from '@/stores';
import { v4 } from 'uuid';

export interface Backlog {
  id: ID;
  name: string;
  index: number; //用于排序,时间毫秒值+随机数
  status: boolean; // true: 完成, false: 未完成
}

/**
 * 备忘录,用于存储待办事项
 */
export const useMeno = defineStore('meno', {
  state: () => ({
    backlogsMap: new Map<ID, Backlog>()
  }),
  getters: {
    backlogs: (state) => {
      return Array.from(state.backlogsMap.values()).sort((a, b) => a.index - b.index);
    },
    todoBacklogs: (state) => {
      return Array.from(state.backlogsMap.values())
        .sort((a, b) => a.index - b.index)
        .filter((b) => !b.status);
    },
    doneBacklogs: (state) => {
      return Array.from(state.backlogsMap.values())
        .sort((a, b) => a.index - b.index)
        .filter((b) => b.status);
    }
  },
  actions: {
    add(name: string) {
      const backlog = <Backlog>{
        id: v4(),
        name,
        index: generateIndex(),
        status: false
      };
      this.backlogsMap.set(backlog.id, backlog);
    }
  }
});
