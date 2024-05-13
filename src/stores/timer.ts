import { defineStore } from 'pinia'
import { ref } from 'vue'


export function showWeek(date: Date | number): string {
  const arr = ['日', '一', '二', '三', '四', '五', '六']
  return '周' + arr[new Date(date).getDay()]
}

export const timeFormat = new Intl.DateTimeFormat('zh-Hans')

export function calculateDaysBetweenDates(startDate: Date | number, endDate: Date | number): number {
  const oneDay = 24 * 60 * 60 * 1000 // 一天的毫秒数
  const oneMin = 60_000

  const start = new Date(startDate)
  const end = new Date(endDate)

  const startDays = Math.ceil((start.getTime() - start.getTimezoneOffset() * oneMin) / oneDay)
  const endDays = Math.ceil((end.getTime() - end.getTimezoneOffset() * oneMin) / oneDay)
  return startDays - endDays
}

export const useTimer = defineStore('timestamp', () => {
  const timestamp = ref(new Date().valueOf())
  return {
    timestamp
  }
})