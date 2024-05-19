import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'


export function showWeek(date: Date | number): string {
  const arr = ['日', '一', '二', '三', '四', '五', '六']
  return '周' + arr[new Date(date).getDay()]
}

export const timeFormat = new Intl.DateTimeFormat('zh-Hans')

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const ONE_MINUTE_MS = 60_000

export function days(date: Date | number) {
  const d = new Date(date)
  return Math.ceil((d.getTime() - d.getTimezoneOffset() * ONE_MINUTE_MS) / ONE_DAY_MS)
}

export function calculateDaysBetweenDates(startDate: Date | number, endDate: Date | number): number {
  return days(startDate) - days(endDate)
}

export function scheduleMidnightTask(clear: Ref<any>, callback: () => void) {
  const now: Date = new Date()
  const midnight: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
  const delay: number = midnight.getTime() - now.getTime()
  clearTimeout(clear.value)
  clear.value = setTimeout(() => {
    callback()
    // 设置下一个午夜的定时器
    scheduleMidnightTask(clear, callback)
  }, delay)
}

export const useTimer = defineStore('timestamp', () => {
  const timestamp = ref(new Date().valueOf())

  function update() {
    timestamp.value = new Date().valueOf()
  }

  return {
    timestamp,
    update
  }
})