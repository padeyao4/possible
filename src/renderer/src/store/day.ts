import { defineStore } from 'pinia'

export const useTodayStore = defineStore('today', {
  state() {
    return {
      today: new Date()
    }
  },
  getters: {
    data: (state) => {
      return state.today
    }
  },
  actions: {
    update(d: Date) {
      this.today = d
    }
  }
})
