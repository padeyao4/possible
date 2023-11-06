import {defineStore} from 'pinia'
import {DAY_OF_MS} from "@renderer/util/constant";
import {deltaIndex} from "@renderer/util/time";

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
      // 时间相差30分钟更新 或者 天数变化
      if (Math.abs(now.getTime() - this.now.getTime()) >= 1800_000 || deltaIndex(now, this.now) > 0) {
        this.now = now
      }
    },
    addDay(n: number) {
      this.now = new Date(this.now.getTime() + n * DAY_OF_MS)
    }
  }
})
