import { defineStore } from 'pinia';
import { v4 } from 'uuid';
import { generateIndex } from '@/stores/data';
import { type Backlog, BacklogControllerApi } from '@/openapi';

/**
 * 备忘录,用于存储待办事项
 */
export const useBacklogStore = defineStore('backlog', {
  state: () => ({
    backlogsMap: new Map<string, Backlog>(),
    loading: false
  }),
  getters: {
    backlogs: (state) => {
      return Array.from(state.backlogsMap.values()).sort((a, b) => a.index! - b.index!);
    },
    todoBacklogs: (state) => {
      return Array.from(state.backlogsMap.values())
        .sort((a, b) => a.index! - b.index!)
        .filter((b) => !b.status);
    },
    doneBacklogs: (state) => {
      return Array.from(state.backlogsMap.values())
        .sort((a, b) => a.index!- b.index!)
        .filter((b) => b.status);
    }
  },
  actions: {
    add(name: string) {
      const uuid = v4();
      this.backlogsMap.set(uuid, {
        name: name,
        index: generateIndex(),
        status: false,
        id: uuid
      });
    },
    remove(item: string | Backlog) {
      const uuid = typeof item === 'object' ? item.id : item;
      this.backlogsMap.delete(uuid!);
    },
    fetch() {
      this.loading = true;
      new BacklogControllerApi()
        .list1()
        .then((res) => {
          const data = res.data.payload;
          this.backlogsMap.clear();
          data!.forEach((item) => {
            this.backlogsMap.set(item.id!, item);
          });
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
});
