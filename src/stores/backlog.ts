import { defineStore } from 'pinia';
import { generateIndex, type ID } from '@/stores';
import { BacklogControllerApi, type BacklogPost } from '@/openapi'

export interface Backlog {
  id: number;
  name: string;
  index: number; //用于排序,时间毫秒值+随机数
  status: boolean; // true: 完成, false: 未完成
  loading: boolean; // 是否在进行服务端保存
}

/**
 * 备忘录,用于存储待办事项
 */
export const useBacklogStore = defineStore('backlog', {
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
      const backlog = <BacklogPost>{
        name,
        index: generateIndex(),
        status: false,
        saving: true,
      };
      const api = new BacklogControllerApi()
      api.add(backlog).then((request) => {
        const payload =  request.data.payload
        this.backlogsMap.set(payload.id,{
          id: payload.id,
          name: payload.name,
          index: payload.index,
          status: payload.status,
          loading: false,
        })
      })
    },
    exchangeIndex(b1:Backlog,b2:Backlog) {
      console.log(b1);
      [b1.index,b2.index] = [b2.index,b1.index];
      b1.loading = true;
      b2.loading = true;
      new BacklogControllerApi().exchangeIndex(b1,b2).then((request) => {
        b1.loading = false;
        b2.loading = false;
      })
    },
    remove(item: number | Backlog) {
      const id = typeof item === 'object' ? item.id : item;
      const api = new BacklogControllerApi()
      api._delete(id).then(_ => {
        this.backlogsMap.delete(id)
      })
    }
  },

});
