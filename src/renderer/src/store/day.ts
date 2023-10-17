import { defineStore } from 'pinia'

export const useTodayStore = defineStore('today', {
  state() {
    return {
      today: new Date()
    }
  },
  actions: {
    update(d: Date) {
      this.today = d
    }
  }
})
