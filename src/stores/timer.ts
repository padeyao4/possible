import { defineStore } from 'pinia'
import { ref } from 'vue'


export function showWeek(date: Date | number): string {
  const arr = ['日', '一', '二', '三', '四', '五', '六']
  return '星期' + arr[new Date(date).getDay()]
}

export const timeFormat = new Intl.DateTimeFormat('zh-Hans')

export const useTimestamp = defineStore('timestamp', () => {
  const timestamp = ref(new Date().valueOf())
  return {
    timestamp
  }
})