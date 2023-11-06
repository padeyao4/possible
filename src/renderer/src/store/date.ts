import {defineStore} from 'pinia'
import {DAY_OF_MS} from "@renderer/util";

export const useDateStore = defineStore('today', {
  state() {
    return {
      now: new Date()
    }
  },
  getters: {
    data: (state) => {
      return state.now
    }
  },
  actions: {
    update(d: Date) {
      this.now = d
    },
    update2Now() {
      const now = new Date()
      // todo
      // 时间相差30分钟更新
      if (Math.abs(now.getTime() - this.now.getTime()) >= 1800_000) {
        this.now = now
      }
    },
    addDay(n: number) {
      this.now = new Date(this.now.getTime() + n * DAY_OF_MS)
    }
  }
})
